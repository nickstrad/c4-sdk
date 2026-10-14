import { expect, it } from 'vitest'
import fc from 'fast-check'
import fixture from '../../fixtures/context.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { frameBounds } from '../../src/lib/c4/domain/viewport'
const options = { seed: 4102026, numRuns: 200 }
it('framing finite supported bounds centers the entire card within a usable canvas', () => {
  fc.assert(fc.property(fc.record({ x: fc.integer({ min: -100000, max: 100000 }), y: fc.integer({ min: -100000, max: 100000 }), width: fc.integer({ min: 50, max: 500 }), height: fc.integer({ min: 50, max: 500 }) }), fc.integer({ min: 200, max: 1600 }), fc.integer({ min: 200, max: 1000 }), (bounds, width, height) => {
    const v = frameBounds(bounds, width, height)
    expect([v.x, v.y, v.zoom].every(Number.isFinite)).toBe(true)
    expect(v.zoom).toBeGreaterThanOrEqual(0.02); expect(v.zoom).toBeLessThanOrEqual(1)
    expect(v.x + bounds.x * v.zoom).toBeGreaterThanOrEqual(0)
    expect(v.y + bounds.y * v.zoom).toBeGreaterThanOrEqual(0)
    expect(v.x + (bounds.x + bounds.width) * v.zoom).toBeLessThanOrEqual(width + 1e-8)
    expect(v.y + (bounds.y + bounds.height) * v.zoom).toBeLessThanOrEqual(height + 1e-8)
  }), options)
})
it('host count ceilings preserve input and are monotonic within the supported envelope', () => {
  fc.assert(fc.property(fc.integer({ min: 1, max: 10 }), maximum => {
    const before = structuredClone(fixture)
    const result = decodeArchitecture(fixture, { maxElements: maximum })
    expect(result.ok).toBe(maximum >= fixture.model.elements.length)
    expect(fixture).toEqual(before)
  }), options)
})
it('published extent ceilings reject finite scenes above the host budget monotonically', async () => {
  const { buildScene } = await import('../../src/lib/c4/domain/scene')
  const { fixedLayout, validateLayout } = await import('../../src/lib/c4/domain/layout')
  const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
  const input = buildScene(decoded.value.index, 'context'); if (!input.ok) throw new Error('scene')
  const scene = fixedLayout(input.value); if (!scene.ok) throw new Error('layout')
  const required = Math.max(scene.value.width, scene.value.height)
  fc.assert(fc.property(fc.integer({ min: 1, max: 2000 }), maximum => {
    expect(validateLayout(input.value, scene, { maxExtent: maximum }).ok).toBe(maximum >= required)
  }), options)
})
