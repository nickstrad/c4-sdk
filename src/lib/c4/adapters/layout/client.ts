import type { LayoutPort, LayoutResponse } from '../../ports/layout'
import { manualLayout } from '../../domain/layout'
import { elkInput, layoutCacheKey } from './elk-input'
import { attachGeometry } from './elk-output'
import type { LayoutGeometry } from './elk-output'
export interface LayoutWorker {
  postMessage(message: unknown): void; terminate(): void
  onmessage: ((event: MessageEvent) => void) | null; onerror: ((event: ErrorEvent) => void) | null; onmessageerror: ((event: MessageEvent) => void) | null
}
export const createLayoutWorker = (): LayoutWorker => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
/** Cache geometry only; a hit still reattaches this caller's original model references. */
export function createElkLayoutPort(factory: () => LayoutWorker = createLayoutWorker): LayoutPort {
  const cache = new Map<string, LayoutGeometry>()
  return { layout(request) {
    const response = (result: LayoutResponse['result']): LayoutResponse => ({ generation: request.generation, measurementRevision: request.measurements?.revision, result })
    const failure = (message: string) => response({ ok: false, diagnostics: [{ code: 'layout', path: '$.layout', severity: 'error', message }] })
    const timeout = request.timeoutMs ?? 10000
    if (!Number.isFinite(timeout) || timeout <= 0 || timeout > 2147483647) return Promise.resolve(failure('Layout timeout must be finite, positive and no greater than 2147483647 ms.'))
    if (request.signal.aborted) return Promise.resolve(failure('Layout cancelled.'))
    if (request.scene.diagram.layout?.mode === 'manual') return Promise.resolve(response(manualLayout(request.scene, request.measurements)))
    const key = layoutCacheKey(request.scene, request.measurements)
    const cached = cache.get(key)
    if (cached) return Promise.resolve(response(attachGeometry(request.scene, cached)))
    return new Promise(resolve => {
      let worker: LayoutWorker | undefined; let timer: ReturnType<typeof setTimeout> | undefined; let settled = false
      const finish = (value: LayoutResponse) => {
        if (settled) return; settled = true
        if (timer) clearTimeout(timer)
        request.signal.removeEventListener('abort', abort)
        if (worker) { worker.onmessage = null; worker.onerror = null; worker.onmessageerror = null; worker.terminate() }
        resolve(value)
      }
      const abort = () => finish(failure('Layout cancelled.'))
      try {
        worker = factory()
        request.signal.addEventListener('abort', abort, { once: true })
        if (request.signal.aborted) { abort(); return }
        worker.onerror = () => finish(failure('Layout worker failed to load or execute.'))
        worker.onmessageerror = () => finish(failure('Layout worker returned an unreadable message.'))
        worker.onmessage = event => {
          const data = event.data
          if (!data?.ok) { finish(failure(typeof data?.message === 'string' ? data.message : 'Layout worker failed.')); return }
          const result = attachGeometry(request.scene, data.geometry)
          if (result.ok) { cache.set(key, data.geometry); if (cache.size > 24) cache.delete(cache.keys().next().value!) }
          finish(response(result))
        }
        timer = setTimeout(() => finish(failure(`Layout exceeded ${timeout} ms. Use a smaller view or retry.`)), timeout)
        worker.postMessage({ graph: elkInput(request.scene, request.measurements) })
      } catch (error) { finish(failure(error instanceof Error ? error.message : 'Layout worker unavailable.')) }
    })
  } }
}
