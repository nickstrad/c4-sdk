// Filesystem/process adapter for the release driver. All effects the driver needs go through
// the object returned by createIo(), so tests replace it wholesale and no test can publish.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, realpathSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, sep } from 'node:path'
import { isSafePackagePath } from './policy.mjs'

export const MARKER = '.c4-release-artifacts'

const modeOf = perms => {
  let mode = 0
  const bits = [[0o400, 'r'], [0o200, 'w'], [0o100, 'x'], [0o40, 'r'], [0o20, 'w'], [0o10, 'x'], [0o4, 'r'], [0o2, 'w'], [0o1, 'x']]
  bits.forEach(([bit, letter], index) => { if (perms[index + 1] === letter) mode |= bit })
  if (/[sS]/.test(perms[3])) mode |= 0o4000
  if (/[sS]/.test(perms[6])) mode |= 0o2000
  if (/[tT]/.test(perms[9])) mode |= 0o1000
  return mode
}

// Physical containment: every existing component from repoRoot (exclusive) to path (inclusive) must be a
// real directory (no symlinks), and the real path must equal the lexical path under the real repo root.
export function physicalContainmentErrors(repoRoot, path) {
  const rel = relative(repoRoot, path)
  if (rel === '' || rel.startsWith('..')) return [`${path} is not inside ${repoRoot}`]
  const errors = []
  let current = repoRoot
  for (const part of rel.split(sep)) {
    current = join(current, part)
    let stat
    try { stat = lstatSync(current) } catch (error) { if (error.code === 'ENOENT') break; errors.push(`cannot inspect ${current}: ${error.code}`); break }
    if (stat.isSymbolicLink()) { errors.push(`${current} is a symbolic link; refusing to follow it`); break }
    if (!stat.isDirectory()) { errors.push(`${current} is not a directory`); break }
  }
  if (errors.length === 0) {
    try {
      if (existsSync(path) && realpathSync(path) !== join(realpathSync(repoRoot), rel)) errors.push(`${path} resolves outside the repository tree`)
    } catch (error) { errors.push(`cannot resolve ${path}: ${error.code}`) }
  }
  return errors
}

export function parseTarListing(text) {
  return text.split('\n').filter(Boolean).map(line => {
    const match = /^([-dlhcbps])([rwxsStT-]{9})\s+\S+\s+(\d+)\s+\S+\s+\S+\s+(.*)$/.exec(line)
    if (!match) return { path: line, type: 'unknown', mode: 0, size: 0 }
    const type = { '-': 'file', d: 'directory', l: 'symlink', h: 'hardlink' }[match[1]] ?? 'special'
    // GNU tar prints hardlinks as "name link to target" and symlinks as "name -> target".
    const name = match[4].replace(/ -> .*$/, '').replace(/ link to .*$/, '')
    return { path: name, type: line.includes(' link to ') ? 'hardlink' : type, mode: modeOf(`-${match[2]}`), size: Number(match[3]) }
  })
}

export function createIo({ cwd = process.cwd(), log = text => process.stdout.write(`${text}\n`) } = {}) {
  const run = (command, args, { env = process.env, capture = false, input } = {}) => {
    const result = spawnSync(command, args, { cwd, env, encoding: 'utf8', input, stdio: capture ? ['ignore', 'pipe', 'pipe'] : ['inherit', 'inherit', 'inherit'], maxBuffer: 256 * 1024 * 1024 })
    if (result.error) return { status: 127, stdout: '', stderr: String(result.error.message) }
    return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
  }
  return {
    cwd,
    log,
    run,
    exists: path => existsSync(path),
    readText: path => readFileSync(path, 'utf8'),
    readJson: path => JSON.parse(readFileSync(path, 'utf8')),
    readBytes: path => readFileSync(path),
    isRegularFile: path => { try { return lstatSync(path).isFile() } catch { return false } },
    mkdirp: path => mkdirSync(path, { recursive: true }),
    writeAtomic(path, text) {
      mkdirSync(dirname(path), { recursive: true })
      const temp = `${path}.${process.pid}.tmp`
      writeFileSync(temp, text)
      renameSync(temp, path)
    },
    physicalContainmentErrors,
    removeFile: path => rmSync(path, { force: true }),
    // Only called after policy.checkCleanTarget approved the exact directory.
    removeTree: path => rmSync(path, { recursive: true, force: true }),
    hashFile(path) {
      const bytes = readFileSync(path)
      return { size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), sha1: createHash('sha1').update(bytes).digest('hex'), integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}` }
    },
    gitState({ excludes = [] } = {}) {
      const head = run('git', ['rev-parse', 'HEAD'], { capture: true })
      const status = run('git', ['status', '--porcelain', '--', '.', ...excludes.map(path => `:(exclude)${path}`)], { capture: true })
      return { sha: head.stdout.trim(), dirty: status.status !== 0 || status.stdout.trim() !== '', status: status.stdout }
    },
    // Lists then extracts the exact tarball into a private temp dir; returns per-file facts and text of metadata.
    inspectTarball(tarball) {
      const listing = run('tar', ['-tvzf', tarball], { capture: true })
      if (listing.status !== 0) return { ok: false, errors: [`cannot list tarball: ${listing.stderr.trim()}`], files: [] }
      const entries = parseTarListing(listing.stdout).filter(entry => entry.type !== 'directory')
      const errors = []
      const files = []
      for (const entry of entries) {
        if (!entry.path.startsWith('package/')) { errors.push(`entry outside package/: ${entry.path}`); continue }
        const path = entry.path.slice('package/'.length)
        if (!isSafePackagePath(path)) { errors.push(`unsafe path in tarball: ${JSON.stringify(entry.path)}`); continue }
        files.push({ path, type: entry.type, mode: entry.mode, size: entry.size })
      }
      if (errors.length || files.some(file => file.type !== 'file')) return { ok: errors.length === 0, errors, files }
      const dir = mkdtempSync(join(tmpdir(), 'c4-release-inspect-'))
      try {
        const extract = run('tar', ['-xzf', tarball, '-C', dir, '--no-same-owner'], { capture: true })
        if (extract.status !== 0) return { ok: false, errors: [`cannot extract tarball: ${extract.stderr.trim()}`], files }
        for (const file of files) {
          const full = join(dir, 'package', file.path)
          const stat = lstatSync(full)
          if (!stat.isFile()) { file.type = 'special'; continue }
          const bytes = readFileSync(full)
          file.size = bytes.length
          file.sha256 = createHash('sha256').update(bytes).digest('hex')
          if (file.path === 'package.json' || /\.d\.[cm]ts$/.test(file.path)) file.text = bytes.toString('utf8')
        }
        if (readdirSync(join(dir, 'package')).length === 0) errors.push('tarball package/ is empty')
        return { ok: errors.length === 0, errors, files }
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
    statSize: path => statSync(path).size,
  }
}
