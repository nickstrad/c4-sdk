import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { useDocumentation } from '../../src/lib/c4/react/hooks/useDocumentation'
import type { DocumentSelection } from '../../src/lib/c4/domain/documentation'
afterEach(cleanup)
const selection: DocumentSelection={title:'t',documents:['a','b'].map(id=>({id,title:id,plain:id,ste:{text:id,issue:'9',reviewStatus:'draft'},sourceIds:[],termIds:[]})),sources:[],terms:[],plannedNotes:[]}
it('resets document choice synchronously on architecture and route identity changes',()=> {
 const {result,rerender}=renderHook(({identity})=>useDocumentation(selection,identity),{initialProps:{identity:'alpha/element'}})
 act(()=>result.current.onDocument('b')); expect(result.current.documentId).toBe('b')
 rerender({identity:'beta/element'}); expect(result.current.documentId).toBe('a')
 act(()=>result.current.onSte()); expect(result.current.mode).toBe('ste')
})
