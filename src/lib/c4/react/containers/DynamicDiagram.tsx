import { ArchitectureViewer, type ArchitectureViewerProps } from './ArchitectureViewer'
import { useDiagramKind } from '../hooks/useContext'
import { DiagnosticView } from '../views/DiagnosticView'
export function DynamicDiagram(props: ArchitectureViewerProps) {
  const diagnostics = useDiagramKind(props.validatedBundle, props.diagramId, 'dynamic')
  return diagnostics.length ? <DiagnosticView diagnostics={diagnostics} /> : <ArchitectureViewer {...props} />
}
