import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import {
  APPROVED_EXPORT_KEYS, EVIDENCE_SCHEMA, REQUIRED_FILES, buildPublishArgs, checkCleanTarget, checkDeclarations, checkEvidence, checkInventory,
  checkManifest, checkPackJson, checkPackageReport, checkPublishRequest, checkReadmeReport, checkRegistry, checkTag, checkVerifyReport, childEnv,
  declarationSpecifiers, inventoryDigest, isRecursiveInvocation, isSafePackagePath, parseVersion, publishConfirmation, tarballName,
} from '../../work-scripts/node/release/policy.mjs'

const file = (path, extra = {}) => ({ path, size: 10, mode: 0o644, type: 'file', sha256: 'a'.repeat(64), ...extra })
const goodFiles = () => [...REQUIRED_FILES.map(path => file(path)), file('dist-sdk/shared-abc_DEF-1.cjs')]
const goodManifest = () => ({
  name: 'c4-sdk', version: '0.1.0', main: './dist-sdk/index.cjs', module: './dist-sdk/index.mjs', types: './dist-sdk/index.d.mts',
  exports: {
    '.': { import: { types: './dist-sdk/index.d.mts', default: './dist-sdk/index.mjs' }, require: { types: './dist-sdk/index.d.cts', default: './dist-sdk/index.cjs' } },
    './core': { import: { types: './dist-sdk/core.d.mts', default: './dist-sdk/core.mjs' }, require: { types: './dist-sdk/core.d.cts', default: './dist-sdk/core.cjs' } },
    './styles.css': './dist-sdk/styles.css',
    './layout-worker.js': './dist-sdk/layout-worker.js',
  },
  peerDependencies: { react: '19.3.0', 'react-dom': '19.3.0' },
})
const paths = new Set(REQUIRED_FILES)
const hex = fc.stringMatching(/^[0-9a-f]{64}$/)
const sha = fc.stringMatching(/^[0-9a-f]{40}$/)

describe('version and path primitives', () => {
  it('accepts plain and prerelease semver, rejects build metadata and leading zeros', () => {
    expect(parseVersion('0.1.0')).toMatchObject({ major: 0, minor: 1, patch: 0, prerelease: null })
    expect(parseVersion('0.1.0-beta.1')?.prerelease).toBe('beta.1')
    for (const bad of ['01.0.0', '1.0', '1.0.0+build', 'v1.0.0', '', '1.0.0-', null]) expect(parseVersion(bad)).toBeNull()
  })

  it('property: generated semver round-trips and any ".." segment is an unsafe path', () => {
    fc.assert(fc.property(fc.nat(99), fc.nat(99), fc.nat(99), (a, b, c) => parseVersion(`${a}.${b}.${c}`)?.patch === c))
    const segment = fc.stringMatching(/^[a-z0-9_-]{1,8}$/)
    fc.assert(fc.property(fc.array(segment, { minLength: 1, maxLength: 4 }), fc.nat(5), (parts, at) => {
      expect(isSafePackagePath(parts.join('/'))).toBe(true)
      const withDots = [...parts]
      withDots.splice(at % (parts.length + 1), 0, '..')
      expect(isSafePackagePath(withDots.join('/'))).toBe(false)
    }))
    for (const bad of ['/etc/passwd', 'a//b', 'a\\b', 'C:/x', '', './a', 'a/\0b']) expect(isSafePackagePath(bad)).toBe(false)
  })
})

describe('inventory allowlist', () => {
  it('accepts the exact runtime/declaration/metadata set including hashed shared chunks', () => {
    expect(checkInventory(goodFiles())).toEqual([])
  })

  it.each([
    ['source map', 'dist-sdk/index.cjs.map'], ['source file', 'src/index.ts'], ['tests', 'tests/api/x.ts'], ['state', 'STATE.md'],
    ['agent work', 'agent-work/a.md'], ['traversal', '../x'], ['demo', 'demos/a/index.ts'], ['uppercase chunk dir', 'dist-sdk/sub/shared-a.cjs'],
  ])('rejects %s', (_label, path) => {
    expect(checkInventory([...goodFiles(), file(path)]).length).toBeGreaterThan(0)
  })

  it('rejects links, executables, duplicates and missing required files', () => {
    expect(checkInventory([...goodFiles(), file('dist-sdk/shared-x.cjs', { type: 'symlink' })]).join()).toMatch(/non-regular/)
    expect(checkInventory(goodFiles().map(f => (f.path === 'LICENSE' ? { ...f, mode: 0o755 } : f))).join()).toMatch(/executable/)
    expect(checkInventory([...goodFiles(), file('LICENSE')]).join()).toMatch(/duplicate/)
    expect(checkInventory(goodFiles().filter(f => f.path !== 'dist-sdk/core.cjs')).join()).toMatch(/missing required file: dist-sdk\/core.cjs/)
  })

  it('property: any non-allowlisted extra path fails and any single missing required file fails', () => {
    const extra = fc.stringMatching(/^[a-z]{1,6}\/[a-z0-9]{1,8}\.(ts|map|json|md)$/)
    fc.assert(fc.property(extra, path => checkInventory([...goodFiles(), file(path)]).length > 0))
    fc.assert(fc.property(fc.constantFrom(...REQUIRED_FILES), missing => checkInventory(goodFiles().filter(f => f.path !== missing)).length > 0))
  })

  it('property: inventory digest ignores order and detects any size, mode or hash change', () => {
    const files = goodFiles()
    fc.assert(fc.property(fc.shuffledSubarray(files, { minLength: files.length }), shuffled => inventoryDigest(shuffled) === inventoryDigest(files)))
    fc.assert(fc.property(fc.nat(files.length - 1), hex, (index, other) => {
      fc.pre(other !== files[index].sha256)
      const mutate = patch => files.map((f, i) => (i === index ? { ...f, ...patch } : f))
      const base = inventoryDigest(files)
      return inventoryDigest(mutate({ sha256: other })) !== base && inventoryDigest(mutate({ size: files[index].size + 1 })) !== base && inventoryDigest(mutate({ mode: 0o600 })) !== base
    }))
  })
})

describe('manifest and exports', () => {
  it('accepts the approved export map whose targets exist', () => {
    expect(checkManifest(goodManifest(), { paths })).toEqual([])
    expect(APPROVED_EXPORT_KEYS).toHaveLength(4)
  })

  it('rejects unapproved, wildcard, missing and escaping exports', () => {
    const add = (key, value) => ({ ...goodManifest(), exports: { ...goodManifest().exports, [key]: value } })
    expect(checkManifest(add('./internal', './dist-sdk/index.cjs'), { paths }).join()).toMatch(/unapproved export \.\/internal/)
    expect(checkManifest(add('./*', './dist-sdk/*'), { paths }).join()).toMatch(/wildcard/)
    expect(checkManifest(add('./core', './src/core/index.ts'), { paths }).join()).toMatch(/outside dist-sdk/)
    expect(checkManifest(add('./core', './dist-sdk/ghost.mjs'), { paths }).join()).toMatch(/not in the tarball/)
    const missing = goodManifest(); delete missing.exports['./core']
    expect(checkManifest(missing, { paths }).join()).toMatch(/missing approved export \.\/core/)
    expect(checkManifest({ ...goodManifest(), exports: undefined }, { paths }).join()).toMatch(/no exports map/)
  })

  it('rejects private, lifecycle hooks and local dependency specifiers', () => {
    expect(checkManifest({ ...goodManifest(), private: true }, { paths }).join()).toMatch(/private/)
    expect(checkManifest({ ...goodManifest(), scripts: { postinstall: 'node x.js' } }, { paths }).join()).toMatch(/lifecycle script postinstall/)
    for (const spec of ['file:../x', 'link:../x', 'workspace:*', '../x', 'git+https://x/y.git']) {
      expect(checkManifest({ ...goodManifest(), dependencies: { zod: spec } }, { paths }).join()).toMatch(/non-registry/)
    }
    expect(checkManifest({ ...goodManifest(), version: 'latest' }, { paths }).join()).toMatch(/invalid release version/)
  })
})

describe('declarations', () => {
  const ok = [{ path: 'dist-sdk/index.d.mts', text: "import type { ReactNode } from 'react'\nexport * from './core.mjs'\nimport('react-dom/client')" }]
  const externals = new Set(['react', 'react-dom'])

  it('extracts import, export-from, dynamic import, require and reference specifiers', () => {
    const text = "import a from 'x'\nexport { b } from \"y\"\nimport('z')\nimport 'side'\n/// <reference types=\"node\" />\ntype T = import('w').T"
    expect(declarationSpecifiers(text).sort()).toEqual(['node', 'side', 'w', 'x', 'y', 'z'])
  })

  it('accepts resolved relatives and declared externals', () => {
    expect(checkDeclarations(ok, { paths, externals })).toEqual([])
  })

  it('rejects unresolved relatives, undeclared packages, absolute and Node-builtin specifiers', () => {
    const bad = text => checkDeclarations([{ path: 'dist-sdk/index.d.mts', text }], { paths, externals })
    expect(bad("import './missing.mjs'").join()).toMatch(/unresolved relative/)
    expect(bad("import '../src/index'").join()).toMatch(/unresolved relative/)
    expect(bad("import 'zod'").join()).toMatch(/undeclared package zod/)
    expect(bad("import '@scope/pkg/deep'").join()).toMatch(/undeclared package @scope\/pkg/)
    expect(bad("import '/abs/x'").join()).toMatch(/absolute|undeclared/)
    expect(bad("import 'node:fs'").join()).toMatch(/Node builtin/)
  })

  it('requires a packed declaration counterpart, not just the runtime file', () => {
    const runtimeOnly = new Set([...paths, 'dist-sdk/only-runtime.mjs', 'dist-sdk/only-runtime.cjs'])
    const check = text => checkDeclarations([{ path: 'dist-sdk/index.d.mts', text }], { paths: runtimeOnly, externals })
    expect(check("export * from './only-runtime.mjs'").join()).toMatch(/unresolved relative/)
    expect(check("export * from './only-runtime.cjs'").join()).toMatch(/unresolved relative/)
    expect(check("export * from './only-runtime'").join()).toMatch(/unresolved relative/)
    const withDecl = new Set([...runtimeOnly, 'dist-sdk/only-runtime.d.mts'])
    expect(checkDeclarations([{ path: 'dist-sdk/index.d.mts', text: "export * from './only-runtime.mjs'" }], { paths: withDecl, externals })).toEqual([])
  })
})

describe('evidence binding', () => {
  const inventory = goodFiles()
  const evidence = () => ({ schema: EVIDENCE_SCHEMA, name: 'c4-sdk', version: '0.1.0', sha256: 'b'.repeat(64), size: 123, sourceSha: 'c'.repeat(40), dirty: false, inventory, inventoryDigest: inventoryDigest(inventory) })
  const actual = () => ({ name: 'c4-sdk', version: '0.1.0', sha256: 'b'.repeat(64), size: 123, inventory })

  it('accepts matching evidence', () => {
    expect(checkEvidence(evidence(), actual(), { requireClean: true })).toEqual([])
  })

  it('rejects missing evidence, wrong hash, version, size, name, schema and dirty source', () => {
    expect(checkEvidence(undefined, actual()).join()).toMatch(/missing/)
    expect(checkEvidence({ ...evidence(), sha256: 'd'.repeat(64) }, actual()).join()).toMatch(/sha256 mismatch/)
    expect(checkEvidence({ ...evidence(), version: '0.1.1' }, actual()).join()).toMatch(/version mismatch/)
    expect(checkEvidence({ ...evidence(), size: 1 }, actual()).join()).toMatch(/size mismatch/)
    expect(checkEvidence({ ...evidence(), name: 'other' }, actual()).join()).toMatch(/name/)
    expect(checkEvidence({ ...evidence(), schema: 9 }, actual()).join()).toMatch(/schema/)
    expect(checkEvidence({ ...evidence(), dirty: true }, actual(), { requireClean: true }).join()).toMatch(/dirty/)
    expect(checkEvidence({ ...evidence(), sourceSha: 'xyz' }, actual()).join()).toMatch(/sourceSha/)
  })

  it('rejects inventory tampering in the tarball and in the evidence file', () => {
    const tampered = inventory.map((f, i) => (i === 0 ? { ...f, sha256: 'e'.repeat(64) } : f))
    expect(checkEvidence(evidence(), { ...actual(), inventory: tampered }).join()).toMatch(/inventory mismatch/)
    expect(checkEvidence({ ...evidence(), inventory: tampered }, actual()).join()).toMatch(/own inventory/)
    expect(checkEvidence({ ...evidence(), inventory: undefined }, actual()).join()).toMatch(/inventory missing/)
  })

  it('property: any single differing identity field is rejected', () => {
    fc.assert(fc.property(hex, hex, sha, (a, b, source) => {
      fc.pre(a !== b)
      const errors = checkEvidence({ ...evidence(), sha256: a, sourceSha: source }, { ...actual(), sha256: b })
      return errors.some(message => message.includes('sha256 mismatch'))
    }))
    fc.assert(fc.property(fc.nat(50), fc.nat(50), fc.nat(50), fc.nat(50), (a, b, c, d) => {
      fc.pre(c !== d)
      return checkEvidence({ ...evidence(), version: `${a}.${b}.${c}` }, { ...actual(), version: `${a}.${b}.${d}` }).some(message => message.includes('version mismatch'))
    }))
  })
})

describe('reports', () => {
  const id = { sha256: 'b'.repeat(64), version: '0.1.0', sourceSha: 'c'.repeat(40) }

  it('requires the package report to name the same hash, version, source and consumer', () => {
    expect(checkPackageReport({ ...id, consumer: '/tmp/x' }, id)).toEqual([])
    expect(checkPackageReport({ ...id, consumer: '/tmp/x', sha256: 'f'.repeat(64) }, id).join()).toMatch(/sha256/)
    expect(checkPackageReport({ ...id, consumer: '/tmp/x', sourceSha: 'd'.repeat(40) }, id).join()).toMatch(/source commit/)
    expect(checkPackageReport({ ...id }, id).join()).toMatch(/consumer/)
    expect(checkPackageReport(null, id).join()).toMatch(/missing/)
  })

  it('requires README report passed:true, matching identity and evidence locations', () => {
    const good = { passed: true, sha256: id.sha256, version: id.version, evidence: { browser: '/tmp/x' } }
    expect(checkReadmeReport(good, id)).toEqual([])
    expect(checkReadmeReport({ ...good, passed: false }, id).join()).toMatch(/did not pass/)
    expect(checkReadmeReport({ ...good, passed: 'true' }, id).join()).toMatch(/did not pass/)
    expect(checkReadmeReport({ ...good, version: '9.9.9' }, id).join()).toMatch(/version/)
    expect(checkReadmeReport({ ...good, evidence: {} }, id).join()).toMatch(/evidence locations/)
    expect(checkReadmeReport(undefined, id).join()).toMatch(/missing/)
    for (const bad of ['', '  ', false, 0, true, 7, null, [], [''], [{}], { a: '' }, { a: { b: [] } }, { a: 0 }]) {
      expect(checkReadmeReport({ ...good, evidence: bad }, id).join(), JSON.stringify(bad)).toMatch(/evidence locations/)
    }
    for (const fine of ['/tmp/x', ['/tmp/a', '/tmp/b'], { a: { b: ['/tmp/c'] } }]) expect(checkReadmeReport({ ...good, evidence: fine }, id)).toEqual([])
    expect(checkReadmeReport({ passed: true, sha256: id.sha256, version: id.version, evidenceLocations: ['/tmp/y'] }, id)).toEqual([])
  })

  describe('README evidence: locations validated separately from execution output', () => {
    const base = { passed: true, sha256: id.sha256, version: id.version }
    // Frozen producer shape of tests/readme/verify.mjs: { consumer, output: { esm, cjs }, screenshots }.
    const real = {
      consumer: '/tmp/consumer',
      output: {
        esm: [{ file: 'a.mjs', stdout: 'ok', nodes: 4 }],
        cjs: [{ file: 'a.cjs', stdout: 'ok', nodes: 4 }],
      },
      screenshots: ['/tmp/shot-1.png', '/tmp/shot-2.png'],
    }
    const errorsFor = fields => checkReadmeReport({ ...base, ...fields }, id).join()

    it('accepts the real producer shape including numeric execution results', () => {
      expect(errorsFor({ evidence: real })).toBe('')
    })
    it('accepts previously accepted shapes and evidenceLocations alone or beside execution output', () => {
      for (const fine of ['/tmp/x', ['/tmp/a', '/tmp/b'], { a: { b: ['/tmp/c'] } }, { browser: '/tmp/x' }]) expect(errorsFor({ evidence: fine })).toBe('')
      expect(errorsFor({ evidenceLocations: ['/tmp/y'] })).toBe('')
      expect(errorsFor({ evidence: { output: real.output }, evidenceLocations: ['/tmp/y'] })).toBe('')
      expect(errorsFor({ evidence: real, evidenceLocations: '/tmp/z' })).toBe('')
    })
    it('rejects malformed or location-free evidence', () => {
      const bad = ['', '  ', false, 0, true, 7, null, [], [''], [{}], { a: '' }, { a: { b: [] } }, { a: 0 }, {}, { consumer: '' }, { screenshots: [] }, { screenshots: [''] },
        { output: [{ nodes: 4 }] }, { consumer: '/tmp/x', screenshots: [] }, { output: real.output }, { ...real, consumer: '' }, { ...real, screenshots: [] }]
      for (const evidence of bad) expect(errorsFor({ evidence }), JSON.stringify(evidence)).toMatch(/evidence locations/)
      expect(errorsFor({}), 'neither field').toMatch(/evidence locations/)
      expect(errorsFor({ evidence: real, evidenceLocations: [''] })).toMatch(/evidence locations/)
      expect(errorsFor({ evidenceLocations: [] })).toMatch(/evidence locations/)
    })
    it('leaves identity checks unchanged for the real shape', () => {
      expect(errorsFor({ evidence: real, passed: false })).toMatch(/did not pass/)
      expect(errorsFor({ evidence: real, sha256: 'f'.repeat(64) })).toMatch(/sha256/)
      expect(errorsFor({ evidence: real, version: '9.9.9' })).toMatch(/version/)
    })
  })

  it('requires every verification stage, same evidence file and source', () => {
    const good = { passed: true, ...id, evidenceSha256: 'e'.repeat(64), stages: { inventory: 'passed', package: 'passed', browser: 'passed', readme: 'passed' } }
    const expected = { ...id, evidenceSha256: good.evidenceSha256 }
    expect(checkVerifyReport(good, expected)).toEqual([])
    for (const stage of ['inventory', 'package', 'browser', 'readme']) {
      expect(checkVerifyReport({ ...good, stages: { ...good.stages, [stage]: 'failed' } }, expected).join()).toContain(stage)
    }
    expect(checkVerifyReport({ ...good, evidenceSha256: 'a'.repeat(64) }, expected).join()).toMatch(/evidence file/)
    expect(checkVerifyReport({ ...good, passed: false }, expected).join()).toMatch(/did not pass/)
  })
})

describe('publication gates', () => {
  const evidence = { name: 'c4-sdk', version: '0.1.0', sha256: 'ab'.repeat(32) }
  const confirm = publishConfirmation(evidence)

  it('requires explicit https registry without credentials', () => {
    expect(checkRegistry('https://registry.npmjs.org/')).toEqual([])
    expect(checkRegistry('http://127.0.0.1:4873')).toEqual([])
    for (const bad of [undefined, '', 'registry.npmjs.org', 'http://registry.npmjs.org', 'https://user:pw@registry.npmjs.org', 'https://r.example/?x=1']) {
      expect(checkRegistry(bad).length).toBeGreaterThan(0)
    }
  })

  it('never lets a prerelease use latest and always requires an explicit tag', () => {
    expect(checkTag('latest', '0.1.0-beta.1').join()).toMatch(/must not be published under latest/)
    expect(checkTag('beta', '0.1.0-beta.1')).toEqual([])
    expect(checkTag('latest', '0.1.0')).toEqual([])
    expect(checkTag(undefined, '0.1.0').join()).toMatch(/explicit/)
    expect(checkTag('1.2.3', '0.1.0').join()).toMatch(/dist-tag/)
    expect(checkTag('Bad Tag', '0.1.0').length).toBeGreaterThan(0)
  })

  it('property: a prerelease version is never accepted for latest', () => {
    fc.assert(fc.property(fc.nat(9), fc.nat(9), fc.nat(9), fc.stringMatching(/^[a-z]{1,5}(\.[0-9]{1,2})?$/), (a, b, c, pre) => checkTag('latest', `${a}.${b}.${c}-${pre}`).length > 0))
  })

  it('requires the exact operator confirmation bound to name, version and hash', () => {
    const input = { evidence, tag: 'beta', registry: 'https://registry.npmjs.org/', confirm }
    expect(checkPublishRequest(input)).toEqual([])
    expect(checkPublishRequest({ ...input, confirm: undefined }).join()).toMatch(/confirmation/)
    expect(checkPublishRequest({ ...input, confirm: 'publish c4-sdk@0.1.0 000000000000' }).join()).toMatch(/confirmation/)
  })

  it('builds publish args that never rebuild and always ignore scripts', () => {
    const args = buildPublishArgs({ tarball: '/a/b.tgz', tag: 'beta', registry: 'https://r.example/' })
    expect(args).toEqual(['publish', '/a/b.tgz', '--tag', 'beta', '--registry', 'https://r.example/', '--ignore-scripts'])
    expect(buildPublishArgs({ tarball: '/a/b.tgz', tag: 'beta', registry: 'https://r.example/', dryRun: true }).at(-1)).toBe('--dry-run')
  })

  it('names tarballs like npm', () => {
    expect(tarballName('c4-sdk', '0.1.0')).toBe('c4-sdk-0.1.0.tgz')
    expect(tarballName('@a/b', '1.0.0')).toBe('a-b-1.0.0.tgz')
    expect(checkPackJson([{ name: 'c4-sdk', version: '0.1.0', filename: 'c4-sdk-0.1.0.tgz', files: [] }], { name: 'c4-sdk', version: '0.1.0' })).toEqual([])
    expect(checkPackJson([], { name: 'c4-sdk', version: '0.1.0' }).length).toBe(1)
  })
})

describe('recursion and destructive cleanup guards', () => {
  it('detects recursion and strips credentials from non-publication children', () => {
    expect(isRecursiveInvocation({})).toBe(false)
    expect(isRecursiveInvocation(childEnv({}))).toBe(true)
    const env = childEnv({ NODE_AUTH_TOKEN: 'x', NPM_TOKEN: 'y', 'npm_config_//registry.npmjs.org/:_authToken': 'z', PATH: '/bin' })
    expect(env).toEqual({ PATH: '/bin', C4_RELEASE_ACTIVE: '1' })
    expect(childEnv({ NODE_AUTH_TOKEN: 'x' }, { credentials: true }).NODE_AUTH_TOKEN).toBe('x')
  })

  const repoRoot = '/work/repo'
  const artifactsRoot = '/work/repo/artifacts/release'
  it('only cleans marked directories strictly inside the artifacts root', () => {
    expect(checkCleanTarget({ target: `${artifactsRoot}/c4-sdk-1`, artifactsRoot, repoRoot, marked: true })).toEqual([])
    expect(checkCleanTarget({ target: `${artifactsRoot}/c4-sdk-1`, artifactsRoot, repoRoot, marked: false }).join()).toMatch(/marker/)
    for (const target of [artifactsRoot, repoRoot, '/', '/work', '/work/repo/src', `${artifactsRoot}/../../src`, 'relative/path']) {
      expect(checkCleanTarget({ target, artifactsRoot, repoRoot, marked: true }).length).toBeGreaterThan(0)
    }
    for (const root of [repoRoot, '/work', '/work/repo/src/lib', '/work/repo/node_modules/x', '/work/repo/.git/y']) {
      expect(checkCleanTarget({ target: `${root}/x`, artifactsRoot: root, repoRoot, marked: true }).length).toBeGreaterThan(0)
    }
  })

  it('property: nothing outside the artifacts root is ever cleanable', () => {
    const segment = fc.stringMatching(/^[a-z0-9]{1,6}$/)
    fc.assert(fc.property(fc.array(segment, { minLength: 0, maxLength: 4 }), parts => {
      const target = `/work/repo/${parts.join('/')}`
      const inside = target.startsWith(`${artifactsRoot}/`)
      return (checkCleanTarget({ target, artifactsRoot, repoRoot, marked: true }).length === 0) === inside
    }))
  })
})
