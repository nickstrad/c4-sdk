import { act, renderHook, waitFor, cleanup, render, fireEvent, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import fixture from '../../fixtures/navigation.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { fixedLayout } from '../../src/lib/c4/domain/layout'
import { useDiagramLayout } from '../../src/lib/c4/react/hooks/useDiagramLayout'
import type { LayoutPort, LayoutRequest, LayoutResponse } from '../../src/lib/c4/ports/layout'
import { useViewerSession } from '../../src/lib/c4/react/hooks/useViewerSession'
import { useDiagramMeasurements } from '../../src/lib/c4/react/hooks/useDiagramMeasurements'
const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
const scene = (id: string) => { const value = buildScene(decoded.value.index, id); if (!value.ok) throw new Error('fixture'); return value.value }
afterEach(cleanup)
it('generation/cancellation prevents stale and mismatched layout responses and cancels unmount', async () => {
  const pending: { request: LayoutRequest; resolve: (response: LayoutResponse) => void }[] = []
  const port: LayoutPort = { layout: request => new Promise(resolve => { pending.push({ request, resolve }) }) }
  const first = scene('context'); const second = scene('containers')
  const view = renderHook(({ input }) => useDiagramLayout(input, port), { initialProps: { input: first } })
  view.rerender({ input: second }); expect(pending[0].request.signal.aborted).toBe(true)
  act(() => { pending[0].resolve({ generation: pending[0].request.generation, result: fixedLayout(first) }) })
  expect(view.result.current).toMatchObject({ ok: false, diagnostics: [{ code: 'layout-pending' }] })
  act(() => { pending[1].resolve({ generation: 999, result: fixedLayout(first) }) })
  expect(view.result.current).toMatchObject({ ok: false, diagnostics: [{ code: 'layout-pending' }] })
  const third = scene('context'); view.rerender({ input: third })
  act(() => { pending[2].resolve({ generation: pending[2].request.generation, result: { ok: false, diagnostics: [{ code: 'layout', path: '$.layout', severity: 'error', message: 'Too large' }] } }) })
  await waitFor(() => expect(view.result.current.ok).toBe(false))
  view.unmount(); expect(pending[2].request.signal.aborted).toBe(true)
})
it('rejected layout promise reports a visible error without rejecting the route', async () => {
  const port: LayoutPort = { layout: async () => { throw new Error('Worker unavailable') } }
  const input = scene('containers')
  const view = renderHook(() => useDiagramLayout(input, port))
  await waitFor(() => expect(view.result.current).toMatchObject({ ok: false, diagnostics: [{ message: 'Worker unavailable' }] }))
})

it('a measurement snapshot cancels provisional work and wrong measurement revisions cannot publish', async () => {
  const pending: { request: LayoutRequest; resolve: (response: LayoutResponse) => void }[] = []
  const port: LayoutPort = { layout: request => new Promise(resolve => pending.push({ request, resolve })) }
  const input = scene('context')
  const measurements = { revision: 'settled', nodeSizes: {}, edgeLabelSizes: {} }
  const view = renderHook(({ measured }: { measured?: typeof measurements }) => useDiagramLayout(input, port, measured), { initialProps: { measured: undefined as typeof measurements | undefined } })
  view.rerender({ measured: measurements }); expect(pending[0].request.signal.aborted).toBe(true)
  act(() => pending[1].resolve({ generation: pending[1].request.generation, measurementRevision: 'wrong', result: fixedLayout(input) }))
  expect(view.result.current.ok).toBe(false)
  view.unmount(); expect(pending[1].request.signal.aborted).toBe(true)
})


it('navigation from an unfinished initial layout focuses the destination when ready', () => {
  function Viewer({ diagram, ready }: { diagram: string; ready: boolean }) {
    const session = useViewerSession({ architectureId: 'a', diagramId: diagram }, 'r1')
    return <div {...session.rootProps}><div {...(ready ? { 'data-layout-ready': true } : {})}><h1 data-diagram-heading tabIndex={-1}>{diagram}</h1></div></div>
  }
  const view = render(<Viewer diagram="context" ready={false} />)
  view.rerender(<Viewer diagram="containers" ready={false} />)
  expect(document.activeElement).not.toBe(view.getByRole('heading'))
  view.rerender(<Viewer diagram="containers" ready />)
  // Readiness is observed asynchronously just as it is after worker completion.
  return waitFor(() => expect(document.activeElement).toBe(view.getByRole('heading')))
})
it('host session survives keyed dataset replacement and isolates sibling hosts', async () => {
  const read = vi.fn()
  function Viewer({ dataset }: { dataset: string }) {
    const session = useViewerSession({ architectureId: dataset, diagramId: 'context' }, 'r1')
    return <div {...session.rootProps}><div data-layout-ready><h1 data-diagram-heading tabIndex={-1}>{dataset}</h1><button data-element-id="developer">Node {dataset}</button></div><button onClick={() => session.canvasSession.onViewport({ x: 12, y: 34, zoom: 0.7 })}>Save viewport</button><button onClick={() => read(session.canvasSession.getViewport())}>Read viewport</button><button onClick={session.canvasSession.onReady}>Ready</button></div>
  }
  const host = (dataset: string) => <><div className="c4-shell" data-testid="first"><Viewer key={dataset} dataset={dataset} /></div><div className="c4-shell" data-testid="second"><Viewer dataset="alpha" /></div></>
  const view = render(host('alpha'))
  const first = within(view.getByTestId('first')); const second = within(view.getByTestId('second'))
  fireEvent.click(first.getByText('Save viewport')); first.getByText('Node alpha').focus()
  view.rerender(host('beta')); fireEvent.click(first.getByText('Ready'))
  view.rerender(host('alpha')); fireEvent.click(first.getByText('Ready'))
  expect(document.activeElement).toBe(first.getByText('Node alpha'))
  fireEvent.click(first.getByText('Read viewport')); expect(read).toHaveBeenLastCalledWith({ x: 12, y: 34, zoom: 0.7 })
  fireEvent.click(second.getByText('Read viewport')); expect(read).toHaveBeenLastCalledWith(undefined)
})
it('natural-content measurement publishes once per immutable input and cleans up pending frames', async () => {
  const input = scene('context'); let frames: FrameRequestCallback[] = []
  let notify = () => {}; const disconnect = vi.fn()
  vi.stubGlobal('ResizeObserver', class { constructor(callback: () => void) { notify = callback } observe() {} disconnect = disconnect })
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.push(callback); return frames.length })
  const cancel = vi.fn(); vi.stubGlobal('cancelAnimationFrame', cancel)
  function Probe({ source }: { source: typeof input }) {
    const { ref, measurements } = useDiagramMeasurements(source)
    return <div ref={ref}><span data-measure-kind="node" data-measure-id="constructor" /><output>{measurements?.revision ?? 'pending'}</output></div>
  }
  const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(260)
  const height = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(201)
  const view = render(<Probe source={input} />)
  await act(async () => { await Promise.resolve() }); expect(frames).toHaveLength(1)
  act(() => frames[0](0)); expect(view.container.querySelector('output')!.textContent).toContain('constructor')
  view.rerender(<Probe source={input} />); expect(frames).toHaveLength(1)
  const original = view.container.querySelector('output')!.textContent
  act(() => { notify(); frames[1](0) }); expect(view.container.querySelector('output')!.textContent).toBe(original)
  height.mockReturnValue(301)
  act(() => { notify(); frames[2](0) }); expect(view.container.querySelector('output')!.textContent).toContain('301')
  view.unmount(); expect(cancel).toHaveBeenCalled(); expect(disconnect).toHaveBeenCalledOnce()
  notify(); expect(frames).toHaveLength(3)
  width.mockRestore(); height.mockRestore(); vi.unstubAllGlobals(); frames = []
})
