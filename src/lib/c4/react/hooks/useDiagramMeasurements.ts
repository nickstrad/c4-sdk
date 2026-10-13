import { useEffect, useRef, useState } from 'react'
import type { SceneInput } from '../../domain/scene'
import type { LayoutMeasurements } from '../../ports/layout'
import type { Size } from '../../domain/geometry'
/** Fixed-width natural-content probes avoid a canvas-size → layout → resize feedback loop. */
export function useDiagramMeasurements(input: SceneInput) {
  const ref = useRef<HTMLDivElement>(null)
  const [snapshot, setSnapshot] = useState<{ input: SceneInput; measurements: LayoutMeasurements }>()
  useEffect(() => {
    let disposed = false; let frame = 0
    const measure = () => {
      if (disposed || !ref.current) return
      const sizes: Record<string, Record<string, Size>> = { node: Object.create(null), edge: Object.create(null), group: Object.create(null) }
      for (const element of ref.current.querySelectorAll<HTMLElement>('[data-measure-id]')) {
        const kind = element.dataset.measureKind!; const id = element.dataset.measureId!
        const width = Math.ceil(element.offsetWidth); const height = Math.ceil(element.scrollHeight)
        if (width > 0 && height > 0) sizes[kind][id] = { width, height }
      }
      const revision = JSON.stringify(sizes)
      setSnapshot({ input, measurements: { revision, nodeSizes: sizes.node, edgeLabelSizes: sizes.edge, groupLabelSizes: sizes.group } })
    }
    // Fonts settle before reading natural block sizes. One snapshot per immutable input, never
    // measurements of the ELK-sized boxes, which would feed the output back into the engine.
    Promise.resolve(document.fonts?.ready).then(() => { if (!disposed) frame = requestAnimationFrame(measure) })
    return () => { disposed = true; cancelAnimationFrame(frame) }
  }, [input])
  return { ref, measurements: snapshot?.input === input ? snapshot.measurements : undefined }
}
