import { useId, useMemo } from 'react'
import type { ValidatedArchitecture } from '../../domain/model'
import { diagramKindDiagnostics } from '../../domain/architecture'
import { buildScene } from '../../domain/scene'
import { useDocumentation } from './useDocumentation'
import { selectDocumentation } from '../../domain/documentation'
import type { DestinationLinkProps } from '../contracts/views'
import type { NavigationAction, Route } from '../../domain/navigation'
export function useContext(architecture: ValidatedArchitecture, route: Route, navigate: (action: NavigationAction) => void, detail: (elementId: string) => DestinationLinkProps | undefined) {
  const markerId = useId()
  const input = useMemo(() => buildScene(architecture.index, route.diagramId), [architecture, route.diagramId])
  const documentation = selectDocumentation(architecture.index, route.diagramId, route.elementId)
  const documentationProps = useDocumentation(documentation, JSON.stringify([architecture.bundle.id, architecture.bundle.revision, route.diagramId, route.elementId]))
  return { input, markerId, documentationProps,
    canvasActions: { onDiagramSelect: () => navigate({ type: 'diagram' }), nodeActions: (elementId: string) => ({ selected: route.elementId === elementId, detail: detail(elementId), onSelect: () => navigate({ type: 'activate', elementId }), onInspect: () => navigate({ type: 'inspect', elementId }) }) },
  }
}

export function useDiagramKind(architecture: ValidatedArchitecture, diagramId: string | undefined, kind: import('../../domain/model').Diagram['kind']) {
  return diagramKindDiagnostics(architecture.index, diagramId ?? architecture.bundle.defaultDiagramId, kind)
}
