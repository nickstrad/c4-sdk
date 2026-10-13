import type { ContextDiagram, Diagnostic, Document, Element, LegendSpec, ModelIndex, Relationship, Result, Source, Status, Term } from './model'
export interface SceneNode { readonly element: Element; readonly x: number; readonly y: number; readonly width: number; readonly height: number; readonly tone: 'accent' | 'external' | 'default'; readonly stroke: 'solid' | 'dashed'; readonly kindLabel: string; readonly statusText: string }
export interface SceneEdge { readonly relationship: Relationship; readonly source: SceneNode; readonly target: SceneNode; readonly number?: number; readonly stroke: 'solid' | 'dashed'; readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly labelX: number; readonly labelY: number }
export interface Scene { readonly diagram: ContextDiagram; readonly nodes: readonly SceneNode[]; readonly edges: readonly SceneEdge[]; readonly width: number; readonly height: number; readonly statusText: string }
export interface DocumentSelection { readonly title: string; readonly description?: string; readonly statusText?: string; readonly plannedNotes: readonly string[]; readonly documents: readonly Document[]; readonly sources: readonly Source[]; readonly terms: readonly Term[] }
export const statusLabel = (status: Status) => status === 'mixed' ? 'Existing system with planned changes' : status === 'planned' ? 'Planned architecture' : 'Existing architecture'
export function projectDiagram(index: ModelIndex, diagramId: string): Result<Scene> {
  const diagram = index.diagrams[diagramId]
  const failure = (path: string, message: string): Result<Scene> => ({ ok: false, diagnostics: [{ code: 'projection', severity: 'error', path, message }] })
  if (!diagram) return failure('$.diagramId', `Unknown diagram "${diagramId}".`)
  const nodes: SceneNode[] = []
  const columnWidth = Math.max(220, ...diagram.nodes.map(member => member.size?.width ?? 220))
  const rowHeight = Math.max(166, ...diagram.nodes.map(member => member.size?.height ?? 166))
  for (const [i, member] of diagram.nodes.entries()) {
    const element = index.elements[member.elementId]
    if (!element) return failure(`$.nodes[${i}]`, 'Cannot project an unknown element.')
    const horizontal = diagram.layout?.direction === 'LR'
    const spacing = diagram.layout?.spacing ?? 100
    const x = member.position?.x ?? (horizontal ? i % 3 * (columnWidth + spacing) + 40 : 280)
    const y = member.position?.y ?? (horizontal ? Math.floor(i / 3) * (rowHeight + spacing + 80) + 130 : i * (rowHeight + spacing) + 100)
    nodes.push({ element, x, y, width: member.size?.width ?? 220, height: member.size?.height ?? 166, tone: element.id === diagram.scopeId ? 'accent' : element.tags.includes('external') ? 'external' : 'default', stroke: element.status === 'existing' ? 'solid' : 'dashed', statusText: element.status === 'mixed' ? 'Existing + planned changes' : element.status, kindLabel: element.kind === 'person' ? 'Person' : element.tags.includes('external') ? 'External software system' : 'Software system' })
  }
  const shiftX = Math.max(0, 40 - Math.min(...nodes.map(node => node.x)))
  const shiftY = Math.max(0, 100 - Math.min(...nodes.map(node => node.y)))
  nodes.forEach((node, i) => { nodes[i] = { ...node, x: node.x + shiftX, y: node.y + shiftY } })
  if (nodes.some(node => !Number.isFinite(node.x + node.width) || !Number.isFinite(node.y + node.height))) return failure('$.nodes', 'Positions exceed the finite canvas geometry range.')
  const edges: SceneEdge[] = []
  for (const [i, edge] of diagram.edges.entries()) {
    const relationship = index.relationships[edge.relationshipId]
    const source = nodes.find(node => node.element.id === relationship?.sourceId)
    const target = nodes.find(node => node.element.id === relationship?.targetId)
    if (!relationship || !source || !target) return failure(`$.edges[${i}]`, 'Cannot project a relationship with absent endpoints.')
    const sx = source.x + source.width / 2; const sy = source.y + source.height / 2
    const tx = target.x + target.width / 2; const ty = target.y + target.height / 2
    const dx = tx - sx; const dy = ty - sy
    const sourceRatio = Math.max(Math.abs(dx) / (source.width / 2), Math.abs(dy) / (source.height / 2), 1)
    const targetRatio = Math.max(Math.abs(dx) / (target.width / 2), Math.abs(dy) / (target.height / 2), 1)
    edges.push({ relationship, source, target, number: edge.displayNumber, stroke: relationship.status === 'existing' ? 'solid' : 'dashed', x1: sx + dx / sourceRatio, y1: sy + dy / sourceRatio, x2: tx - dx / targetRatio, y2: ty - dy / targetRatio, labelX: (sx + tx) / 2, labelY: Math.abs(dx) >= Math.abs(dy) ? Math.min(source.y, target.y) - 72 : (sy + ty) / 2 - 20 })
  }
  return { ok: true, value: { diagram, nodes, edges, width: Math.max(960, ...nodes.map(node => node.x + node.width + 40)), height: Math.max(350, ...nodes.map(node => node.y + node.height + 40)), statusText: statusLabel(diagram.status) }, diagnostics: [] }
}
export function selectDocumentation(index: ModelIndex, diagramId: string, elementId?: string): DocumentSelection {
  const visible = !elementId || index.diagrams[diagramId]?.nodes.some(member => member.elementId === elementId)
  const item = visible ? elementId ? index.elements[elementId] : index.diagrams[diagramId] : undefined
  const documents = (item?.docIds ?? []).map(id => index.documents[id]).filter((doc): doc is Document => !!doc)
  const sourceIds = new Set([...(item?.sourceIds ?? []), ...documents.flatMap(doc => doc.sourceIds)])
  const termIds = new Set(documents.flatMap(doc => doc.termIds))
  return { plannedNotes: elementId && visible ? index.elements[elementId]?.plannedNotes ?? [] : [], statusText: item ? statusLabel(item.status) : undefined, title: elementId ? visible ? index.elements[elementId]?.name ?? 'Unknown element' : 'Element is not in this diagram' : index.diagrams[diagramId]?.title ?? 'Unknown diagram', description: elementId && visible ? index.elements[elementId]?.description : undefined, documents, sources: [...sourceIds].map(id => index.sources[id]).filter((source): source is Source => !!source), terms: [...termIds].map(id => index.terms[id]).filter((term): term is Term => !!term) }
}
export function resolveLegend(index: ModelIndex, diagramId: string): LegendSpec | undefined { return index.diagrams[diagramId]?.legend }
export function loadingFailure(message: string): readonly Diagnostic[] { return [{ code: 'load', path: '$', severity: 'error', message }] }

export function resourceStatus(pending: boolean, architecture: { readonly bundle: { readonly title: string; readonly revision: string } } | undefined, diagnostics: readonly Diagnostic[]): string {
  if (pending) return 'Loading architecture…'
  if (architecture && diagnostics.some(item => item.severity === 'error')) return 'Resource rejected. The last valid architecture remains visible.'
  return architecture ? `${architecture.bundle.title} · Revision ${architecture.bundle.revision}` : 'No valid architecture loaded.'
}
