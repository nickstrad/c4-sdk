import type { ElkNode } from 'elkjs/lib/elk-api'
import type { Bounds, EdgeSection, Scene, SceneEdge } from '../../domain/geometry'
import type { SceneInput } from '../../domain/scene'
import type { Result } from '../../domain/model'
import { validateLayout } from '../../domain/layout'
import { nodeId, groupId, edgeId } from './elk-input'
export interface LayoutGeometry {
  readonly width: number; readonly height: number
  readonly nodes: readonly (Bounds & { id: string; labelBounds?: Bounds })[]
  readonly edges: readonly { id: string; sections: readonly EdgeSection[]; labelBounds?: Bounds }[]
}
/** ELK children and edge containers are local; publish absolute scene coordinates exactly once. */
export function elkOutput(root: ElkNode): LayoutGeometry {
  const nodes: LayoutGeometry['nodes'][number][] = []; const edges: LayoutGeometry['edges'][number][] = []
  const visit = (graph: ElkNode, x: number, y: number) => {
    for (const child of graph.children ?? []) {
      const cx = x + (child.x ?? NaN); const cy = y + (child.y ?? NaN)
      const label = child.labels?.[0]
      nodes.push({ id: child.id, x: cx, y: cy, width: child.width ?? NaN, height: child.height ?? NaN, ...(label ? { labelBounds: { x: cx + (label.x ?? 16), y: cy + (label.y ?? 16), width: label.width ?? NaN, height: label.height ?? NaN } } : {}) })
      visit(child, cx, cy)
    }
    for (const edge of graph.edges ?? []) {
      const label = edge.labels?.[0]
      const translate = (p: { x: number; y: number }) => ({ x: x + p.x, y: y + p.y })
      edges.push({ id: edge.id, sections: (edge.sections ?? []).map(section => ({ startPoint: translate(section.startPoint), endPoint: translate(section.endPoint), bendPoints: section.bendPoints?.map(translate) })), ...(label ? { labelBounds: { x: x + (label.x ?? NaN), y: y + (label.y ?? NaN), width: label.width ?? NaN, height: label.height ?? NaN } } : {}) })
    }
  }
  visit(root, 0, 0)
  return { width: root.width ?? NaN, height: root.height ?? NaN, nodes, edges }
}
export function attachGeometry(input: SceneInput, geometry: LayoutGeometry): Result<Scene> {
  try {
    const positions = new Map(geometry.nodes.map(node => [node.id, node]))
    const nodes = input.nodes.map(node => ({ ...node, ...positions.get(nodeId(node.element.id))! }))
    const groups = input.groups.map(group => ({ group, parentGroupId: group.parentGroupId, ...positions.get(groupId(group.id))! }))
    const routes = new Map(geometry.edges.map(edge => [edge.id, edge]))
    const edges: SceneEdge[] = input.edges.map(edge => {
      const route = routes.get(edgeId(edge.relationship.id))!
      const first = route.sections[0].startPoint; const last = route.sections.at(-1)!.endPoint
      return { ...edge, source: nodes.find(n => n.element.id === edge.relationship.sourceId)!, target: nodes.find(n => n.element.id === edge.relationship.targetId)!, sections: route.sections, labelBounds: route.labelBounds, x1: first.x, y1: first.y, x2: last.x, y2: last.y, labelX: route.labelBounds ? route.labelBounds.x + route.labelBounds.width / 2 : (first.x + last.x) / 2, labelY: route.labelBounds?.y ?? (first.y + last.y) / 2 }
    })
    return validateLayout(input, { ok: true, value: { architectureId: input.architectureId, revision: input.revision, diagram: input.diagram, kindLabel: input.kindLabel, statusText: input.statusText, nodes, groups, edges, width: geometry.width, height: geometry.height }, diagnostics: [] })
  } catch {
    return { ok: false, diagnostics: [{ code: 'layout', severity: 'error', path: '$.layout', message: 'Layout worker returned incomplete geometry.' }] }
  }
}
/** React Flow requires ancestors first and parent-relative positions, while the SDK stays absolute. */
export function relativeGeometry(scene: Scene) {
  const groups = new Map((scene.groups ?? []).map(group => [group.group.id, group]))
  const position = (item: Bounds & { parentGroupId?: string }) => {
    const parent = item.parentGroupId ? groups.get(item.parentGroupId) : undefined
    return { x: item.x - (parent?.x ?? 0), y: item.y - (parent?.y ?? 0) }
  }
  const ordered: NonNullable<Scene['groups']>[number][] = []; const seen = new Set<string>()
  const add = (group: NonNullable<Scene['groups']>[number]) => { if (seen.has(group.group.id)) return; if (group.parentGroupId) add(groups.get(group.parentGroupId)!); seen.add(group.group.id); ordered.push(group) }
  for (const group of groups.values()) add(group)
  return { groups: ordered.map(group => ({ id: groupId(group.group.id), parentId: group.parentGroupId ? groupId(group.parentGroupId) : undefined, position: position(group), group })), nodes: scene.nodes.map(node => ({ id: nodeId(node.element.id), parentId: node.parentGroupId ? groupId(node.parentGroupId) : undefined, position: position(node), node })) }
}
