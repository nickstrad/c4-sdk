import { createHash, randomUUID } from 'node:crypto'
import { lstatSync, readFileSync, writeFileSync, chmodSync, renameSync, unlinkSync, mkdirSync } from 'node:fs'
import { resolve, dirname, basename, parse, join, relative } from 'node:path'
import { equalFile, planCopy, serializeManifest, validateManifest, validatePath } from './policy.ts'
import type { CopyPlan, Manifest, Snapshot } from './types.ts'

export const PROVENANCE = '.c4-sdk-source.json'
export const hashBytes = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex')
function stat(path: string) {
  try { return lstatSync(path) } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return undefined; throw e }
}
/** Reject all symlinks, including ancestors of the supplied root; never follow an escape. */
function safePath(root: string, relative: string): string {
  const absolute = resolve(root, relative)
  let cursor = parse(absolute).root
  for (const part of absolute.slice(cursor.length).split('/')) {
    cursor = join(cursor, part)
    const s = stat(cursor)
    if (s?.isSymbolicLink()) throw new Error(`Symlink rejected: ${cursor}`)
    if (cursor !== absolute && s && !s.isDirectory()) throw new Error(`Non-directory ancestor: ${cursor}`)
  }
  return absolute
}
function read(root: string, path: string) {
  const absolute = safePath(root, path)
  const s = stat(absolute)
  if (!s) return undefined
  if (!s.isFile() || s.nlink !== 1) throw new Error(`Non-regular or hard-linked file: ${path}`)
  const bytes = readFileSync(absolute)
  return { bytes, mode: s.mode & 0o777, sha256: hashBytes(bytes), executable: Boolean(s.mode & 0o111) }
}
export function snapshot(root: string, paths: string[]): Snapshot {
  const result: Snapshot = Object.create(null)
  for (const path of paths) { validatePath(path); const file = read(root, path); result[path] = file ? {sha256: file.sha256, executable: file.executable} : undefined }
  return result
}
/** One authority: C4-09 supplies pages/c4-sdk-source.json OUTSIDE the copied subtree.
 * Omission selects the internal marker for scratch fixtures; never use both locations. */
function provenanceLocation(target: string, external?: string): {root: string; path: string} {
  if (!external) return {root: target, path: PROVENANCE}
  const absolute = resolve(external)
  const rel = relative(resolve(target), absolute)
  if (basename(absolute) !== 'c4-sdk-source.json' || (!rel.startsWith('../') && rel !== '..')) throw new Error('External provenance must be c4-sdk-source.json outside copied subtree')
  if (read(target, PROVENANCE)) throw new Error('Competing internal provenance marker exists')
  return {root: dirname(absolute), path: basename(absolute)}
}
export function readManifest(root: string, externalProvenance?: string): Manifest | null {
  const location = provenanceLocation(root, externalProvenance)
  const file = read(location.root, location.path)
  if (!file) return null
  const manifest = JSON.parse(file.bytes.toString()) as Manifest
  validateManifest(manifest)
  return manifest
}
/** Inventory must come from a reviewed tracked snapshot; this API never discovers untracked files. */
export function createManifest(source: string, sourceCommit: string, inventory: string[]): Manifest {
  const files = inventory.map(path => { validatePath(path); const f = read(source, path); if (!f) throw new Error(`Missing source: ${path}`); return {path, sha256: f.sha256, executable: f.executable} })
  const manifest: Manifest = {version: 1, sourceCommit, files}
  validateManifest(manifest)
  return JSON.parse(serializeManifest(manifest))
}
export function prepareCopy(source: string, target: string, next: Manifest, externalProvenance?: string): CopyPlan {
  validateManifest(next)
  const sourceToTarget = relative(resolve(source), resolve(target))
  const targetToSource = relative(resolve(target), resolve(source))
  if (!sourceToTarget.startsWith('../') || !targetToSource.startsWith('../')) throw new Error('Source and target trees must be disjoint')
  if (externalProvenance && !relative(resolve(source), resolve(externalProvenance)).startsWith('../')) throw new Error('Provenance must be outside source tree')
  for (const f of next.files) if (!equalFile(read(source, f.path), f)) throw new Error(`Source mismatch: ${f.path}`)
  const previous = readManifest(target, externalProvenance)
  return planCopy(previous, next, snapshot(target, [...new Set([...next.files, ...(previous?.files ?? [])].map(f => f.path))]))
}
function publish(root: string, path: string, bytes: Uint8Array, mode: number) {
  const absolute = safePath(root, path)
  mkdirSync(dirname(absolute), {recursive: true})
  safePath(root, path)
  const temp = join(dirname(absolute), `.c4-copy-${randomUUID()}`)
  try { writeFileSync(temp, bytes, {flag: 'wx', mode}); chmodSync(temp, mode); safePath(root, path); renameSync(temp, absolute) }
  finally { if (stat(temp)) unlinkSync(temp) }
}
export class CopyFailure extends Error {
  readonly cause: unknown
  readonly rollbackErrors: unknown[]
  constructor(cause: unknown, rollbackErrors: unknown[]) {
    super(rollbackErrors.length ? 'Copy failed; rollback incomplete. Preserve old provenance and reconcile managed files manually before retry.' : 'Copy failed; file bytes and modes restored. Empty created directories may remain.')
    this.cause = cause
    this.rollbackErrors = rollbackErrors
  }
}
/**
 * Trusted, exclusively owned scratch trees only: portable Node APIs cannot eliminate TOCTOU
 * races against another writer, or make a multi-file transaction crash-atomic. Ordinary
 * exceptions trigger best-effort rollback; power loss/process termination can leave a partial
 * copy with OLD provenance, which will be rejected as local edits on retry. Reconcile against
 * the old manifest explicitly; never use an implicit force or bless partial state.
 * beforeOperation is a fault-injection seam (not a concurrency/locking mechanism).
 */
export function applyCopy(source: string, target: string, plan: CopyPlan, beforeOperation?: (index: number) => void, externalProvenance?: string): void {
  const fresh = prepareCopy(source, target, plan.next, externalProvenance)
  if (JSON.stringify(fresh) !== JSON.stringify(plan)) throw new Error('Reviewed plan no longer matches filesystem')
  const location = provenanceLocation(target, externalProvenance)
  const originalProvenance = read(location.root, location.path)
  const backups = new Map<string, ReturnType<typeof read>>()
  const sourceBytes = new Map(plan.next.files.map(f => [f.path, read(source, f.path)!]))
  let provenanceAttempted = false
  try {
    for (const [index, op] of plan.operations.entries()) {
      beforeOperation?.(index)
      const old = plan.previous?.files.find(f => f.path === op.path)
      const current = read(target, op.path)
      if (!equalFile(current, old)) throw new Error(`Target changed before mutation: ${op.path}`)
      backups.set(op.path, current)
      if (op.kind === 'delete') unlinkSync(safePath(target, op.path))
      else { const f = sourceBytes.get(op.path)!; publish(target, op.path, f.bytes, f.executable ? 0o755 : 0o644) }
    }
    for (const f of plan.next.files) if (!equalFile(read(target, f.path), f)) throw new Error(`Verification failed: ${f.path}`)
    for (const op of plan.operations) if (op.kind === 'delete' && read(target, op.path)) throw new Error(`Deletion verification failed: ${op.path}`)
    provenanceLocation(target, externalProvenance)
    const provenance = read(location.root, location.path)
    if (provenance?.sha256 !== originalProvenance?.sha256) throw new Error('Provenance changed during copy')
    const bytes = Buffer.from(serializeManifest(plan.next))
    if (!originalProvenance?.bytes.equals(bytes)) { provenanceAttempted = true; publish(location.root, location.path, bytes, 0o644) }
  } catch (cause) {
    const errors: unknown[] = []
    if (provenanceAttempted) {
      try {
        if (originalProvenance) publish(location.root, location.path, originalProvenance.bytes, originalProvenance.mode)
        else if (stat(safePath(location.root, location.path))) unlinkSync(safePath(location.root, location.path))
      } catch (error) { errors.push(error) }
    }
    for (const [path, old] of [...backups].reverse()) {
      try { if (old) publish(target, path, old.bytes, old.mode); else if (stat(safePath(target, path))) unlinkSync(safePath(target, path)) } catch (error) { errors.push(error) }
    }
    throw new CopyFailure(cause, errors)
  }
}
