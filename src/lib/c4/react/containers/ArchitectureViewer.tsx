import type { ValidatedArchitecture } from '../../domain/model'
import type { LayoutPort } from '../../ports/layout'
import type { RoutePort } from '../../ports/route'
import type { DocumentationSlot } from '../contracts/views'
import { useContext, useDiagramKind } from '../hooks/useContext'
import { useNavigation, useRoutePort } from '../hooks/useNavigation'
import { useDiagramRenderer } from '../hooks/useDiagramRenderer'
import { useViewerSession } from '../hooks/useViewerSession'
import { DiagramCanvas, MeasurementRack } from './DiagramCanvas'
import { DiagramFallback } from '../views/DiagramFallback'
import type { CanvasSession } from '../hooks/useViewerSession'
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
function RenderDiagram({ input, context, layoutPort, session }: { input: SceneInput; context: ReturnType<typeof useContext>; layoutPort?: LayoutPort; session: CanvasSession }) {
  const { projected, canvasProps, measurementRef } = useDiagramRenderer(input, context, layoutPort)
  const pending = !projected.ok && projected.diagnostics.some(diagnostic => diagnostic.code === 'layout-pending')
  return <>
    <MeasurementRack input={input} measurementRef={measurementRef} />
    {projected.ok && canvasProps ? <>
      <ContextView scene={projected.value} onDiagramSelect={context.canvasActions.onDiagramSelect} canvasSlot={<DiagramCanvas key={JSON.stringify([input.architectureId, input.revision, input.diagram.id])} {...canvasProps} session={session} />} />
      <details className="c4-text-alternative"><summary>Element and relationship text alternative</summary><DiagramFallback ready={false} input={input} nodeActions={context.canvasActions.nodeActions} /></details>
    </> : <>
      {pending ? <p role="status">Arranging diagram…</p> : <DiagnosticView diagnostics={projected.diagnostics} />}
      <DiagramFallback ready={!pending} input={input} nodeActions={context.canvasActions.nodeActions} />
    </>}
    <Legend {...input.diagram.legend} />
  </>
}
export function ArchitectureViewer({ validatedBundle, diagramId, routePort, layoutPort, documentationSlot }: ArchitectureViewerProps) {
  const port = useRoutePort(routePort)
  const navigation = useNavigation(validatedBundle, port, diagramId)
  const context = useContext(validatedBundle, navigation.route, navigation.navigate, navigation.detail)
  const session = useViewerSession(navigation.route, validatedBundle.bundle.revision)
  return <div {...session.rootProps} className="c4-sdk">
    <NavigationView {...navigation.viewProps} />
    <p className="c4-sr-only" aria-live="polite">{navigation.diagramTitle}</p>
    {navigation.diagnostics.length ? <><DiagnosticView diagnostics={navigation.diagnostics} /><a {...navigation.recovery}>Open diagram</a></> : context.input.ok ? <div className="c4-viewer-grid"><div><RenderDiagram input={context.input.value} context={context} layoutPort={layoutPort} session={session.canvasSession} /></div>{documentationSlot ? documentationSlot(context.documentationProps) : <DocumentationView {...context.documentationProps} />}</div> : <DiagnosticView diagnostics={context.input.diagnostics} />}
  </div>
}
export function SystemContext(props: ArchitectureViewerProps) {
  const diagnostics = useDiagramKind(props.validatedBundle, props.diagramId, 'context')
  return diagnostics.length ? <DiagnosticView diagnostics={diagnostics} /> : <ArchitectureViewer {...props} />
}
export function ContainerDiagram(props: ArchitectureViewerProps) {
  const diagnostics = useDiagramKind(props.validatedBundle, props.diagramId, 'container')
  return diagnostics.length ? <DiagnosticView diagnostics={diagnostics} /> : <ArchitectureViewer {...props} />
}
