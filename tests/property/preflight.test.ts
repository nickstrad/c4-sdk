import { expect, it } from 'vitest'
import fc from 'fast-check'
import fixture from '../../fixtures/context.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { fixedLayout, validateLayout } from '../../src/lib/c4/domain/layout'
import { validateGroups } from '../../src/lib/c4/domain/groups'
import type { Group } from '../../src/lib/c4/domain/model'
const options = { seed: 403042026, numRuns: 200 }
const forest = fc.array(fc.nat({ max: 10000 }), { minLength: 1, maxLength: 30 }).chain(parents => fc.tuple(fc.array(fc.nat({ max: parents.length - 1 }), { minLength: 3, maxLength: 3 }), fc.boolean()).map(([assignments, reverse]) => {
  const groups: Group[] = parents.map((choice, i) => ({ id: `g${i}`, label: `Group ${i}`, status: 'existing', memberIds: fixture.diagrams[0].nodes.filter((_, member) => assignments[member] === i).map(node => node.elementId), ...(i ? { parentGroupId: `g${choice % i}` } : {}) }))
  return reverse ? groups.reverse() : groups
}))
it('generated valid group forests preserve immutable membership and ancestry in arbitrary declaration order', () => {
  fc.assert(fc.property(forest, groups => {
    const input = { ...fixture, diagrams: [{ ...fixture.diagrams[0], groups }] }; const before = structuredClone(input)
    const decoded = decodeArchitecture(input); expect(decoded.ok).toBe(true); expect(input).toEqual(before); if (!decoded.ok) return
    const projected = buildScene(decoded.value.index, 'context'); expect(projected.ok).toBe(true); if (!projected.ok) return
    expect(projected.value.groups).toEqual(groups)
    expect(projected.value.nodes.map(node => node.element.id)).toEqual(fixture.diagrams[0].nodes.map(node => node.elementId))
    projected.value.nodes.forEach(node => expect(node.parentGroupId).toBe(groups.find(group => group.memberIds.includes(node.element.id))?.id))
    expect(Object.isFrozen(projected.value)).toBe(true); expect(Object.isFrozen(projected.value.groups)).toBe(true)
    expect(projected.value.architectureId).toBe(fixture.id); expect(projected.value.revision).toBe(fixture.revision)
    expect(fixedLayout(projected.value)).toMatchObject({ ok: false, diagnostics: [{ code: 'unsupported-groups' }] })
  }), options)
})
it('generated corrupt group identities, memberships and parent references cannot reach layout', () => {
  fc.assert(fc.property(forest, groups => {
    const visible = fixture.diagrams[0].nodes.map(node => node.elementId)
    expect(validateGroups([...groups, groups[0]], visible).some(item => item.code === 'duplicate-group-id')).toBe(true)
    expect(validateGroups([{ ...groups[0], memberIds: ['missing-member'] }, ...groups.slice(1)], visible).some(item => item.code === 'group-member-not-visible')).toBe(true)
    expect(validateGroups([{ ...groups[0], memberIds: ['developer', 'developer'] }, ...groups.slice(1)], visible).some(item => item.code === 'duplicate-group-member')).toBe(true)
    expect(validateGroups([{ ...groups[0], parentGroupId: 'absent-parent' }, ...groups.slice(1)], visible).some(item => item.code === 'missing-group-parent')).toBe(true)
    const cycle = groups.map((group, i) => ({ ...group, parentGroupId: groups[(i + 1) % groups.length].id }))
    expect(validateGroups(cycle, visible).some(item => item.code === 'group-cycle')).toBe(true)
  }), options)
})
it('flat JSON can still exceed relational nesting depth and is rejected before projection', () => {
  fc.assert(fc.property(fc.integer({ min: 33, max: 80 }), length => {
    const groups: Group[] = Array.from({ length }, (_, i) => ({ id: `g${i}`, label: 'Group', status: 'existing', memberIds: [], ...(i ? { parentGroupId: `g${i - 1}` } : {}) }))
    const decoded = decodeArchitecture({ ...fixture, diagrams: [{ ...fixture.diagrams[0], groups }] })
    expect(decoded.ok).toBe(false); expect(decoded.diagnostics.some(item => item.code === 'group-depth')).toBe(true)
  }), options)
})
it('geometry adapters cannot replace validated content or lose group/endpoint identity', () => {
  const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
  const projected = buildScene(decoded.value.index, 'context'); if (!projected.ok) throw new Error('fixture')
  const result = fixedLayout(projected.value); if (!result.ok) throw new Error('fixture')
  fc.assert(fc.property(fc.string({ maxLength: 40 }), fc.nat({ max: result.value.nodes.length - 1 }), (name, index) => {
    const scene = { ...result.value, nodes: result.value.nodes.map((node, i) => i === index ? { ...node, element: { ...node.element, name } } : node) }
    expect(validateLayout(projected.value, { ...result, value: scene }).ok).toBe(false)
    expect(validateLayout(projected.value, result).ok).toBe(true)
  }), options)
})

it('generated group statuses require boundary notation and exactly the planned/mixed stroke notation', () => {
  fc.assert(fc.property(fc.array(fc.constantFrom('existing' as const, 'planned' as const, 'mixed' as const), { minLength: 1, maxLength: 20 }), statuses => {
    const groups = statuses.map((status, i) => ({ id: `g${i}`, label: `Group ${i}`, status, memberIds: [] }))
    const input = { ...fixture, diagrams: [{ ...fixture.diagrams[0], groups }] }
    const result = decodeArchitecture(input); expect(result.ok).toBe(true)
    const warnings = result.diagnostics.filter(item => item.code === 'legend-coverage').map(item => item.message)
    expect(warnings).toContain('Key does not explain "boundary" notation.')
    expect(warnings.includes('Key does not explain "dashed" notation.')).toBe(statuses.some(status => status !== 'existing'))
    const complete = { ...input, diagrams: input.diagrams.map(diagram => ({ ...diagram, legend: { ...diagram.legend, entries: [...diagram.legend.entries, { id: 'group', label: 'Boundary', description: 'Group notation', swatch: { shape: 'boundary', tone: 'default', stroke: 'dashed' } }] } })) }
    const accepted = decodeArchitecture(complete); expect(accepted.ok).toBe(true)
    expect(accepted.diagnostics.filter(item => item.code === 'legend-coverage')).toEqual([])
  }), options)
})
