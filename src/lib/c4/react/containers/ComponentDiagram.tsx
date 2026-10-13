import { ArchitectureViewer, type ArchitectureViewerProps } from './ArchitectureViewer'
import { useDiagramKind } from '../hooks/useContext'
import { DiagnosticView } from '../views/DiagnosticView'
export function ComponentDiagram(props: ArchitectureViewerProps) {
  const diagnostics = useDiagramKind(props.validatedBundle, props.diagramId, 'component')
  return diagnostics.length ? <DiagnosticView diagnostics={diagnostics} /> : <ArchitectureViewer {...props} />
}
