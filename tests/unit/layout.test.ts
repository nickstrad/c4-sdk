import { expect, it } from 'vitest'
import fixture from '../../fixtures/navigation.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { fixedLayout, validateLayout } from '../../src/lib/c4/domain/layout'
it('scene input retains membership and technology labels without carrying derived geometry', () => {
  const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
  const input = buildScene(decoded.value.index, 'containers'); if (!input.ok) throw new Error('fixture')
  expect(input.value.nodes.map(node => node.element.id)).toEqual(['server', 'repository', 'storage'])
  expect(input.value.nodes[1].kindLabel).toBe('Data store · Git / NVMe')
  expect(input.value.nodes[0]).not.toHaveProperty('x')
  const result = fixedLayout(input.value); expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.value.edges[0].labelY).toBeLessThan(result.value.edges[1].labelY)
    expect(result.value.edges.every(edge => edge.labelY + 60 === (edge.source.y + edge.source.height / 2) / 2 + (edge.target.y + edge.target.height / 2) / 2)).toBe(true)
    expect(result.value.edges.map(edge => [edge.source.element.id, edge.target.element.id])).toEqual([['server', 'repository'], ['server', 'storage']])
  }
})
it('rejects adapter geometry that invents membership or contains infinite coordinates', () => {
  const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
  const input = buildScene(decoded.value.index, 'containers'); if (!input.ok) throw new Error('fixture')
  const result = fixedLayout(input.value); if (!result.ok) throw new Error('fixture')
  expect(validateLayout(input.value, result).ok).toBe(true)
  expect(validateLayout(input.value, { ...result, value: { ...result.value, width: Infinity } }).ok).toBe(false)
  expect(validateLayout(input.value, { ...result, value: { ...result.value, nodes: result.value.nodes.slice(1) } }).ok).toBe(false)
})
