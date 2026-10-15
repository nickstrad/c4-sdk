// In-memory io for driver tests. It performs no filesystem, process or network effects, so no test can build or publish.
import { createHash } from 'node:crypto'
import { REQUIRED_FILES, inventoryDigest } from '../../work-scripts/node/release/policy.mjs'

export const ROOT = '/repo'
export const manifest = () => ({
  name: 'c4-sdk', version: '0.1.0', engines: { node: process.version.slice(1) }, main: './dist-sdk/index.cjs', module: './dist-sdk/index.mjs', types: './dist-sdk/index.d.mts',
  exports: {
    '.': { import: { types: './dist-sdk/index.d.mts', default: './dist-sdk/index.mjs' }, require: { types: './dist-sdk/index.d.cts', default: './dist-sdk/index.cjs' } },
    './core': { import: { types: './dist-sdk/core.d.mts', default: './dist-sdk/core.mjs' }, require: { types: './dist-sdk/core.d.cts', default: './dist-sdk/core.cjs' } },
    './styles.css': './dist-sdk/styles.css',
    './layout-worker.js': './dist-sdk/layout-worker.js',
  },
  peerDependencies: { react: '19.3.0', 'react-dom': '19.3.0' },
})

export const goodFiles = (pkg = manifest()) => REQUIRED_FILES.map(path => ({
  path, type: 'file', mode: 0o644, size: 20,
  sha256: createHash('sha256').update(path).digest('hex'),
  ...(path === 'package.json' ? { text: JSON.stringify(pkg) } : {}),
  ...(/\.d\.[cm]ts$/.test(path) ? { text: "import type { ReactNode } from 'react'\nexport type X = ReactNode\n" } : {}),
}))

export function fakeIo({ version = '0.1.0', dirty = false, inspections = {}, hashes = {}, runs = {}, files = {} } = {}) {
  const fs = new Map(Object.entries(files))
  const calls = []
  const logs = []
  const state = { dirty, sha: 'a'.repeat(40) }
  const io = {
    calls, logs, fs, state,
    log: text => logs.push(text),
    run(command, args, options = {}) {
      calls.push({ command, args, env: options.env })
      const key = `${command} ${args[0]}`
      const handler = runs[key] ?? runs[command]
      if (handler) return handler({ command, args, options, io })
      if (key === 'git rev-parse') return { status: 0, stdout: state.sha, stderr: '' }
      if (key === 'npm --version') return { status: 0, stdout: '10.9.8\n', stderr: '' }
      return { status: 0, stdout: '', stderr: '' }
    },
    exists: path => fs.has(path) || [...fs.keys()].some(key => key.startsWith(`${path}/`)),
    readText: path => String(fs.get(path)),
    readJson: path => JSON.parse(String(fs.get(path))),
    readBytes: path => Buffer.from(fs.get(path)),
    isRegularFile: path => fs.has(path) && !String(path).endsWith('/'),
    mkdirp() {},
    writeAtomic: (path, text) => { fs.set(path, text) },
    removeFile: path => { fs.delete(path) },
    removeTree(path) { for (const key of [...fs.keys()]) if (key === path || key.startsWith(`${path}/`)) fs.delete(key) },
    hashFile: path => hashes[path] ?? { size: 99, sha256: createHash('sha256').update(String(fs.get(path))).digest('hex'), sha1: 's1', integrity: 'sha512-x' },
    gitState: () => ({ sha: state.sha, dirty: state.dirty, status: state.dirty ? ' M src/x.ts\n' : '' }),
    inspectTarball(path) { return inspections[path] ?? { ok: true, errors: [], files: goodFiles({ ...manifest(), version }) } },
  }
  return io
}

export const evidenceFor = (tarballName, files, overrides = {}) => {
  const inventory = files.map(({ path, size, mode, sha256 }) => ({ path, size, mode, sha256 })).sort((a, b) => a.path.localeCompare(b.path))
  return { schema: 1, name: 'c4-sdk', version: '0.1.0', sourceSha: 'a'.repeat(40), dirty: false, tarball: tarballName, size: 99, inventory, inventoryDigest: inventoryDigest(inventory), ...overrides }
}
