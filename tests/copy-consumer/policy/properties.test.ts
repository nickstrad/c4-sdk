import { expect, it } from 'vitest'
import fc from 'fast-check'
import { planCopy } from '../../../work-scripts/node/copy-project/policy'
import type { Manifest, Snapshot } from '../../../work-scripts/node/copy-project/types'
const inventory = fc.uniqueArray(fc.record({path: fc.nat(10000).map(n => `src/file-${n}`),sha256: fc.uint8Array({minLength:32,maxLength:32}).map(b => Buffer.from(b).toString('hex')),executable:fc.boolean()}),{selector:f => f.path,maxLength:30})
it('repeat copy is idempotent, input immutable and unmanaged files irrelevant', () => {
  fc.assert(fc.property(inventory, files => {
    const m: Manifest = {version:1,sourceCommit:'a'.repeat(40),files}; const before = JSON.stringify(m)
    const current: Snapshot = Object.fromEntries(files.map(f => [f.path,f])); current['consumer/own'] = {sha256:'b'.repeat(64),executable:false}
    expect(planCopy(m,m,current).operations).toEqual([]); expect(JSON.stringify(m)).toBe(before)
  }),{numRuns:200})
})
it('all deletes come from old inventory and simulated apply converges', () => {
  fc.assert(fc.property(inventory,inventory,(oldFiles,files) => {
    const old: Manifest = {version:1,sourceCommit:'a'.repeat(40),files:oldFiles}; const next: Manifest = {...old,files}
    const current: Snapshot = Object.fromEntries(oldFiles.map(f => [f.path,f])); const plan = planCopy(old,next,current)
    for (const op of plan.operations) {
      if (op.kind === 'delete') { expect(oldFiles.some(f=>f.path===op.path)).toBe(true); delete current[op.path] }
      else current[op.path] = files.find(f=>f.path===op.path)
    }
    expect(planCopy(next,next,current).operations).toEqual([])
  }),{numRuns:200})
})
