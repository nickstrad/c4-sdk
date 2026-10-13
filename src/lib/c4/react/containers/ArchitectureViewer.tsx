import type { ValidatedArchitecture } from '../../domain/model'
import { useContext } from '../hooks/useContext'
import { ContextView } from '../views/ContextView'
import { DocumentationView } from '../views/DocumentationView'
import { DiagnosticView } from '../views/DiagnosticView'
import { Legend } from '../views/Legend'
export interface ArchitectureViewerProps { readonly validatedBundle: ValidatedArchitecture; readonly diagramId?: string }
export function SystemContext({ validatedBundle, diagramId = validatedBundle.bundle.defaultDiagramId }: ArchitectureViewerProps) {
  const { contextProps, documentationProps, projected } = useContext(validatedBundle, diagramId)
  return <div className="c4-sdk">{contextProps ? <><div className="c4-viewer-grid"><div><ContextView {...contextProps} /><Legend {...contextProps.scene.diagram.legend} /></div><DocumentationView {...documentationProps} /></div></> : <DiagnosticView diagnostics={projected.diagnostics} />}</div>
}
export const ArchitectureViewer = SystemContext
