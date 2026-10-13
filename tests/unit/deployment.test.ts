import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { deploymentAncestors, effectiveCollapsed, projectDeployment } from '../../src/lib/c4/domain/deployment'
import { buildScene } from '../../src/lib/c4/domain/scene'
import { breadcrumbs, transition } from '../../src/lib/c4/domain/navigation'
const fixture = () => JSON.parse(readFileSync('fixtures/deployment.json', 'utf8'))
function valid() { const result = decodeArchitecture(fixture()); if (!result.ok) throw Error(JSON.stringify(result.diagnostics)); return result.value }
it('retains distinct replica identities and derives nested boundaries without mutating validated input', () => {
 const { index } = valid(); const diagram = index.diagrams.deployment; if (diagram.kind !== 'deployment') throw Error('kind')
 const original = JSON.stringify(diagram); const view = projectDeployment(index, diagram)
 expect(view.nodes.map(node => node.elementId).filter(id => id.startsWith('server-'))).toEqual(['server-a', 'server-b'])
 expect(view.groups?.find(group => group.id === 'deployment-boundary:demo-host-b')?.parentGroupId).toBe('deployment-boundary:demo-region')
 expect(view.groups?.flatMap(group => group.memberIds).sort()).toEqual(view.nodes.map(node => node.elementId).sort())
 expect(buildScene({ ...index, diagrams: { ...index.diagrams, deployment: view } }, 'deployment').ok).toBe(true)
 expect(JSON.stringify(diagram)).toBe(original)
})
it('collapse hides only descendants and incident edges, selection reveals exact ancestors', () => {
 const { index } = valid(); const diagram = index.diagrams.deployment; if (diagram.kind !== 'deployment') throw Error('kind')
 const view = projectDeployment(index, diagram, ['demo-host-a'])
 expect(view.nodes.map(node => node.elementId)).not.toContain('server-a'); expect(view.nodes.map(node => node.elementId)).toContain('server-b')
 expect(view.edges).toEqual([])
 expect(deploymentAncestors(index, 'server-a')).toEqual(['demo-host-a', 'demo-region'])
 expect(effectiveCollapsed(index, diagram, ['missing', 'demo-region', 'demo-host-a', 'demo-host-b'], 'server-a')).toEqual(['demo-host-b'])
 expect(projectDeployment(index, diagram, ['demo-region'], 'server-b').nodes.some(node => node.elementId === 'server-b')).toBe(true)
})
it('rejects illegal parent, logical target, environment, cycle and replica identity', () => {
 const mutations = [
  (b: ReturnType<typeof fixture>) => { b.model.elements.find((e: {id:string})=>e.id==='server-a').parentId='server' },
  (b: ReturnType<typeof fixture>) => { b.model.elements.find((e: {id:string})=>e.id==='server-a').instanceOf='server-handler' },
  (b: ReturnType<typeof fixture>) => { b.model.elements.find((e: {id:string})=>e.id==='server-a').environment='other' },
  (b: ReturnType<typeof fixture>) => { b.model.elements.find((e: {id:string})=>e.id==='demo-region').parentId='demo-host-a' },
  (b: ReturnType<typeof fixture>) => { b.model.elements.find((e: {id:string})=>e.id==='server-b').id='server-a' },
  (b: ReturnType<typeof fixture>) => { b.diagrams.find((d:{id:string})=>d.id==='deployment').environment='other' },
  (b: ReturnType<typeof fixture>) => { b.diagrams.find((d:{id:string})=>d.id==='deployment').nodes.pop() },
  (b: ReturnType<typeof fixture>) => { b.model.relationships.find((e:{id:string})=>e.id==='deployment-local-a').modelRelationshipId='server-wal' },
  (b: ReturnType<typeof fixture>) => { b.model.relationships.find((e:{id:string})=>e.id==='deployment-local-a').sourceId='demo-host-a' },
 ]
 for (const mutate of mutations) { const bundle=fixture(); mutate(bundle); expect(decodeArchitecture(bundle).ok).toBe(false) }
})
it('requires physical ancestor membership and rejects physical leakage into logical views', () => {
 const b=fixture(); const diagram=b.diagrams.find((d:{id:string})=>d.id==='deployment')
 diagram.nodes=diagram.nodes.filter((node:{elementId:string})=>node.elementId!=='demo-host-b'); expect(decodeArchitecture(b).ok).toBe(false)
 const logical=fixture(); logical.diagrams[2].nodes.push({elementId:'server-a'}); expect(decodeArchitecture(logical).ok).toBe(false)
})
it('logical drill and history retain canonical model breadcrumbs and exact selected replica', () => {
 const { index } = valid(); const route={architectureId:index.bundle.id,diagramId:'deployment',elementId:'server-b'}
 expect(transition(index,route,{type:'activate',elementId:'server-b'})).toMatchObject({ok:true,value:{type:'push',route:{diagramId:'server-components'}}})
 expect(transition(index,route,{type:'back'},true)).toMatchObject({ok:true,value:{type:'back'}})
 expect(breadcrumbs(index,{...route,diagramId:'server-components',elementId:undefined})).toEqual([{diagramId:'context',elementId:'continuity'},{diagramId:'containers',elementId:'server'},{diagramId:'server-components'}])
})
