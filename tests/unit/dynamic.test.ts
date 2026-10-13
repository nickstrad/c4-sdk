import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { architectureJsonSchema, decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { adjacentSelection, findStep, interactions, precedence, readingSelections, scenarioItems, selectInteractions } from '../../src/lib/c4/domain/scenario'
import { formatRoute, parseRoute, transition, validateRoute } from '../../src/lib/c4/domain/navigation'
import { buildScene } from '../../src/lib/c4/domain/scene'
import type { Step } from '../../src/lib/c4/domain/model'
const fixture=()=>JSON.parse(readFileSync('fixtures/dynamic.json','utf8'))
function valid(){const result=decodeArchitecture(fixture());if(!result.ok)throw Error(JSON.stringify(result.diagnostics));return result.value}
describe('dynamic partial-order scenarios',()=> {
 it('preserves IDs/repeated/reverse calls without confusing source display numbers',()=> {
 const architecture=valid();const diagram=architecture.index.diagrams.push;if(diagram.kind!=='dynamic')throw Error('diagram')
 const active=selectInteractions(architecture.index,diagram,'push-story');expect(active.map(item=>item.id)).toEqual(interactions(diagram.scenario).map(step=>step.id))
 expect(active.filter(item=>item.relationshipId==='server-local')).toHaveLength(3)
 const response=active.find(item=>item.id==='ack-push')!;expect(response.sourceName).toBe('Continuity server');expect(response.targetName).toBe('Git developer');expect(response.direction).toBe('reverse');expect(response.number).not.toBe('99')
 expect(selectInteractions(architecture.index,diagram,'missing')).toEqual([])
 })
 it('imposes branch-local sequence but no zipped barrier or cross-branch order',()=> {
 const diagram=valid().index.diagrams.push;if(diagram.kind!=='dynamic')throw Error('diagram')
 const order=precedence(diagram.scenario);expect(order).toContainEqual(['write-local','prepare-references']);expect(order).toContainEqual(['persist-wal','publish-cas']);expect(order).toContainEqual(['prepare-references','publish-cas'])
 expect(order).not.toContainEqual(['persist-wal','write-local']);expect(order).not.toContainEqual(['persist-wal','prepare-references']);expect(order).not.toContainEqual(['prepare-references','persist-wal'])
 })
 it('rejects duplicate step IDs, undeclared relationships, empty groups and invalid directions',()=> {
 for(const mutate of [(b:ReturnType<typeof fixture>)=>{b.diagrams[2].scenario.children[0].id='push-story'},(b:ReturnType<typeof fixture>)=>{b.diagrams[2].scenario.children[0].relationshipId='git'},(b:ReturnType<typeof fixture>)=>{b.diagrams[2].scenario.children=[]},(b:ReturnType<typeof fixture>)=>{b.diagrams[2].scenario.children[0].direction='sideways'}]){const b=fixture();mutate(b);expect(decodeArchitecture(b).ok).toBe(false)}
 })
 it('explicitly accepts semantic depth32 and rejects33 with a separate scenario JSONdepth96 guard',()=> {
 const nested=(depth:number):Step=>{let step:Step={kind:'interaction',id:'leaf',relationshipId:'client-server',direction:'forward',label:'Leaf'};for(let i=1;i<depth;i++)step={kind:'sequence',id:`seq${i}`,children:[step]};return step}
 const b=fixture();b.diagrams[2].scenario=nested(32);expect(decodeArchitecture(b).ok).toBe(true)
 b.diagrams[2].scenario=nested(33);const result=decodeArchitecture(b);expect(result.ok).toBe(false);expect(result.diagnostics.some(item=>item.code==='scenario-limit')).toBe(true)
 expect(JSON.stringify(architectureJsonSchema)).toContain('$ref')
 })
 it('bounds total scenarios at1000steps and preserves safe exported recursive shape',()=> {
 const b=fixture();b.diagrams[2].scenario={kind:'sequence',id:'root',children:Array.from({length:1000},(_,i)=>({kind:'interaction',id:`s${i}`,relationshipId:'client-server',direction:'forward',label:'Step'}))};expect(decodeArchitecture(b).ok).toBe(false)
 b.diagrams[2].scenario.children.pop();expect(decodeArchitecture(b).ok).toBe(true)
 })
 it('routes step URLs and Inspect preserve scenario; Up/related leave it; wrong diagram fails',()=> {
 const architecture=valid();const route={architectureId:architecture.bundle.id,diagramId:'push',stepId:'persist-wal'}
 expect(parseRoute(formatRoute(route))).toMatchObject({ok:true,value:route})
 const inspect=transition(architecture.index,route,{type:'inspect',elementId:'server'});expect(inspect).toMatchObject({ok:true,value:{route:{...route,elementId:'server'}}})
 const up=transition(architecture.index,route,{type:'up'});expect(up).toMatchObject({ok:true,value:{route:{diagramId:'containers'}}});if(up.ok&&up.value.type==='push')expect(up.value.route.stepId).toBeUndefined()
 expect(validateRoute(architecture.index,{...route,diagramId:'containers'})).not.toEqual([])
 expect(transition(architecture.index,route,{type:'step',stepId:'check-current'}).ok).toBe(false)
 expect(parseRoute(formatRoute({...route,elementId:'server'}))).toMatchObject({ok:true,value:{...route,elementId:'server'}})
 expect(parseRoute(formatRoute(route)+'&step=bad').ok).toBe(false)
 })
 it('uses reading selection navigation without altering stable scene inputs',()=> {
 const architecture=valid();const diagram=architecture.index.diagrams.push;if(diagram.kind!=='dynamic')throw Error('diagram')
 const tree=scenarioItems(diagram.scenario);expect(adjacentSelection(tree,undefined,1)).toBe('push-story');expect(adjacentSelection(tree,'push-story',-1)).toBeUndefined();expect(readingSelections(tree).some(item=>item.number.includes('B'))).toBe(true)
 expect(findStep(diagram.scenario,'persist-wal')?.kind).toBe('interaction')
 const before=buildScene(architecture.index,'push');selectInteractions(architecture.index,diagram,'ack-push');expect(buildScene(architecture.index,'push')).toEqual(before)
 })
})
