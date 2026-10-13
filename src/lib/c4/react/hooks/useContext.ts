import { useId, useState } from 'react'
import type { ValidatedArchitecture } from '../../domain/model'
import { projectDiagram, selectDocumentation } from '../../domain/presentation'
export function useContext(architecture: ValidatedArchitecture, diagramId: string) {
  const markerId = useId()
  const [selection, setSelection] = useState<{ architecture: ValidatedArchitecture; elementId?: string }>()
  const [mode, setMode] = useState<'plain' | 'ste'>('plain')
  const elementId = selection?.architecture === architecture ? selection.elementId : undefined
  const projected = projectDiagram(architecture.index, diagramId)
  const documentation = selectDocumentation(architecture.index, diagramId, elementId)
  return {
    projected, documentationProps: { selection: documentation, mode, onPlain: () => setMode('plain'), onSte: () => setMode('ste') },
    contextProps: projected.ok ? { markerId, scene: projected.value, nodes: projected.value.nodes.map(node => ({ ...node, selected: elementId === node.element.id, onSelect: () => setSelection({ architecture, elementId: node.element.id }) })), onDiagramSelect: () => setSelection({ architecture }) } : undefined,
  }
}
