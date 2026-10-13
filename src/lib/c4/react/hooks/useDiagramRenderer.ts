import { useMemo, useRef } from 'react'
import type { SceneInput } from '../../domain/scene'
import type { LayoutPort } from '../../ports/layout'
import type { useContext } from './useContext'
import { createElkLayoutPort } from '../../adapters/layout/client'
import { useDiagramLayout } from './useDiagramLayout'
import { useDiagramMeasurements } from './useDiagramMeasurements'
export function useDiagramRenderer(input: SceneInput, context: ReturnType<typeof useContext>, layoutPort?: LayoutPort) {
  const port = useMemo(() => layoutPort ?? createElkLayoutPort(), [layoutPort])
  const measurement = useDiagramMeasurements(input)
  // Legacy custom ports need not implement measured requests. The built-in engine always does.
  const projected = useDiagramLayout(input, port, layoutPort ? undefined : measurement.measurements)
  return { projected, measurementRef: measurement.ref, canvasProps: projected.ok ? { markerId: context.markerId, scene: projected.value, onDiagramSelect: context.canvasActions.onDiagramSelect, nodes: projected.value.nodes.map(node => ({ ...node, ...context.canvasActions.nodeActions(node.element.id) })) } : undefined }
}

/** Browser viewport effects stay outside the props-only node/edge/group views. */
export function useCanvasViewport(session: import('./useViewerSession').CanvasSession) {
  const instance = useRef<import('@xyflow/react').ReactFlowInstance<import('../views/CanvasNode').FlowNode | import('../views/CanvasGroup').FlowGroup, import('../views/CanvasEdge').FlowEdge> | undefined>(undefined)
  return {
    onInit: (value: NonNullable<typeof instance.current>) => { instance.current = value; void value.setViewport(session.getViewport() ?? { x: 20, y: 20, zoom: 1 }).then(session.onReady) },
    onActualSize: () => { void instance.current?.zoomTo(1) },
    onFocusCapture: (event: import('react').FocusEvent<HTMLDivElement>) => {
      if (!(event.target as HTMLElement).closest('[data-node-id]') || !instance.current) return
      const target = (event.target as HTMLElement).getBoundingClientRect(); const canvas = event.currentTarget.getBoundingClientRect()
      if (target.left < canvas.left || target.right > canvas.right || target.top < canvas.top || target.bottom > canvas.bottom) {
        const viewport = instance.current.getViewport()
        void instance.current.setViewport({ ...viewport, x: viewport.x + canvas.left + canvas.width / 2 - (target.left + target.width / 2), y: viewport.y + canvas.top + canvas.height / 2 - (target.top + target.height / 2) })
      }
    },
    onKeyDown: (event: import('react').KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget || !instance.current) return
      const delta: Record<string, [number, number]> = { ArrowLeft: [80, 0], ArrowRight: [-80, 0], ArrowUp: [0, 80], ArrowDown: [0, -80] }
      const move = delta[event.key]; if (!move) return
      event.preventDefault(); const viewport = instance.current.getViewport()
      void instance.current.setViewport({ ...viewport, x: viewport.x + move[0], y: viewport.y + move[1] })
    },
  }
}
