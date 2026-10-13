import type { Diagram, Element, ModelIndex, Relationship, Result, Status } from './model'
export interface SceneNode { readonly element: Element; readonly x: number; readonly y: number; readonly width: number; readonly height: number; readonly tone: 'accent' | 'external' | 'default'; readonly stroke: 'solid' | 'dashed'; readonly kindLabel: string; readonly statusText: string }
export interface SceneEdge { readonly relationship: Relationship; readonly source: SceneNode; readonly target: SceneNode; readonly number?: number; readonly stroke: 'solid' | 'dashed'; readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly labelX: number; readonly labelY: number }
export interface Scene { readonly diagram: Diagram; readonly nodes: readonly SceneNode[]; readonly edges: readonly SceneEdge[]; readonly width: number; readonly height: number; readonly statusText: string }
export const statusLabel = (status: Status) => status === 'mixed' ? 'Existing system with planned changes' : status === 'planned' ? 'Planned architecture' : 'Existing architecture'
export interface SceneInput {
  readonly diagram: Diagram
  readonly nodes: readonly { readonly element: Element; readonly kindLabel: string }[]
  readonly edges: readonly { readonly relationship: Relationship }[]
}
export function buildScene(index: ModelIndex, diagramId: string): Result<SceneInput> {
  const diagram = index.diagrams[diagramId]
  const fail = (path: string, message: string): Result<SceneInput> => ({ ok: false, diagnostics: [{ code: 'projection', severity: 'error', path, message }] })
  if (!diagram) return fail('$.diagramId', `Unknown diagram "${diagramId}".`)
  const nodes: SceneInput['nodes'][number][] = []
  for (const [i, member] of diagram.nodes.entries()) {
    const element = index.elements[member.elementId]
    if (!element) return fail(`$.nodes[${i}]`, 'Cannot project an unknown element.')
    const kindLabel = element.kind === 'person' ? 'Person' : element.kind === 'container' ? `${element.containerType === 'datastore' ? 'Data store' : 'Application'} · ${element.technology}` : element.tags.includes('external') ? 'External software system' : 'Software system'
    nodes.push({ element, kindLabel })
  }
  const edges: SceneInput['edges'][number][] = []
  for (const [i, edge] of diagram.edges.entries()) {
    const relationship = index.relationships[edge.relationshipId]
    if (!relationship || !nodes.some(node => node.element.id === relationship.sourceId) || !nodes.some(node => node.element.id === relationship.targetId)) return fail(`$.edges[${i}]`, 'Cannot project a relationship with absent endpoints.')
    edges.push({ relationship })
  }
  return { ok: true, value: { diagram, nodes, edges }, diagnostics: [] }
}
