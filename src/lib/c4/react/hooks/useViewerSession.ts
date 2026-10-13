import { useEffect, useRef } from 'react'
import type { FocusEvent, UIEvent } from 'react'
import type { Route } from '../../domain/navigation'
export function useViewerSession(route: Route, revision: string) {
  const root = useRef<HTMLDivElement>(null)
  const focusMemory = useRef(new Map<string, string>())
  const viewportMemory = useRef(new Map<string, { left: number; top: number }>())
  const viewKey = `${route.architectureId}:${revision}:${route.diagramId}`
  const previous = useRef<string | undefined>(undefined)
  const key = `${viewKey}:${route.elementId ?? ''}`
  useEffect(() => {
    if (previous.current && previous.current !== key) {
      const nodes = root.current?.querySelectorAll<HTMLElement>('[data-element-id]')
      const selected = [...(nodes ?? [])].find(node => node.dataset.elementId === (route.elementId ?? focusMemory.current.get(viewKey)))
      const target = selected ?? root.current?.querySelector<HTMLElement>('[data-diagram-heading]')
      target?.focus({ preventScroll: false })
    }
    const viewport = root.current?.querySelector<HTMLElement>('.c4-canvas-scroll')
    const saved = viewportMemory.current.get(viewKey)
    if (viewport && previous.current !== key) { viewport.scrollLeft = saved?.left ?? 0; viewport.scrollTop = saved?.top ?? 0 }
    previous.current = key
  }, [key, viewKey, route.elementId])
  return {
    ref: root,
    onFocusCapture: (event: FocusEvent<HTMLDivElement>) => { const element = (event.target as HTMLElement).dataset.elementId; if (element) focusMemory.current.set(viewKey, element) },
    onScrollCapture: (event: UIEvent<HTMLDivElement>) => { const viewport = event.target as HTMLElement; if (viewport.classList.contains('c4-canvas-scroll')) viewportMemory.current.set(viewKey, { left: viewport.scrollLeft, top: viewport.scrollTop }) },
  }
}
