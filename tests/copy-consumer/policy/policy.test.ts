import { describe, expect, it } from 'vitest'
import { planCopy, serializeManifest, validateManifest, validatePath } from '../../../work-scripts/node/copy-project/policy'
import type { Manifest } from '../../../work-scripts/node/copy-project/types'
const record = (path = 'src/a.ts', sha256 = 'a'.repeat(64), executable = false) => ({path, sha256, executable})
const manifest = (files = [record()]): Manifest => ({version: 1, sourceCommit: 'b'.repeat(40), files})
describe('copy policy', () => {
  it('plans upstream add/change/delete and preserves unmanaged paths', () => {
    const old = manifest([record('a'), record('b')]); const next = manifest([record('b', 'c'.repeat(64)), record('c')])
    expect(planCopy(old, next, {a: record('a'), b: record('b'), custom: record('custom')}).operations).toEqual([{kind:'delete',path:'a'},{kind:'replace',path:'b'},{kind:'add',path:'c'}])
  })
  it('rejects content edits, mode edits and missing managed files even on no-op', () => {
    for (const current of [{}, {'src/a.ts': record('src/a.ts','c'.repeat(64))}, {'src/a.ts': record('src/a.ts',undefined,true)}]) expect(() => planCopy(manifest(),manifest(),current)).toThrow(/Local edit/)
  })
  it('does not claim identical unmanaged files', () => expect(() => planCopy(null,manifest(),{'src/a.ts':record()})).toThrow(/Unmanaged/))
  it('canonicalizes order and snapshots mutable inputs', () => {
    const next = manifest([record('b'), record('a')]); const plan = planCopy(null,next,{})
    expect(serializeManifest(next)).toBe(serializeManifest(manifest([...next.files].reverse())))
    next.files[0].sha256 = 'c'.repeat(64); expect(plan.next.files[1].sha256).toBe('a'.repeat(64))
  })
  it.each(['../x','/x','a//x','a/./x','a\\x','x\0y','C:/x','.git/config','a/node_modules/x','.env.local','dist/a','dist-ssr/a','test-results-final/a','settings.local','run.log','public/consumer/a','STATE.md','.c4-sdk-source.json'])('rejects excluded path %s', p => expect(() => validatePath(p)).toThrow())
  it('rejects malformed/duplicate/prefix inventories and commit/hash', () => {
    for (const m of [manifest([record('a'),record('a')]),manifest([record('a'),record('a/b')]), {...manifest(),sourceCommit:'HEAD'},manifest([record('a','no')]), {...manifest(),version:2}]) expect(() => validateManifest(m as Manifest)).toThrow()
  })
})
