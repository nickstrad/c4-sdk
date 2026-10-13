import { describe, expect, it } from 'vitest'
import fixture from '../../fixtures/context.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene, diagramKindLabel } from '../../src/lib/c4/domain/scene'
import { fixedLayout, lookupMeasuredSize, validateLayout } from '../../src/lib/c4/domain/layout'
import { MAX_GROUP_DEPTH, validateGroups } from '../../src/lib/c4/domain/groups'
import type { Group } from '../../src/lib/c4/domain/model'
import type { Scene } from '../../src/lib/c4/domain/geometry'
import type { LayoutPort, LayoutRequest } from '../../src/lib/c4/ports/layout'
const groups: readonly Group[] = [{ id: 'outer', label: 'Outer', status: 'existing', memberIds: ['continuity'] }, { id: 'inner', label: 'Inner', status: 'planned', parentGroupId: 'outer', memberIds: ['developer'] }]
function input(groupData: readonly Group[] = []) { return { ...structuredClone(fixture), diagrams: [{ ...structuredClone(fixture.diagrams[0]), groups: groupData }] } }
function scene(groupData: readonly Group[] = []) {
  const decoded = decodeArchitecture(input(groupData)); if (!decoded.ok) throw new Error(JSON.stringify(decoded.diagnostics))
  const result = buildScene(decoded.value.index, 'context'); if (!result.ok) throw new Error('projection')
  return result.value
}
function rejected(groupData: readonly Group[], path: string, code: string) {
  const decoded = decodeArchitecture(input(groupData))
  expect(decoded.ok).toBe(false)
  expect(decoded.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({ path: '$.diagrams[0].groups' + path, code })]))
}
describe('group model and forest contract', () => {
  it('normalizes omitted groups, retains immutable declared identity and direct membership without mutating caller data', () => {
    const omitted = decodeArchitecture(fixture); if (!omitted.ok) throw new Error('fixture')
    expect(omitted.value.bundle.diagrams[0].groups).toEqual([])
    const source = input(groups); const before = structuredClone(source)
    const decoded = decodeArchitecture(source); if (!decoded.ok) throw new Error('fixture')
    const projected = buildScene(decoded.value.index, 'context'); if (!projected.ok) throw new Error('fixture')
    expect(source).toEqual(before); expect(Object.isFrozen(source)).toBe(false)
    expect(projected.value.groups).toEqual(groups)
    expect(projected.value.groups[0]).toBe(decoded.value.bundle.diagrams[0].groups?.[0])
    expect(Object.isFrozen(projected.value.groups[0].memberIds)).toBe(true)
    expect(Object.isFrozen(projected.value.groups)).toBe(true)
    expect(Object.isFrozen(projected.value.nodes)).toBe(true)
    expect(projected.value.nodes.map(node => node.parentGroupId)).toEqual(['inner', 'outer', undefined])
  })
  it('reports exact duplicate, invisible, missing-parent and cycle paths', () => {
    rejected([...groups, groups[0]], '[2].id', 'duplicate-group-id')
    rejected([{ ...groups[0], memberIds: ['continuity', 'continuity'] }], '[0].memberIds[1]', 'duplicate-group-member')
    rejected([groups[0], { ...groups[1], memberIds: ['continuity'] }], '[1].memberIds[0]', 'duplicate-group-member')
    rejected([{ ...groups[0], memberIds: ['missing'] }], '[0].memberIds[0]', 'group-member-not-visible')
    rejected([{ ...groups[0], parentGroupId: 'absent' }], '[0].parentGroupId', 'missing-group-parent')
    rejected([{ ...groups[0], parentGroupId: 'inner' }, groups[1]], '[0].parentGroupId', 'group-cycle')
  })
  it('enforces the exact nesting bound independently of JSON object depth and permits separate ID namespaces', () => {
    const chain = (count: number): Group[] => Array.from({ length: count }, (_, i) => ({ id: `g${i}`, label: 'Group', memberIds: [], status: 'existing', ...(i ? { parentGroupId: `g${i - 1}` } : {}) }))
    expect(validateGroups(chain(MAX_GROUP_DEPTH), []).length).toBe(0)
    expect(validateGroups(chain(MAX_GROUP_DEPTH + 1), []).some(item => item.code === 'group-depth')).toBe(true)
    expect(decodeArchitecture(input([{ id: 'continuity', label: 'Separate visual namespace', memberIds: ['continuity'], status: 'existing' }])).ok).toBe(true)
    rejected([{ ...groups[0], parentGroupId: 'outer' }], '[0].parentGroupId', 'group-cycle')
  })
  it('validates strict group shape and rejects dishonest grouped fixed layout', () => {
    const malformed = input(groups); malformed.diagrams[0].groups = [{ ...groups[0], ...{ html: '<div>' } }]
    const decoded = decodeArchitecture(malformed); expect(decoded.ok).toBe(false); expect(decoded.diagnostics[0].code).toBe('schema')
    expect(fixedLayout(scene(groups))).toMatchObject({ ok: false, diagnostics: [{ code: 'unsupported-groups', path: '$.groups' }] })
  })
})
describe('projection, geometry and measurement seams', () => {
  it('carries dataset/revision cache identity and generic display names before layout', () => {
    const first = scene(); expect(first.architectureId).toBe(fixture.id); expect(first.revision).toBe(fixture.revision)
    const decoded = decodeArchitecture({ ...fixture, id: 'another', revision: 'new' }); if (!decoded.ok) throw new Error('fixture')
    const second = buildScene(decoded.value.index, 'context'); if (!second.ok) throw new Error('fixture')
    expect(second.value.diagram.id).toBe(first.diagram.id)
    expect([second.value.architectureId, second.value.revision]).not.toEqual([first.architectureId, first.revision])
    expect(first.kindLabel).toBe('System context')
    expect(diagramKindLabel('container')).toBe('Containers'); expect(diagramKindLabel('component')).toBe('Components')
    expect(diagramKindLabel('constructor')).toBe('Diagram')
  })
  it('keeps existing Scene exports and unmeasured ports compatible while adding optional measured sizes', async () => {
    const source = scene(); const result = fixedLayout(source); if (!result.ok) throw new Error('fixture')
    const legacy: import('../../src/lib/c4/domain/scene').Scene = result.value
    const geometry: Scene = legacy; expect(geometry).toBe(result.value)
    const port: LayoutPort = { layout: async request => ({ generation: request.generation, result: fixedLayout(request.scene) }) }
    const request: LayoutRequest = { scene: source, signal: new AbortController().signal, generation: 1 }
    expect((await port.layout(request)).result.ok).toBe(true)
    const measured: LayoutRequest = { ...request, measurements: { revision: 'm2', nodeSizes: { developer: { width: 240, height: 180 } }, edgeLabelSizes: { git: { width: 280, height: 72 } } } }
    expect(measured.measurements?.revision).toBe('m2')
  })
  it('rejects geometry metadata replacement and nonfinite routed/label bounds while allowing valid absolute sections', () => {
    const source = scene(); const result = fixedLayout(source); if (!result.ok) throw new Error('fixture')
    const original = result.value; const edge = original.edges[0]
    const routed = { ...original, edges: original.edges.map((item, i) => i ? item : { ...edge, sections: [{ startPoint: { x: edge.x1, y: edge.y1 }, endPoint: { x: edge.x2, y: edge.y2 }, bendPoints: [{ x: 300, y: 200 }] }], labelBounds: { x: 40, y: 40, width: 270, height: 68 } }) }
    expect(validateLayout(source, { ...result, value: routed }).ok).toBe(true)
    expect(validateLayout(source, { ...result, value: { ...original, diagram: { ...original.diagram } } }).ok).toBe(false)
    expect(validateLayout(source, { ...result, value: { ...original, nodes: original.nodes.map((node, i) => i ? node : { ...node, element: { ...node.element, name: 'Changed content' } }) } }).ok).toBe(false)
    expect(validateLayout(source, { ...result, value: { ...routed, edges: [{ ...routed.edges[0], labelBounds: { x: 0, y: 0, width: Infinity, height: 1 } }, ...routed.edges.slice(1)] } }).ok).toBe(false)
    expect(validateLayout(source, { ...result, value: { ...original, edges: [{ ...edge, sections: [] }, ...original.edges.slice(1)] } }).ok).toBe(false)
    expect(validateLayout(source, { ...result, value: { ...original, edges: [{ ...edge, number: 999 }, ...original.edges.slice(1)] } }).ok).toBe(false)
    expect(validateLayout(source, { ...result, value: { ...original, nodes: original.nodes.map((node, i) => i ? node : { ...node, stroke: 'dashed', tone: 'external', statusText: 'Invented status' }) } }).ok).toBe(false)
  })
})

it('group notation warnings require both boundaries and planned/mixed stroke, and complete keys resolve them', () => {
  const source = input(groups); const result = decodeArchitecture(source); expect(result.ok).toBe(true)
  expect(result.diagnostics.filter(item => item.code === 'legend-coverage').map(item => item.message)).toEqual(expect.arrayContaining(['Key does not explain "boundary" notation.', 'Key does not explain "dashed" notation.']))
  source.diagrams[0].legend.entries.push({ id: 'group-boundary', label: 'Boundary', description: 'Group', swatch: { shape: 'boundary', tone: 'default', stroke: 'dashed' } })
  const complete = decodeArchitecture(source); expect(complete.ok).toBe(true)
  expect(complete.diagnostics.filter(item => item.code === 'legend-coverage')).toEqual([])
})
it('own measured IDs constructor/toString are usable while inherited or invalid dimensions are not', () => {
  expect(lookupMeasuredSize({}, 'constructor')).toBeUndefined(); expect(lookupMeasuredSize({}, 'toString')).toBeUndefined()
  const values = Object.assign(Object.create(null), { constructor: { width: 240, height: 160 }, toString: { width: 200, height: 140 }, invalid: { width: Infinity, height: 1 } })
  expect(lookupMeasuredSize(values, 'constructor')).toEqual({ width: 240, height: 160 })
  expect(lookupMeasuredSize(values, 'toString')).toEqual({ width: 200, height: 140 })
  expect(lookupMeasuredSize(values, 'invalid')).toBeUndefined()
})
