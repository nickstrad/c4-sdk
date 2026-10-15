#!/usr/bin/env node
// Release driver behind the Makefile. Commands: sdk-check, sdk-build, pack, verify, check, publish.
// Orchestration only: policy.mjs decides, process.mjs performs effects, and `io` is injectable.
import { basename, dirname, isAbsolute, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  EVIDENCE_SCHEMA, buildPackArgs, buildPublishArgs, checkArtifactsRoot, checkCleanTarget, checkDeclarations, checkEvidence, checkInventory, checkManifest,
  checkPackJson, checkPackageReport, checkPublishRequest, checkReadmeReport, checkVerifyReport, childEnv, declaredExternals,
  inventoryDigest, isRecursiveInvocation, parseVersion, sha256Hex, tarballName,
} from './policy.mjs'
import { MARKER, createIo } from './process.mjs'

export class ReleaseError extends Error {
  constructor(errors) {
    const list = Array.isArray(errors) ? errors : [errors]
    super(list.join('\n'))
    this.errors = list
  }
}
const fail = errors => { throw new ReleaseError(errors) }
const failIf = errors => { if (errors.length) fail(errors) }

const sidecar = (tarball, suffix) => join(dirname(tarball), `${basename(tarball, '.tgz')}.${suffix}.json`)
const stdoutJson = text => { try { return JSON.parse(text) } catch { return null } }

export function context(env, root) {
  const repoRoot = resolve(root)
  const artifactsRoot = resolve(repoRoot, env.ARTIFACTS || 'artifacts/release')
  return { repoRoot, artifactsRoot, env }
}

function readManifest(io, ctx) {
  const manifest = io.readJson(join(ctx.repoRoot, 'package.json'))
  failIf(manifest?.name === 'c4-sdk' ? [] : ['driver must run from the c4-sdk repository root'])
  return manifest
}

function checkNode(manifest) {
  const wanted = manifest.engines?.node
  return parseVersion(wanted) && wanted !== process.version.slice(1) ? [`Node ${process.version} does not match the exercised engines.node ${wanted}`] : []
}

function runStep(io, ctx, label, command, args, extra = {}) {
  io.log(`release: ${label}`)
  const result = io.run(command, args, { env: childEnv(ctx.env, extra.credentials ? { credentials: true } : {}), capture: extra.capture })
  if (result.status !== 0) fail([`${label} failed (exit ${result.status})${extra.capture ? `: ${result.stderr.trim()}` : ''}`])
  return result
}

export function sdkCheck(io, ctx) {
  const nodeErrors = checkNode(readManifest(io, ctx))
  failIf(nodeErrors)
  runStep(io, ctx, 'sdk-check: typecheck, lint, unit, property, API snapshot', 'npm', ['run', 'sdk:check'])
  runStep(io, ctx, 'sdk-check: release unit and property tests', 'node', ['node_modules/vitest/vitest.mjs', 'run', '--config', 'tests/release/vitest.config.ts'])
}

export function sdkBuild(io, ctx) {
  readManifest(io, ctx)
  runStep(io, ctx, 'sdk-build', 'node', ['sdk-build.mjs'])
}

// Pure-ish: the manifest/inventory/declaration rules applied to an inspected tarball.
export function inspectCandidate(inspection) {
  // An unreadable archive has no inventory to judge; report the cause once.
  if (inspection.files.length === 0 && inspection.errors.length > 0) return { errors: [...inspection.errors], manifest: null }
  const errors = [...inspection.errors, ...checkInventory(inspection.files)]
  const manifestFile = inspection.files.find(file => file.path === 'package.json')
  let manifest = null
  if (!manifestFile?.text) errors.push('tarball has no readable package.json')
  else {
    try { manifest = JSON.parse(manifestFile.text) } catch { errors.push('tarball package.json is not valid JSON') }
  }
  if (manifest) {
    const paths = new Set(inspection.files.map(file => file.path))
    errors.push(...checkManifest(manifest, { paths }))
    const declarations = inspection.files.filter(file => /\.d\.[cm]ts$/.test(file.path)).map(file => ({ path: file.path, text: file.text ?? '' }))
    errors.push(...checkDeclarations(declarations, { paths, externals: declaredExternals(manifest) }))
  }
  return { errors, manifest }
}

const publicInventory = files => files.map(({ path, size, mode, sha256 }) => ({ path, size, mode, sha256 })).sort((a, b) => a.path.localeCompare(b.path))

export function releasePack(io, ctx) {
  const manifest = readManifest(io, ctx)
  failIf(checkNode(manifest))
  failIf(parseVersion(manifest.version) ? [] : [`invalid version ${manifest.version}`])
  const allowDirty = ctx.env.ALLOW_DIRTY === '1'
  // Generated outputs are not source: the build recreates dist-sdk and .sdk-types, and artifacts are ours.
  const excludes = ['dist-sdk', '.sdk-types', ...(ctx.artifactsRoot.startsWith(`${ctx.repoRoot}/`) ? [ctx.artifactsRoot.slice(ctx.repoRoot.length + 1)] : [])]
  // Validate the destination root (lexically and physically) before any build, write or status exclusion.
  failIf([...checkArtifactsRoot({ artifactsRoot: ctx.artifactsRoot, repoRoot: ctx.repoRoot }), ...io.physicalContainmentErrors(ctx.repoRoot, ctx.artifactsRoot)].map(message => `unsafe artifacts root: ${message}`))
  const before = io.gitState({ excludes })
  if (before.dirty && !allowDirty) fail(['source tree is dirty; commit first or set ALLOW_DIRTY=1 for a non-releasable rehearsal'])
  runStep(io, ctx, 'release-pack: build once', 'node', ['sdk-build.mjs'])
  const after = io.gitState({ excludes })
  if (!allowDirty && (after.dirty || after.sha !== before.sha)) fail([`build modified tracked sources:\n${after.status}`])

  // With the override, any change of source state across the build makes the evidence dirty; an override run is never publishable.
  const dirty = allowDirty || before.dirty || after.dirty || after.sha !== before.sha
  const destination = join(ctx.artifactsRoot, `${manifest.name}-${manifest.version}-${before.sha.slice(0, 12)}`)
  if (io.exists(destination)) {
    // Re-examined immediately before deletion: lexical rules, no symlink on the path, marker is a real file.
    const guard = [
      ...checkCleanTarget({ target: destination, artifactsRoot: ctx.artifactsRoot, repoRoot: ctx.repoRoot, marked: io.isRegularFile(join(destination, MARKER)) }),
      ...io.physicalContainmentErrors(ctx.repoRoot, destination),
    ]
    failIf(guard.map(message => `refusing to replace existing artifacts: ${message}`))
    io.removeTree(destination)
  } else {
    // A build can introduce a symlinked ancestor; reject before creating anything for a missing destination.
    failIf(io.physicalContainmentErrors(ctx.repoRoot, destination).map(message => `unsafe artifacts destination: ${message}`))
  }
  io.mkdirp(destination)
  failIf(io.physicalContainmentErrors(ctx.repoRoot, destination).map(message => `unsafe artifacts destination: ${message}`))
  io.writeAtomic(join(destination, MARKER), 'managed by work-scripts/node/release/cli.mjs\n')

  io.log('release: pack once')
  const packed = io.run('npm', buildPackArgs(destination), { env: childEnv(ctx.env), capture: true })
  if (packed.status !== 0) fail([`npm pack failed (exit ${packed.status}): ${packed.stderr.trim()}`])
  const packJson = stdoutJson(packed.stdout)
  failIf(checkPackJson(packJson, manifest))
  const tarball = join(destination, tarballName(manifest.name, manifest.version))
  failIf(io.isRegularFile(tarball) ? [] : [`npm pack did not create ${tarball}`])

  const inspection = io.inspectTarball(tarball)
  const { errors, manifest: packed_ } = inspectCandidate(inspection)
  failIf(errors)
  const hash = io.hashFile(tarball)
  const [entry] = packJson
  const crossCheck = []
  if (entry.shasum !== hash.sha1) crossCheck.push('npm pack shasum does not match tarball bytes')
  if (entry.integrity !== hash.integrity) crossCheck.push('npm pack integrity does not match tarball bytes')
  const packedPaths = new Set((entry.files ?? []).map(file => file.path))
  const inspected = new Set(inspection.files.map(file => file.path))
  if (packedPaths.size !== inspected.size || [...packedPaths].some(path => !inspected.has(path))) crossCheck.push('npm pack file list differs from inspected tarball')
  if (packed_.version !== manifest.version) crossCheck.push('packed manifest version differs from source manifest')
  failIf(crossCheck)

  const inventory = publicInventory(inspection.files)
  const evidence = {
    schema: EVIDENCE_SCHEMA,
    name: manifest.name,
    version: manifest.version,
    sourceSha: before.sha,
    dirty,
    dirtyBefore: before.dirty,
    dirtyAfter: after.dirty,
    sourceShaAfter: after.sha,
    allowDirty,
    tarball: basename(tarball),
    sha256: hash.sha256,
    sha1: hash.sha1,
    integrity: hash.integrity,
    size: hash.size,
    inventory,
    inventoryDigest: inventoryDigest(inventory),
    tools: { node: process.version, npm: runVersion(io, ctx, 'npm') },
  }
  io.writeAtomic(sidecar(tarball, 'evidence'), `${JSON.stringify(evidence, null, 2)}\n`)
  io.log(JSON.stringify({ tarball, sha256: hash.sha256, version: manifest.version, sourceSha: before.sha, evidence: sidecar(tarball, 'evidence') }))
  return { tarball, evidence }
}

const runVersion = (io, ctx, command) => io.run(command, ['--version'], { env: childEnv(ctx.env), capture: true }).stdout.trim()

function loadArtifact(io, tarballInput, { requireClean }) {
  if (!tarballInput) fail(['TARBALL must be given explicitly (verification and publication never build or pack)'])
  const tarball = resolve(tarballInput)
  failIf(io.isRegularFile(tarball) ? [] : [`tarball is not a regular file: ${tarball}`])
  const evidencePath = sidecar(tarball, 'evidence')
  failIf(io.exists(evidencePath) ? [] : [`release evidence is missing: ${evidencePath}`])
  const evidenceBytes = io.readBytes(evidencePath)
  let evidence
  try { evidence = JSON.parse(evidenceBytes.toString('utf8')) } catch { fail([`release evidence is not valid JSON: ${evidencePath}`]) }
  const hash = io.hashFile(tarball)
  const inspection = io.inspectTarball(tarball)
  const { errors, manifest } = inspectCandidate(inspection)
  const actual = { name: manifest?.name, version: manifest?.version, sha256: hash.sha256, size: hash.size, inventory: publicInventory(inspection.files) }
  const all = manifest ? [...errors, ...checkEvidence(evidence, actual, { requireClean })] : errors
  if (evidence?.tarball !== basename(tarball)) all.push(`evidence is for ${evidence?.tarball}, not ${basename(tarball)}`)
  return { tarball, evidence, evidenceSha256: sha256Hex(evidenceBytes), hash, errors: all }
}

export function releaseVerify(io, ctx, tarballInput = ctx.env.TARBALL) {
  readManifest(io, ctx)
  const artifact = loadArtifact(io, tarballInput, { requireClean: false })
  const reportPath = sidecar(artifact.tarball, 'verify')
  io.removeFile(reportPath) // a stale pass must never survive a failed run
  const stages = { inventory: 'failed', package: 'pending', browser: 'pending', readme: 'pending' }
  const write = (passed, errors) => {
    const report = { schema: EVIDENCE_SCHEMA, passed, name: artifact.evidence?.name, version: artifact.evidence?.version, sha256: artifact.hash.sha256, sourceSha: artifact.evidence?.sourceSha, evidenceSha256: artifact.evidenceSha256, stages, errors }
    io.writeAtomic(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  }
  const stop = errors => { write(false, errors); fail(errors) }
  if (artifact.errors.length) stop(artifact.errors)
  stages.inventory = 'passed'
  const { evidence } = artifact
  const env = childEnv(ctx.env)

  io.log('release-verify: P-02 consumer matrix against the exact tarball')
  const consumerRun = io.run('node', ['tests/package/verify.mjs', artifact.tarball], { env, capture: true })
  io.log(consumerRun.stdout)
  if (consumerRun.status !== 0) { stages.package = 'failed'; stop([`package consumer verification failed (exit ${consumerRun.status})`]) }
  const consumer = [...consumerRun.stdout.matchAll(/"consumer":\s*"([^"]+)"/g)].at(-1)?.[1]
  const consumerReportPath = consumer ? join(consumer, 'report.json') : null
  const consumerReport = consumerReportPath && io.exists(consumerReportPath) ? io.readJson(consumerReportPath) : null
  const packageErrors = checkPackageReport(consumerReport, { sha256: evidence.sha256, version: evidence.version, sourceSha: evidence.sourceSha })
  if (packageErrors.length) { stages.package = 'failed'; stop(packageErrors) }
  stages.package = 'passed'

  io.log('release-verify: packaged browser tests (ports 4185/4186)')
  const browser = io.run('node', ['node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/package/playwright.config.ts'], { env: { ...env, CONSUMER_DIR: consumer }, capture: false })
  if (browser.status !== 0) { stages.browser = 'failed'; stop([`packaged browser tests failed (exit ${browser.status})`]) }
  stages.browser = 'passed'

  const readmeVerifier = 'tests/readme/verify.mjs'
  if (!io.exists(join(ctx.repoRoot, readmeVerifier))) { stages.readme = 'failed'; stop([`${readmeVerifier} is missing: README verification is required (fail closed)`]) }
  const readmeReport = sidecar(artifact.tarball, 'readme')
  io.removeFile(readmeReport)
  io.log('release-verify: P-04 README verification (ports 4187/4188)')
  const readme = io.run('node', [readmeVerifier, artifact.tarball], { env: { ...env, README_REPORT: readmeReport }, capture: false })
  if (readme.status !== 0) { stages.readme = 'failed'; stop([`README verification failed (exit ${readme.status})`]) }
  const readmeErrors = io.exists(readmeReport) ? checkReadmeReport(io.readJson(readmeReport), { sha256: evidence.sha256, version: evidence.version }) : [`README_REPORT was not written: ${readmeReport}`]
  if (readmeErrors.length) { stages.readme = 'failed'; stop(readmeErrors) }
  stages.readme = 'passed'

  write(true, [])
  io.log(JSON.stringify({ verified: artifact.tarball, sha256: evidence.sha256, version: evidence.version, report: reportPath }))
  return { reportPath }
}

export function releaseCheck(io, ctx) {
  sdkCheck(io, ctx)
  const { tarball } = releasePack(io, ctx)
  return releaseVerify(io, ctx, tarball)
}

// Publishes only the already-verified tarball; imports no build step and never packs.
export function releasePublish(io, ctx, { tarball: tarballInput = ctx.env.TARBALL, tag = ctx.env.TAG, registry = ctx.env.REGISTRY, confirm = ctx.env.CONFIRM, dryRun = ctx.env.DRY_RUN === '1' } = {}) {
  const artifact = loadArtifact(io, tarballInput, { requireClean: true })
  failIf(artifact.errors)
  const reportPath = sidecar(artifact.tarball, 'verify')
  failIf(io.exists(reportPath) ? [] : [`verification report is missing: ${reportPath}`])
  failIf(checkVerifyReport(io.readJson(reportPath), { sha256: artifact.hash.sha256, version: artifact.evidence.version, evidenceSha256: artifact.evidenceSha256, sourceSha: artifact.evidence.sourceSha }))
  failIf(checkPublishRequest({ evidence: artifact.evidence, tag, registry, confirm }))

  const spec = `${artifact.evidence.name}@${artifact.evidence.version}`
  const lookup = io.run('npm', ['view', spec, 'version', '--registry', registry], { env: childEnv(ctx.env, { credentials: true }), capture: true })
  if (lookup.status === 0 && lookup.stdout.trim() !== '') fail([`${spec} already exists on ${registry}; publish nothing`])
  if (lookup.status !== 0 && !/E404/.test(`${lookup.stdout}${lookup.stderr}`)) fail([`could not confirm ${spec} is unpublished: ${lookup.stderr.trim()}`])

  io.log(`release-publish: ${dryRun ? 'dry-run ' : ''}${spec} -> ${registry} --tag ${tag}`)
  const published = io.run('npm', buildPublishArgs({ tarball: artifact.tarball, tag, registry, dryRun }), { env: childEnv(ctx.env, { credentials: true }) })
  if (published.status !== 0) fail([`npm publish failed (exit ${published.status}); do not rebuild under the same evidence`])
  return { spec, tag, registry, dryRun }
}

function parseFlags(argv) {
  const flags = {}
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) fail([`unexpected argument ${arg}`])
    const [key, inline] = arg.slice(2).split('=', 2)
    flags[key] = inline ?? argv[++index]
    if (flags[key] === undefined) fail([`missing value for --${key}`])
  }
  return flags
}

export function main(argv, env = process.env, io = createIo({ cwd: process.cwd() }), root = process.cwd()) {
  try {
    if (isRecursiveInvocation(env)) fail(['release driver invoked from inside a release run (lifecycle recursion refused)'])
    const [command, ...rest] = argv
    const flags = parseFlags(rest)
    const merged = { ...env }
    for (const [flag, name] of [['tarball', 'TARBALL'], ['tag', 'TAG'], ['registry', 'REGISTRY'], ['confirm', 'CONFIRM']]) if (flags[flag] !== undefined) merged[name] = flags[flag]
    if (merged.TARBALL && !isAbsolute(merged.TARBALL)) merged.TARBALL = resolve(root, merged.TARBALL)
    const ctx = context(merged, root)
    const commands = { 'sdk-check': sdkCheck, 'sdk-build': sdkBuild, pack: releasePack, verify: releaseVerify, check: releaseCheck, publish: releasePublish }
    if (!commands[command]) fail([`unknown command ${JSON.stringify(command)}; expected ${Object.keys(commands).join(', ')}`])
    commands[command](io, ctx)
    return 0
  } catch (error) {
    if (error instanceof ReleaseError) { process.stderr.write(`release: FAILED\n${error.message}\n`); return 1 }
    throw error
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2))
