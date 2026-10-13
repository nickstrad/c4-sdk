import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { selectDocumentation, selectDocument, selectDocumentReferences, safeDocumentationUrl } from '../../src/lib/c4/domain/documentation'
import { buildScene } from '../../src/lib/c4/domain/scene'
const fixture = () => JSON.parse(readFileSync('fixtures/component-docs.json', 'utf8'))
describe('component scope and documentation', () => {
  it('projects component presentation, planned notation and canonical detail', () => {
    const result = decodeArchitecture(fixture()); expect(result.ok).toBe(true)
    if (!result.ok) return
    const scene = buildScene(result.value.index, 'components'); expect(scene.ok).toBe(true)
    if (scene.ok) { expect(scene.value.nodes[0].kindLabel).toContain('Component ·'); expect(scene.value.nodes[1].stroke).toBe('dashed') }
    expect(result.diagnostics.filter(d => d.code === 'legend-coverage')).toEqual([])
  })
  it('rejects wrong parent, scope, out-of-scope members and wrong detail', () => {
    for (const mutate of [(b: ReturnType<typeof fixture>) => { b.model.elements.find((e: {id:string})=>e.id==='transactions').parentId='continuity' }, (b: ReturnType<typeof fixture>) => { b.diagrams[2].scopeId='continuity' }, (b: ReturnType<typeof fixture>) => { b.model.elements.find((e: {id:string})=>e.id==='transactions').parentId='repository' }, (b: ReturnType<typeof fixture>) => { b.diagrams[1].nodes[0].detail.diagramId='context' }]) {
      const bundle=fixture(); mutate(bundle); expect(decodeArchitecture(bundle).ok).toBe(false)
    }
  })
  it('does not leak selected docs across diagram/element changes and falls back from stale choice', () => {
    const result=decodeArchitecture(fixture()); if(!result.ok) throw Error('fixture')
    const selected=selectDocumentation(result.value.index,'components','transactions')
    expect(selectDocument(selected,'safety-doc')?.id).toBe('safety-doc')
    expect(selectDocumentReferences(selected, selectDocument(selected,'safety-doc')).terms).toEqual([])
    expect(selectDocumentReferences(selected, selectDocument(selected,'transactions-doc')).terms.map(term=>term.id)).toEqual(['reference-transaction'])
    const empty=selectDocumentation(result.value.index,'components','publication'); expect(selectDocument(empty,'safety-doc')).toBeUndefined()
    expect(selectDocumentation(result.value.index,'components','server').documents).toEqual([])
    expect(selectDocument(selected,'overview')?.id).toBe('transactions-doc')
  })
  it('filters decoded hostile URLs while preserving safe HTTPS and local destinations', () => {
    for(const url of ['javascript:alert(1)','data:text/html,a','//evil.test','https://user:pass@host.test','../secret','https://ok.test/\nfoo','%6aavascript:foo','\\evil.test']) expect(safeDocumentationUrl(url)).toBeUndefined()
    expect(safeDocumentationUrl('https://cursor.com/blog/git-at-any-scale')).toBeTruthy()
    expect(safeDocumentationUrl('guides/reference.md')).toBe('guides/reference.md')
    expect(safeDocumentationUrl('#definition')).toBe('#definition')
  })
})
