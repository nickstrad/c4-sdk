import type { CopyPlan, FileRecord, Manifest, Snapshot } from './types.ts'

const excluded = new Set(['.git', 'node_modules', 'dist', 'dist-demo', 'dist-ssr', 'coverage', 'logs', '.idea', '.DS_Store', 'test-results', 'playwright-report', '.vite', '.cache', '.agents', '.codex', '.aws'])
export function validatePath(path: string): void {
  const parts = path.split('/')
  if (!path || parts.some(p => !p || p === '.' || p === '..' || excluded.has(p)) || (path.includes('\\') || path.includes(':') || [...path].some(c => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127)) || parts.some(p => p.startsWith('.env') || p.startsWith('test-results') || p.startsWith('.c4-copy-') || p.endsWith('.local') || p.endsWith('.log') || p.endsWith('.tsbuildinfo')) || path === '.c4-sdk-source.json' || path === 'STATE.md' || path === 'build-kickoff.md' || path.startsWith('public/consumer/') || path === 'public/consumer') {
    throw new Error(`Unsafe or excluded inventory path: ${path}`)
  }
}
export function validateManifest(value: Manifest): void {
  if (!value || value.version !== 1 || typeof value.sourceCommit !== 'string' || !/^[0-9a-f]{40}$/.test(value.sourceCommit) || !Array.isArray(value.files)) throw new Error('Invalid manifest version or source commit')
  const paths = new Set<string>()
  for (const f of value.files) {
    if (!f || typeof f.path !== 'string') throw new Error('Invalid file record')
    validatePath(f.path)
    if (typeof f.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(f.sha256) || typeof f.executable !== 'boolean' || paths.has(f.path)) throw new Error(`Invalid or duplicate record: ${f.path}`)
    paths.add(f.path)
  }
  for (const p of paths) for (let i = p.indexOf('/'); i !== -1; i = p.indexOf('/', i + 1)) if (paths.has(p.slice(0, i))) throw new Error(`File/directory inventory conflict: ${p}`)
}
export function equalFile(a: Snapshot[string], b: Snapshot[string]): boolean {
  return a?.sha256 === b?.sha256 && a?.executable === b?.executable
}
/** Canonical serialization means inventory ordering alone never changes provenance. */
export function serializeManifest(manifest: Manifest): string {
  validateManifest(manifest)
  return JSON.stringify({ version: 1, sourceCommit: manifest.sourceCommit, files: [...manifest.files].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0).map(({path, sha256, executable}) => ({path, sha256, executable})) }, null, 2) + '\n'
}
export function planCopy(previous: Manifest | null, next: Manifest, current: Snapshot): CopyPlan {
  if (previous) validateManifest(previous)
  validateManifest(next)
  const old = new Map(previous?.files.map(f => [f.path, f]) ?? [])
  const incoming = new Map(next.files.map(f => [f.path, f]))
  const operations: CopyPlan['operations'] = []
  for (const f of old.values()) if (!equalFile(f, Object.hasOwn(current, f.path) ? current[f.path] : undefined)) throw new Error(`Local edit or missing managed file: ${f.path}`)
  for (const f of incoming.values()) {
    if (!old.has(f.path)) {
      if (Object.hasOwn(current, f.path) && current[f.path]) throw new Error(`Unmanaged target conflict: ${f.path}`)
      operations.push({ kind: 'add', path: f.path })
    } else if (!equalFile(old.get(f.path), f)) operations.push({kind: 'replace', path: f.path})
  }
  for (const f of old.values()) if (!incoming.has(f.path)) operations.push({kind: 'delete', path: f.path})
  // Snapshot caller data: later mutation cannot silently alter a reviewed plan.
  return { previous: previous ? JSON.parse(serializeManifest(previous)) : null, next: JSON.parse(serializeManifest(next)), operations: operations.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0) }
}
export type { FileRecord }
