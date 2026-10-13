import ELK from 'elkjs/lib/elk.bundled.js'
import type { ElkNode } from 'elkjs/lib/elk-api'
import { elkOutput } from './elk-output'
const engine = new ELK()
// A dedicated engine worker is terminated on completion, cancellation or timeout.
self.onmessage = async (event: MessageEvent<{ graph: ElkNode }>) => {
  try { self.postMessage({ ok: true, geometry: elkOutput(await engine.layout(event.data.graph)) }) }
  catch (error) { self.postMessage({ ok: false, message: error instanceof Error ? error.message : 'ELK layout failed.' }) }
}
