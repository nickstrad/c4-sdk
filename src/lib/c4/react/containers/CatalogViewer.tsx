import { useEffect, useMemo, useRef } from 'react'
import { parseRoute } from '../../domain/navigation'
import type { RoutePort } from '../../ports/route'
import { useRoutePort, useRouteSnapshot } from '../hooks/useNavigation'
import type { ArchitectureLoader } from '../../ports/loader'
import { createFetchLoader } from '../../adapters/loaders/fetch'
import { useArchitectureBundle } from '../hooks/useArchitectureBundle'
import { ArchitectureViewer } from './ArchitectureViewer'
import { DiagnosticView } from '../views/DiagnosticView'
import { CatalogView } from '../views/CatalogView'
export interface CatalogViewerProps { readonly catalogUrl: string; readonly loader?: ArchitectureLoader; readonly title?: string; readonly routePort?: RoutePort }
export function CatalogViewer({ catalogUrl, loader, title = 'Architecture explorer', routePort }: CatalogViewerProps) {
  const resourceLoader = useMemo(() => loader ?? createFetchLoader(), [loader])
  const port = useRoutePort(routePort)
  const snapshot = useRouteSnapshot(port)
  const parsed = parseRoute(snapshot.hash)
  const architectureId = parsed.ok ? parsed.value?.architectureId : undefined
  const state = useArchitectureBundle(resourceLoader, catalogUrl, architectureId)
  const unknownArchitecture = !!(architectureId && state.catalog && !state.catalog.entries.some(entry => entry.id === architectureId))
  const selected = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (state.architecture && state.architecture.bundle.id === selected.current) {
      selected.current = undefined
      port.replace({ architectureId: state.architecture.bundle.id, diagramId: state.architecture.bundle.defaultDiagramId })
    }
  }, [port, state.architecture])
  const onResourceSelect = (url: string) => { const entry = state.catalog?.entries.find(item => item.url === url); if (entry) { selected.current = entry.id; port.push({ architectureId: entry.id, diagramId: 'context' }) }; state.onResourceSelect(url) }
  return <CatalogView title={title} catalog={state.catalog} resourceUrl={state.resourceUrl} onResourceSelect={onResourceSelect} statusText={state.statusText} diagnosticsSlot={<DiagnosticView diagnostics={unknownArchitecture ? [...state.diagnostics, { code: 'route', path: '$.route.architectureId', severity: 'error', message: `Not Found: unknown architecture "${architectureId}".` }] : state.diagnostics} />} viewerSlot={state.architecture && !unknownArchitecture && <ArchitectureViewer key={`${state.architecture.bundle.id}:${state.architecture.bundle.revision}`} validatedBundle={state.architecture} routePort={port} />} />
}
