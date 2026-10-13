import { useEffect, useState } from 'react'
import type { Diagnostic, ValidatedArchitecture } from '../../domain/model'
import { loadingFailure, resourceStatus } from '../../domain/presentation'
import type { ArchitectureLoader, Catalog } from '../../ports/loader'
export function useArchitectureBundle(loader: ArchitectureLoader, catalogUrl: string, architectureId?: string) {
  const [catalogState, setCatalog] = useState<{ url: string; catalog: Catalog }>()
  const [resource, setResource] = useState<{ catalogUrl: string; url: string }>()
  const [architecture, setArchitecture] = useState<ValidatedArchitecture>()
  const [diagnostics, setDiagnostics] = useState<readonly Diagnostic[]>([])
  const [pending, setPending] = useState(true)
  const catalog = catalogState?.url === catalogUrl ? catalogState.catalog : undefined
  const resourceUrl = catalog?.entries.find(entry => entry.id === architectureId)?.url ?? (resource?.catalogUrl === catalogUrl ? resource.url : undefined)
  useEffect(() => {
    const controller = new AbortController(); let active = true
    // External resource lifecycle begins here; expose pending before its promise completes.
    // eslint-disable-next-line react/set-state-in-effect
    setPending(true); setDiagnostics([])
    loader.loadCatalog(catalogUrl, controller.signal).then(value => {
      if (active) { setCatalog({ url: catalogUrl, catalog: value }); setResource({ catalogUrl, url: value.entries[0].url }) }
    }).catch((error: unknown) => { if (active) { setDiagnostics(loadingFailure(error instanceof Error ? error.message : 'Catalog could not be loaded.')); setPending(false) } })
    return () => { active = false; controller.abort() }
  }, [loader, catalogUrl])
  useEffect(() => {
    if (!resourceUrl) return
    const controller = new AbortController(); let active = true
    // External resource lifecycle begins here; expose pending before its promise completes.
    // eslint-disable-next-line react/set-state-in-effect
    setPending(true); setDiagnostics([])
    loader.loadBundle(resourceUrl, controller.signal).then(result => {
      if (!active) return
      if (result.ok) setArchitecture(result.value)
      setDiagnostics(result.diagnostics); setPending(false)
    }).catch((error: unknown) => { if (active) { setDiagnostics(loadingFailure(error instanceof Error ? error.message : 'Architecture could not be loaded.')); setPending(false) } })
    return () => { active = false; controller.abort() }
  }, [loader, catalogUrl, resourceUrl])
  return { catalog, resourceUrl, architecture, diagnostics, pending, statusText: resourceStatus(pending, architecture, diagnostics), onResourceSelect: (url: string) => setResource({ catalogUrl, url }) }
}
