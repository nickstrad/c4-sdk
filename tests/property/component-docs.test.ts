import { readFileSync } from 'node:fs'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { expect, it } from 'vitest'
import fc from 'fast-check'
import { safeDocumentationUrl, selectDocument } from '../../src/lib/c4/domain/documentation'
import type { DocumentSelection } from '../../src/lib/c4/domain/documentation'
it('URL filtering never admits a non-HTTPS scheme or authority-relative destination',()=> {
 fc.assert(fc.property(fc.string(),value=> { const safe=safeDocumentationUrl(value); if(safe) { expect(safe.startsWith('//')).toBe(false); if(/^[^/?#]*:/.test(safe)) expect(new URL(safe).protocol).toBe('https:') } }),{numRuns:300,seed:403})
})
it('stale document choices never select a document outside the current selection',()=> {
 fc.assert(fc.property(fc.uniqueArray(fc.string()),fc.string(),(ids,choice)=> {
 const documents=ids.map(id=>({id,title:id,plain:'p',ste:{text:'s',issue:'9',reviewStatus:'draft' as const},sourceIds:[],termIds:[]}))
 const selection:DocumentSelection={title:'t',documents,sources:[],terms:[],plannedNotes:[]}
 const doc=selectDocument(selection,choice); expect(!doc||documents.some(document=>document === doc)).toBe(true); expect(doc?.id).toBe(ids.includes(choice)?choice:ids[0])
 }),{numRuns:200,seed:403})
})

it('component status projection and legend coverage survive generated status choices',()=> {
 fc.assert(fc.property(fc.constantFrom('existing','planned','mixed'), status=> {
 const source=JSON.parse(readFileSync('fixtures/component-docs.json','utf8'))
 const component=source.model.elements.find((element:{id:string})=>element.id==='transactions')
 component.status=status; component.plannedNotes=status==='mixed'?['Illustrative change']:[]
 const decoded=decodeArchitecture(source); expect(decoded.ok).toBe(true)
 if(!decoded.ok) return
 expect(decoded.diagnostics.filter(diagnostic=>diagnostic.code==='legend-coverage')).toEqual([])
 const projected=buildScene(decoded.value.index,'components'); expect(projected.ok).toBe(true)
 if(projected.ok) expect(projected.value.nodes.find(node=>node.element.id==='transactions')?.stroke).toBe(status==='existing'?'solid':'dashed')
 }),{numRuns:100,seed:403})
})
