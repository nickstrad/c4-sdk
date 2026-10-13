import { expect, it } from 'vitest'
import fc from 'fast-check'
import type { Step } from '../../src/lib/c4/domain/model'
import { interactions, precedence, readingSelections, scenarioItems } from '../../src/lib/c4/domain/scenario'
import { formatRoute, parseRoute } from '../../src/lib/c4/domain/navigation'
const leaf=(id:string):Step=>({kind:'interaction',id,relationshipId:'relation',direction:'forward',label:id})
it('unequal parallel branches preserve only their local order and join prerequisites',()=> {
 fc.assert(fc.property(fc.integer({min:1,max:12}),fc.integer({min:1,max:12}),(a,b)=> {
 const left=Array.from({length:a},(_,i)=>leaf(`a${i}`));const right=Array.from({length:b},(_,i)=>leaf(`b${i}`))
 const root:Step={kind:'sequence',id:'root',children:[leaf('before'),{kind:'parallel',id:'parallel',branches:[{kind:'sequence',id:'left',children:left},{kind:'sequence',id:'right',children:right}]},leaf('after')]}
 const pairs=new Set(precedence(root).map(([a,b])=>JSON.stringify([a,b])));for(let i=0;i<a;i++)for(let j=0;j<b;j++){expect(pairs.has(JSON.stringify([`a${i}`,`b${j}`]))).toBe(false);expect(pairs.has(JSON.stringify([`b${j}`,`a${i}`]))).toBe(false)}
 for(const branch of [left,right])for(let i=0;i<branch.length;i++){expect(pairs.has(JSON.stringify(['before',branch[i].id]))).toBe(true);expect(pairs.has(JSON.stringify([branch[i].id,'after']))).toBe(true);for(let j=i+1;j<branch.length;j++)expect(pairs.has(JSON.stringify([branch[i].id,branch[j].id]))).toBe(true)}
 expect(new Set(readingSelections(scenarioItems(root)).map(item=>item.id)).size).toBe(a+b+6);expect(interactions(root)).toHaveLength(a+b+2)
 }),{numRuns:150,seed:405})
})
it('step and optional participant URLs round trip without query ambiguity',()=> {
 const id=fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789._-'),{minLength:1,maxLength:30}).map(chars=>'a'+chars.join(''))
 fc.assert(fc.property(id,id,id,fc.option(id,{nil:undefined}),(architectureId,diagramId,stepId,elementId)=>{const route={architectureId,diagramId,stepId,...(elementId?{elementId}:{})};expect(parseRoute(formatRoute(route))).toMatchObject({ok:true,value:route})}),{numRuns:300,seed:405})
})
