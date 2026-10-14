import { afterEach, expect, it, vi } from 'vitest'
import ELK from 'elkjs/lib/elk.bundled.js'
import fixture from '../../fixtures/layout.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { validateLayout } from '../../src/lib/c4/domain/layout'
import { elkInput, layoutCacheKey } from '../../src/lib/c4/adapters/layout/elk-input'
import { elkOutput, attachGeometry, relativeGeometry } from '../../src/lib/c4/adapters/layout/elk-output'
import { createElkLayoutPort } from '../../src/lib/c4/adapters/layout/client'
import type { LayoutWorker } from '../../src/lib/c4/adapters/layout/client'
const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error(JSON.stringify(decoded.diagnostics))
const projected = buildScene(decoded.value.index, 'context'); if (!projected.ok) throw new Error('fixture')
const input = projected.value
const engine = new ELK()
afterEach(() => vi.useRealTimers())
it('real pinned ELK preserves nested absolute geometry, cross-boundary routing and model reference identity', async () => {
  const graph = elkInput(input); const result = attachGeometry(input, elkOutput(await engine.layout(graph)))
  expect(result.ok, JSON.stringify(result.diagnostics)).toBe(true)
  if (!result.ok) return
  expect(result.value.groups?.map(g => g.group)).toEqual(input.groups)
  result.value.nodes.forEach((node, i) => expect(node.element).toBe(input.nodes[i].element))
  const parent = result.value.groups!.find(g => g.group.id === 'inner')!
  const child = result.value.nodes.find(n => n.element.id === 'developer')!
  expect(child.x).toBeGreaterThanOrEqual(parent.x); expect(child.y).toBeGreaterThanOrEqual(parent.y)
  const relative = relativeGeometry(result.value)
  expect(relative.groups.map(g => g.id)).toEqual(['group:continuity', 'group:inner'])
  expect(relative.nodes[0].position).toEqual({ x: child.x - parent.x, y: child.y - parent.y })
  expect(result.value.edges[0].source).toBe(result.value.nodes[0]); expect(result.value.edges[0].number).toBe(1)
  for (const edge of result.value.edges) {
    for (const [point, node] of [[{ x: edge.x1, y: edge.y1 }, edge.source], [{ x: edge.x2, y: edge.y2 }, edge.target]] as const) {
      expect(point.x).toBeGreaterThanOrEqual(node.x); expect(point.x).toBeLessThanOrEqual(node.x + node.width)
      expect(point.y).toBeGreaterThanOrEqual(node.y); expect(point.y).toBeLessThanOrEqual(node.y + node.height)
    }
  }
  expect(validateLayout(input, { ...result, value: { ...result.value, groups: result.value.groups!.map(g => ({ ...g, width: 1 })) } }).ok).toBe(false)
})
it('cache identity includes dataset, revision, hierarchy, labels, settings and measured dimensions', () => {
  const first = layoutCacheKey(input)
  for (const modified of [{ ...input, architectureId: 'other' }, { ...input, revision: 'next' }, { ...input, diagram: { ...input.diagram, layout: { mode: 'auto' as const, direction: 'TB' as const } } }, { ...input, groups: input.groups.map(g => ({ ...g, label: 'changed' })) }]) expect(layoutCacheKey(modified)).not.toBe(first)
  expect(layoutCacheKey(input, { revision: '1', nodeSizes: { developer: { width: 333, height: 222 } }, edgeLabelSizes: {} })).not.toBe(first)
})
class FakeWorker implements LayoutWorker {
  onmessage: LayoutWorker['onmessage'] = null; onerror: LayoutWorker['onerror'] = null; onmessageerror: LayoutWorker['onmessageerror'] = null
  layoutId = -1
  terminate = vi.fn()
  postMessage = vi.fn((message: { cmd: string; id: number }) => {
    if (message.cmd === 'register') this.onmessage?.({ data: { id: message.id, data: true } } as MessageEvent)
    else if (message.cmd === 'layout') this.layoutId = message.id
  })
  complete(graph: unknown) { this.onmessage?.({ data: { id: this.layoutId, data: graph } } as MessageEvent) }
}
it('timeout and cancellation terminate CPU workers, remove handlers, and replacement starts clean', async () => {
  vi.useFakeTimers(); const workers: FakeWorker[] = []
  const port = createElkLayoutPort(() => { const worker = new FakeWorker(); workers.push(worker); return worker })
  const controller = new AbortController()
  const request = { scene: input, generation: 1, signal: controller.signal, timeoutMs: 20 }
  const pending = port.layout(request); await vi.advanceTimersByTimeAsync(20)
  expect((await pending).result.ok).toBe(false); expect(workers[0].terminate).toHaveBeenCalledOnce(); expect(workers[0].onmessage).toBeNull()
  const second = port.layout({ ...request, generation: 2 }); controller.abort()
  expect((await second).generation).toBe(2); expect(workers[1].terminate).toHaveBeenCalledOnce()
  expect(workers[1].onerror).toBeNull(); await vi.runOnlyPendingTimersAsync(); expect(vi.getTimerCount()).toBe(0)
  const aborted = await port.layout(request); expect(aborted.result.ok).toBe(false); expect(workers).toHaveLength(2)
})
it('success terminates, caches geometry only and reattaches another validated input; malformed output is diagnosed', async () => {
  const graph = await engine.layout(elkInput(input))
  const workers: FakeWorker[] = []; const port = createElkLayoutPort(() => { const worker = new FakeWorker(); workers.push(worker); return worker })
  const request = { scene: input, generation: 1, signal: new AbortController().signal }
  const first = port.layout(request); workers[0].complete(graph)
  expect((await first).result.ok).toBe(true); expect(workers[0].terminate).toHaveBeenCalledOnce()
  const clone = structuredClone(input); const cached = await port.layout({ ...request, scene: clone })
  expect(workers).toHaveLength(1); if (cached.result.ok) expect(cached.result.value.nodes[0].element).toBe(clone.nodes[0].element)
  const bad = port.layout({ ...request, scene: { ...input, revision: 'new' } }); workers[1].complete({})
  expect((await bad).result.ok).toBe(false)
})
it('invalid timeout and factory failures are recoverable diagnostics', async () => {
  const factory = vi.fn(() => { throw new Error('worker creation blocked') }); const port = createElkLayoutPort(factory)
  const request = { scene: input, generation: 1, signal: new AbortController().signal }
  for (const timeoutMs of [0, -1, Infinity, NaN, 2147483648]) expect((await port.layout({ ...request, timeoutMs })).result.ok).toBe(false)
  expect(factory).not.toHaveBeenCalled()
  expect((await port.layout(request)).result).toMatchObject({ ok: false, diagnostics: [{ message: 'worker creation blocked' }] })
})

it('manual compound layout keeps authored node positions and encloses descendants without invoking a worker', async () => {
  const manual = { ...input, diagram: { ...input.diagram, layout: { mode: 'manual' as const, direction: 'LR' as const }, nodes: input.diagram.nodes.map((node, i) => ({ ...node, position: { x: 200 + i * 700, y: 300 } })) } }
  const factory = vi.fn(() => new FakeWorker())
  const response = await createElkLayoutPort(factory).layout({ scene: manual, generation: 1, signal: new AbortController().signal })
  expect(response.result.ok, JSON.stringify(response.result.diagnostics)).toBe(true)
  if (response.result.ok) expect(response.result.value.nodes.map(node => [node.x, node.y])).toEqual([[200, 300], [900, 300], [1600, 300]])
  expect(factory).not.toHaveBeenCalled()
})

it('rejects duplicate, extra, unknown and excessive worker geometry before publication', async () => {
  const geometry = elkOutput(await engine.layout(elkInput(input)))
  const cases = [
    { ...geometry, nodes: [...geometry.nodes, geometry.nodes[0]] },
    { ...geometry, nodes: geometry.nodes.map((node, i) => i === 1 ? geometry.nodes[0] : node) },
    { ...geometry, nodes: geometry.nodes.map((node, i) => i ? node : { ...node, id: 'unknown' }) },
    { ...geometry, edges: [...geometry.edges, geometry.edges[0]] },
    { ...geometry, edges: geometry.edges.map((edge, i) => i ? edge : { ...edge, sections: Array(10000).fill(edge.sections[0]) }) },
  ]
  for (const invalid of cases) expect(attachGeometry(input, invalid).ok).toBe(false)
})
it('manual origin and negative positions remain exact; distant independent groups stay local and edge labels use measured heights', async () => {
  const nodes = input.nodes.map(node => ({ ...node, parentGroupId: node.element.id }))
  const groups = nodes.map(node => ({ id: node.element.id, label: 'Local group', memberIds: [node.element.id], status: 'existing' as const }))
  const manual = { ...input, nodes, groups, diagram: { ...input.diagram, groups, layout: { mode: 'manual' as const, direction: 'LR' as const }, nodes: input.diagram.nodes.map((node, i) => ({ ...node, position: { x: [-600, 0, 2000][i], y: [-400, 0, 2000][i] } })) } }
  const response = await createElkLayoutPort(() => new FakeWorker()).layout({ scene: manual, generation: 1, signal: new AbortController().signal, measurements: { revision: 'tall', nodeSizes: {}, edgeLabelSizes: { git: { width: 240, height: 250 } } } })
  expect(response.result.ok).toBe(true); if (!response.result.ok) return
  expect(response.result.value.nodes.map(node => [node.x, node.y])).toEqual([[-600, -400], [0, 0], [2000, 2000]])
  expect(response.result.value.groups![2].x).toBe(1968)
  expect(response.result.value.groups![0].x + response.result.value.groups![0].width).toBeLessThan(response.result.value.groups![1].x)
  expect(response.result.value.edges[0].labelBounds?.height).toBe(250)
})

it('parallel manual relationships have disjoint measured labels without moving authored nodes', async () => {
  const edges = Array.from({ length: 4 }, (_, i) => ({ ...input.edges[0], relationship: { ...input.edges[0].relationship, id: `parallel-${i}` }, number: i + 1 }))
  const manual = { ...input, edges, diagram: { ...input.diagram, edges: edges.map(edge => ({ relationshipId: edge.relationship.id })), layout: { mode: 'manual' as const, direction: 'LR' as const }, nodes: input.diagram.nodes.map((node, i) => ({ ...node, position: { x: i * 600, y: 0 } })) } }
  const response = await createElkLayoutPort().layout({ scene: manual, generation: 1, signal: new AbortController().signal, measurements: { revision: 'parallel', nodeSizes: {}, edgeLabelSizes: Object.fromEntries(edges.map(edge => [edge.relationship.id, { width: 350, height: 180 }])) } })
  expect(response.result.ok, JSON.stringify(response.result.diagnostics)).toBe(true); if (!response.result.ok) return
  const scene = response.result.value
  expect(scene.nodes.map(node => [node.x, node.y])).toEqual([[0, 0], [600, 0], [1200, 0]])
  scene.edges.forEach((edge, i) => {
    expect(edge.relationship).toBe(edges[i].relationship)
    const a = edge.labelBounds!
    for (const b of [...scene.nodes, ...scene.groups!.map(group => group.labelBounds!), ...scene.edges.slice(0, i).map(other => other.labelBounds!)]) expect(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y).toBe(true)
  })
})

it('worker execution and message errors terminate, clear handlers and detach abort listeners', async () => {
  for (const kind of ['error', 'messageerror'] as const) {
    const worker = new FakeWorker(); const controller = new AbortController()
    const remove = vi.spyOn(controller.signal, 'removeEventListener')
    const pending = createElkLayoutPort(() => worker).layout({ scene: input, signal: controller.signal, generation: 1 })
    if (kind === 'error') worker.onerror?.({ message: 'engine crash' } as ErrorEvent)
    else worker.onmessageerror?.({} as MessageEvent)
    expect((await pending).result.ok).toBe(false)
    expect(worker.terminate).toHaveBeenCalledOnce(); expect(worker.onmessage).toBeNull(); expect(worker.onerror).toBeNull(); expect(worker.onmessageerror).toBeNull()
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function))
  }
})
it('configured geometry cache evicts old entries and failed results never enter it', async () => {
  const graph = await engine.layout(elkInput(input))
  const workers: FakeWorker[] = []
  const port = createElkLayoutPort(() => { const worker = new FakeWorker(); workers.push(worker); return worker }, { cacheEntries: 2 })
  const run = (revision: string) => port.layout({ scene: { ...input, revision }, generation: 1, signal: new AbortController().signal })
  for (const revision of ['a', 'b', 'c']) { const pending = run(revision); workers.at(-1)!.complete(graph); expect((await pending).result.ok).toBe(true) }
  await run('b'); expect(workers).toHaveLength(3)
  const evicted = run('a'); expect(workers).toHaveLength(4); workers.at(-1)!.complete({}); expect((await evicted).result.ok).toBe(false)
  const retry = run('a'); expect(workers).toHaveLength(5); workers.at(-1)!.complete(graph); expect((await retry).result.ok).toBe(true)
})

it('total routing budget rejects many individually bounded sections', async () => {
  const geometry = elkOutput(await engine.layout(elkInput(input)))
  const source = { ...input, edges: Array.from({ length: 400 }, (_, i) => ({ ...input.edges[0], relationship: { ...input.edges[0].relationship, id: `many${i}` } })) }
  const section = { startPoint: { x: 1, y: 1 }, endPoint: { x: 2, y: 2 }, bendPoints: Array.from({ length: 18 }, () => ({ x: 1, y: 1 })) }
  const many = { ...geometry, edges: source.edges.map(edge => ({ id: `edge:${edge.relationship.id}`, sections: Array.from({ length: 18 }, () => section) })) }
  expect(attachGeometry(source, many)).toMatchObject({ ok: false })
})
