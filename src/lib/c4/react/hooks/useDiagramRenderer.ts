import { useMemo, useRef } from 'react'
import type { SceneInput } from '../../domain/scene'
import type { Scene } from '../../domain/geometry'
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
export function useCanvasViewport(session: import('./useViewerSession').CanvasSession, scene: Scene) {
  const instance = useRef<import('@xyflow/react').ReactFlowInstance<import('../views/CanvasNode').FlowNode | import('../views/CanvasGroup').FlowGroup, import('../views/CanvasEdge').FlowEdge> | undefined>(undefined)
  const pointerDown = useRef(false)
  return {
    onPointerDownCapture: () => { pointerDown.current = true },
    onPointerUpCapture: () => { pointerDown.current = false },
    onPointerCancel: () => { pointerDown.current = false },
    // Capture before React Flow handles keyboard events on its descendants.
    onKeyDownCapture: () => { pointerDown.current = false },
    onInit: (value: NonNullable<typeof instance.current>) => { instance.current = value; void value.setViewport(session.getViewport() ?? { x: 20, y: 20, zoom: 1 }).then(session.onReady) },
    onActualSize: () => { void instance.current?.zoomTo(1) },
    onFocusCapture: (event: import('react').FocusEvent<HTMLDivElement>) => {
      // A mouse/touch focus must not move its target between pointerdown and click.
      if (pointerDown.current || !instance.current) return
      const id = (event.target as HTMLElement).closest<HTMLElement>('[data-node-id]')?.dataset.nodeId
      const node = scene.nodes.find(node => node.element.id === id); if (!node) return
      // Native focus briefly scrolls overflow ancestors before React Flow resets
      // their scroll. Graph coordinates avoid those transient DOM rectangles and
      // remain in the same CSS units under browser/host zoom.
      const viewport = instance.current.getViewport()
      const width = event.currentTarget.clientWidth; const height = event.currentTarget.clientHeight
      const left = viewport.x + node.x * viewport.zoom; const top = viewport.y + node.y * viewport.zoom
      if (left < 0 || left + node.width * viewport.zoom > width || top < 0 || top + node.height * viewport.zoom > height) {
        void instance.current.setViewport({ ...viewport, x: width / 2 - (node.x + node.width / 2) * viewport.zoom, y: height / 2 - (node.y + node.height / 2) * viewport.zoom })
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
