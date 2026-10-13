import { act, render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import fixture from '../../fixtures/navigation.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { ArchitectureViewer } from '../../src/lib/c4/react/containers/ArchitectureViewer'
import { formatRoute } from '../../src/lib/c4/domain/navigation'
import type { Route } from '../../src/lib/c4/domain/navigation'
import type { RoutePort } from '../../src/lib/c4/ports/route'
import { createHashRoutePort } from '../../src/lib/c4/adapters/router/hash'
const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
const architecture = decoded.value
function port() {
  let snapshot = { hash: formatRoute({ architectureId: fixture.id, diagramId: 'context' }), canGoBack: false }
  const listeners = new Set<() => void>(); const writes: Route[] = []
  const update = (route: Route) => { writes.push(route); snapshot = { hash: formatRoute(route), canGoBack: writes.length > 0 }; listeners.forEach(listener => listener()) }
  const fake: RoutePort = { getSnapshot: () => snapshot, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } }, push: update, replace: update, back: () => { snapshot = { hash: formatRoute({ architectureId: fixture.id, diagramId: 'context', elementId: 'developer' }), canGoBack: false }; listeners.forEach(listener => listener()) } }
  return { fake, writes, listeners }
}
afterEach(cleanup)
it('shared controller follows route-port changes, restores parent focus and unsubscribes', async () => {
  const { fake, writes, listeners } = port()
  const view = render(<ArchitectureViewer validatedBundle={architecture} routePort={fake} />)
  act(() => { screen.getByRole('link', { name: 'Open detail for Continuity' }).click() })
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Continuity: logical containers', level: 1 })).toBeTruthy())
  act(() => { screen.getByRole('link', { name: 'Up' }).click() })
  await waitFor(() => expect(screen.getByRole('link', { name: 'Open detail for Continuity' })).toBe(document.activeElement))
  expect(writes.at(-1)).toEqual({ architectureId: fixture.id, diagramId: 'context', elementId: 'continuity' })
  act(() => { screen.getByRole('button', { name: 'Back' }).click() })
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Git developer' })).toBeTruthy())
  view.unmount(); expect(listeners.size).toBe(0)
})
it('hash adapter restores same-tab viewer Back availability on recreation and never claims foreign history', () => {
  window.history.replaceState(null, '', '#')
  const first = createHashRoutePort(window)
  first.replace({ architectureId: fixture.id, diagramId: 'context' })
  first.push({ architectureId: fixture.id, diagramId: 'containers' })
  expect(first.getSnapshot().canGoBack).toBe(true)
  const recreated = createHashRoutePort(window)
  expect(recreated.getSnapshot()).toEqual(first.getSnapshot())
  window.history.replaceState({ foreign: true }, '', '#/architectures/other/diagrams/context')
  expect(createHashRoutePort(window).getSnapshot().canGoBack).toBe(false)
})
it('documentation slot is props-only and route selection cannot leak between bundle revisions', () => {
  const { fake } = port()
  const slot = (props: any) => <aside>{props.selection.title}:{props.mode}</aside>
  const view = render(<ArchitectureViewer validatedBundle={architecture} routePort={fake} documentationSlot={slot} />)
  act(() => { screen.getByRole('button', { name: 'Inspect Git developer' }).click() })
  expect(screen.getByText('Git developer:plain')).toBeTruthy()
  const other = decodeArchitecture({ ...fixture, id: 'other', revision: 'new' }); if (!other.ok) throw new Error('fixture')
  view.rerender(<ArchitectureViewer validatedBundle={other.value} routePort={fake} documentationSlot={slot} />)
  expect(screen.getByText('Continuity and its collaborators:plain')).toBeTruthy()
})
it('destination hrefs preserve native modified clicks and use the route port for ordinary activation', () => {
  const { fake, writes } = port()
  render(<ArchitectureViewer validatedBundle={architecture} routePort={fake} />)
  const detail = screen.getByRole('link', { name: 'Open detail for Continuity' })
  expect(detail.getAttribute('href')).toBe(formatRoute({ architectureId: fixture.id, diagramId: 'containers' }))
  fireEvent.click(detail, { ctrlKey: true }); fireEvent.click(detail, { metaKey: true }); fireEvent.click(detail, { shiftKey: true }); fireEvent.click(detail, { button: 1 })
  expect(writes).toEqual([])
  fireEvent.click(detail)
  expect(writes).toEqual([{ architectureId: fixture.id, diagramId: 'containers' }])
  const up = screen.getByRole('link', { name: 'Up' })
  expect(up.getAttribute('href')).toBe(formatRoute({ architectureId: fixture.id, diagramId: 'context', elementId: 'continuity' }))
  const current = screen.getByRole('link', { name: 'Continuity: logical containers' })
  expect(current.getAttribute('aria-current')).toBe('page')
})
