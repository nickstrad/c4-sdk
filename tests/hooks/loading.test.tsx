import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import fixture from '../../fixtures/context.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { useArchitectureBundle } from '../../src/lib/c4/react/hooks/useArchitectureBundle'
import type { ArchitectureLoader } from '../../src/lib/c4/ports/loader'
import type { Result, ValidatedArchitecture } from '../../src/lib/c4/domain/model'
afterEach(cleanup)
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done }); return { promise, resolve } }
function harness() {
  const requests: { url: string; signal: AbortSignal; resolve: (value: Result<ValidatedArchitecture>) => void }[] = []
  const loader: ArchitectureLoader = { loadCatalog: async () => ({ entries: [{ id: 'a', title: 'A', url: 'a.json' }, { id: 'b', title: 'B', url: 'b.json' }] }), loadBundle: (url, signal) => { const request = deferred<Result<ValidatedArchitecture>>(); requests.push({ url, signal, resolve: request.resolve }); return request.promise } }
  return { loader, requests }
}
it('retains the whole last valid architecture when a replacement fails', async () => {
  const { loader, requests } = harness(); const hook = renderHook(() => useArchitectureBundle(loader, 'catalog.json'))
  await waitFor(() => expect(requests).toHaveLength(1))
  const valid = decodeArchitecture(fixture); if (!valid.ok) throw new Error('Invalid fixture')
  await act(async () => requests[0].resolve(valid)); expect(hook.result.current.architecture).toBe(valid.value)
  act(() => hook.result.current.onResourceSelect('b.json')); await waitFor(() => expect(requests).toHaveLength(2))
  expect(requests[0].signal.aborted).toBe(true)
  await act(async () => requests[1].resolve({ ok: false, diagnostics: [{ code: 'invalid', path: '$', severity: 'error', message: 'Bad input' }] }))
  expect(hook.result.current.architecture).toBe(valid.value); expect(hook.result.current.diagnostics[0].message).toBe('Bad input'); expect(hook.result.current.pending).toBe(false)
})
it('ignores stale completions and aborts requests on unmount', async () => {
  const { loader, requests } = harness(); const hook = renderHook(() => useArchitectureBundle(loader, 'catalog.json'))
  await waitFor(() => expect(requests).toHaveLength(1)); act(() => hook.result.current.onResourceSelect('b.json')); await waitFor(() => expect(requests).toHaveLength(2))
  const newer = decodeArchitecture({ ...fixture, title: 'Newer dataset' }); const old = decodeArchitecture(fixture)
  if (!newer.ok || !old.ok) throw new Error('Invalid fixtures')
  await act(async () => requests[1].resolve(newer)); await act(async () => requests[0].resolve(old))
  expect(hook.result.current.architecture).toBe(newer.value)
  hook.unmount(); expect(requests[1].signal.aborted).toBe(true)
})

it('catalog changes cancel pending old bundles and ignore old completions', async () => {
  const catalogs: { url: string; signal: AbortSignal; resolve: (catalog: { entries: { id: string; title: string; url: string }[] }) => void }[] = []
  const bundles: { url: string; signal: AbortSignal; resolve: (value: Result<ValidatedArchitecture>) => void }[] = []
  const loader: ArchitectureLoader = { loadCatalog: (url, signal) => { const d = deferred<{ entries: { id: string; title: string; url: string }[] }>(); catalogs.push({ url, signal, resolve: d.resolve }); return d.promise }, loadBundle: (url, signal) => { const d = deferred<Result<ValidatedArchitecture>>(); bundles.push({ url, signal, resolve: d.resolve }); return d.promise } }
  const hook = renderHook(({ url }) => useArchitectureBundle(loader, url), { initialProps: { url: 'old/catalog.json' } })
  await act(async () => catalogs[0].resolve({ entries: [{ id: 'old', title: 'Old', url: 'old.json' }] }))
  await waitFor(() => expect(bundles).toHaveLength(1))
  hook.rerender({ url: 'new/catalog.json' }); expect(bundles[0].signal.aborted).toBe(true)
  await act(async () => bundles[0].resolve(decodeArchitecture(fixture)))
  expect(hook.result.current.architecture).toBeUndefined(); expect(hook.result.current.catalog).toBeUndefined()
  await act(async () => catalogs[1].resolve({ entries: [{ id: 'new', title: 'New', url: 'new.json' }] }))
  await waitFor(() => expect(bundles).toHaveLength(2)); expect(bundles[1].url).toBe('new.json')
  await act(async () => bundles[1].resolve(decodeArchitecture({ ...fixture, title: 'New catalog dataset' })))
  expect(hook.result.current.architecture?.bundle.title).toBe('New catalog dataset')
})
