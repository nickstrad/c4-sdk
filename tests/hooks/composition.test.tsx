import { readFileSync } from 'node:fs'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fixture from '../../fixtures/seven-types.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { CodeDiagram, ComponentDiagram, ContainerDiagram, DeploymentDiagram, DynamicDiagram, SystemContext, SystemLandscape, ArchitectureViewer, ArchitectureProvider, DiagramView, useViewerController } from '../../src/lib/c4'
import type { NamedDiagramProps } from '../../src/lib/c4'
import { formatRoute } from '../../src/lib/c4/domain/navigation'
import type { Route } from '../../src/lib/c4/domain/navigation'
import type { RoutePort } from '../../src/lib/c4/ports/route'
import { fixedLayout } from '../../src/lib/c4/domain/layout'
import type { LayoutPort } from '../../src/lib/c4/ports/layout'
import { ShopWorkspace } from './composition-example'

const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
const architecture = decoded.value
const layoutPort: LayoutPort = { layout: async request => ({ generation: request.generation, result: fixedLayout(request.scene) }) }
function port(route: Partial<Route> & { diagramId: string }) {
  let snapshot = { hash: formatRoute({ architectureId: fixture.id, ...route }), canGoBack: false }
  const listeners = new Set<() => void>(); const writes: Route[] = []
  const update = (next: Route) => { writes.push(next); snapshot = { hash: formatRoute(next), canGoBack: true }; listeners.forEach(listener => listener()) }
  const fake: RoutePort = { getSnapshot: () => snapshot, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } }, push: update, replace: update, back: () => undefined }
  return { fake, writes }
}
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
  vi.stubGlobal('DOMMatrixReadOnly', class { m22 = 1 })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks() })

const wrappers: readonly (readonly [string, (props: NamedDiagramProps) => React.ReactNode, string])[] = [
  ['SystemLandscape', SystemLandscape, 'landscape'], ['SystemContext', SystemContext, 'context'], ['ContainerDiagram', ContainerDiagram, 'container'],
  ['ComponentDiagram', ComponentDiagram, 'component'], ['CodeDiagram', CodeDiagram, 'code'], ['DynamicDiagram', DynamicDiagram, 'dynamic'], ['DeploymentDiagram', DeploymentDiagram, 'deployment'],
]
const diagrams = Object.values(architecture.index.diagrams)
describe('named wrappers validate the actual routed kind', () => {
  for (const [name, Wrapper, kind] of wrappers) {
    for (const target of diagrams) {
      it(`${name} with the route port at ${target.id} (${target.kind})`, async () => {
        const { fake } = port({ diagramId: target.id })
        render(<Wrapper validatedBundle={architecture} routePort={fake} layoutPort={layoutPort} />)
        if (target.kind === kind) {
          await waitFor(() => expect(screen.getAllByRole('heading', { level: 1, name: target.title }).length).toBeGreaterThan(0))
          expect(screen.queryByText(/Expected a/)).toBeNull()
        } else {
          expect(screen.getByText(`Expected a ${kind} diagram, but "${target.id}" is a ${target.kind} diagram.`)).toBeTruthy()
          expect(screen.queryByRole('heading', { level: 1, name: target.title })).toBeNull()
          expect(screen.queryByRole('region', { name: /diagram canvas/ })).toBeNull()
        }
      })
    }
  }
  it('a wrapper stays valid for its own kind when the prop names another kind, because the route wins', async () => {
    const { fake } = port({ diagramId: 'code' })
    render(<CodeDiagram validatedBundle={architecture} diagramId="landscape" routePort={fake} layoutPort={layoutPort} />)
    await waitFor(() => expect(screen.getAllByRole('heading', { level: 1, name: 'Order handling code' }).length).toBeGreaterThan(0))
  })
  it('navigating through a drill link into another kind is rejected by a narrower wrapper without leaving the shared route', async () => {
    const { fake, writes } = port({ diagramId: 'landscape' })
    render(<SystemLandscape validatedBundle={architecture} routePort={fake} layoutPort={layoutPort} />)
    await waitFor(() => expect(screen.getAllByRole('link', { name: 'Open detail for Shop' }).length).toBeGreaterThan(0))
    act(() => { screen.getAllByRole('link', { name: 'Open detail for Shop' })[0].click() })
    await waitFor(() => expect(screen.getByText('Expected a landscape diagram, but "context" is a context diagram.')).toBeTruthy())
    expect(writes.map(route => route.diagramId)).toEqual(['context'])
  })
})
describe('shared provider composition', () => {
  it('renders code compartments as an accessible list and keeps one controller across parts', async () => {
    const { fake } = port({ diagramId: 'code' })
    render(<ArchitectureProvider validatedBundle={architecture} routePort={fake} layoutPort={layoutPort}><DiagramView /></ArchitectureProvider>)
    await waitFor(() => expect(screen.getAllByRole('list', { name: 'Members of OrderService' }).length).toBeGreaterThan(0))
    const list = screen.getAllByRole('list', { name: 'Members of OrderService' })[0]
    expect(list.textContent).toContain('place(order: NewOrder): Promise<Order>')
    expect(list.textContent).toContain('private')
  })
  it('parts and the controller hook fail clearly outside a provider', () => {
    const Probe = () => { useViewerController(); return null }
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<Probe />)).toThrow('ArchitectureProvider')
  })
  it('replaceable slots receive props only and the viewer remains one pipeline', async () => {
    const { fake } = port({ diagramId: 'landscape' })
    render(<ArchitectureViewer validatedBundle={architecture} routePort={fake} layoutPort={layoutPort}
      navigationSlot={props => <nav aria-label="Custom navigation">{props.breadcrumbs.map(item => <span key={item.id}>{item.title}</span>)}</nav>}
      legendSlot={props => <aside aria-label="Custom legend">{props.title}</aside>}
      documentationSlot={props => <section aria-label="Custom documentation">{props.document?.title}</section>} />)
    await waitFor(() => expect(screen.getByLabelText('Custom legend').textContent).toBe('Landscape key'))
    expect(screen.getByLabelText('Custom navigation').textContent).toBe('Shop landscape')
    expect(screen.getByLabelText('Custom documentation').textContent).toBe('Shop landscape')
    expect(screen.queryByRole('navigation', { name: 'Diagram navigation' })).toBeNull()
  })
  it('the README composition example is the tested, compile-checked example', async () => {
    const readme = readFileSync('README.md', 'utf8')
    const block = /<!-- composition-example -->\s*```tsx\n([\s\S]*?)```/.exec(readme)?.[1]
    expect(block).toBeTruthy()
    const source = readFileSync('tests/hooks/composition-example.tsx', 'utf8').replaceAll("'../../src/lib/c4'", "'./src/lib/c4'")
    expect(block!.trim()).toBe(source.trim())
    window.location.hash = formatRoute({ architectureId: fixture.id, diagramId: 'code' })
    render(<ShopWorkspace validatedBundle={architecture} />)
    await waitFor(() => expect(screen.getByText('Showing a code diagram')).toBeTruthy())
    expect(screen.getByLabelText('Explanation').textContent).toBe('This view shows selected symbols of the order handling component and their typed relations.')
    window.location.hash = ''
  })
})
