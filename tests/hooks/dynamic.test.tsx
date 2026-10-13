import { readFileSync } from 'node:fs'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { useContext } from '../../src/lib/c4/react/hooks/useContext'
import { useDiagramRenderer } from '../../src/lib/c4/react/hooks/useDiagramRenderer'
import { fixedLayout } from '../../src/lib/c4/domain/layout'
import type { LayoutPort } from '../../src/lib/c4/ports/layout'
afterEach(cleanup)
it('step-only changes reuse layout input/geometry and do not request worker relayout',async()=> {
 const decoded=decodeArchitecture(JSON.parse(readFileSync('fixtures/dynamic.json','utf8')));if(!decoded.ok)throw Error(JSON.stringify(decoded.diagnostics))
 let calls=0;const port:LayoutPort={layout:request=>{calls++;return Promise.resolve({ generation: request.generation, result: fixedLayout(request.scene) })}}
 const {result,rerender}=renderHook(({stepId})=>{const context=useContext(decoded.value,{architectureId:decoded.value.bundle.id,diagramId:'push',stepId},()=>{},()=>undefined);if(!context.input.ok)throw Error('input');return {input:context.input.value,...useDiagramRenderer(context.input.value,context,port)}},{initialProps:{stepId:'persist-wal'}})
 await waitFor(()=>expect(result.current.projected.ok).toBe(true));const input=result.current.input;const scene=result.current.projected;const before=calls
 rerender({stepId:'ack-push'});expect(result.current.input).toBe(input);expect(calls).toBe(before);expect(result.current.projected).toBe(scene);expect(result.current.canvasProps?.overlays?.[0].direction).toBe('reverse')
})
