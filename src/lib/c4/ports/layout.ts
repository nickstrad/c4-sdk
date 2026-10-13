import type { Result } from '../domain/model'
import type { Scene, SceneInput } from '../domain/scene'
export interface LayoutRequest { readonly scene: SceneInput; readonly generation: number; readonly signal: AbortSignal }
export interface LayoutResponse { readonly generation: number; readonly result: Result<Scene> }
/** Return finite geometry or actionable errors. Aborted generations must never publish. */
export interface LayoutPort { readonly layout: (request: LayoutRequest) => Promise<LayoutResponse> }
