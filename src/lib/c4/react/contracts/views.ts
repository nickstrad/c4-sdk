import type { MouseEventHandler, ReactNode } from 'react'
import type { Diagnostic, LegendSpec, Source } from '../../domain/model'
import type { DocumentSelection, Scene, SceneNode } from '../../domain/presentation'
export interface DestinationLinkProps { readonly href: string; readonly onClick: MouseEventHandler<HTMLAnchorElement> }
export interface DiagramCanvasProps { readonly markerId: string; readonly scene: Scene; readonly nodes: readonly (SceneNode & { readonly selected: boolean; readonly onSelect: () => void; readonly onInspect: () => void; readonly detail?: DestinationLinkProps })[]; readonly onDiagramSelect: () => void }
export interface ContextViewProps { readonly scene: Scene; readonly canvasSlot: ReactNode; readonly onDiagramSelect: () => void }
export type DocumentationSlot = (props: DocumentationViewProps) => ReactNode
export interface DocumentationViewProps { readonly selection: DocumentSelection; readonly mode: 'plain' | 'ste'; readonly onPlain: () => void; readonly onSte: () => void }
export interface LegendProps extends LegendSpec { readonly compact?: boolean }
export interface DiagnosticViewProps { readonly diagnostics: readonly Diagnostic[] }
export interface SourceListProps { readonly sources: readonly Source[] }
