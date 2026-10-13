import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { projectDiagram } from '../../src/lib/c4/domain/presentation'
import { codeAncestry, memberKey, symbolKey } from '../../src/lib/c4/domain/codeview'
import { breadcrumbs, transition } from '../../src/lib/c4/domain/navigation'
import type { Diagnostic } from '../../src/lib/c4/domain/model'

type Json = Record<string, any>
const fixture = (): Json => JSON.parse(readFileSync('fixtures/seven-types.json', 'utf8'))
const element = (bundle: Json, id: string) => bundle.model.elements.find((item: Json) => item.id === id)
const diagram = (bundle: Json, id: string) => bundle.diagrams.find((item: Json) => item.id === id)
function rejected(bundle: Json, code: string, path?: string): Diagnostic[] {
  const result = decodeArchitecture(bundle)
  expect(result.ok, JSON.stringify(result.diagnostics)).toBe(false)
  expect(result.diagnostics).toContainEqual(expect.objectContaining({ code, ...(path ? { path } : {}) }))
  return [...result.diagnostics]
}
describe('seven-type fixture', () => {
  it('decodes without diagnostics and declares all seven kinds', () => {
    const result = decodeArchitecture(fixture())
    expect(result.diagnostics).toEqual([])
    if (!result.ok) throw Error('fixture')
    expect(Object.values(result.value.index.diagrams).map(item => item.kind).sort()).toEqual(['code', 'component', 'container', 'context', 'deployment', 'dynamic', 'landscape'])
  })
  it('projects every diagram retaining declared members and endpoints', () => {
    const result = decodeArchitecture(fixture()); if (!result.ok) throw Error('fixture')
    for (const item of Object.values(result.value.index.diagrams)) {
      const scene = projectDiagram(result.value.index, item.id)
      expect(scene.ok, item.id).toBe(true); if (!scene.ok) continue
      expect(scene.value.nodes.map(node => node.element.id), item.id).toEqual(item.nodes.map(node => node.elementId))
      expect(scene.value.edges.map(edge => edge.relationship.id), item.id).toEqual(item.edges.map(edge => edge.relationshipId))
      for (const edge of scene.value.edges) { expect(edge.source.element.id).toBe(edge.relationship.sourceId); expect(edge.target.element.id).toBe(edge.relationship.targetId) }
    }
  })
  it('keeps text-only members with default visibility and stable ordering', () => {
    const result = decodeArchitecture(fixture()); if (!result.ok) throw Error('fixture')
    const service = result.value.index.elements.OrderService
    if (service.kind !== 'code') throw Error('kind')
    expect(service.members.map(member => member.name)).toEqual(['repository', 'place', 'price'])
    expect(service.members.map(member => member.visibility)).toEqual(['private', 'public', 'protected'])
    const input = fixture(); delete element(input, 'OrderService').members[1].visibility
    const defaulted = decodeArchitecture(input); if (!defaulted.ok) throw Error('fixture')
    expect((defaulted.value.index.elements.OrderService as unknown as { members: { visibility: string }[] }).members[1].visibility).toBe('public')
  })
})
describe('code containment and hierarchy', () => {
  it('resolves nested symbols to their owning component and tolerates cycles', () => {
    const result = decodeArchitecture(fixture()); if (!result.ok) throw Error('fixture')
    expect(codeAncestry(result.value.index.elements, 'OrderLine')).toEqual({ ok: true, ancestors: ['OrderService', 'order-handling'], componentId: 'order-handling' })
    const loop = { a: { ...element(fixture(), 'OrderLine'), id: 'a', parentId: 'b' }, b: { ...element(fixture(), 'OrderLine'), id: 'b', parentId: 'a' } }
    expect(codeAncestry(loop, 'a')).toEqual({ ok: false, reason: 'cycle' })
  })
  it('rejects illegal parents, cycles, excessive depth and unknown parents', () => {
    const system = fixture(); element(system, 'OrderService').parentId = 'shop'; rejected(system, 'invalid-parent')
    const container = fixture(); element(container, 'OrderService').parentId = 'orders-api'; rejected(container, 'invalid-parent')
    const unknown = fixture(); element(unknown, 'OrderService').parentId = 'nowhere'; rejected(unknown, 'missing-reference')
    const cycle = fixture(); element(cycle, 'OrderService').parentId = 'OrderLine'; rejected(cycle, 'code-cycle')
    const deep = fixture(); let parent = 'order-handling'
    for (let i = 0; i < 34; i++) { deep.model.elements.push({ ...element(deep, 'EmptyModule'), id: `deep-${i}`, parentId: parent }); parent = `deep-${i}` }
    rejected(deep, 'code-depth')
  })
  it('validates symbol kinds and text-only members', () => {
    const kind = fixture(); element(kind, 'OrderService').symbolKind = 'macro'; rejected(kind, 'schema')
    const control = fixture(); element(control, 'OrderService').members[0].name = 'bad\nname'; rejected(control, 'schema')
    const extra = fixture(); element(extra, 'OrderService').members[0].body = '<script>alert(1)</script>'; rejected(extra, 'schema')
    const html = fixture(); element(html, 'OrderService').members[0].signature = '<img src=x onerror=alert(1)>'
    expect(decodeArchitecture(html).ok).toBe(true)
  })
  it('requires code members to belong to the scoped component unless external', () => {
    const foreign = fixture(); element(foreign, 'OrderStatus').parentId = 'order-storage'; rejected(foreign, 'code-scope')
    const external = fixture(); element(external, 'OrderStatus').parentId = 'order-storage'; element(external, 'OrderStatus').tags = ['external']
    expect(decodeArchitecture(external).ok).toBe(true)
    const person = fixture(); diagram(person, 'code').nodes.push({ elementId: 'customer' }); rejected(person, 'invalid-member')
    const leak = fixture(); diagram(leak, 'components').nodes.push({ elementId: 'OrderService' }); rejected(leak, 'invalid-member')
    const scope = fixture(); diagram(scope, 'code').scopeId = 'orders-api'; rejected(scope, 'invalid-scope')
    const dynamic = fixture(); diagram(dynamic, 'dynamic').nodes.push({ elementId: 'OrderService' }); rejected(dynamic, 'invalid-member')
  })
})
describe('relationship kinds, landscape scope and detail navigation', () => {
  it('accepts typed relations only between legal code elements', () => {
    const inheritance = fixture(); inheritance.model.relationships.find((item: Json) => item.id === 'rush-svc').targetId = 'customer'; rejected(inheritance, 'relationship-kind')
    const implementation = fixture(); implementation.model.relationships.find((item: Json) => item.id === 'sql-repo').targetId = 'OrderService'; rejected(implementation, 'relationship-kind')
    const composition = fixture(); composition.model.relationships.find((item: Json) => item.id === 'svc-line').sourceId = 'web'; rejected(composition, 'relationship-kind')
    const self = fixture(); const link = self.model.relationships.find((item: Json) => item.id === 'rush-svc'); link.targetId = link.sourceId; rejected(self, 'relationship-kind')
    const unknown = fixture(); unknown.model.relationships.find((item: Json) => item.id === 'svc-line').kind = 'mixin'; rejected(unknown, 'schema')
  })
  it('requires visible endpoints in code views', () => {
    const hidden = fixture(); diagram(hidden, 'code').nodes = diagram(hidden, 'code').nodes.filter((node: Json) => node.elementId !== 'OrderLine'); rejected(hidden, 'endpoint-not-visible')
  })
  it('landscape accepts people and systems with an optional visible system scope', () => {
    const scoped = fixture(); diagram(scoped, 'landscape').scopeId = 'shop'; expect(decodeArchitecture(scoped).ok).toBe(true)
    const hidden = fixture(); diagram(hidden, 'landscape').scopeId = 'shop'; diagram(hidden, 'landscape').nodes = diagram(hidden, 'landscape').nodes.filter((node: Json) => node.elementId !== 'shop'); diagram(hidden, 'landscape').edges = []
    rejected(hidden, 'scope-not-visible')
    const wrong = fixture(); diagram(wrong, 'landscape').scopeId = 'customer'; rejected(wrong, 'invalid-scope')
    const container = fixture(); diagram(container, 'landscape').nodes.push({ elementId: 'web' }); rejected(container, 'invalid-member')
  })
  it('landscape system and component details must reach their own next scope', () => {
    const landscape = fixture(); diagram(landscape, 'landscape').nodes[1].detail = { diagramId: 'containers' }; rejected(landscape, 'invalid-detail')
    const component = fixture(); diagram(component, 'components').nodes[0].detail = { diagramId: 'components' }; rejected(component, 'invalid-detail')
    const result = decodeArchitecture(fixture()); if (!result.ok) throw Error('fixture')
    const index = result.value.index
    const down = transition(index, { architectureId: 'seven-types', diagramId: 'landscape' }, { type: 'activate', elementId: 'shop' })
    expect(down).toMatchObject({ ok: true, value: { type: 'push', route: { diagramId: 'context' } } })
    const code = transition(index, { architectureId: 'seven-types', diagramId: 'components' }, { type: 'activate', elementId: 'order-handling' })
    expect(code).toMatchObject({ ok: true, value: { type: 'push', route: { diagramId: 'code' } } })
    expect(breadcrumbs(index, { architectureId: 'seven-types', diagramId: 'code' }).map(item => item.diagramId)).toEqual(['landscape', 'context', 'containers', 'components', 'code'])
  })
})
describe('rendering identities', () => {
  it('symbol and member keys are injective across the ID grammar', () => {
    const keys = new Set<string>()
    for (const id of ['a', 'a.b', 'a-b', 'a_b', 'a-member-0', 'member-0', 'symbol-a']) {
      keys.add(symbolKey(id))
      for (let index = 0; index < 3; index++) keys.add(memberKey(id, index))
    }
    expect(keys.size).toBe(7 * 4)
  })
})
