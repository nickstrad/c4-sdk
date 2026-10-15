import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import bundle from '../../demos/git-at-any-scale/public/diagrams/continuity.json'
import map from '../../demos/git-at-any-scale/content/research/source-map.json'
import catalog from '../../demos/git-at-any-scale/public/catalog.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { selectDocumentation } from '../../src/lib/c4/domain/documentation'
import { precedence } from '../../src/lib/c4/domain/scenario'
const decoded = decodeArchitecture(bundle)
function valid() { if (!decoded.ok) throw Error(JSON.stringify(decoded.diagnostics)); return decoded.value }
describe('source-grounded independent showcase', () => {
 it('loads the catalog architecture with every intended reading view', () => {
  const a = valid(); expect(catalog.entries[0].id).toBe(a.bundle.id)
  expect(a.bundle.diagrams.map(d => d.id).sort()).toEqual(['context','containers','server-components','push','read-current','read-catch-up','gossip','rebuild','compaction','deployment'].sort())
  expect(a.bundle.model.elements.some(e => e.kind === 'code')).toBe(false)
  expect(a.index.diagrams['server-components'].nodes).toHaveLength(4)
 })
 it('maps every modeled identity to source sections, evidence and honest review status', () => {
  const a = valid()
  for (const [kind, items] of [['element', a.bundle.model.elements], ['diagram', a.bundle.diagrams], ['relationship', a.bundle.model.relationships]] as const) {
   for (const item of items) {
    const provenance = map.entries.find(e => e.kind === kind && e.id === item.id)
    expect(provenance).toBeDefined(); expect(provenance!.sourceIds).toEqual(item.sourceIds)
    expect(provenance!.docIds).toEqual(item.docIds); expect(provenance!.evidence).toBeTruthy()
    expect(provenance!.languageReview.status).toBe('draft'); expect(provenance!.languageReview.humanReview).toBe('pending')
    for (const id of item.docIds) {
     const d = a.index.documents[id]; expect(d.plain).toContain('Evidence:'); expect(d.ste.text).toContain('Evidence:')
     expect(d.ste).toMatchObject({ issue: 'ASD-STE100 Issue 9', reviewStatus: 'draft' }); expect(d.termIds.length).toBeGreaterThan(0)
     expect(d.sourceIds.length).toBeGreaterThan(0)
    }
   }
  }
  expect(a.bundle.sources.every(s => s.url.startsWith('https://cursor.com/blog/git-at-any-scale'))).toBe(true)
  expect(map.independentSourceReview).toBe('pending')
 })
 it('offers sources and terms for every actual diagram and element selection', () => {
  const a = valid()
  for (const d of a.bundle.diagrams) for (const id of [undefined, ...d.nodes.map(n => n.elementId)]) {
   const docs = selectDocumentation(a.index, d.id, id)
   expect(docs.documents.length).toBeGreaterThan(0); expect(docs.sources.length).toBeGreaterThan(0); expect(docs.terms.length).toBeGreaterThan(0)
  }
 })
 it('preserves publication partial order and separates successful read alternatives', () => {
  const a = valid(); const push = a.index.diagrams.push; if (push.kind !== 'dynamic') throw Error('push')
  const order = precedence(push.scenario)
  expect(order).toContainEqual(['persist-wal','publish-cas']); expect(order).toContainEqual(['prepare-references','publish-cas'])
  expect(order).not.toContainEqual(['persist-wal','write-local']); expect(order).not.toContainEqual(['write-local','persist-wal'])
  expect(JSON.stringify(a.index.diagrams['read-current'])).toContain('304')
  expect(JSON.stringify(a.index.diagrams['read-current'])).not.toContain('Return the new index (200)')
  expect(JSON.stringify(a.index.diagrams['read-catch-up'])).toContain('200')
  expect(JSON.stringify(a.index.diagrams['read-catch-up'])).not.toContain('Return unchanged status (304)')
 })
 it('reconciles the delivered contract claims in the root README with the shipped surface', () => {
  const text = readFileSync('README.md','utf8')
  // Delivered capabilities the current README states: all seven kinds, bundled ELK in a module worker, safe Markdown.
  expect(text).toContain('all seven diagram kinds')
  expect(text).toMatch(/^## Layout worker$/m); expect(text).toContain('Layout runs in a browser module worker')
  expect(text).toContain('createElkLayoutPort'); expect(text).toContain('c4-sdk/layout-worker.js')
  expect(text).toMatch(/Markdown in documentation supports safe links and literal text; HTML, images and components are rejected/)
  // Every public entry the README documents must exist in the manifest exports.
  const exportsMap = JSON.parse(readFileSync('package.json','utf8')).exports
  for (const entry of ['c4-sdk/core','c4-sdk/styles.css','c4-sdk/layout-worker.js']) expect(exportsMap).toHaveProperty(['.' + entry.slice('c4-sdk'.length)])
  // Retired claims from before layout and Markdown landed must stay absent.
  for (const stale of ['No ELK is implemented here','without graph routing or ELK','rather than interpreting Markdown/HTML','until C4-04 supplies']) expect(text).not.toContain(stale)
 })
})
