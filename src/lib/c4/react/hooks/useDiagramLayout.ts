import { useEffect, useRef, useState } from 'react'
import { fixedLayout, validateLayout } from '../../domain/layout'
import type { Scene, SceneInput } from '../../domain/scene'
import type { Result } from '../../domain/model'
import type { LayoutPort } from '../../ports/layout'
export function useDiagramLayout(input: SceneInput, port?: LayoutPort): Result<Scene> {
  const generation = useRef(0)
  const [published, publish] = useState<{ input: SceneInput; result: Result<Scene> }>()
  useEffect(() => {
    if (!port) return
    const controller = new AbortController(); const current = ++generation.current
    port.layout({ scene: input, generation: current, signal: controller.signal }).then(response => {
      if (!controller.signal.aborted && response.generation === current && generation.current === current) publish({ input, result: validateLayout(input, response.result) })
    }).catch((error: unknown) => {
      if (!controller.signal.aborted && generation.current === current) publish({ input, result: { ok: false, diagnostics: [{ code: 'layout', severity: 'error', path: '$.layout', message: error instanceof Error ? error.message : 'Layout failed.' }] } })
    })
    return () => { controller.abort() }
  }, [input, port])
  return port && published?.input === input ? published.result : fixedLayout(input)
}
