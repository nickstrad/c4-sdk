// Pure release policy: manifest, inventory, evidence and publication validation.
// No filesystem, network or process effects live here; process.mjs and cli.mjs adapt them.
// Every validator returns an array of human-readable error strings (empty means valid).
import { createHash } from 'node:crypto'
import { isAbsolute, relative, resolve, sep } from 'node:path'

export const EVIDENCE_SCHEMA = 1
export const PACKAGE_NAME = 'c4-sdk'
export const APPROVED_EXPORT_KEYS = ['.', './core', './styles.css', './layout-worker.js']
export const REQUIRED_FILES = [
  'package.json', 'LICENSE', 'README.md', 'THIRD_PARTY_NOTICES.md',
  'dist-sdk/index.cjs', 'dist-sdk/index.mjs', 'dist-sdk/index.d.cts', 'dist-sdk/index.d.mts',
  'dist-sdk/core.cjs', 'dist-sdk/core.mjs', 'dist-sdk/core.d.cts', 'dist-sdk/core.d.mts',
  'dist-sdk/styles.css', 'dist-sdk/layout-worker.js',
]
// The allowlist is the required set plus content-hashed shared CJS chunks.
const SHARED_CHUNK = /^dist-sdk\/shared-[A-Za-z0-9_-]+\.cjs$/
const FORBIDDEN_LIFECYCLE = ['preinstall', 'install', 'postinstall', 'prepublish', 'prepublishOnly', 'publish', 'postpublish']
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/
const HEX64 = /^[0-9a-f]{64}$/
const HEX40 = /^[0-9a-f]{40}$/
const DIST_TAG = /^[a-z][a-z0-9._-]{0,63}$/
const LOCAL_SPEC = /^(file:|link:|workspace:|git\+|git:|github:|\.{1,2}\/|\/|~)/

export const sha256Hex = bytes => createHash('sha256').update(bytes).digest('hex')

export function parseVersion(version) {
  if (typeof version !== 'string') return null
  const match = SEMVER.exec(version)
  if (!match || version.includes('+')) return null // build metadata would not survive registry identity
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]), prerelease: match[4] ?? null }
}

export function isSafePackagePath(path) {
  if (typeof path !== 'string' || path.length === 0 || path.length > 200) return false
  if (path.startsWith('/') || path.includes('\\') || path.includes('\0') || /^[A-Za-z]:/.test(path)) return false
  return path.split('/').every(part => part !== '' && part !== '.' && part !== '..')
}

export function isAllowedPath(path) {
  return REQUIRED_FILES.includes(path) || SHARED_CHUNK.test(path)
}

// files: [{path, size, mode, type?, sha256?}] from inspecting the exact tarball.
export function checkInventory(files) {
  const errors = []
  const seen = new Set()
  for (const file of files) {
    const path = file?.path
    if (!isSafePackagePath(path)) { errors.push(`unsafe path in tarball: ${JSON.stringify(path)}`); continue }
    if (seen.has(path)) errors.push(`duplicate entry: ${path}`)
    seen.add(path)
    if (file.type !== undefined && file.type !== 'file') errors.push(`non-regular entry (${file.type}): ${path}`)
    if (!isAllowedPath(path)) errors.push(`unexpected packed file: ${path}`)
    if (/\.map$/.test(path)) errors.push(`source map packed: ${path}`)
    if (typeof file.mode === 'number' && (file.mode & 0o7111) !== 0) errors.push(`executable or setuid mode on ${path}`)
    if (!Number.isInteger(file.size) || file.size < 0) errors.push(`invalid size for ${path}`)
  }
  for (const required of REQUIRED_FILES) if (!seen.has(required)) errors.push(`missing required file: ${required}`)
  return errors
}

export function inventoryDigest(files) {
  const lines = files.map(f => `${f.path}\t${f.size}\t${f.mode}\t${f.sha256 ?? ''}\n`).sort()
  return sha256Hex(lines.join(''))
}

export function exportTargets(map) {
  const targets = []
  const errors = []
  const walk = (node, where) => {
    if (typeof node === 'string') targets.push([where, node])
    else if (node && typeof node === 'object' && !Array.isArray(node)) for (const [key, value] of Object.entries(node)) walk(value, `${where}.${key}`)
    else errors.push(`invalid export target at ${where}`)
  }
  walk(map, 'exports')
  return { targets, errors }
}

export function checkManifest(manifest, options = {}) {
  const errors = []
  const { expectedName = PACKAGE_NAME, approvedExports = APPROVED_EXPORT_KEYS, paths } = options
  if (!manifest || typeof manifest !== 'object') return ['manifest is not an object']
  if (manifest.name !== expectedName) errors.push(`package name ${JSON.stringify(manifest.name)} is not ${expectedName}`)
  if (!parseVersion(manifest.version)) errors.push(`invalid release version ${JSON.stringify(manifest.version)}`)
  if (manifest.private === true) errors.push('manifest is private')
  if (manifest.workspaces !== undefined) errors.push('manifest declares workspaces')
  const exportsMap = manifest.exports
  if (!exportsMap || typeof exportsMap !== 'object' || Array.isArray(exportsMap)) errors.push('manifest has no exports map')
  else {
    const keys = Object.keys(exportsMap)
    for (const key of keys) {
      if (key.includes('*')) errors.push(`wildcard export ${key}`)
      if (!approvedExports.includes(key)) errors.push(`unapproved export ${key}`)
    }
    for (const key of approvedExports) if (!keys.includes(key)) errors.push(`missing approved export ${key}`)
    const { targets, errors: targetErrors } = exportTargets(exportsMap)
    errors.push(...targetErrors)
    for (const [where, target] of targets) {
      if (!target.startsWith('./dist-sdk/') || !isSafePackagePath(target.slice(2))) errors.push(`${where} target ${target} is outside dist-sdk`)
      else if (paths && !paths.has(target.slice(2))) errors.push(`${where} target ${target} is not in the tarball`)
    }
  }
  for (const field of ['main', 'module', 'types']) {
    const target = manifest[field]
    if (target === undefined) continue
    if (typeof target !== 'string' || !target.startsWith('./dist-sdk/') || !isSafePackagePath(target.slice(2))) errors.push(`${field} target ${JSON.stringify(target)} is outside dist-sdk`)
    else if (paths && !paths.has(target.slice(2))) errors.push(`${field} target ${target} is not in the tarball`)
  }
  for (const hook of FORBIDDEN_LIFECYCLE) if (manifest.scripts?.[hook] !== undefined) errors.push(`consumer-visible lifecycle script ${hook}`)
  for (const section of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
    for (const [name, spec] of Object.entries(manifest[section] ?? {})) {
      if (typeof spec !== 'string' || LOCAL_SPEC.test(spec)) errors.push(`${section}.${name} uses non-registry specifier ${JSON.stringify(spec)}`)
    }
  }
  return errors
}

export function declaredExternals(manifest) {
  return new Set(['dependencies', 'optionalDependencies', 'peerDependencies'].flatMap(section => Object.keys(manifest?.[section] ?? {})))
}

const packageNameOf = specifier => (specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0])

export function declarationSpecifiers(text) {
  const found = []
  const patterns = [/\bfrom\s*['"]([^'"]+)['"]/g, /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, /\bimport\s*['"]([^'"]+)['"]/g, /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g, /\/\/\/\s*<reference\s+(?:path|types)\s*=\s*['"]([^'"]+)['"]/g]
  for (const pattern of patterns) for (const match of text.matchAll(pattern)) found.push(match[1])
  return found
}

function resolvesInTarball(fromPath, specifier, paths) {
  const base = fromPath.split('/').slice(0, -1)
  for (const part of specifier.split('/')) {
    if (part === '..') { if (base.length === 0) return false; base.pop() } else if (part !== '.') base.push(part)
  }
  const target = base.join('/')
  // A runtime .mjs/.cjs file is not a declaration: only a packed declaration counterpart resolves.
  const candidates = [`${target}.d.mts`, `${target}.d.cts`, `${target}/index.d.mts`, `${target}/index.d.cts`]
  if (/\.d\.[cm]ts$/.test(target)) candidates.push(target)
  if (/\.mjs$/.test(target)) candidates.push(target.replace(/\.mjs$/, '.d.mts'))
  if (/\.cjs$/.test(target)) candidates.push(target.replace(/\.cjs$/, '.d.cts'))
  return candidates.some(candidate => paths.has(candidate))
}

// declarations: [{path, text}] for every packed .d.mts/.d.cts file.
export function checkDeclarations(declarations, { paths, externals }) {
  const errors = []
  for (const { path, text } of declarations) {
    for (const specifier of declarationSpecifiers(text)) {
      if (specifier.startsWith('.')) {
        if (!resolvesInTarball(path, specifier, paths)) errors.push(`${path}: unresolved relative declaration import ${specifier}`)
      } else if (isAbsolute(specifier) || /^[A-Za-z]:/.test(specifier)) errors.push(`${path}: absolute declaration import ${specifier}`)
      else if (specifier.startsWith('node:')) errors.push(`${path}: Node builtin in public declarations: ${specifier}`)
      else if (!externals.has(packageNameOf(specifier))) errors.push(`${path}: declaration imports undeclared package ${specifier}`)
    }
  }
  return errors
}

export function checkPackJson(packJson, { name, version }) {
  if (!Array.isArray(packJson) || packJson.length !== 1) return ['npm pack must report exactly one tarball']
  const [entry] = packJson
  const errors = []
  if (entry?.name !== name) errors.push(`npm pack name ${JSON.stringify(entry?.name)} is not ${name}`)
  if (entry?.version !== version) errors.push(`npm pack version ${JSON.stringify(entry?.version)} is not ${version}`)
  if (entry?.filename !== tarballName(name, version)) errors.push(`npm pack filename ${JSON.stringify(entry?.filename)} is unexpected`)
  if (!Array.isArray(entry?.files)) errors.push('npm pack reported no file list')
  return errors
}

export const tarballName = (name, version) => `${name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`

// actual: {sha256, size, version, name, inventory}; pure comparison of recorded evidence to the inspected artifact.
export function checkEvidence(evidence, actual, { requireClean = false } = {}) {
  if (!evidence || typeof evidence !== 'object') return ['release evidence is missing or not an object']
  const errors = []
  if (evidence.schema !== EVIDENCE_SCHEMA) errors.push(`unsupported evidence schema ${JSON.stringify(evidence.schema)}`)
  if (evidence.name !== actual.name) errors.push(`evidence name ${JSON.stringify(evidence.name)} does not match tarball ${actual.name}`)
  if (!parseVersion(evidence.version)) errors.push(`evidence version ${JSON.stringify(evidence.version)} is invalid`)
  if (evidence.version !== actual.version) errors.push(`version mismatch: evidence ${evidence.version}, tarball ${actual.version}`)
  if (!HEX64.test(evidence.sha256 ?? '')) errors.push('evidence sha256 is malformed')
  else if (evidence.sha256 !== actual.sha256) errors.push(`sha256 mismatch: evidence ${evidence.sha256}, tarball ${actual.sha256}`)
  if (evidence.size !== actual.size) errors.push(`size mismatch: evidence ${evidence.size}, tarball ${actual.size}`)
  if (!HEX40.test(evidence.sourceSha ?? '')) errors.push('evidence sourceSha is malformed')
  if (requireClean && evidence.dirty !== false) errors.push('evidence was produced from a dirty source tree')
  if (!Array.isArray(evidence.inventory)) errors.push('evidence inventory missing')
  else {
    if (evidence.inventoryDigest !== inventoryDigest(evidence.inventory)) errors.push('evidence inventory digest does not match its own inventory')
    if (evidence.inventoryDigest !== inventoryDigest(actual.inventory)) errors.push('inventory mismatch: tarball contents differ from recorded evidence')
  }
  return errors
}

export function checkPackageReport(report, { sha256, version, sourceSha }) {
  if (!report || typeof report !== 'object') return ['package consumer report missing']
  const errors = []
  if (report.sha256 !== sha256) errors.push(`package report sha256 ${report.sha256} does not match artifact`)
  if (report.version !== version) errors.push(`package report version ${report.version} does not match artifact`)
  if (report.sourceSha !== sourceSha) errors.push('package report was produced from a different source commit')
  if (typeof report.consumer !== 'string' || report.consumer === '') errors.push('package report has no consumer location')
  return errors
}

// README evidence locations. A location is a non-whitespace string; arrays and plain objects that hold
// locations must be nonempty at every depth. Designated fields of the P-04 producer shape
// `{ consumer, output, screenshots }` are typed wherever they appear: `consumer` is one location and
// `screenshots` a nonempty flat array of locations. Only the top-level `output` of `evidence` is execution
// evidence (ESM/CJS results): it must be a nonempty object or array, its contents are not inspected, and it
// never counts as a location. `evidence` and `evidenceLocations` are both checked when present; any
// malformed node in either rejects, and together they must name at least one location.
const isLocation = value => typeof value === 'string' && value.trim() !== ''
const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value))
const nonemptyContainer = value => (Array.isArray(value) && value.length > 0) || (isPlainObject(value) && Object.keys(value).length > 0)
const DESIGNATED = {
  consumer: [isLocation, 'must be a nonempty string'],
  screenshots: [value => Array.isArray(value) && value.length > 0 && value.every(isLocation), 'must be a nonempty array of nonempty strings'],
}
const childPath = (path, key) => /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`

// Returns the number of locations under `value` and appends every malformed node to `problems`.
function scanLocations(value, path, problems, executionOutput = false) {
  if (typeof value === 'string') {
    if (isLocation(value)) return 1
    problems.push(`${path} is an empty string`)
    return 0
  }
  if (Array.isArray(value)) {
    if (value.length === 0) problems.push(`${path} is an empty array`)
    return value.reduce((sum, item, index) => sum + scanLocations(item, `${path}[${index}]`, problems), 0)
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value)
    if (entries.length === 0) problems.push(`${path} is an empty object`)
    let count = 0
    for (const [key, item] of entries) {
      const at = childPath(path, key)
      if (executionOutput && key === 'output') {
        if (!nonemptyContainer(item)) problems.push(`${at} must be a nonempty object or array of execution results`)
        continue
      }
      if (Object.hasOwn(DESIGNATED, key) && !DESIGNATED[key][0](item)) {
        problems.push(`${at} ${DESIGNATED[key][1]}`)
        continue
      }
      count += scanLocations(item, at, problems)
    }
    return count
  }
  problems.push(`${path} is ${value === null ? 'null' : typeof value}, not a location`)
  return 0
}

function evidenceErrors(report) {
  const present = ['evidence', 'evidenceLocations'].filter(field => report[field] !== undefined)
  if (present.length === 0) return ['README report names no evidence locations (neither evidence nor evidenceLocations is present)']
  const problems = []
  const count = present.reduce((sum, field) => sum + scanLocations(report[field], field, problems, field === 'evidence'), 0)
  if (problems.length > 0) return [`README report has malformed evidence locations: ${problems.join('; ')}`]
  if (count === 0) return ['README report names no valid evidence locations (output is execution evidence, not a location)']
  return []
}

export function checkReadmeReport(report, { sha256, version }) {
  if (!report || typeof report !== 'object') return ['README report missing']
  const errors = []
  if (report.passed !== true) errors.push('README report did not pass')
  if (report.sha256 !== sha256) errors.push(`README report sha256 ${report.sha256} does not match artifact`)
  if (report.version !== version) errors.push(`README report version ${report.version} does not match artifact`)
  errors.push(...evidenceErrors(report))
  return errors
}

export function checkVerifyReport(report, { sha256, version, evidenceSha256, sourceSha }) {
  if (!report || typeof report !== 'object') return ['verification report missing']
  const errors = []
  if (report.passed !== true) errors.push('verification report did not pass')
  if (report.sha256 !== sha256) errors.push('verification report is for a different artifact hash')
  if (report.version !== version) errors.push('verification report is for a different version')
  if (report.evidenceSha256 !== evidenceSha256) errors.push('verification report does not match the release evidence file')
  if (report.sourceSha !== sourceSha) errors.push('verification report source commit differs from evidence')
  for (const stage of ['inventory', 'package', 'browser', 'readme']) if (report.stages?.[stage] !== 'passed') errors.push(`verification stage ${stage} did not pass`)
  return errors
}

export function checkRegistry(registry) {
  if (typeof registry !== 'string' || registry === '') return ['registry must be given explicitly']
  let url
  try { url = new URL(registry) } catch { return [`registry is not a URL: ${registry}`] }
  const errors = []
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) errors.push('registry must use https (http only for loopback)')
  if (url.username || url.password) errors.push('registry URL must not contain credentials')
  if (url.search || url.hash) errors.push('registry URL must not contain query or fragment')
  return errors
}

export function checkTag(tag, version) {
  if (typeof tag !== 'string' || tag === '') return ['dist-tag must be given explicitly']
  const errors = []
  if (!DIST_TAG.test(tag)) errors.push(`invalid dist-tag ${JSON.stringify(tag)}`)
  else if (parseVersion(tag)) errors.push('dist-tag must not look like a version')
  const parsed = parseVersion(version)
  if (!parsed) errors.push(`cannot choose a dist-tag for invalid version ${JSON.stringify(version)}`)
  if (parsed?.prerelease && tag === 'latest') errors.push(`prerelease ${version} must not be published under latest`)
  return errors
}

export const publishConfirmation = evidence => `publish ${evidence.name}@${evidence.version} ${String(evidence.sha256).slice(0, 12)}`

export function checkPublishRequest({ evidence, tag, registry, confirm }) {
  const errors = [...checkRegistry(registry), ...checkTag(tag, evidence?.version)]
  if (confirm !== publishConfirmation(evidence)) errors.push(`operator confirmation must equal ${JSON.stringify(publishConfirmation(evidence))}`)
  return errors
}

export const buildPackArgs = destination => ['pack', '--json', '--ignore-scripts', '--pack-destination', destination]
export const buildPublishArgs = ({ tarball, tag, registry, dryRun = false }) => ['publish', tarball, '--tag', tag, '--registry', registry, '--ignore-scripts', ...(dryRun ? ['--dry-run'] : [])]

export const isRecursiveInvocation = env => Boolean(env?.C4_RELEASE_ACTIVE)

const CREDENTIAL_VARS = /^(NODE_AUTH_TOKEN|NPM_TOKEN|NPM_CONFIG_.*AUTH.*|npm_config_.*_auth.*)$/i
export function childEnv(env, { credentials = false } = {}) {
  const result = { ...env, C4_RELEASE_ACTIVE: '1' }
  if (!credentials) for (const key of Object.keys(result)) if (CREDENTIAL_VARS.test(key) || /^npm_config_\/\//.test(key)) delete result[key]
  return result
}

// Cleanup is limited to a marked directory strictly inside the artifacts root, which is itself
// a strict descendant of the repository and never the repository, its ancestors or its sources.
const inside = (parent, child) => { const rel = relative(parent, child); return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel) }

// Lexical rules for the artifacts root; physical (symlink) containment is checked by process.mjs.
export function checkArtifactsRoot({ artifactsRoot, repoRoot }) {
  const errors = []
  for (const [label, value] of [['artifacts root', artifactsRoot], ['repository root', repoRoot]]) {
    if (typeof value !== 'string' || !isAbsolute(value)) errors.push(`${label} must be an absolute path`)
  }
  if (errors.length) return errors
  const root = resolve(artifactsRoot)
  const repo = resolve(repoRoot)
  if (!inside(repo, root)) errors.push('artifacts root must be a strict descendant of the repository')
  for (const forbidden of ['src', 'tests', 'node_modules', '.git', 'work-scripts', 'agent-work', 'docs', 'public']) {
    if (root === resolve(repo, forbidden) || root.startsWith(resolve(repo, forbidden) + sep)) errors.push(`artifacts root overlaps ${forbidden}`)
  }
  return errors
}

export function checkCleanTarget({ target, artifactsRoot, repoRoot, marked }) {
  const errors = checkArtifactsRoot({ artifactsRoot, repoRoot })
  if (typeof target !== 'string' || !isAbsolute(target)) errors.push('target must be an absolute path')
  if (errors.length) return errors
  const root = resolve(artifactsRoot)
  const path = resolve(target)
  if (!inside(root, path)) errors.push('cleanup target is outside the artifacts root')
  if (!marked) errors.push('cleanup target lacks the release artifact marker')
  return errors
}
