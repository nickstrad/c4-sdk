import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import fixture from '../../fixtures/navigation.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { formatRoute } from '../../src/lib/c4/domain/navigation'
import type { Route } from '../../src/lib/c4/domain/navigation'
import type { Result, ValidatedArchitecture } from '../../src/lib/c4/domain/model'
import type { ArchitectureLoader } from '../../src/lib/c4/ports/loader'
import type { RoutePort, RouteSnapshot } from '../../src/lib/c4/ports/route'
import { useCatalogViewer } from '../../src/lib/c4/react/hooks/useCatalogViewer'
afterEach(cleanup)
function bundle(id: string, defaultId: string) {
  const input = structuredClone(fixture)
  input.id = id; input.defaultDiagramId = defaultId
  input.diagrams[1].id = defaultId; input.diagrams[0].nodes[1] = { ...input.diagrams[0].nodes[1], detail: { diagramId: defaultId } }
  const result = decodeArchitecture(input); if (!result.ok) throw new Error(JSON.stringify(result.diagnostics))
  return result
}
function history(initial: Route) {
  const entries = [initial]; let cursor = 0
  const writes: Route[] = []; const listeners = new Set<() => void>()
  let snapshot: RouteSnapshot = { hash: formatRoute(initial), canGoBack: false }
  const emit = () => { snapshot = { hash: formatRoute(entries[cursor]), canGoBack: cursor > 0 }; listeners.forEach(listener => listener()) }
  const port: RoutePort = {
    getSnapshot: () => snapshot, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    push: route => { entries.splice(cursor + 1); entries.push(route); cursor++; writes.push(route); emit() },
    replace: route => { entries[cursor] = route; emit() }, back: () => { if (cursor > 0) { cursor--; emit() } },
  }
  return { port, writes, forward: () => { if (cursor + 1 < entries.length) { cursor++; emit() } } }
}
function harness() {
  const requests: { url: string; signal: AbortSignal; resolve: (value: Result<ValidatedArchitecture>) => void }[] = []
  const catalogs: string[] = []
  const loader: ArchitectureLoader = {
    loadCatalog: async url => { catalogs.push(url); return { entries: [{ id: 'alpha', title: 'Alpha', url: 'alpha.json' }, { id: 'beta', title: 'Beta', url: 'beta.json' }, { id: 'invalid', title: 'Invalid', url: 'invalid.json' }] } },
    loadBundle: (url, signal) => new Promise(resolve => requests.push({ url, signal, resolve })),
  }
  return { loader, requests, catalogs }
}
it.each(['catalog-one.json', 'nested/catalog-two.json'])('waits for declared non-context defaults and preserves failed replacement/history in %s', async catalogUrl => {
  const { loader, requests, catalogs } = harness()
  const navigation = history({ architectureId: 'alpha', diagramId: 'alpha-detail', elementId: 'server' })
  const hook = renderHook(() => useCatalogViewer(catalogUrl, loader, navigation.port))
  await waitFor(() => expect(requests).toHaveLength(1))
  await act(async () => requests[0].resolve(bundle('alpha', 'alpha-detail')))
  const before = navigation.port.getSnapshot().hash
  act(() => hook.result.current.onResourceSelect('beta.json'))
  await waitFor(() => expect(requests).toHaveLength(2))
  expect(navigation.port.getSnapshot().hash).toBe(before)
  expect(navigation.writes).toEqual([])
  expect(hook.result.current.architecture?.bundle.id).toBe('alpha')
  await act(async () => requests[1].resolve(bundle('beta', 'beta-detail')))
  await waitFor(() => expect(navigation.port.getSnapshot().hash).toBe(formatRoute({ architectureId: 'beta', diagramId: 'beta-detail' })))
  expect(navigation.writes).toEqual([{ architectureId: 'beta', diagramId: 'beta-detail' }])
  expect(requests).toHaveLength(2)
  act(() => hook.result.current.onResourceSelect('invalid.json'))
  await waitFor(() => expect(requests).toHaveLength(3))
  await act(async () => requests[2].resolve({ ok: false, diagnostics: [{ code: 'invalid', path: '$', severity: 'error', message: 'Rejected replacement' }] }))
  expect(hook.result.current.architecture?.bundle.id).toBe('beta')
  expect(navigation.port.getSnapshot().hash).toBe(formatRoute({ architectureId: 'beta', diagramId: 'beta-detail' }))
  expect(navigation.writes).toHaveLength(1)
  act(() => navigation.port.back())
  await waitFor(() => expect(requests).toHaveLength(4))
  await act(async () => requests[3].resolve(bundle('alpha', 'alpha-detail')))
  expect(navigation.port.getSnapshot().hash).toBe(before)
  expect(hook.result.current.architecture?.bundle.id).toBe('alpha')
  act(() => navigation.forward())
  await waitFor(() => expect(requests).toHaveLength(5))
  expect(requests[4].url).toBe('beta.json')
  await act(async () => requests[4].resolve(bundle('beta', 'beta-detail')))
  expect(navigation.port.getSnapshot().hash).toBe(formatRoute({ architectureId: 'beta', diagramId: 'beta-detail' }))
  expect(hook.result.current.architecture?.bundle.id).toBe('beta')
  expect(catalogs).toEqual([catalogUrl])
})
it('a route change cancels a pending menu choice, and identity mismatch rejects the replacement', async () => {
  const { loader, requests } = harness()
  const navigation = history({ architectureId: 'alpha', diagramId: 'alpha-detail' })
  const hook = renderHook(() => useCatalogViewer('catalog.json', loader, navigation.port))
  await waitFor(() => expect(requests).toHaveLength(1)); await act(async () => requests[0].resolve(bundle('alpha', 'alpha-detail')))
  act(() => hook.result.current.onResourceSelect('beta.json')); await waitFor(() => expect(requests).toHaveLength(2))
  act(() => navigation.port.push({ architectureId: 'alpha', diagramId: 'context', elementId: 'developer' }))
  await waitFor(() => expect(requests[1].signal.aborted).toBe(true))
  await act(async () => requests[1].resolve(bundle('beta', 'beta-detail')))
  expect(navigation.port.getSnapshot().hash).toContain('/context/elements/developer')
  await act(async () => requests[2].resolve(bundle('alpha', 'alpha-detail')))
  act(() => hook.result.current.onResourceSelect('beta.json')); await waitFor(() => expect(requests).toHaveLength(4))
  await act(async () => requests[3].resolve(bundle('wrong-id', 'other-default')))
  expect(hook.result.current.architecture?.bundle.id).toBe('alpha')
  expect(hook.result.current.diagnostics[0].code).toBe('catalog-identity')
  expect(navigation.port.getSnapshot().hash).toContain('/context/elements/developer')
})
