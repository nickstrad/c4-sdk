import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
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
  it('the composition-example component keeps navigation, view and documentation in sync', async () => {
    window.location.hash = formatRoute({ architectureId: fixture.id, diagramId: 'code' })
    render(<ShopWorkspace validatedBundle={architecture} />)
    await waitFor(() => expect(screen.getByText('Showing a code diagram')).toBeTruthy())
    expect(screen.getByLabelText('Explanation').textContent).toBe('This view shows selected symbols of the order handling component and their typed relations.')
    window.location.hash = ''
  })
  it('the README composition snippet equals examples/readme/compose.tsx', () => {
    const readme = readFileSync('README.md', 'utf8')
    const block = /<!-- example: examples\/readme\/compose\.tsx -->\s*```tsx\n([\s\S]*?)```/.exec(readme)?.[1]
    expect(block).toBeTruthy()
    expect(block!.trim()).toBe(readFileSync('examples/readme/compose.tsx', 'utf8').trim())
  })
  it('the executable README public-import example composes parts in one provider and stays in sync', async () => {
    // The example imports the published names (`c4-sdk`, `c4-sdk/core`, a worker URL, CSS). Run its
    // source unchanged except for resolving those specifiers to the repo's public facades, with the
    // ELK worker replaced by the fixed layout port. The copy lives in the git-ignored node_modules cache.
    const root = resolve('.'); const dir = resolve('node_modules/.cache/c4-readme-compose'); mkdirSync(dir, { recursive: true })
    const shim = resolve(dir, 'sdk.ts')
    writeFileSync(shim, `export * from ${JSON.stringify(resolve(root, 'src/index.ts'))}
import { fixedLayout } from ${JSON.stringify(resolve(root, 'src/lib/c4/domain/layout.ts'))}
export const createElkLayoutPort = () => ({ layout: async (request: any) => ({ generation: request.generation, result: fixedLayout(request.scene) }) })
`)
    writeFileSync(resolve(dir, 'worker-url.ts'), 'export default "layout-worker.js"\n'); writeFileSync(resolve(dir, 'empty.css'), '')
    const source = readFileSync('examples/readme/compose.tsx', 'utf8')
    const rewritten = source
      .replace("'c4-sdk/core'", JSON.stringify(resolve(root, 'src/core/index.ts')))
      .replace("'c4-sdk/layout-worker.js?url'", JSON.stringify(resolve(dir, 'worker-url.ts')))
      .replace("'c4-sdk/styles.css'", JSON.stringify(resolve(dir, 'empty.css')))
      .replaceAll("'c4-sdk'", JSON.stringify(shim))
      .replace("'./bundle.json'", JSON.stringify(resolve(root, 'examples/readme/bundle.json')))
    expect(rewritten).not.toContain("'c4-sdk")
    const entry = resolve(dir, 'compose.tsx'); writeFileSync(entry, rewritten)
    document.body.innerHTML = '<div id="root"></div>'
    window.location.hash = ''
    // The example owns its React root; capture it so the test can unmount it.
    const roots: { unmount(): void }[] = []
    vi.resetModules()
    vi.doMock('react-dom/client', async importOriginal => {
      const original = await importOriginal<typeof import('react-dom/client')>()
      return { ...original, createRoot: (...args: Parameters<typeof original.createRoot>) => { const created = original.createRoot(...args); roots.push(created); return created } }
    })
    try {
      await act(async () => { await import(/* @vite-ignore */ entry) })
      await waitFor(() => expect(document.getElementById('heading')?.textContent).toBe('Shop landscape'))
      // Navigation, view and documentation all follow the one provider's route.
      await waitFor(() => expect(screen.getByLabelText('Explanation').querySelector('h2')?.textContent).toBe('Shop landscape'))
      const before = document.getElementById('explanation-text')?.textContent
      expect(before).toBeTruthy()
      act(() => { screen.getByRole('button', { name: 'STE' }).click() })
      await waitFor(() => expect(screen.getByRole('button', { name: 'STE' }).getAttribute('aria-pressed')).toBe('true'))
      expect(document.getElementById('explanation-text')?.textContent).toBeTruthy()
      await waitFor(() => expect(screen.getAllByRole('link', { name: 'Open detail for Shop' }).length).toBeGreaterThan(0))
      act(() => { screen.getAllByRole('link', { name: 'Open detail for Shop' })[0].click() })
      await waitFor(() => expect(document.getElementById('heading')?.textContent).not.toBe('Shop landscape'))
      const heading = document.getElementById('heading')!.textContent
      await waitFor(() => expect(screen.getByLabelText('Explanation').querySelector('h2')?.textContent).toBeTruthy())
      act(() => { screen.getByRole('button', { name: 'Go up' }).click() })
      await waitFor(() => expect(document.getElementById('heading')?.textContent).not.toBe(heading))
    } finally {
      act(() => { roots.forEach(created => created.unmount()) })
      vi.doUnmock('react-dom/client'); vi.resetModules()
      document.body.innerHTML = ''; window.location.hash = ''
    }
  })
})
