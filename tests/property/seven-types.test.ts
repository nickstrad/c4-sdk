import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import fc from 'fast-check'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { projectDiagram } from '../../src/lib/c4/domain/presentation'
import { codeAncestry, memberKey, symbolKey } from '../../src/lib/c4/domain/codeview'
type Json = Record<string, any>
const fixture = (): Json => JSON.parse(readFileSync('fixtures/seven-types.json', 'utf8'))
const decoded = decodeArchitecture(fixture()); if (!decoded.ok) throw Error('fixture')
const index = decoded.value.index
const diagramIds = Object.keys(index.diagrams)
const validId = fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,20}$/)

it('every diagram projection retains declared members and visible endpoints in order', () => {
  fc.assert(fc.property(fc.constantFrom(...diagramIds), id => {
    const scene = projectDiagram(index, id); if (!scene.ok) throw Error(JSON.stringify(scene.diagnostics))
    const diagram = index.diagrams[id]
    expect(scene.value.nodes.map(node => node.element.id)).toEqual(diagram.nodes.map(node => node.elementId))
    const visible = new Set(scene.value.nodes.map(node => node.element.id))
    expect(scene.value.edges.map(edge => edge.relationship.id)).toEqual(diagram.edges.map(edge => edge.relationshipId))
    for (const edge of scene.value.edges) { expect(visible.has(edge.relationship.sourceId)).toBe(true); expect(visible.has(edge.relationship.targetId)).toBe(true) }
    for (const node of scene.value.nodes) if (node.element.kind === 'code') expect(node.element.members).toBe(index.elements[node.element.id].kind === 'code' ? (index.elements[node.element.id] as { members: unknown }).members : undefined)
  }), { numRuns: 50 })
})
it('symbol and member identities never collide for any valid IDs and indexes', () => {
  fc.assert(fc.property(validId, validId, fc.nat(300), fc.nat(300), (a, b, i, j) => {
    const left = memberKey(a, i); const right = memberKey(b, j)
    expect(left === right).toBe(a === b && i === j)
    expect(symbolKey(a) === symbolKey(b)).toBe(a === b)
    expect(symbolKey(a)).not.toBe(left)
  }), { numRuns: 400 })
})
it('any single-parent rewiring among code elements either reaches a component or is rejected', () => {
  const codeIds = Object.values(index.elements).filter(item => item.kind === 'code').map(item => item.id)
  fc.assert(fc.property(fc.constantFrom(...codeIds), fc.constantFrom(...codeIds, 'order-handling', 'order-storage', 'shop', 'orders-api'), (child, parent) => {
    const input = fixture(); input.model.elements.find((item: Json) => item.id === child).parentId = parent
    const result = decodeArchitecture(input)
    if (result.ok) expect(codeAncestry(result.value.index.elements, child).ok).toBe(true)
    else expect(result.diagnostics.some(item => item.severity === 'error')).toBe(true)
  }), { numRuns: 120 })
})
it('detail targets that are not the member next scope are always rejected', () => {
  const dests = diagramIds
  fc.assert(fc.property(fc.constantFrom('landscape', 'context', 'containers', 'components'), fc.constantFrom(...dests), (source, destination) => {
    const input = fixture(); const view = input.diagrams.find((item: Json) => item.id === source)
    const member = view.nodes.find((item: Json) => item.detail)
    const original = member.detail.diagramId; member.detail = { diagramId: destination }
    expect(decodeArchitecture(input).ok).toBe(destination === original)
  }), { numRuns: 60 })
})
