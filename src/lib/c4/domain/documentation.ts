import type { Document, LegendSpec, ModelIndex, Source, Term } from './model'
import { statusLabel } from './scene'
export interface DocumentSelection { readonly title: string; readonly description?: string; readonly statusText?: string; readonly plannedNotes: readonly string[]; readonly documents: readonly Document[]; readonly sources: readonly Source[]; readonly terms: readonly Term[] }
export function selectDocumentation(index: ModelIndex, diagramId: string, elementId?: string): DocumentSelection {
  const visible = !elementId || index.diagrams[diagramId]?.nodes.some(member => member.elementId === elementId)
  const item = visible ? elementId ? index.elements[elementId] : index.diagrams[diagramId] : undefined
  const documents = (item?.docIds ?? []).map(id => index.documents[id]).filter((doc): doc is Document => !!doc)
  const sourceIds = new Set([...(item?.sourceIds ?? []), ...documents.flatMap(doc => doc.sourceIds)])
  const termIds = new Set(documents.flatMap(doc => doc.termIds))
  return { plannedNotes: elementId && visible ? index.elements[elementId]?.plannedNotes ?? [] : [], statusText: item ? statusLabel(item.status) : undefined, title: elementId ? visible ? index.elements[elementId]?.name ?? 'Unknown element' : 'Element is not in this diagram' : index.diagrams[diagramId]?.title ?? 'Unknown diagram', description: elementId && visible ? index.elements[elementId]?.description : undefined, documents, sources: [...sourceIds].map(id => index.sources[id]).filter((source): source is Source => !!source), terms: [...termIds].map(id => index.terms[id]).filter((term): term is Term => !!term) }
}
export function resolveLegend(index: ModelIndex, diagramId: string): LegendSpec | undefined { return index.diagrams[diagramId]?.legend }
