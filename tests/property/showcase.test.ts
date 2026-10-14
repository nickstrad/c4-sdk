import { expect, it } from 'vitest'
import fc from 'fast-check'
import bundle from '../../demos/git-at-any-scale/public/diagrams/continuity.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { formatRoute, parseRoute, validateRoute } from '../../src/lib/c4/domain/navigation'
import { selectDocumentation } from '../../src/lib/c4/domain/documentation'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { readingSelections, scenarioItems } from '../../src/lib/c4/domain/scenario'
const result = decodeArchitecture(bundle)
if (!result.ok) throw Error(JSON.stringify(result.diagnostics))
const a = result.value
const selections = a.bundle.diagrams.flatMap(d => [undefined, ...d.nodes.map(n => n.elementId)].flatMap(elementId => [undefined, ...(d.kind === 'dynamic' ? readingSelections(scenarioItems(d.scenario)).map(s => s.id) : [])].map(stepId => ({ architectureId: a.bundle.id, diagramId: d.id, ...(elementId ? { elementId } : {}), ...(stepId ? { stepId } : {}) }))))
it('generated reading selections retain valid routes, sources and stable scene identity', () => {
 const before = JSON.stringify(a.bundle)
 const scenes = new Map(a.bundle.diagrams.map(d => [d.id, buildScene(a.index, d.id)]))
 fc.assert(fc.property(fc.array(fc.constantFrom(...selections), { minLength: 1, maxLength: 40 }), routes => {
  for (const route of routes) {
   expect(validateRoute(a.index, route)).toEqual([])
   expect(parseRoute(formatRoute(route))).toMatchObject({ ok: true, value: route })
   const docs = selectDocumentation(a.index, route.diagramId, route.elementId)
   expect(docs.documents.every(doc => (route.elementId ? a.index.elements[route.elementId] : a.index.diagrams[route.diagramId]).docIds.includes(doc.id))).toBe(true)
   expect(docs.sources.every(s => !!a.index.sources[s.id])).toBe(true)
   expect(buildScene(a.index, route.diagramId)).toEqual(scenes.get(route.diagramId))
  }
  expect(JSON.stringify(a.bundle)).toBe(before)
 }), { seed: 4082026, numRuns: 100 })
})
it('catalog identity changes preserve dataset isolation without framework state', () => {
 fc.assert(fc.property(fc.stringMatching(/^[a-z][a-z0-9-]{0,15}$/), fc.constantFrom(...selections), (id, route) => {
  const other = decodeArchitecture({ ...bundle, id, revision: `copy-${id}` }); expect(other.ok).toBe(true)
  if (!other.ok) return
  expect(validateRoute(other.value.index, { ...route, architectureId: id })).toEqual([])
  if (id !== a.bundle.id) expect(validateRoute(other.value.index, route).length).toBeGreaterThan(0)
  expect(selectDocumentation(other.value.index, route.diagramId, route.elementId)).toEqual(selectDocumentation(a.index, route.diagramId, route.elementId))
 }), { seed: 4082027, numRuns: 100 })
})
