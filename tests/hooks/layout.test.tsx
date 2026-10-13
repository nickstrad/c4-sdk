import { act, renderHook, waitFor, cleanup } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import fixture from '../../fixtures/navigation.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { fixedLayout } from '../../src/lib/c4/domain/layout'
import { useDiagramLayout } from '../../src/lib/c4/react/hooks/useDiagramLayout'
import type { LayoutPort, LayoutRequest, LayoutResponse } from '../../src/lib/c4/ports/layout'
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
  expect(view.result.current).toMatchObject({ ok: true, value: { diagram: { id: 'containers' } } })
  act(() => { pending[1].resolve({ generation: 999, result: fixedLayout(first) }) })
  expect(view.result.current).toMatchObject({ ok: true, value: { diagram: { id: 'containers' } } })
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
