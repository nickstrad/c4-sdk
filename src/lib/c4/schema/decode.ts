import { z } from 'zod'
import type { ArchitectureBundle, Diagnostic, Result, ValidatedArchitecture } from '../domain/model'
import { buildIndex, validateArchitecture } from '../domain/architecture'

const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/)
const text = z.string().trim().min(1).max(2000)
const body = z.string().min(1).max(100_000)
const ids = z.array(id).max(10_000).default([])
const strings = z.array(text).max(1000).default([])
const status = z.enum(['existing', 'planned', 'mixed'])
const references = { docIds: ids, sourceIds: ids }
const elementBase = { id, name: text, description: text, status, technology: text.optional(), tags: strings, plannedNotes: strings, ...references }
const element = z.discriminatedUnion('kind', [z.strictObject({ ...elementBase, kind: z.literal('person') }), z.strictObject({ ...elementBase, kind: z.literal('softwareSystem') }), z.strictObject({ ...elementBase, kind: z.literal('container'), parentId: id, technology: text, containerType: z.enum(['application', 'datastore']).default('application') }), z.strictObject({ ...elementBase, kind: z.literal('component'), parentId: id, technology: text })])
const target = z.strictObject({ diagramId: id, elementId: id.optional() })
const links = z.array(z.strictObject({ diagramId: id, elementId: id.optional(), label: text })).max(200).default([])
const relationship = z.strictObject({ id, sourceId: id, targetId: id, label: text, status, technology: text.optional(), kind: z.enum(['dependency', 'association']).default('dependency'), plannedNotes: strings, ...references })
const swatch = z.strictObject({ shape: z.enum(['person', 'box', 'database', 'boundary', 'line']).optional(), tone: z.enum(['default', 'external', 'accent', 'muted']), stroke: z.enum(['solid', 'dashed', 'dotted']), arrow: z.enum(['none', 'forward']).optional() })
const legend = z.strictObject({ title: text, entries: z.array(z.strictObject({ id, label: text, description: text, swatch })).max(100) })
const groups = z.array(z.strictObject({ id, label: text, memberIds: ids, status, parentGroupId: id.optional() })).max(5000).default([])
const diagram = z.strictObject({ id, kind: z.enum(['context', 'container', 'component']), parent: target.optional(), related: links, groups, title: text, status, scopeId: id,
  nodes: z.array(z.strictObject({ elementId: id, detail: target.optional(), related: links, position: z.strictObject({ x: z.number().finite(), y: z.number().finite() }).optional(), size: z.strictObject({ width: z.number().finite().positive().max(2000), height: z.number().finite().positive().max(2000) }).optional() })).max(5000),
  edges: z.array(z.strictObject({ relationshipId: id, displayNumber: z.number().int().positive().optional() })).max(10_000), legend,
  layout: z.strictObject({ mode: z.enum(['manual', 'auto']), direction: z.enum(['TB', 'LR']), spacing: z.number().finite().positive().max(500).optional() }).optional(), ...references,
})
const document = z.strictObject({ id, title: text, plain: body, ste: z.strictObject({ text: body, issue: text, reviewStatus: z.enum(['draft', 'reviewed']), reviewer: text.optional(), reviewedAt: z.iso.date().optional() }), termIds: ids, sourceIds: ids })
// Shape-only editor schema; runtime additionally checks safe resource URLs and all references.
const source = z.strictObject({ id, title: text, url: z.string().min(1).max(2000), revision: text.optional(), path: text.optional(), notes: text.optional() })
export const architectureSchema = z.strictObject({ schemaVersion: z.literal(1), id, title: text, revision: text, defaultDiagramId: id,
  model: z.strictObject({ elements: z.array(element).max(5000), relationships: z.array(relationship).max(10_000) }),
  diagrams: z.array(diagram).min(1).max(200), documents: z.array(document).max(10_000), sources: z.array(source).max(10_000),
  terms: z.array(z.strictObject({ id, text, definition: text, category: z.enum(['technicalNoun', 'technicalVerb']) })).max(10_000).default([]),
})
// This assignment fails compilation if runtime output drifts from the domain contract.
const domainSchema: z.ZodType<ArchitectureBundle> = architectureSchema
export const architectureJsonSchema = z.toJSONSchema(architectureSchema)

export function isSafeResourceUrl(value: string): boolean {
  if (/[\\\s]/.test(value) || [...value].some(character => character.charCodeAt(0) < 32)) return false
  if (value.startsWith('https://')) {
    try { const url = new URL(value); return !url.username && !url.password && !!url.hostname } catch { return false }
  }
  return /^[a-zA-Z0-9._~-]+(?:\/[a-zA-Z0-9._~-]+)*(?:[?#][a-zA-Z0-9._~!$&'()*+,;=:@%/?#-]*)?$/.test(value) && !value.split(/[/?#]/).some(part => part === '..' || part === '.') && !value.includes('%')
}
function boundedTree(value: unknown, depth = 0, ancestors = new Set<unknown>()): boolean {
  if (depth > 32) return false
  if (!value || typeof value !== 'object') return true
  if (ancestors.has(value)) return false
  const next = new Set(ancestors); next.add(value)
  return Object.values(value).every(child => boundedTree(child, depth + 1, next))
}
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value) }
  return value
}
export function decodeArchitecture(input: unknown): Result<ValidatedArchitecture> {
  if (!boundedTree(input)) return { ok: false, diagnostics: [{ code: 'resource-limit', path: '$', severity: 'error', message: 'Input exceeds depth 32 or contains a cycle.' }] }
  const parsed = domainSchema.safeParse(input)
  if (!parsed.success) return { ok: false, diagnostics: parsed.error.issues.map(issue => ({ code: 'schema', path: '$' + issue.path.map(part => typeof part === 'number' ? `[${part}]` : `.${String(part)}`).join(''), severity: 'error', message: issue.code === 'unrecognized_keys' ? `Unsupported fields: ${issue.keys.join(', ')}. Supported views are context, container and component; later diagram kinds are not yet supported.` : issue.message })) }
  const bundle = parsed.data
  const diagnostics: Diagnostic[] = validateArchitecture(bundle)
  bundle.sources.forEach((item, i) => {
    if (!isSafeResourceUrl(item.url)) diagnostics.push({ code: 'unsafe-url', path: `$.sources[${i}].url`, severity: 'error', message: 'Use HTTPS without credentials or a safe relative resource URL.' })
    if (item.path && (item.path.startsWith('/') || item.path.includes('\\') || item.path.split('/').includes('..'))) diagnostics.push({ code: 'unsafe-path', path: `$.sources[${i}].path`, severity: 'error', message: 'Source paths must be relative, with no parent traversal.' })
  })
  if (diagnostics.some(item => item.severity === 'error')) return { ok: false, diagnostics }
  freeze(bundle)
  return { ok: true, value: Object.freeze({ bundle, index: buildIndex(bundle), diagnostics: Object.freeze(diagnostics) }), diagnostics }
}
