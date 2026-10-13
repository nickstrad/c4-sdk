import type { ArchitectureBundle, Diagnostic, ModelIndex, References } from './model'

function keyed<T extends { readonly id: string }>(items: readonly T[]): Readonly<Record<string, T>> {
  return Object.freeze(Object.assign(Object.create(null), Object.fromEntries(items.map(item => [item.id, item]))))
}
export function buildIndex(bundle: ArchitectureBundle): ModelIndex {
  return Object.freeze({ bundle, elements: keyed(bundle.model.elements), relationships: keyed(bundle.model.relationships), diagrams: keyed(bundle.diagrams), documents: keyed(bundle.documents), sources: keyed(bundle.sources), terms: keyed(bundle.terms) })
}

/** Checks references without constructing a usable index from invalid input. */
export function validateArchitecture(bundle: ArchitectureBundle): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const error = (code: string, path: string, message: string) => diagnostics.push({ code, path, message, severity: 'error' })
  const warning = (code: string, path: string, message: string) => diagnostics.push({ code, path, message, severity: 'warning' })
  const collections = { elements: bundle.model.elements, relationships: bundle.model.relationships, diagrams: bundle.diagrams, documents: bundle.documents, sources: bundle.sources, terms: bundle.terms }
  const ids = (items: readonly { readonly id: string }[], path: string) => {
    const seen = new Set<string>()
    items.forEach((item, i) => { if (seen.has(item.id)) error('duplicate-id', `${path}[${i}].id`, `Duplicate ID "${item.id}".`); seen.add(item.id) })
    return seen
  }
  const sets = {
    elements: ids(collections.elements, '$.model.elements'), relationships: ids(collections.relationships, '$.model.relationships'),
    diagrams: ids(collections.diagrams, '$.diagrams'), documents: ids(collections.documents, '$.documents'), sources: ids(collections.sources, '$.sources'), terms: ids(collections.terms, '$.terms'),
  }
  const reference = (set: Set<string>, id: string, path: string) => { if (!set.has(id)) error('missing-reference', path, `Unknown reference "${id}".`) }
  const refs = (item: References, path: string) => {
    item.docIds.forEach((id, i) => reference(sets.documents, id, `${path}.docIds[${i}]`))
    item.sourceIds.forEach((id, i) => reference(sets.sources, id, `${path}.sourceIds[${i}]`))
  }
  reference(sets.diagrams, bundle.defaultDiagramId, '$.defaultDiagramId')
  bundle.model.elements.forEach((item, i) => {
    const path = `$.model.elements[${i}]`; refs(item, path)
    if (item.status === 'mixed' && item.plannedNotes.length === 0) error('mixed-notes', `${path}.plannedNotes`, 'Mixed status requires planned notes.')
  })
  bundle.model.relationships.forEach((item, i) => {
    const path = `$.model.relationships[${i}]`; refs(item, path)
    reference(sets.elements, item.sourceId, `${path}.sourceId`); reference(sets.elements, item.targetId, `${path}.targetId`)
    if (item.status === 'mixed' && item.plannedNotes.length === 0) error('mixed-notes', `${path}.plannedNotes`, 'Mixed status requires planned notes.')
  })
  bundle.documents.forEach((item, i) => {
    const path = `$.documents[${i}]`; item.sourceIds.forEach((id, j) => reference(sets.sources, id, `${path}.sourceIds[${j}]`))
    item.termIds.forEach((id, j) => reference(sets.terms, id, `${path}.termIds[${j}]`))
    if (item.ste.reviewStatus === 'reviewed' && (!item.ste.reviewer?.trim() || !item.ste.reviewedAt)) error('review-metadata', `${path}.ste`, 'Reviewed text requires a reviewer and date.')
  })
  bundle.diagrams.forEach((diagram, i) => {
    const path = `$.diagrams[${i}]`; refs(diagram, path)
    reference(sets.elements, diagram.scopeId, `${path}.scopeId`)
    const scope = bundle.model.elements.find(item => item.id === diagram.scopeId)
    if (scope && scope.kind !== 'softwareSystem') error('invalid-scope', `${path}.scopeId`, 'Context scope must be a software system.')
    const members = new Set<string>(); const edges = new Set<string>()
    diagram.nodes.forEach((node, j) => {
      reference(sets.elements, node.elementId, `${path}.nodes[${j}].elementId`)
      if (members.has(node.elementId)) error('duplicate-member', `${path}.nodes[${j}].elementId`, 'Element occurs twice in this view.')
      members.add(node.elementId)
      if (diagram.layout?.mode === 'manual' && !node.position) error('missing-position', `${path}.nodes[${j}].position`, 'Manual layout requires every position.')
      if (diagram.layout?.mode !== 'manual' && node.position) error('partial-layout', `${path}.nodes[${j}].position`, 'Auto layout does not accept fixed positions. Use manual mode.')
    })
    if (!members.has(diagram.scopeId)) error('scope-not-visible', `${path}.scopeId`, 'The scoped system must appear in the view.')
    diagram.edges.forEach((edge, j) => {
      const edgePath = `${path}.edges[${j}].relationshipId`
      reference(sets.relationships, edge.relationshipId, edgePath)
      if (edges.has(edge.relationshipId)) error('duplicate-edge', edgePath, 'Relationship occurs twice in this view.')
      edges.add(edge.relationshipId)
      const relationship = bundle.model.relationships.find(item => item.id === edge.relationshipId)
      if (relationship) {
        if (!members.has(relationship.sourceId) || !members.has(relationship.targetId)) error('endpoint-not-visible', edgePath, 'Both relationship endpoints must appear in the view.')
        if (!relationship.technology) warning('missing-protocol', edgePath, `Relationship "${relationship.label}" has no protocol or technology.`)
      }
    })
    ids(diagram.legend.entries, `${path}.legend.entries`)
    const required = new Set<string>(['accent'])
    diagram.nodes.forEach(node => {
      const element = bundle.model.elements.find(item => item.id === node.elementId)
      if (element) required.add(element.kind === 'person' ? 'person' : element.tags.includes('external') ? 'external' : 'box')
      if (element?.status !== 'existing') required.add('dashed')
    })
    if (diagram.edges.length) required.add('forward')
    if (diagram.edges.some(edge => bundle.model.relationships.find(item => item.id === edge.relationshipId)?.status !== 'existing')) required.add('dashed')
    const swatches = diagram.legend.entries.map(entry => entry.swatch)
    required.forEach(notation => {
      if (!swatches.some(s => s.shape === notation || s.tone === notation || s.stroke === notation || s.arrow === notation)) warning('legend-coverage', `${path}.legend.entries`, `Key does not explain "${notation}" notation.`)
    })
    if (diagram.nodes.length > 200 || diagram.edges.length > 400) warning('large-view', path, 'This view exceeds the initial 200-node / 400-edge rendering target.')
  })
  return diagnostics
}
