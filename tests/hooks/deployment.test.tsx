import { readFileSync } from 'node:fs'
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { useViewerSession } from '../../src/lib/c4/react/hooks/useViewerSession'
import { useContext } from '../../src/lib/c4/react/hooks/useContext'
import { useDeployment } from '../../src/lib/c4/react/hooks/useDeployment'
afterEach(cleanup)
it('collapse is view-local, selection exposes ancestors, and nondeployment visits preserve expansion state',()=> {
 const decoded=decodeArchitecture(JSON.parse(readFileSync('fixtures/deployment.json','utf8')));if(!decoded.ok)throw Error('fixture')
 const inspected:string[]=[];const {result,rerender}=renderHook(({diagramId,elementId}:{diagramId:string;elementId?:string})=>useDeployment(decoded.value.index,{architectureId:decoded.value.bundle.id,diagramId,elementId},id=>inspected.push(id),()=>undefined),{initialProps:{diagramId:'deployment',elementId:undefined} as {diagramId:string;elementId?:string}})
 act(()=>result.current!.rows.find(row=>row.id==='demo-region')!.onToggle());expect(result.current!.hiddenCount).toBe(6)
 rerender({diagramId:'deployment',elementId:'server-b'});expect(result.current!.hiddenCount).toBe(0)
 act(()=>result.current!.rows.find(row=>row.id==='demo-host-b')!.onToggle());expect(inspected).toEqual(['demo-host-b'])
 rerender({diagramId:'deployment',elementId:'demo-host-b'});expect(result.current!.rows.find(row=>row.id==='demo-host-b')?.collapsed).toBe(true)
 rerender({diagramId:'server-components',elementId:undefined});expect(result.current).toBeUndefined()
 rerender({diagramId:'deployment',elementId:'server-b'});expect(result.current!.projection.nodes.some(node=>node.elementId==='server-b')).toBe(true)
})

it('inspection without a visibility change preserves the exact layout input',()=> {
 const decoded=decodeArchitecture(JSON.parse(readFileSync('fixtures/deployment.json','utf8')));if(!decoded.ok)throw Error('fixture')
 const {result,rerender}=renderHook(({elementId}:{elementId:string})=>useContext(decoded.value,{architectureId:decoded.value.bundle.id,diagramId:'deployment',elementId},()=>{},()=>undefined),{initialProps:{elementId:'server-a'}})
 const input=result.current.input;rerender({elementId:'server-b'});expect(result.current.input).toBe(input)
})

it('viewport readiness only considers focus inside its own viewer',()=> {
 const root=document.createElement('div');const own=document.createElement('button');const other=document.createElement('button');root.append(own);document.body.append(root,other)
 const {result}=renderHook(()=>useViewerSession({architectureId:'a',diagramId:'deployment'},'r1'));result.current.rootProps.ref.current=root
 own.focus();expect(result.current.canvasSession.getFocusedElement()).toBe(own)
 other.focus();expect(result.current.canvasSession.getFocusedElement()).toBeUndefined()
 root.remove();other.remove()
})
