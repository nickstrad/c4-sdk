import { useId, useMemo, useState } from 'react'
import type { ValidatedArchitecture } from '../../domain/model'
import { buildScene } from '../../domain/scene'
import { selectDocumentation } from '../../domain/documentation'
import type { NavigationAction, Route } from '../../domain/navigation'
export function useContext(architecture: ValidatedArchitecture, route: Route, navigate: (action: NavigationAction) => void) {
  const markerId = useId()
  const [mode, setMode] = useState<'plain' | 'ste'>('plain')
  const input = useMemo(() => buildScene(architecture.index, route.diagramId), [architecture, route.diagramId])
  const documentation = selectDocumentation(architecture.index, route.diagramId, route.elementId)
  return { input, markerId, documentationProps: { selection: documentation, mode, onPlain: () => setMode('plain'), onSte: () => setMode('ste') },
    canvasActions: { onDiagramSelect: () => navigate({ type: 'diagram' }), nodeActions: (elementId: string) => ({ selected: route.elementId === elementId, hasDetail: !!architecture.index.diagrams[route.diagramId]?.nodes.find(member => member.elementId === elementId)?.detail, onSelect: () => navigate({ type: 'activate', elementId }), onInspect: () => navigate({ type: 'inspect', elementId }) }) },
  }
}
