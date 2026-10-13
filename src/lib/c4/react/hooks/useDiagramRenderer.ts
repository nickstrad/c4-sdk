import type { SceneInput } from '../../domain/scene'
import type { LayoutPort } from '../../ports/layout'
import type { useContext } from './useContext'
import { useDiagramLayout } from './useDiagramLayout'
export function useDiagramRenderer(input: SceneInput, context: ReturnType<typeof useContext>, layoutPort?: LayoutPort) {
  const projected = useDiagramLayout(input, layoutPort)
  return { projected, canvasProps: projected.ok ? { markerId: context.markerId, scene: projected.value, onDiagramSelect: context.canvasActions.onDiagramSelect, nodes: projected.value.nodes.map(node => ({ ...node, ...context.canvasActions.nodeActions(node.element.id) })) } : undefined }
}
