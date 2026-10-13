import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import fc from 'fast-check'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { projectDeployment } from '../../src/lib/c4/domain/deployment'
const fixture=()=>JSON.parse(readFileSync('fixtures/deployment.json','utf8'))
it('every collapse combination keeps distinct IDs, full selected ancestry and no orphan or invented edges',()=> {
 const decoded=decodeArchitecture(fixture());if(!decoded.ok)throw Error('fixture');const index=decoded.value.index;const diagram=index.diagrams.deployment;if(diagram.kind!=='deployment')throw Error('kind')
 fc.assert(fc.property(fc.subarray(['demo-region','demo-host-a','demo-host-b']),fc.option(fc.constantFrom('server-a','server-b','repository-a'),{nil:undefined}), (collapsed,selected)=> {
  const view=projectDeployment(index,diagram,collapsed,selected);const ids=view.nodes.map(node=>node.elementId)
  expect(new Set(ids).size).toBe(ids.length);if(selected)expect(ids).toContain(selected)
  for(const ref of view.edges){expect(diagram.edges).toContainEqual(ref);const edge=index.relationships[ref.relationshipId];expect(ids).toContain(edge.sourceId);expect(ids).toContain(edge.targetId)}
  expect(view.groups?.flatMap(group=>group.memberIds).sort()).toEqual([...ids].sort())
 }),{numRuns:100})
})
it('arbitrary environment mismatches and deployment-parent cycles are rejected',()=> {
 fc.assert(fc.property(fc.stringMatching(/^[a-z]{1,12}$/),environment=> {
  fc.pre(environment!=='illustration');const b=fixture();b.model.elements.find((e:{id:string})=>e.id==='server-a').environment=environment;expect(decodeArchitecture(b).ok).toBe(false)
 }),{numRuns:100})
 fc.assert(fc.property(fc.constantFrom('demo-host-a','demo-host-b'),host=> {
  const b=fixture();b.model.elements.find((e:{id:string})=>e.id==='demo-region').parentId=host;expect(decodeArchitecture(b).ok).toBe(false)
 }),{numRuns:20})
})
