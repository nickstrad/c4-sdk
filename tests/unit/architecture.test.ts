import { describe, expect, it } from 'vitest'
import fixture from '../../fixtures/context.json'
import { decodeArchitecture, architectureJsonSchema, isSafeResourceUrl } from '../../src/lib/c4/schema/decode'
import { projectDiagram, selectDocumentation } from '../../src/lib/c4/domain/presentation'
const sample = () => structuredClone(fixture)
function valid(input: unknown = sample()) { const result = decodeArchitecture(input); if (!result.ok) throw new Error(JSON.stringify(result.diagnostics)); return result.value }
function rejected(input: unknown, path: string, code?: string) {
  const result = decodeArchitecture(input)
  expect(result.ok).toBe(false)
  expect(result.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({ path, ...(code ? { code } : {}) })]))
}
describe('strict runtime context contract', () => {
  it('normalizes omitted arrays without changing caller input and exports editor shape', () => {
    const input = sample(); const before = structuredClone(input); const architecture = valid(input)
    expect(input).toEqual(before); expect(architecture.bundle.model.elements[0].tags).toEqual([])
    expect(Object.isFrozen(input)).toBe(false); expect(Object.isFrozen(architecture.bundle.model.elements)).toBe(true)
    expect(architectureJsonSchema).toHaveProperty('properties.schemaVersion')
    expect(architecture.diagnostics).toEqual([])
  })
  it('reports exact reference paths instead of dropping an invalid edge', () => {
    const input = sample(); input.model.relationships[0].targetId = 'unknown'
    rejected(input, '$.model.relationships[0].targetId', 'missing-reference')
  })
  it('rejects duplicate collection IDs, members, edges and invisible endpoints', () => {
    const input = sample(); input.model.elements.push(input.model.elements[0]); rejected(input, '$.model.elements[3].id', 'duplicate-id')
    const members = sample(); members.diagrams[0].nodes.push(members.diagrams[0].nodes[0]); rejected(members, '$.diagrams[0].nodes[3].elementId', 'duplicate-member')
    const edges = sample(); edges.diagrams[0].edges.push(edges.diagrams[0].edges[0]); rejected(edges, '$.diagrams[0].edges[2].relationshipId', 'duplicate-edge')
    const endpoints = sample(); endpoints.diagrams[0].nodes.pop(); rejected(endpoints, '$.diagrams[0].edges[1].relationshipId', 'endpoint-not-visible')
  })
  it('validates context scope and mixed-status notes', () => {
    const input = sample(); input.diagrams[0].scopeId = 'developer'; rejected(input, '$.diagrams[0].scopeId', 'invalid-scope')
    const hidden = sample(); hidden.diagrams[0].nodes.splice(1, 1); rejected(hidden, '$.diagrams[0].scopeId', 'scope-not-visible')
    const mixed = sample(); mixed.model.elements[1].status = 'mixed'; rejected(mixed, '$.model.elements[1].plannedNotes', 'mixed-notes')
    mixed.model.elements[1] = { ...mixed.model.elements[1], ...{ plannedNotes: ['Add capability'] } }; expect(decodeArchitecture(mixed).ok).toBe(true)
  })
  it('rejects unknown versions, later types and deferred features explicitly', () => {
    rejected({ ...sample(), schemaVersion: 2 }, '$.schemaVersion', 'schema')
    const types = sample(); types.diagrams[0].kind = 'container'; rejected(types, '$.diagrams[0].kind', 'schema')
    for (const extra of [{ groups: [] }, { parent: { diagramId: 'context' } }, { related: [] }]) {
      const input = sample(); input.diagrams[0] = { ...input.diagrams[0], ...extra }; rejected(input, '$.diagrams[0]', 'schema')
    }
    const detail = sample(); detail.diagrams[0].nodes[1] = { elementId: 'continuity', ...{ detail: { diagramId: 'context' } } }; rejected(detail, '$.diagrams[0].nodes[1]', 'schema')
    const element = sample(); element.model.elements[0] = { ...element.model.elements[0], ...{ parentId: 'continuity' } }; rejected(element, '$.model.elements[0]', 'schema')
  })
  it('checks document references, reviewer metadata and dates', () => {
    const input = sample(); input.model.elements[0].docIds = ['missing']; rejected(input, '$.model.elements[0].docIds[0]', 'missing-reference')
    const doc = sample(); doc.documents[0].ste.reviewStatus = 'reviewed'; rejected(doc, '$.documents[0].ste', 'review-metadata')
    doc.documents[0].ste = { ...doc.documents[0].ste, ...{ reviewer: 'A reviewer', reviewedAt: '2026-10-12' } }; expect(decodeArchitecture(doc).ok).toBe(true)
    doc.documents[0].ste = { ...doc.documents[0].ste, ...{ reviewedAt: '2026-02-30' } }; rejected(doc, '$.documents[0].ste.reviewedAt', 'schema')
    doc.documents[0] = { ...doc.documents[0], ...{ termIds: ['unknown'] } }; expect(decodeArchitecture(doc).ok).toBe(false)
  })
  it('rejects unsafe source resources and paths', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,evil', '//evil.test', 'https://user:pass@host.test', '/root/private', '../private', '%2e%2e/private', 'https://host.test/\\evil']) {
      const input = sample(); input.sources[0].url = url; rejected(input, '$.sources[0].url', 'unsafe-url')
    }
    expect(isSafeResourceUrl('diagrams/example.json')).toBe(true)
    const input = sample(); input.sources[0] = { ...input.sources[0], ...{ path: '/root/private' } }; rejected(input, '$.sources[0].path', 'unsafe-path')
  })
  it('rejects cyclic and over-deep caller objects', () => {
    const cycle: Record<string, unknown> = {}; cycle.child = cycle; rejected(cycle, '$', 'resource-limit')
    let deep: unknown = {}; for (let i = 0; i < 34; i++) deep = { child: deep }; rejected(deep, '$', 'resource-limit')
  })
  it('requires complete manual positions and rejects auto fixed positions', () => {
    const input = sample(); input.diagrams[0].layout.mode = 'manual'; rejected(input, '$.diagrams[0].nodes[0].position', 'missing-position')
    const auto = sample(); auto.diagrams[0].nodes[0] = { elementId: 'developer', ...{ position: { x: 50, y: 60 } } }; rejected(auto, '$.diagrams[0].nodes[0].position', 'partial-layout')
  })
  it('retains clarity warnings as visible successful diagnostics', () => {
    const input = sample(); input.model.relationships[0].technology = ''; rejected(input, '$.model.relationships[0].technology', 'schema')
    const unknown: unknown = { ...input, model: { ...input.model, relationships: input.model.relationships.map(({ technology: _technology, ...relationship }) => relationship) } }
    const result = decodeArchitecture(unknown); expect(result.ok).toBe(true); expect(result.diagnostics.some(item => item.code === 'missing-protocol')).toBe(true)
    const legend = sample(); legend.diagrams[0].legend.entries = []; const result2 = decodeArchitecture(legend); expect(result2.ok).toBe(true); expect(result2.diagnostics.some(item => item.code === 'legend-coverage')).toBe(true)
  })
})
describe('scene and document selectors', () => {
  it('preserves declared membership and references in source order', () => {
    const architecture = valid(); const scene = projectDiagram(architecture.index, 'context'); expect(scene.ok).toBe(true)
    if (!scene.ok) return
    expect(scene.value.nodes.map(node => node.element.id)).toEqual(['developer', 'continuity', 'storage'])
    expect(scene.value.edges.map(edge => [edge.relationship.id, edge.source.element.id, edge.target.element.id])).toEqual([['git', 'developer', 'continuity'], ['wal', 'continuity', 'storage']])
    expect(scene.value.edges.map(edge => edge.number)).toEqual([1, 2])
  })
  it('does not resolve inherited index keys as diagrams or elements', () => {
    const architecture = valid(); expect(architecture.index.diagrams.constructor).toBeUndefined()
    expect(projectDiagram(architecture.index, 'constructor').ok).toBe(false)
    expect(projectDiagram(architecture.index, 'toString').ok).toBe(false)
    expect(selectDocumentation(architecture.index, 'context', 'constructor').documents).toEqual([])
  })
  it('honors manual geometry and directional auto spacing', () => {
    const input = sample(); input.diagrams[0].layout.mode = 'manual'
    input.diagrams[0].nodes = input.diagrams[0].nodes.map((node, i) => ({ ...node, position: { x: 80 + i * 500, y: 140 }, size: { width: 300, height: 200 } }))
    const result = projectDiagram(valid(input).index, 'context'); if (!result.ok) throw new Error('Projection failed')
    expect(result.value.nodes.map(node => [node.x, node.y, node.width, node.height])).toEqual([[80, 140, 300, 200], [580, 140, 300, 200], [1080, 140, 300, 200]])
    const auto = sample(); auto.diagrams[0].layout.direction = 'TB'; const vertical = projectDiagram(valid(auto).index, 'context'); if (!vertical.ok) throw new Error('Projection failed')
    expect(vertical.value.nodes[0].x).toBe(vertical.value.nodes[1].x); expect(vertical.value.nodes[1].y).toBeGreaterThan(vertical.value.nodes[0].y)
    auto.diagrams[0].layout = { ...auto.diagrams[0].layout, ...{ spacing: 200 } }; const spaced = projectDiagram(valid(auto).index, 'context'); if (!spaced.ok) throw new Error('Projection failed'); expect(spaced.value.nodes[1].y).toBeGreaterThan(vertical.value.nodes[1].y)
  })
  it('selects element documents, respects membership, and never substitutes diagram prose', () => {
    const input = sample(); input.model.elements.push({ ...input.model.elements[0], id: 'outside', name: 'Outside' })
    const architecture = valid(input)
    expect(selectDocumentation(architecture.index, 'context').documents[0].id).toBe('overview')
    expect(selectDocumentation(architecture.index, 'context', 'developer').documents[0].id).toBe('user-doc')
    expect(selectDocumentation(architecture.index, 'context', 'outside').documents).toEqual([])
    input.model.elements[0].docIds = []; expect(selectDocumentation(valid(input).index, 'context', 'developer').documents).toEqual([])
  })
})

describe('finite manual geometry regression', () => {
  it('uses stable relationship midpoints for large finite manual coordinates', () => {
    const input = sample(); input.diagrams[0].layout.mode = 'manual'
    input.diagrams[0].nodes = input.diagrams[0].nodes.map(node => ({ ...node, position: { x: 1e308, y: 1e308 } }))
    const result = projectDiagram(valid(input).index, 'context')
    expect(result.ok).toBe(true); if (!result.ok) return
    expect(result.value.edges[0].labelX).toBe(1e308)
    const geometry = [result.value.width, result.value.height, ...result.value.nodes.flatMap(node => [node.x, node.y, node.width, node.height]), ...result.value.edges.flatMap(edge => [edge.x1, edge.y1, edge.x2, edge.y2, edge.labelX, edge.labelY])]
    expect(geometry.every(Number.isFinite)).toBe(true)
  })
  it('returns actionable diagnostics for coordinate spans and sizes arithmetic cannot represent', () => {
    const input = sample(); input.diagrams[0].layout.mode = 'manual'
    input.diagrams[0].nodes = input.diagrams[0].nodes.map((node, i) => ({ ...node, position: { x: i === 0 ? -1e308 : 1e308, y: 140 } }))
    const overflow = projectDiagram(valid(input).index, 'context')
    expect(overflow.ok).toBe(false); expect(overflow.diagnostics[0].message).toContain('Reduce the distance')
    input.diagrams[0].nodes = input.diagrams[0].nodes.map((node, i) => ({ ...node, position: { x: 40 + i * 320, y: 140 }, size: { width: Number.MIN_VALUE, height: 166 } }))
    const underflow = projectDiagram(valid(input).index, 'context')
    expect(underflow.ok).toBe(false); expect(underflow.diagnostics[0]).toMatchObject({ code: 'projection', path: '$.nodes[0].size', severity: 'error' }); expect(underflow.diagnostics[0].message).toContain('Increase')
  })
})
