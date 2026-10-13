import { useEffect, useRef } from 'react'
import type { ValidatedArchitecture } from '../../domain/model'
import type { LayoutPort } from '../../ports/layout'
import type { RoutePort } from '../../ports/route'
import type { DocumentationSlot } from '../contracts/views'
import { useContext } from '../hooks/useContext'
import { useNavigation, useRoutePort } from '../hooks/useNavigation'
import { useDiagramLayout } from '../hooks/useDiagramLayout'
import { DiagramCanvas } from './DiagramCanvas'
import { ContextView } from '../views/ContextView'
import { NavigationView } from '../views/NavigationView'
import { DocumentationView } from '../views/DocumentationView'
import { DiagnosticView } from '../views/DiagnosticView'
import { Legend } from '../views/Legend'
import type { SceneInput } from '../../domain/scene'
export interface ArchitectureViewerProps {
  readonly validatedBundle: ValidatedArchitecture; readonly diagramId?: string
  readonly routePort?: RoutePort; readonly layoutPort?: LayoutPort; readonly documentationSlot?: DocumentationSlot
}
function RenderDiagram({ input, context, layoutPort }: { input: SceneInput; context: ReturnType<typeof useContext>; layoutPort?: LayoutPort }) {
  const projected = useDiagramLayout(input, layoutPort)
  if (!projected.ok) return <DiagnosticView diagnostics={projected.diagnostics} />
  const scene = projected.value
  return <><ContextView scene={scene} onDiagramSelect={context.canvasActions.onDiagramSelect} canvasSlot={<DiagramCanvas markerId={context.markerId} scene={scene} onDiagramSelect={context.canvasActions.onDiagramSelect} nodes={scene.nodes.map(node => ({ ...node, ...context.canvasActions.nodeActions(node.element.id) }))} />} /><Legend {...scene.diagram.legend} /></>
}
export function ArchitectureViewer({ validatedBundle, diagramId, routePort, layoutPort, documentationSlot }: ArchitectureViewerProps) {
  const port = useRoutePort(routePort)
  const navigation = useNavigation(validatedBundle, port, diagramId)
  const context = useContext(validatedBundle, navigation.route, navigation.navigate)
  const root = useRef<HTMLDivElement>(null)
  const focusMemory = useRef(new Map<string, string>())
  const viewportMemory = useRef(new Map<string, { left: number; top: number }>())
  const viewKey = `${validatedBundle.bundle.id}:${validatedBundle.bundle.revision}:${navigation.route.diagramId}`
  const previous = useRef<string | undefined>(undefined)
  const key = `${validatedBundle.bundle.id}:${validatedBundle.bundle.revision}:${navigation.route.diagramId}:${navigation.route.elementId ?? ''}`
  useEffect(() => {
    if (previous.current && previous.current !== key) {
      const nodes = root.current?.querySelectorAll<HTMLElement>('[data-element-id]')
      const selected = [...(nodes ?? [])].find(node => node.dataset.elementId === (navigation.route.elementId ?? focusMemory.current.get(viewKey)))
      const target = selected ?? root.current?.querySelector<HTMLElement>('[data-diagram-heading]')
      target?.focus({ preventScroll: false })
    }
    const viewport = root.current?.querySelector<HTMLElement>('.c4-canvas-scroll')
    const saved = viewportMemory.current.get(viewKey)
    if (viewport && previous.current !== key) { viewport.scrollLeft = saved?.left ?? 0; viewport.scrollTop = saved?.top ?? 0 }
    previous.current = key
  }, [key, viewKey, navigation.route.elementId])
  const diagram = validatedBundle.index.diagrams[navigation.route.diagramId]
  const related = [...(diagram?.related ?? []), ...(diagram?.nodes.find(node => node.elementId === navigation.route.elementId)?.related ?? [])]
  return <div ref={root} className="c4-sdk" onFocusCapture={event => { const element = (event.target as HTMLElement).dataset.elementId; if (element) focusMemory.current.set(viewKey, element) }} onScrollCapture={event => { const viewport = event.target as HTMLElement; if (viewport.classList.contains('c4-canvas-scroll')) viewportMemory.current.set(viewKey, { left: viewport.scrollLeft, top: viewport.scrollTop }) }}>
    <NavigationView breadcrumbs={navigation.trail.map((target, i) => ({ id: target.diagramId, title: validatedBundle.index.diagrams[target.diagramId].title, current: i === navigation.trail.length - 1, onSelect: () => navigation.navigate({ type: 'target', target }) }))} onBack={() => navigation.navigate({ type: 'back' })} onUp={() => navigation.navigate({ type: 'up' })} hasParent={!!diagram?.parent} related={related.map(target => ({ label: target.label, onSelect: () => navigation.navigate({ type: 'target', target }) }))} />
    <p className="c4-sr-only" aria-live="polite">{diagram?.title}</p>
    {navigation.diagnostics.length ? <><DiagnosticView diagnostics={navigation.diagnostics} /><button onClick={() => navigation.navigate({ type: 'target', target: { diagramId: diagram?.id ?? validatedBundle.bundle.defaultDiagramId } })}>Open diagram</button></> : context.input.ok ? <div className="c4-viewer-grid"><div><RenderDiagram input={context.input.value} context={context} layoutPort={layoutPort} /></div>{documentationSlot ? documentationSlot(context.documentationProps) : <DocumentationView {...context.documentationProps} />}</div> : <DiagnosticView diagnostics={context.input.diagnostics} />}
  </div>
}
export function SystemContext(props: ArchitectureViewerProps) {
  const id = props.diagramId ?? props.validatedBundle.bundle.defaultDiagramId
  return props.validatedBundle.index.diagrams[id]?.kind === 'context' ? <ArchitectureViewer {...props} /> : <DiagnosticView diagnostics={[{ code: 'diagram-kind', severity: 'error', path: '$.diagramId', message: 'SystemContext requires a context diagram.' }]} />
}
export function ContainerDiagram(props: ArchitectureViewerProps) {
  const id = props.diagramId ?? props.validatedBundle.bundle.defaultDiagramId
  return props.validatedBundle.index.diagrams[id]?.kind === 'container' ? <ArchitectureViewer {...props} /> : <DiagnosticView diagnostics={[{ code: 'diagram-kind', severity: 'error', path: '$.diagramId', message: 'ContainerDiagram requires a container diagram.' }]} />
}
