import type { Result } from './model'
import type { Scene, SceneInput, SceneNode, SceneEdge } from './scene'
import { statusLabel } from './scene'
export function fixedLayout(input: SceneInput): Result<Scene> {
  const { diagram } = input
  const failure = (path: string, message: string): Result<Scene> => ({ ok: false, diagnostics: [{ code: 'projection', severity: 'error', path, message }] })
  const nodes: SceneNode[] = []
  const columnWidth = Math.max(220, ...diagram.nodes.map(member => member.size?.width ?? 220))
  const rowHeight = Math.max(166, ...diagram.nodes.map(member => member.size?.height ?? 166))
  for (const [i, member] of diagram.nodes.entries()) {
    const element = input.nodes[i].element
    if (!element) return failure(`$.nodes[${i}]`, 'Cannot project an unknown element.')
    const horizontal = diagram.layout?.direction === 'LR'
    const spacing = diagram.layout?.spacing ?? 100
    const x = member.position?.x ?? (horizontal ? i % 3 * (columnWidth + spacing) + 40 : 280)
    const y = member.position?.y ?? (horizontal ? Math.floor(i / 3) * (rowHeight + spacing + 80) + 130 : i * (rowHeight + spacing) + 100)
    nodes.push({ element, x, y, width: member.size?.width ?? 220, height: member.size?.height ?? 166, tone: element.id === diagram.scopeId ? 'accent' : element.tags.includes('external') ? 'external' : 'default', stroke: element.status === 'existing' ? 'solid' : 'dashed', statusText: element.status === 'mixed' ? 'Existing + planned changes' : element.status, kindLabel: input.nodes[i].kindLabel })
  }
  const shiftX = Math.max(0, 40 - Math.min(...nodes.map(node => node.x)))
  const shiftY = Math.max(0, 100 - Math.min(...nodes.map(node => node.y)))
  nodes.forEach((node, i) => { nodes[i] = { ...node, x: node.x + shiftX, y: node.y + shiftY } })
  if (nodes.some(node => !Number.isFinite(node.x + node.width) || !Number.isFinite(node.y + node.height))) return failure('$.nodes', 'Positions exceed the finite canvas geometry range. Reduce the distance between members.')
  const tinyNode = nodes.findIndex(node => node.width / 2 === 0 || node.height / 2 === 0)
  if (tinyNode !== -1) return failure(`$.nodes[${tinyNode}].size`, 'Size is too small to represent canvas geometry. Increase the member width and height.')
  const edges: SceneEdge[] = []
  for (const [i, edge] of diagram.edges.entries()) {
    const relationship = input.edges[i].relationship
    const source = nodes.find(node => node.element.id === relationship?.sourceId)
    const target = nodes.find(node => node.element.id === relationship?.targetId)
    if (!relationship || !source || !target) return failure(`$.edges[${i}]`, 'Cannot project a relationship with absent endpoints.')
    const sx = source.x + source.width / 2; const sy = source.y + source.height / 2
    const tx = target.x + target.width / 2; const ty = target.y + target.height / 2
    const dx = tx - sx; const dy = ty - sy
    const sourceRatio = Math.max(Math.abs(dx) / (source.width / 2), Math.abs(dy) / (source.height / 2), 1)
    const targetRatio = Math.max(Math.abs(dx) / (target.width / 2), Math.abs(dy) / (target.height / 2), 1)
    const horizontalGap = Math.max(source.x, target.x) - Math.min(source.x + source.width, target.x + target.width)
    edges.push({ relationship, source, target, number: edge.displayNumber, stroke: relationship.status === 'existing' ? 'solid' : 'dashed', x1: sx + dx / sourceRatio, y1: sy + dy / sourceRatio, x2: tx - dx / targetRatio, y2: ty - dy / targetRatio, labelX: sx / 2 + tx / 2, labelY: Math.abs(dx) >= Math.abs(dy) ? horizontalGap >= 310 ? sy / 2 + ty / 2 - 60 : Math.min(source.y, target.y) - 72 : sy / 2 + ty / 2 - 20 })
  }
  const width = Math.max(960, ...nodes.map(node => node.x + node.width + 40))
  const height = Math.max(350, ...nodes.map(node => node.y + node.height + 40))
  const geometry = [width, height, ...nodes.flatMap(node => [node.x, node.y, node.width, node.height]), ...edges.flatMap(edge => [edge.x1, edge.y1, edge.x2, edge.y2, edge.labelX, edge.labelY])]
  if (!geometry.every(Number.isFinite)) return failure('$.layout', 'Canvas geometry is not finite. Reduce member coordinates or increase very small member sizes.')
  return { ok: true, value: { diagram, nodes, edges, width, height, statusText: statusLabel(diagram.status) }, diagnostics: [] }
}

/** A layout adapter cannot change scene membership or publish nonfinite geometry. */
export function validateLayout(input: SceneInput, result: Result<Scene>): Result<Scene> {
  if (!result.ok) return result
  const scene = result.value
  const expectedNodes = input.nodes.map(node => node.element.id)
  const expectedEdges = input.edges.map(edge => edge.relationship.id)
  const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((id, i) => id === b[i])
  const geometry = [scene.width, scene.height, ...scene.nodes.flatMap(node => [node.x, node.y, node.width, node.height]), ...scene.edges.flatMap(edge => [edge.x1, edge.y1, edge.x2, edge.y2, edge.labelX, edge.labelY])]
  const endpoints = scene.edges.every((edge, i) => edge.source.element.id === input.edges[i]?.relationship.sourceId && edge.target.element.id === input.edges[i]?.relationship.targetId)
  if (scene.diagram.id !== input.diagram.id || !same(expectedNodes, scene.nodes.map(node => node.element.id)) || !same(expectedEdges, scene.edges.map(edge => edge.relationship.id)) || !endpoints || !geometry.every(Number.isFinite) || scene.width <= 0 || scene.height <= 0 || scene.nodes.some(node => node.width <= 0 || node.height <= 0)) return { ok: false, diagnostics: [{ code: 'layout', path: '$.layout', severity: 'error', message: 'Layout must preserve scene membership and endpoints with finite positive geometry.' }] }
  return result
}
