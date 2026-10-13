import { useMemo } from 'react'
import type { ArchitectureLoader } from '../../ports/loader'
import { createFetchLoader } from '../../adapters/loaders/fetch'
import { useArchitectureBundle } from '../hooks/useArchitectureBundle'
import { ArchitectureViewer } from './ArchitectureViewer'
import { DiagnosticView } from '../views/DiagnosticView'
import { CatalogView } from '../views/CatalogView'
export interface CatalogViewerProps { readonly catalogUrl: string; readonly loader?: ArchitectureLoader; readonly title?: string }
export function CatalogViewer({ catalogUrl, loader, title = 'Architecture explorer' }: CatalogViewerProps) {
  const resourceLoader = useMemo(() => loader ?? createFetchLoader(), [loader])
  const state = useArchitectureBundle(resourceLoader, catalogUrl)
  return <CatalogView title={title} catalog={state.catalog} resourceUrl={state.resourceUrl} onResourceSelect={state.onResourceSelect} statusText={state.statusText} diagnosticsSlot={<DiagnosticView diagnostics={state.diagnostics} />} viewerSlot={state.architecture && <ArchitectureViewer validatedBundle={state.architecture} />} />
}
