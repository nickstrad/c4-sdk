import { ArchitectureViewer } from './ArchitectureViewer'
import type { ArchitectureViewerProps } from './ArchitectureViewer'
import { useDiagramKind } from '../hooks/useContext'
import { DiagnosticView } from '../views/DiagnosticView'
export function DeploymentDiagram(props: ArchitectureViewerProps) {
  const diagnostics = useDiagramKind(props.validatedBundle, props.diagramId, 'deployment')
  return diagnostics.length ? <DiagnosticView diagnostics={diagnostics} /> : <ArchitectureViewer {...props} />
}
