import { useEffect, useMemo, useSyncExternalStore } from 'react'
import type { ValidatedArchitecture } from '../../domain/model'
import { breadcrumbs, parseRoute, transition, validateRoute } from '../../domain/navigation'
import type { NavigationAction, Route } from '../../domain/navigation'
import type { RoutePort } from '../../ports/route'
import { createHashRoutePort } from '../../adapters/router/hash'
export function useRoutePort(provided?: RoutePort) { return useMemo(() => provided ?? createHashRoutePort(), [provided]) }
export function useRouteSnapshot(port: RoutePort) { return useSyncExternalStore(port.subscribe, port.getSnapshot, port.getSnapshot) }
export function useNavigation(architecture: ValidatedArchitecture, port: RoutePort, initialDiagramId?: string) {
  const snapshot = useRouteSnapshot(port)
  const parsed = parseRoute(snapshot.hash)
  const root: Route = useMemo(() => ({ architectureId: architecture.bundle.id, diagramId: initialDiagramId ?? architecture.bundle.defaultDiagramId }), [architecture, initialDiagramId])
  // A rejected resource preserves its last valid viewer. Its route remains isolated to that architecture.
  const route = parsed.ok && parsed.value?.architectureId === architecture.bundle.id ? parsed.value : root
  const diagnostics = !parsed.ok ? parsed.diagnostics : validateRoute(architecture.index, route)
  useEffect(() => { if (!snapshot.hash) port.replace(root) }, [port, snapshot.hash, root])
  return {
    route, diagnostics, trail: breadcrumbs(architecture.index, route), canGoBack: snapshot.canGoBack,
    navigate: (action: NavigationAction) => { const result = transition(architecture.index, route, action, snapshot.canGoBack); if (result.ok) { if (result.value.type === 'back') port.back(); else port.push(result.value.route) } },
  }
}
