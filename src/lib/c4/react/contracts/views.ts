import type { Diagnostic, LegendSpec, Source } from '../../domain/model'
import type { DocumentSelection, Scene, SceneNode } from '../../domain/presentation'
export interface ContextViewProps { readonly markerId: string; readonly scene: Scene; readonly nodes: readonly (SceneNode & { readonly selected: boolean; readonly onSelect: () => void })[]; readonly onDiagramSelect: () => void }
export interface DocumentationViewProps { readonly selection: DocumentSelection; readonly mode: 'plain' | 'ste'; readonly onPlain: () => void; readonly onSte: () => void }
export interface LegendProps extends LegendSpec { readonly compact?: boolean }
export interface DiagnosticViewProps { readonly diagnostics: readonly Diagnostic[] }
export interface SourceListProps { readonly sources: readonly Source[] }
