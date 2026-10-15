import fc from 'fast-check'
import { createHash } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ReleaseError, context, inspectCandidate, main, releaseCheck, releasePack, releasePublish, releaseVerify, sdkBuild, sdkCheck } from '../../work-scripts/node/release/cli.mjs'
import { publishConfirmation, sha256Hex } from '../../work-scripts/node/release/policy.mjs'
import { ROOT, evidenceFor, fakeIo, goodFiles, manifest } from './fake-io.mjs'

const env = (extra = {}) => ({ PATH: '/bin', ...extra })
const ctx = (extra = {}) => context(env(extra), ROOT)
const DIR = `${ROOT}/artifacts/release/c4-sdk-0.1.0-${'a'.repeat(12)}`
const TARBALL = `${DIR}/c4-sdk-0.1.0.tgz`
const EVIDENCE = `${DIR}/c4-sdk-0.1.0.evidence.json`
const VERIFY = `${DIR}/c4-sdk-0.1.0.verify.json`
const README = `${DIR}/c4-sdk-0.1.0.readme.json`
const CONSUMER = '/tmp/c4-sdk-consumer-fake'
const tarSha = createHash('sha256').update('tarball-bytes').digest('hex')
const hashes = { [TARBALL]: { size: 99, sha256: tarSha, sha1: 'sha1', integrity: 'sha512-fake' } }

const packJson = (files = goodFiles(), over = {}) => JSON.stringify([{ id: 'c4-sdk@0.1.0', name: 'c4-sdk', version: '0.1.0', filename: 'c4-sdk-0.1.0.tgz', shasum: 'sha1', integrity: 'sha512-fake', files: files.map(f => ({ path: f.path })), ...over }])

function packRuns(over = {}) {
  const created = handler => args => { args.io.fs.set(TARBALL, 'tarball-bytes'); return handler(args) }
  const pack = over['npm pack'] ?? (() => ({ status: 0, stdout: packJson(), stderr: '' }))
  return { ...over, 'npm pack': created(pack) }
}
function repoFiles(extra = {}) {
  return { [`${ROOT}/package.json`]: JSON.stringify(manifest()), ...extra }
}
function packedIo(over = {}) {
  return fakeIo({ files: repoFiles(), hashes, runs: packRuns(), ...over })
}
const stageRuns = (over = {}) => ({
  'node tests/package/verify.mjs': () => ({ status: 0, stdout: `{\n  "consumer": "${CONSUMER}"\n}`, stderr: '' }),
  ...over,
})
function verifiedIo(over = {}) {
  const files = goodFiles()
  const io = fakeIo({ files: repoFiles({ [TARBALL]: 'tarball-bytes', [EVIDENCE]: JSON.stringify(evidenceFor('c4-sdk-0.1.0.tgz', files, { sha256: tarSha })), [`${ROOT}/tests/readme/verify.mjs`]: '// p04', [`${CONSUMER}/report.json`]: JSON.stringify({ tarball: TARBALL, sha256: tarSha, version: '0.1.0', sourceSha: 'a'.repeat(40), consumer: CONSUMER }) }), hashes, runs: stageRuns(over.runs), ...over.io })
  return io
}
const readmeWrites = (report = {}) => ({ io }) => {
  io.fs.set(README, JSON.stringify({ passed: true, sha256: tarSha, version: '0.1.0', evidence: { browser: '/tmp/readme' }, ...report }))
  return { status: 0, stdout: '', stderr: '' }
}
const run = fn => { try { fn(); return null } catch (error) { if (error instanceof ReleaseError) return error.message; throw error } }

describe('release-pack', () => {
  it('builds once, packs once, then records tarball hash, version, source SHA and inventory', () => {
    const io = packedIo()
    const { evidence } = releasePack(io, ctx())
    const commands = io.calls.map(c => `${c.command} ${c.args[0]}`)
    expect(commands.filter(c => c === 'node sdk-build.mjs')).toHaveLength(1)
    expect(commands.filter(c => c === 'npm pack')).toHaveLength(1)
    expect(io.calls.find(c => c.args[0] === 'pack').args).toEqual(['pack', '--json', '--ignore-scripts', '--pack-destination', DIR])
    expect(evidence).toMatchObject({ schema: 1, name: 'c4-sdk', version: '0.1.0', sourceSha: 'a'.repeat(40), dirty: false, sha256: tarSha, tarball: 'c4-sdk-0.1.0.tgz' })
    expect(evidence.inventory.map(f => f.path)).toContain('dist-sdk/index.cjs')
    expect(JSON.parse(io.fs.get(EVIDENCE))).toEqual(evidence)
    expect(io.fs.has(`${DIR}/.c4-release-artifacts`)).toBe(true)
  })

  it('refuses a dirty tree and a build that changes tracked sources', () => {
    expect(run(() => releasePack(packedIo({ dirty: true }), ctx()))).toMatch(/dirty/)
    const io = packedIo({ runs: packRuns({ 'node sdk-build.mjs': ({ io: self }) => { self.state.dirty = true; return { status: 0, stdout: '', stderr: '' } } }) })
    expect(run(() => releasePack(io, ctx()))).toMatch(/build modified tracked sources/)
    expect(io.calls.some(c => c.args[0] === 'pack')).toBe(false)
  })

  it('stops on build, pack or malformed pack failures', () => {
    expect(run(() => releasePack(packedIo({ runs: packRuns({ 'node sdk-build.mjs': () => ({ status: 2 }) }) }), ctx()))).toMatch(/build once failed/)
    expect(run(() => releasePack(packedIo({ runs: packRuns({ 'npm pack': () => ({ status: 1, stdout: '', stderr: 'boom' }) }) }), ctx()))).toMatch(/npm pack failed/)
    expect(run(() => releasePack(packedIo({ runs: packRuns({ 'npm pack': () => ({ status: 0, stdout: 'not json', stderr: '' }) }) }), ctx()))).toMatch(/exactly one tarball/)
    expect(run(() => releasePack(packedIo({ runs: packRuns({ 'npm pack': () => ({ status: 0, stdout: packJson(goodFiles(), { version: '9.9.9' }), stderr: '' }) }) }), ctx()))).toMatch(/version/)
  })

  it('rejects unexpected packed files, unapproved exports and unresolved declarations in the tarball', () => {
    const withExtra = [...goodFiles(), { path: 'dist-sdk/index.cjs.map', type: 'file', mode: 0o644, size: 1, sha256: 'a'.repeat(64) }]
    expect(run(() => releasePack(packedIo({ inspections: { [TARBALL]: { ok: true, errors: [], files: withExtra } } }), ctx()))).toMatch(/source map|unexpected packed file/)
    const badManifest = { ...manifest(), exports: { ...manifest().exports, './internal': './dist-sdk/index.cjs' } }
    expect(run(() => releasePack(packedIo({ inspections: { [TARBALL]: { ok: true, errors: [], files: goodFiles(badManifest) } } }), ctx()))).toMatch(/unapproved export/)
    const unresolved = goodFiles().map(f => (f.path === 'dist-sdk/core.d.mts' ? { ...f, text: "import './nope.mjs'\nimport 'zod'" } : f))
    const message = run(() => releasePack(packedIo({ inspections: { [TARBALL]: { ok: true, errors: [], files: unresolved } } }), ctx()))
    expect(message).toMatch(/unresolved relative declaration import/)
    expect(message).toMatch(/undeclared package zod/)
  })

  it('detects npm-reported hash or file-list disagreement', () => {
    expect(run(() => releasePack(packedIo({ runs: packRuns({ 'npm pack': () => ({ status: 0, stdout: packJson(goodFiles(), { shasum: 'other' }), stderr: '' }) }) }), ctx()))).toMatch(/shasum/)
    expect(run(() => releasePack(packedIo({ runs: packRuns({ 'npm pack': () => ({ status: 0, stdout: packJson(goodFiles().slice(1)), stderr: '' }) }) }), ctx()))).toMatch(/file list differs/)
  })

  it('replaces only marked directories inside the artifacts root', () => {
    const marked = packedIo({ files: repoFiles({ [`${DIR}/.c4-release-artifacts`]: 'x', [`${DIR}/stale.txt`]: 'old' }) })
    releasePack(marked, ctx())
    expect(marked.fs.has(`${DIR}/stale.txt`)).toBe(false)
    const unmarked = packedIo({ files: repoFiles({ [`${DIR}/precious.txt`]: 'mine', [DIR]: 'dir' }) })
    expect(run(() => releasePack(unmarked, ctx()))).toMatch(/marker/)
    expect(unmarked.fs.has(`${DIR}/precious.txt`)).toBe(true)
    const escape = packedIo({ files: repoFiles({ '/elsewhere/c4-sdk-0.1.0-aaaaaaaaaaaa': 'dir', '/elsewhere/c4-sdk-0.1.0-aaaaaaaaaaaa/.c4-release-artifacts': 'x' }) })
    expect(run(() => releasePack(escape, context(env({ ARTIFACTS: '/elsewhere' }), ROOT)))).toMatch(/strict descendant|outside/)
    expect(escape.fs.has('/elsewhere/c4-sdk-0.1.0-aaaaaaaaaaaa/.c4-release-artifacts')).toBe(true)
  })

  it('rejects an exercised-engines mismatch and a non-repo cwd', () => {
    const wrongNode = repoFiles({ [`${ROOT}/package.json`]: JSON.stringify({ ...manifest(), engines: { node: '18.0.0' } }) })
    expect(run(() => releasePack(packedIo({ files: wrongNode }), ctx()))).toMatch(/engines\.node/)
    const other = repoFiles({ [`${ROOT}/package.json`]: JSON.stringify({ ...manifest(), name: 'other' }) })
    expect(run(() => releasePack(packedIo({ files: other }), ctx()))).toMatch(/repository root/)
  })
})

describe('release-verify', () => {
  it('runs the exact-tarball matrix then README verifier with README_REPORT and writes a bound pass report', () => {
    const io = verifiedIo({ runs: { 'node tests/readme/verify.mjs': readmeWrites() } })
    releaseVerify(io, ctx(), TARBALL)
    const labels = io.calls.map(c => [c.command, c.args[0], c.args[1]].join(' '))
    expect(labels).toEqual(['node tests/package/verify.mjs ' + TARBALL, 'node node_modules/@playwright/test/cli.js test', `node tests/readme/verify.mjs ${TARBALL}`])
    const readmeCall = io.calls.at(-1)
    expect(readmeCall.env.README_REPORT).toBe(README)
    expect(io.calls.find(c => c.args[0].includes('playwright')).env.CONSUMER_DIR).toBe(CONSUMER)
    expect(io.calls.every(c => c.command !== 'npm' && c.args[0] !== 'sdk-build.mjs')).toBe(true)
    const report = JSON.parse(io.fs.get(VERIFY))
    expect(report).toMatchObject({ passed: true, sha256: tarSha, version: '0.1.0', sourceSha: 'a'.repeat(40) })
    expect(report.stages).toEqual({ inventory: 'passed', package: 'passed', browser: 'passed', readme: 'passed' })
    expect(report.evidenceSha256).toBe(sha256Hex(Buffer.from(io.fs.get(EVIDENCE))))
  })

  it('fails closed without evidence, with a different hash, or with a tampered inventory', () => {
    expect(run(() => releaseVerify(verifiedIo({ io: { files: repoFiles({ [TARBALL]: 'tarball-bytes' }) } }), ctx(), TARBALL))).toMatch(/evidence is missing/)
    const hashed = verifiedIo({ io: { hashes: { [TARBALL]: { size: 99, sha256: 'f'.repeat(64), sha1: '', integrity: '' } } } })
    expect(run(() => releaseVerify(hashed, ctx(), TARBALL))).toMatch(/sha256 mismatch/)
    expect(JSON.parse(hashed.fs.get(VERIFY)).passed).toBe(false)
    const files = goodFiles().map((f, i) => (i === 3 ? { ...f, sha256: 'c'.repeat(64) } : f))
    expect(run(() => releaseVerify(verifiedIo({ io: { inspections: { [TARBALL]: { ok: true, errors: [], files } } } }), ctx(), TARBALL))).toMatch(/inventory mismatch/)
    expect(run(() => releaseVerify(verifiedIo(), ctx(), undefined))).toMatch(/TARBALL must be given/)
    expect(run(() => releaseVerify(verifiedIo(), ctx(), `${DIR}/missing.tgz`))).toMatch(/not a regular file/)
  })

  it('rejects an evidence file bound to another tarball name or version', () => {
    const files = goodFiles()
    const wrong = evidenceFor('c4-sdk-0.1.0.tgz', files, { sha256: tarSha, version: '0.2.0' })
    const io = verifiedIo({ io: { files: repoFiles({ [TARBALL]: 'tarball-bytes', [EVIDENCE]: JSON.stringify(wrong) }) } })
    expect(run(() => releaseVerify(io, ctx(), TARBALL))).toMatch(/version mismatch/)
  })

  it('fails when the README verifier is absent, fails, or writes a missing/mismatched report', () => {
    const absent = verifiedIo()
    absent.fs.delete(`${ROOT}/tests/readme/verify.mjs`)
    expect(run(() => releaseVerify(absent, ctx(), TARBALL))).toMatch(/fail closed/)
    expect(JSON.parse(absent.fs.get(VERIFY)).stages.readme).toBe('failed')
    expect(run(() => releaseVerify(verifiedIo({ runs: { 'node tests/readme/verify.mjs': () => ({ status: 1 }) } }), ctx(), TARBALL))).toMatch(/README verification failed/)
    expect(run(() => releaseVerify(verifiedIo({ runs: { 'node tests/readme/verify.mjs': () => ({ status: 0 }) } }), ctx(), TARBALL))).toMatch(/README_REPORT was not written/)
    expect(run(() => releaseVerify(verifiedIo({ runs: { 'node tests/readme/verify.mjs': readmeWrites({ sha256: 'e'.repeat(64) }) } }), ctx(), TARBALL))).toMatch(/README report sha256/)
    expect(run(() => releaseVerify(verifiedIo({ runs: { 'node tests/readme/verify.mjs': readmeWrites({ passed: false }) } }), ctx(), TARBALL))).toMatch(/did not pass/)
  })

  it('a stale README pass or stale verify pass cannot survive a failing run', () => {
    const io = verifiedIo({ runs: { 'node tests/readme/verify.mjs': () => ({ status: 0 }) }, io: {} })
    io.fs.set(README, JSON.stringify({ passed: true, sha256: tarSha, version: '0.1.0', evidence: { a: 1 } }))
    io.fs.set(VERIFY, JSON.stringify({ passed: true }))
    expect(run(() => releaseVerify(io, ctx(), TARBALL))).toMatch(/not written/)
    expect(JSON.parse(io.fs.get(VERIFY)).passed).toBe(false)
  })

  it('fails when the consumer matrix, its report, or the browser run fails', () => {
    expect(run(() => releaseVerify(verifiedIo({ runs: { 'node tests/package/verify.mjs': () => ({ status: 1, stdout: '' }) } }), ctx(), TARBALL))).toMatch(/package consumer verification failed/)
    const nothing = verifiedIo({ runs: { 'node tests/package/verify.mjs': () => ({ status: 0, stdout: 'no report' }) } })
    expect(run(() => releaseVerify(nothing, ctx(), TARBALL))).toMatch(/package consumer report missing/)
    const wrongHash = verifiedIo()
    wrongHash.fs.set(`${CONSUMER}/report.json`, JSON.stringify({ sha256: 'd'.repeat(64), version: '0.1.0', sourceSha: 'a'.repeat(40), consumer: CONSUMER }))
    expect(run(() => releaseVerify(wrongHash, ctx(), TARBALL))).toMatch(/package report sha256/)
    const browser = verifiedIo({ runs: { 'node node_modules/@playwright/test/cli.js': () => ({ status: 1 }) } })
    expect(run(() => releaseVerify(browser, ctx(), TARBALL))).toMatch(/browser tests failed/)
  })

  it('never builds, packs or publishes while verifying', () => {
    const io = verifiedIo({ runs: { 'node tests/readme/verify.mjs': readmeWrites() } })
    releaseVerify(io, ctx(), TARBALL)
    expect(io.calls.some(c => ['pack', 'publish', 'sdk-build.mjs'].includes(c.args[0]))).toBe(false)
  })
})

describe('release-check', () => {
  it('runs sdk-check, pack, then verify on the freshly packed artifact in that order', () => {
    const io = fakeIo({
      files: repoFiles({ [`${ROOT}/tests/readme/verify.mjs`]: '//', [`${CONSUMER}/report.json`]: JSON.stringify({ sha256: tarSha, version: '0.1.0', sourceSha: 'a'.repeat(40), consumer: CONSUMER }) }),
      hashes,
      runs: packRuns({ ...stageRuns(), 'node tests/readme/verify.mjs': readmeWrites() }),
    })
    releaseCheck(io, ctx())
    const order = io.calls.map(c => `${c.command} ${c.args.slice(0, 2).join(' ')}`.trim())
    const idx = pattern => order.findIndex(entry => entry.includes(pattern))
    expect(idx('run sdk:check')).toBeLessThan(idx('sdk-build.mjs'))
    expect(idx('sdk-build.mjs')).toBeLessThan(idx('npm pack'))
    expect(idx('npm pack')).toBeLessThan(idx('tests/package/verify.mjs'))
    expect(idx('tests/package/verify.mjs')).toBeLessThan(idx('tests/readme/verify.mjs'))
    expect(order.some(entry => entry.includes('publish'))).toBe(false)
  })

  it('stops at the first failing stage: a failing sdk-check never packs', () => {
    const io = fakeIo({ files: repoFiles(), runs: { 'npm run': () => ({ status: 1 }) } })
    expect(run(() => releaseCheck(io, ctx()))).toMatch(/sdk-check/)
    expect(io.calls.some(c => c.args[0] === 'pack' || c.args[0] === 'sdk-build.mjs')).toBe(false)
  })

  it('sdk-check and sdk-build only run their own commands', () => {
    const io = fakeIo({ files: repoFiles() })
    sdkCheck(io, ctx())
    sdkBuild(io, ctx())
    expect(io.calls.map(c => [c.command, ...c.args].join(' '))).toEqual([
      'npm run sdk:check', 'node node_modules/vitest/vitest.mjs run --config tests/release/vitest.config.ts', 'node sdk-build.mjs',
    ])
  })
})

describe('release-publish (mocked registry; nothing can reach npm)', () => {
  const REGISTRY = 'https://registry.npmjs.org/'
  const files = goodFiles()
  const evidence = evidenceFor('c4-sdk-0.1.0.tgz', files, { sha256: tarSha })
  const confirm = publishConfirmation(evidence)
  const verifyReport = over => JSON.stringify({ passed: true, sha256: tarSha, version: '0.1.0', sourceSha: 'a'.repeat(40), evidenceSha256: sha256Hex(Buffer.from(JSON.stringify(evidence))), stages: { inventory: 'passed', package: 'passed', browser: 'passed', readme: 'passed' }, ...over })
  const publishIo = ({ report = verifyReport(), ev = evidence, runs = {}, io = {} } = {}) => fakeIo({
    files: repoFiles({ [TARBALL]: 'tarball-bytes', [EVIDENCE]: JSON.stringify(ev), [VERIFY]: report }),
    hashes,
    runs: { 'npm view': () => ({ status: 1, stdout: '', stderr: 'npm error code E404' }), ...runs },
    ...io,
  })
  const args = (over = {}) => ({ tarball: TARBALL, tag: 'beta', registry: REGISTRY, confirm, ...over })

  it('publishes only the verified tarball with explicit tag/registry and no rebuild', () => {
    const io = publishIo({ runs: { 'npm publish': () => ({ status: 0 }) } })
    expect(releasePublish(io, ctx(), args())).toMatchObject({ spec: 'c4-sdk@0.1.0', tag: 'beta' })
    const publish = io.calls.find(c => c.args[0] === 'publish')
    expect(publish.args).toEqual(['publish', TARBALL, '--tag', 'beta', '--registry', REGISTRY, '--ignore-scripts'])
    expect(io.calls.map(c => c.args[0]).filter(a => ['pack', 'sdk-build.mjs'].includes(a))).toEqual([])
    expect(io.calls.filter(c => c.args[0] === 'publish')).toHaveLength(1)
  })

  it('honours dry-run', () => {
    const io = publishIo()
    releasePublish(io, ctx(), args({ dryRun: true }))
    expect(io.calls.find(c => c.args[0] === 'publish').args).toContain('--dry-run')
  })

  const publishes = io => io.calls.some(c => c.args[0] === 'publish')
  it.each([
    ['missing verify report', { io: { files: repoFiles({ [TARBALL]: 'tarball-bytes', [EVIDENCE]: JSON.stringify(evidence) }) } }, /verification report is missing/],
    ['failed verify report', { report: verifyReport({ passed: false }) }, /did not pass/],
    ['verify report for other hash', { report: verifyReport({ sha256: 'f'.repeat(64) }) }, /different artifact hash/],
    ['verify report for stale evidence', { report: verifyReport({ evidenceSha256: 'e'.repeat(64) }) }, /evidence file/],
    ['README stage not passed', { report: verifyReport({ stages: { inventory: 'passed', package: 'passed', browser: 'passed', readme: 'pending' } }) }, /readme did not pass/],
    ['dirty-source evidence', { ev: { ...evidence, dirty: true } }, /dirty/],
    ['version in evidence differs from tarball', { ev: { ...evidence, version: '0.2.0' } }, /version mismatch/],
  ])('refuses %s', (_label, setup, pattern) => {
    const io = publishIo(setup)
    expect(run(() => releasePublish(io, ctx(), args()))).toMatch(pattern)
    expect(publishes(io)).toBe(false)
  })

  it('refuses implicit/ill-formed tag, registry and confirmation', () => {
    for (const [over, pattern] of [[{ tag: undefined }, /dist-tag/], [{ registry: undefined }, /registry/], [{ registry: 'http://registry.npmjs.org' }, /https/], [{ confirm: 'yes' }, /confirmation/], [{ confirm: undefined }, /confirmation/]]) {
      const io = publishIo()
      expect(run(() => releasePublish(io, ctx(), args(over)))).toMatch(pattern)
      expect(publishes(io)).toBe(false)
    }
  })

  it('never lets a prerelease go to latest', () => {
    const ev = evidenceFor('c4-sdk-0.1.0.tgz', files, { sha256: tarSha, version: '0.1.0-beta.1' })
    const withPre = fakeIo({ files: repoFiles({ [TARBALL]: 'tarball-bytes', [EVIDENCE]: JSON.stringify(ev), [VERIFY]: verifyReport({ version: '0.1.0-beta.1', evidenceSha256: sha256Hex(Buffer.from(JSON.stringify(ev))) }) }), hashes, version: '0.1.0-beta.1' })
    expect(run(() => releasePublish(withPre, ctx(), { tarball: TARBALL, tag: 'latest', registry: REGISTRY, confirm: publishConfirmation(ev) }))).toMatch(/latest/)
    expect(publishes(withPre)).toBe(false)
  })

  it('refuses an already-published version and an indeterminate registry lookup', () => {
    const exists = publishIo({ runs: { 'npm view': () => ({ status: 0, stdout: '0.1.0\n', stderr: '' }) } })
    expect(run(() => releasePublish(exists, ctx(), args()))).toMatch(/already exists/)
    const offline = publishIo({ runs: { 'npm view': () => ({ status: 1, stdout: '', stderr: 'ENOTFOUND' }) } })
    expect(run(() => releasePublish(offline, ctx(), args()))).toMatch(/could not confirm/)
    expect(publishes(exists) || publishes(offline)).toBe(false)
  })

  it('reports publication failure without rebuilding or retrying', () => {
    const io = publishIo({ runs: { 'npm publish': () => ({ status: 1 }) } })
    expect(run(() => releasePublish(io, ctx(), args()))).toMatch(/do not rebuild/)
    expect(io.calls.filter(c => c.args[0] === 'publish')).toHaveLength(1)
    expect(io.calls.some(c => c.args[0] === 'pack')).toBe(false)
  })

  it('exposes credentials only to the registry lookup and publish children', () => {
    const io = publishIo()
    releasePublish(io, context(env({ NODE_AUTH_TOKEN: 'secret' }), ROOT), args())
    for (const call of io.calls) expect(call.env.NODE_AUTH_TOKEN).toBe('secret')
    const verify = verifiedIo({ runs: { 'node tests/readme/verify.mjs': readmeWrites() } })
    releaseVerify(verify, context(env({ NODE_AUTH_TOKEN: 'secret', NPM_TOKEN: 'x' }), ROOT), TARBALL)
    for (const call of verify.calls) { expect(call.env.NODE_AUTH_TOKEN).toBeUndefined(); expect(call.env.NPM_TOKEN).toBeUndefined() }
  })

  it('property: any tarball hash that differs from the evidence blocks publication', () => {
    fc.assert(fc.property(fc.stringMatching(/^[0-9a-f]{64}$/), other => {
      fc.pre(other !== tarSha)
      const io = publishIo({ io: { hashes: { [TARBALL]: { size: 99, sha256: other, sha1: '', integrity: '' } } } })
      return run(() => releasePublish(io, ctx(), args())) !== null && !publishes(io)
    }), { numRuns: 25 })
  })
})

describe('main entry', () => {
  beforeEach(() => { vi.spyOn(process.stderr, 'write').mockImplementation(() => true) })
  afterEach(() => { vi.restoreAllMocks() })

  it('refuses lifecycle recursion before any effect', () => {
    const io = fakeIo({ files: repoFiles() })
    expect(main(['sdk-build'], { C4_RELEASE_ACTIVE: '1' }, io, ROOT)).toBe(1)
    expect(io.calls).toEqual([])
  })

  it('rejects unknown commands and flags, and only invokes the named command', () => {
    const io = fakeIo({ files: repoFiles() })
    expect(main(['publish-now'], env(), io, ROOT)).toBe(1)
    expect(main(['sdk-build', 'stray'], env(), io, ROOT)).toBe(1)
    expect(main(['sdk-build'], env(), io, ROOT)).toBe(0)
    expect(io.calls.map(c => c.args[0])).toEqual(['sdk-build.mjs'])
  })

  it('verify and publish need TARBALL; default invocation has no command and does nothing', () => {
    const io = fakeIo({ files: repoFiles() })
    expect(main(['verify'], env(), io, ROOT)).toBe(1)
    expect(main(['publish'], env(), io, ROOT)).toBe(1)
    expect(main([], env(), io, ROOT)).toBe(1)
    expect(io.calls).toEqual([])
  })

  it('inspectCandidate flags a missing manifest and invalid JSON', () => {
    expect(inspectCandidate({ errors: [], files: goodFiles().filter(f => f.path !== 'package.json') }).errors.join()).toMatch(/package\.json/)
    expect(inspectCandidate({ errors: [], files: goodFiles().map(f => (f.path === 'package.json' ? { ...f, text: '{' } : f)) }).errors.join()).toMatch(/not valid JSON/)
  })
})
