import { expect, it, vi } from 'vitest'
import fixture from '../../fixtures/context.json'
import { architectureJsonSchema, decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { fixedLayout, validateLayout } from '../../src/lib/c4/domain/layout'
import { frameBounds, initialViewport, sceneBounds } from '../../src/lib/c4/domain/viewport'
import { createElkLayoutPort } from '../../src/lib/c4/adapters/layout/client'
import { createFetchLoader, readBoundedJson } from '../../src/lib/c4/adapters/loaders/fetch'
const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
const projected = buildScene(decoded.value.index, 'context'); if (!projected.ok) throw new Error('projection')
const layout = fixedLayout(projected.value); if (!layout.ok) throw new Error('layout')
it('initial framing keeps a readable first card and Fit includes edges beyond nodes', () => {
  const scene = { ...layout.value, nodes: layout.value.nodes.map((node, i) => ({ ...node, x: 2000 + i * 2000 })) }
  const viewport = initialViewport(scene, 360, 520); const first = scene.nodes[0]
  expect(viewport.zoom).toBeGreaterThanOrEqual(0.75)
  expect(viewport.x + first.x * viewport.zoom).toBeGreaterThanOrEqual(0)
  expect(viewport.x + (first.x + first.width) * viewport.zoom).toBeLessThanOrEqual(360)
  const outside = { x: -500, y: -200, width: 250, height: 100 }
  expect(sceneBounds({ ...scene, edges: [{ ...scene.edges[0], labelBounds: outside }] }).x).toBe(-500)
  expect(frameBounds({ x: -500, y: -200, width: 300, height: 200 }, 360, 520)).toEqual({ x: 530, y: 360, zoom: 1 })
})
it('host ceilings reject items before schema/scene publication and never raise global bounds', () => {
  expect(decodeArchitecture(fixture, { maxElements: 3 }).ok).toBe(true)
  for (const [limits, path] of [[{ maxElements: 2 }, '$.model.elements'], [{ maxRelationships: 1 }, '$.model.relationships'], [{ maxJsonDepth: 1 }, '$']] as const) {
    expect(decodeArchitecture(fixture, limits)).toMatchObject({ ok: false, diagnostics: [{ code: 'resource-limit', path }] })
  }
  for (const value of [0, -1, Infinity, NaN, 1.5, 5001]) expect(decodeArchitecture(fixture, { maxElements: value })).toMatchObject({ ok: false, diagnostics: [{ path: '$.limits' }] })
  const cycle: Record<string, unknown> = {}; cycle.self = cycle
  expect(decodeArchitecture(cycle).ok).toBe(false)
  expect(architectureJsonSchema).toMatchObject({ type: 'object', additionalProperties: false })
})
it('configured loader enforces streamed byte and decoder ceilings, with explicit invalid configuration', async () => {
  const signal = new AbortController().signal
  const fetcher = async () => new Response(JSON.stringify(fixture))
  const loader = createFetchLoader(fetcher, { maxBundleBytes: 10 })
  await expect(loader.loadBundle('https://example.test/bundle.json', signal)).rejects.toThrow('10-byte limit')
  expect(await createFetchLoader(fetcher, { decode: { maxElements: 2 } }).loadBundle('https://example.test/bundle.json', signal)).toMatchObject({ ok: false, diagnostics: [{ code: 'resource-limit' }] })
  for (const value of [0, -1, Infinity, NaN, 1.5, 5242881]) {
    expect(() => createFetchLoader(fetcher, { maxBundleBytes: value })).toThrow('maxBundleBytes')
    await expect(readBoundedJson(new Response('{}'), value)).rejects.toThrow('maxBytes')
  }
})
it('layout ceilings apply before manual or worker execution and invalid options cannot disable bounds', async () => {
  const factory = vi.fn(() => { throw new Error('must not start') })
  const response = await createElkLayoutPort(factory, { maxNodes: 2 }).layout({ scene: projected.value, signal: new AbortController().signal, generation: 1 })
  expect(response.result).toMatchObject({ ok: false, diagnostics: [{ message: expect.stringContaining('2 nodes') }] })
  expect(factory).not.toHaveBeenCalled()
  expect(() => createElkLayoutPort(factory, { cacheEntries: 25 })).toThrow('cacheEntries')
})

it('finite but excessive geometry is rejected at the adapter publication boundary', () => {
  expect(validateLayout(projected.value, { ...layout, value: { ...layout.value, width: 10_000_001 } }).ok).toBe(false)
  expect(validateLayout(projected.value, layout, { maxExtent: 100 }).ok).toBe(false)
  const edge = layout.value.edges[0]
  const section = { startPoint: { x: edge.x1, y: edge.y1 }, endPoint: { x: edge.x2, y: edge.y2 } }
  expect(validateLayout(projected.value, { ...layout, value: { ...layout.value, edges: [{ ...edge, sections: Array(100_001).fill(section) }, ...layout.value.edges.slice(1)] } }).ok).toBe(false)
  expect(validateLayout(projected.value, layout, { maxCoordinate: Infinity })).toMatchObject({ ok: false, diagnostics: [{ path: '$.layout.limits' }] })
})

it('advertised oversized streams are cancelled before reading', async () => {
  let cancelled = false
  const stream = new ReadableStream({ cancel() { cancelled = true } })
  await expect(readBoundedJson(new Response(stream, { headers: { 'content-length': '100' } }), 10)).rejects.toThrow('10-byte limit')
  expect(cancelled).toBe(true)
})
