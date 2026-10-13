import { expect, it } from 'vitest'
import fc from 'fast-check'
import fixture from '../../fixtures/context.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { projectDiagram } from '../../src/lib/c4/domain/presentation'
const options = { seed: 4012026, numRuns: 150 }
const graph = fc.uniqueArray(fc.nat({ max: 1000000 }), { minLength: 2, maxLength: 35 }).chain(numbers => fc.array(fc.boolean(), { minLength: numbers.length - 1, maxLength: numbers.length - 1 }).map(mask => {
  const ids = numbers.map(n => `n${n}`)
  const visible = ids.filter((_, i) => i === 0 || mask[i - 1])
  const elements = ids.map((id, i) => ({ id, kind: i === 0 ? 'softwareSystem' : 'person', name: `Element ${id}`, description: 'Generated collaborator.', status: 'existing' }))
  const relationships = visible.slice(1).map((targetId, i) => ({ id: `r${i}`, sourceId: ids[0], targetId, label: 'Uses', technology: 'HTTPS', status: 'existing' }))
  return { ...fixture, id: 'generated', model: { elements, relationships }, diagrams: [{ ...fixture.diagrams[0], scopeId: ids[0], nodes: visible.map(elementId => ({ elementId })), edges: relationships.map(r => ({ relationshipId: r.id })) }] }
}))
it('generated graph projection preserves exactly declared members and endpoints without mutating input', () => {
  fc.assert(fc.property(graph, input => {
    const before = structuredClone(input); const result = decodeArchitecture(input)
    expect(result.ok).toBe(true); expect(input).toEqual(before); expect(Object.isFrozen(input)).toBe(false)
    if (!result.ok) return
    const projected = projectDiagram(result.value.index, 'context'); expect(projected.ok).toBe(true)
    if (!projected.ok) return
    expect(projected.value.nodes.map(node => node.element.id)).toEqual(input.diagrams[0].nodes.map(member => member.elementId))
    expect(projected.value.edges.map(edge => [edge.source.element.id, edge.target.element.id])).toEqual(input.model.relationships.map(r => [r.sourceId, r.targetId]))
    expect(projected.value.nodes.every(node => Number.isFinite(node.x) && Number.isFinite(node.y))).toBe(true)
  }), options)
})
it('duplicate model identities and missing view references are never accepted', () => {
  fc.assert(fc.property(graph, input => {
    const duplicate = { ...input, model: { ...input.model, elements: [...input.model.elements, input.model.elements[0]] } }
    const result = decodeArchitecture(duplicate); expect(result.ok).toBe(false); expect(result.diagnostics.some(item => item.code === 'duplicate-id')).toBe(true)
    const missing = { ...input, diagrams: [{ ...input.diagrams[0], nodes: [...input.diagrams[0].nodes, { elementId: 'missing-element' }] }] }
    const missingResult = decodeArchitecture(missing); expect(missingResult.ok).toBe(false); expect(missingResult.diagnostics.some(item => item.path.endsWith('.elementId') && item.code === 'missing-reference')).toBe(true)
  }), options)
})
it('corrupted relationship targets fail before a scene can enter the viewer', () => {
  fc.assert(fc.property(graph, input => {
    const relationship = { id: 'corrupt', sourceId: input.model.elements[0].id, targetId: 'missing-element', label: 'Uses', technology: 'HTTPS', status: 'existing' }
    const result = decodeArchitecture({ ...input, model: { ...input.model, relationships: [...input.model.relationships, relationship] } })
    expect(result.ok).toBe(false); expect(result.diagnostics.some(item => item.path.endsWith('.targetId') && item.code === 'missing-reference')).toBe(true)
  }), options)
})
it('runtime ID acceptance matches the specified case-sensitive ID grammar', () => {
  fc.assert(fc.property(fc.string({ maxLength: 150 }), id => {
    const input = { ...fixture, id }; const result = decodeArchitecture(input)
    expect(result.ok).toBe(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id))
  }), options)
})

it('all successful scenes from finite manual inputs have entirely finite geometry; unrepresentable scenes report diagnostics', () => {
  const coordinate = fc.oneof(fc.double({ noNaN: true, noDefaultInfinity: true }), fc.constantFrom(Number.MAX_VALUE, -Number.MAX_VALUE, 1e308, -1e308, 0, Number.MIN_VALUE))
  const size = fc.oneof(fc.double({ min: Number.MIN_VALUE, max: 2000, noNaN: true, noDefaultInfinity: true }), fc.constantFrom(Number.MIN_VALUE, 2 * Number.MIN_VALUE, 1e-300, 220, 2000))
  const members = fc.array(fc.record({ x: coordinate, y: coordinate, width: size, height: size }), { minLength: 3, maxLength: 3 })
  fc.assert(fc.property(members, geometry => {
    const input = { ...fixture, diagrams: [{ ...fixture.diagrams[0], layout: { mode: 'manual', direction: 'LR' }, nodes: fixture.diagrams[0].nodes.map((node, i) => ({ ...node, position: { x: geometry[i].x, y: geometry[i].y }, size: { width: geometry[i].width, height: geometry[i].height } })) }] }
    const before = structuredClone(input); const decoded = decodeArchitecture(input)
    expect(decoded.ok).toBe(true); if (!decoded.ok) return
    const projected = projectDiagram(decoded.value.index, 'context'); expect(input).toEqual(before)
    if (!projected.ok) {
      expect(projected.diagnostics.length).toBeGreaterThan(0)
      expect(projected.diagnostics.every(diagnostic => diagnostic.severity === 'error' && diagnostic.path.startsWith('$') && diagnostic.message.length > 0)).toBe(true)
      return
    }
    const scene = projected.value
    const numbers = [scene.width, scene.height, ...scene.nodes.flatMap(node => [node.x, node.y, node.width, node.height]), ...scene.edges.flatMap(edge => [edge.x1, edge.y1, edge.x2, edge.y2, edge.labelX, edge.labelY])]
    expect(numbers.every(Number.isFinite)).toBe(true)
    expect(scene.nodes.map(node => node.element.id)).toEqual(input.diagrams[0].nodes.map(node => node.elementId))
  }), { ...options, numRuns: 300 })
})
