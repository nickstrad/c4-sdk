import { describe, expect, it } from 'vitest'
import fixture from '../../fixtures/navigation.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { breadcrumbs, detailTarget, formatRoute, isOrdinaryLinkActivation, parseRoute, recoveryTarget, relatedTargets, transition, validateRoute } from '../../src/lib/c4/domain/navigation'
const decoded = decodeArchitecture(fixture)
if (!decoded.ok) throw new Error(JSON.stringify(decoded.diagnostics))
const index = decoded.value.index
const root = { architectureId: index.bundle.id, diagramId: 'context' }
const child = { ...root, diagramId: 'containers' }
describe('route and transition rules', () => {
  it('round trips and rejects malformed, unknown and nonmember routes', () => {
    expect(parseRoute(formatRoute({ ...child, elementId: 'server' }))).toMatchObject({ ok: true, value: { ...child, elementId: 'server' } })
    for (const hash of ['#/oops', '#/architectures/%GG/diagrams/context', '#/architectures/a/diagrams/context?step=x&step=y', '#/architectures/a/diagrams/%2F']) expect(parseRoute(hash).ok).toBe(false)
    expect(validateRoute(index, { ...root, stepId: 'x' })[0].path).toBe('$.route.stepId')
    expect(validateRoute(index, { ...root, diagramId: 'constructor' })[0].path).toBe('$.route.diagramId')
    expect(validateRoute(index, { ...root, elementId: 'server' })[0].path).toBe('$.route.elementId')
    expect(validateRoute(index, { ...root, architectureId: 'other' })[0].path).toBe('$.route.architectureId')
  })
  it('drill differs from Inspect and Up restores the exact parent anchor', () => {
    expect(transition(index, root, { type: 'activate', elementId: 'continuity' })).toMatchObject({ ok: true, value: { route: child } })
    expect(transition(index, root, { type: 'inspect', elementId: 'continuity' })).toMatchObject({ ok: true, value: { route: { ...root, elementId: 'continuity' } } })
    expect(transition(index, child, { type: 'up' })).toMatchObject({ ok: true, value: { route: { ...root, elementId: 'continuity' } } })
    expect(transition(index, child, { type: 'back' }, true)).toMatchObject({ ok: true, value: { type: 'back' } })
    expect(transition(index, child, { type: 'back' })).toEqual(transition(index, child, { type: 'up' }))
    expect(transition(index, root, { type: 'back' })).toMatchObject({ ok: true, value: { route: root } })
    expect(breadcrumbs(index, child)).toEqual([{ diagramId: 'context', elementId: 'continuity' }, { diagramId: 'containers' }])
  })
})
describe('container and navigation semantic diagnostics', () => {
  const rejected = (mutate: (input: any) => void, code: string) => { const input = structuredClone(fixture); mutate(input); const result = decodeArchitecture(input); expect(result.ok).toBe(false); expect(result.diagnostics.some(item => item.code === code)).toBe(true) }
  it('rejects wrong containment, level mixing and scope', () => {
    rejected(input => { input.model.elements[3].parentId = 'developer' }, 'invalid-parent')
    rejected(input => { delete input.model.elements[3].technology }, 'schema')
    rejected(input => { input.diagrams[0].nodes.push({ elementId: 'server' }) }, 'invalid-member')
    rejected(input => { input.diagrams[1].scopeId = 'server' }, 'invalid-scope')
  })
  it('rejects unknown, invisible and unrelated targets and cyclic parents', () => {
    rejected(input => { input.diagrams[0].nodes[1].detail.diagramId = 'missing' }, 'missing-reference')
    rejected(input => { input.diagrams[0].nodes[1].detail.elementId = 'developer' }, 'target-not-visible')
    rejected(input => { input.diagrams[1].scopeId = 'storage' }, 'invalid-detail')
    rejected(input => { input.diagrams[0].parent = { diagramId: 'containers' } }, 'parent-cycle')
    rejected(input => { input.diagrams[1].parent.elementId = 'server' }, 'target-not-visible')
  })
  it('permits related cycles and explicitly external supporting containers', () => {
    const input: any = structuredClone(fixture)
    input.diagrams[0].related = [{ diagramId: 'containers', label: 'Container view' }]
    input.diagrams[1].related = [{ diagramId: 'context', label: 'Context view' }]
    input.model.elements.push({ ...input.model.elements[3], id: 'external', parentId: 'storage', tags: ['external'] })
    input.diagrams[1].nodes.push({ elementId: 'external', position: { x: 350, y: 800 } })
    expect(decodeArchitecture(input).ok).toBe(true)
  })
})
it('selects only declared local navigation targets and preserves native link gestures', () => {
  expect(detailTarget(index, root, 'continuity')).toEqual({ diagramId: 'containers' })
  expect(detailTarget(index, { ...root, architectureId: 'foreign' }, 'continuity')).toBeUndefined()
  expect(recoveryTarget(index, { ...root, diagramId: 'missing' })).toEqual({ diagramId: index.bundle.defaultDiagramId })
  expect(relatedTargets(index, { ...root, architectureId: 'foreign' })).toEqual([])
  const ordinary = { button: 0, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, defaultPrevented: false }
  expect(isOrdinaryLinkActivation(ordinary)).toBe(true)
  for (const key of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'defaultPrevented']) expect(isOrdinaryLinkActivation({ ...ordinary, [key]: true })).toBe(false)
  expect(isOrdinaryLinkActivation({ ...ordinary, button: 1 })).toBe(false)
})
