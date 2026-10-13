import { expect, it } from 'vitest'
import fc from 'fast-check'
import ELK from 'elkjs/lib/elk.bundled.js'
import fixture from '../../fixtures/layout.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { elkInput } from '../../src/lib/c4/adapters/layout/elk-input'
import { elkOutput, attachGeometry, relativeGeometry } from '../../src/lib/c4/adapters/layout/elk-output'
const engine = new ELK()
it('pinned ELK produces finite contained geometry and exact identity for varied dimensions, direction and bounded nesting', async () => {
  await fc.assert(fc.asyncProperty(fc.integer({ min: 1, max: 5 }), fc.integer({ min: 180, max: 450 }), fc.integer({ min: 120, max: 320 }), fc.boolean(), async (depth, width, height, horizontal) => {
    const source = structuredClone(fixture)
    source.diagrams[0].groups = Array.from({ length: depth }, (_, i) => ({ id: i ? `g${i}` : 'continuity', label: `Level ${i}`, status: 'planned', parentGroupId: i ? i === 1 ? 'continuity' : `g${i - 1}` : undefined, memberIds: i === depth - 1 ? ['developer', 'continuity'] : [] })) as typeof source.diagrams[0]['groups']
    source.diagrams[0].layout.direction = horizontal ? 'LR' : 'TB'
    const decoded = decodeArchitecture(source); if (!decoded.ok) throw new Error(JSON.stringify(decoded.diagnostics))
    const input = buildScene(decoded.value.index, 'context'); if (!input.ok) throw new Error('fixture')
    const measures = { revision: `${width}/${height}`, nodeSizes: Object.fromEntries(input.value.nodes.map(node => [node.element.id, { width, height }])), edgeLabelSizes: {} }
    const graph = elkInput(input.value, measures)
    expect(elkInput({ ...input.value, nodes: [...input.value.nodes].reverse(), groups: [...input.value.groups].reverse(), edges: [...input.value.edges].reverse() }, measures)).toEqual(graph)
    const geometry = elkOutput(await engine.layout(graph))
    const result = attachGeometry(input.value, geometry)
    expect(result.ok, JSON.stringify(result.diagnostics)).toBe(true); if (!result.ok) return
    const relative = relativeGeometry(result.value)
    relative.nodes.forEach((node, i) => {
      expect(node.node.element).toBe(input.value.nodes[i].element)
      const parent = result.value.groups?.find(group => group.group.id === node.node.parentGroupId)
      expect(node.position.x + (parent?.x ?? 0)).toBeCloseTo(node.node.x)
      expect(node.position.y + (parent?.y ?? 0)).toBeCloseTo(node.node.y)
    })
    result.value.edges.forEach((edge, i) => { expect(edge.relationship).toBe(input.value.edges[i].relationship); expect(result.value.nodes).toContain(edge.source); expect(result.value.nodes).toContain(edge.target) })
  }), { numRuns: 30, seed: 40404 })
}, 30000)
it('identical pinned input is deterministic', async () => {
  const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
  const input = buildScene(decoded.value.index, 'context'); if (!input.ok) throw new Error('fixture')
  const first = elkOutput(await engine.layout(elkInput(input.value)))
  expect(elkOutput(await engine.layout(elkInput(input.value)))).toEqual(first)
})

it('manual coordinates including zero and negative values remain authored under compound layout', async () => {
  const { manualLayout } = await import('../../src/lib/c4/domain/layout')
  fc.assert(fc.property(fc.integer({ min: -10000, max: 10000 }), fc.integer({ min: -10000, max: 10000 }), fc.integer({ min: 1, max: 12 }), (x, y, parallelCount) => {
    const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
    const input = buildScene(decoded.value.index, 'context'); if (!input.ok) throw new Error('fixture')
    const edges = Array.from({ length: parallelCount }, (_, i) => ({ ...input.value.edges[0], relationship: { ...input.value.edges[0].relationship, id: `parallel-${i}` } }))
    const manual = { ...input.value, edges, diagram: { ...input.value.diagram, edges: edges.map(edge => ({ relationshipId: edge.relationship.id })), layout: { mode: 'manual' as const, direction: 'LR' as const }, nodes: input.value.diagram.nodes.map((node, i) => ({ ...node, position: { x: x + i * 700, y } })) } }
    const result = manualLayout(manual)
    expect(result.ok).toBe(true); if (!result.ok) return
    expect(result.value.nodes.map(node => [node.x, node.y])).toEqual(manual.diagram.nodes.map(node => [node.position.x, node.position.y]))
    result.value.edges.forEach((edge, i) => {
      const a = edge.labelBounds!
      for (const other of result.value.edges.slice(0, i)) { const b = other.labelBounds!; expect(a.y + a.height <= b.y || b.y + b.height <= a.y).toBe(true) }
    })
  }), { numRuns: 150, seed: 40405 })
})
