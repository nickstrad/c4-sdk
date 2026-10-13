import { useId, useMemo, useState } from 'react'
import type { ValidatedArchitecture } from '../../domain/model'
import { diagramKindDiagnostics } from '../../domain/architecture'
import { buildScene } from '../../domain/scene'
import { selectDocumentation } from '../../domain/documentation'
import type { DestinationLinkProps } from '../contracts/views'
import type { NavigationAction, Route } from '../../domain/navigation'
export function useContext(architecture: ValidatedArchitecture, route: Route, navigate: (action: NavigationAction) => void, detail: (elementId: string) => DestinationLinkProps | undefined) {
  const markerId = useId()
  const [mode, setMode] = useState<'plain' | 'ste'>('plain')
  const input = useMemo(() => buildScene(architecture.index, route.diagramId), [architecture, route.diagramId])
  const documentation = selectDocumentation(architecture.index, route.diagramId, route.elementId)
  return { input, markerId, documentationProps: { selection: documentation, mode, onPlain: () => setMode('plain'), onSte: () => setMode('ste') },
    canvasActions: { onDiagramSelect: () => navigate({ type: 'diagram' }), nodeActions: (elementId: string) => ({ selected: route.elementId === elementId, detail: detail(elementId), onSelect: () => navigate({ type: 'activate', elementId }), onInspect: () => navigate({ type: 'inspect', elementId }) }) },
  }
}

export function useDiagramKind(architecture: ValidatedArchitecture, diagramId: string | undefined, kind: import('../../domain/model').Diagram['kind']) {
  return diagramKindDiagnostics(architecture.index, diagramId ?? architecture.bundle.defaultDiagramId, kind)
}
