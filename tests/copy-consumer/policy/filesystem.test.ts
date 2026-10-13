import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, statSync, chmodSync, symlinkSync, linkSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { applyCopy, CopyFailure, createManifest, prepareCopy, PROVENANCE } from '../../../work-scripts/node/copy-project/filesystem'
let root: string, source: string, target: string
const sha = 'a'.repeat(40)
function put(dir:string,path:string,bytes:string|Uint8Array,mode=0o644) { const p=join(dir,path); mkdirSync(join(p,'..'),{recursive:true}); writeFileSync(p,bytes); chmodSync(p,mode) }
function copy(paths:string[],commit=sha) { const next=createManifest(source,commit,paths); const plan=prepareCopy(source,target,next); applyCopy(source,target,plan); return next }
beforeEach(()=>{ root=mkdtempSync(join(tmpdir(),'c4-copy-test-')); source=join(root,'source');target=join(root,'target');mkdirSync(source);mkdirSync(target) })
afterEach(()=>rmSync(root,{recursive:true,force:true}))
describe('scratch filesystem copy',()=>{
  it('preserves binary bytes, executable bit, unmanaged files and no-op provenance',()=>{
    put(source,'bin/run',new Uint8Array([0,255,128,10]),0o755);put(target,'consumer/data','mine');copy(['bin/run'])
    expect(readFileSync(join(target,'bin/run'))).toEqual(Buffer.from([0,255,128,10]));expect(statSync(join(target,'bin/run')).mode & 0o111).toBe(0o111)
    const before=statSync(join(target,PROVENANCE)).mtimeMs; copy(['bin/run']);expect(statSync(join(target,PROVENANCE)).mtimeMs).toBe(before);expect(readFileSync(join(target,'consumer/data'),'utf8')).toBe('mine')
  })
  it('replaces upstream bytes/mode and deletes only managed files',()=>{
    put(source,'a','one',0o755);put(source,'gone','bye');copy(['a','gone']);put(target,'consumer','keep');put(source,'a','two',0o644);copy(['a'],'b'.repeat(40))
    expect(readFileSync(join(target,'a'),'utf8')).toBe('two');expect(statSync(join(target,'a')).mode & 0o111).toBe(0);expect(()=>statSync(join(target,'gone'))).toThrow();expect(readFileSync(join(target,'consumer'),'utf8')).toBe('keep')
  })
  it('uses a single external consumer provenance authority',()=>{
    put(source,'a','one');const external=join(root,'c4-sdk-source.json');const next=createManifest(source,sha,['a']);const plan=prepareCopy(source,target,next,external);applyCopy(source,target,plan,undefined,external)
    expect(()=>statSync(join(target,PROVENANCE))).toThrow();expect(JSON.parse(readFileSync(external,'utf8'))).toEqual(next)
    const before=statSync(external).mtimeMs;applyCopy(source,target,prepareCopy(source,target,next,external),undefined,external);expect(statSync(external).mtimeMs).toBe(before)
    expect(()=>prepareCopy(source,source,next)).toThrow(/disjoint/)
    expect(()=>prepareCopy(source,target,next,join(source,'c4-sdk-source.json'))).toThrow(/outside source/)
    expect(()=>prepareCopy(source,target,next,join(target,'c4-sdk-source.json'))).toThrow(/outside/)
    put(target,PROVENANCE,JSON.stringify(next));expect(()=>prepareCopy(source,target,next,external)).toThrow(/Competing/)
  })
  it('rejects edits/deletions and identical unmanaged target',()=>{
    put(source,'a','one');put(target,'a','one');expect(()=>prepareCopy(source,target,createManifest(source,sha,['a']))).toThrow(/Unmanaged/);rmSync(join(target,'a'));copy(['a']);put(target,'a','local');expect(()=>prepareCopy(source,target,createManifest(source,sha,['a']))).toThrow(/Local edit/);rmSync(join(target,'a'));expect(()=>prepareCopy(source,target,createManifest(source,sha,[]))).toThrow(/missing/)
  })
  it('rejects symlink leaves/ancestors, directories and hardlinks',()=>{
    put(source,'a','one'); const next=createManifest(source,sha,['a']);symlinkSync(join(source,'a'),join(target,'a'));expect(()=>prepareCopy(source,target,next)).toThrow(/Symlink/);rmSync(join(target,'a'));mkdirSync(join(target,'a'));expect(()=>prepareCopy(source,target,next)).toThrow(/regular/);rmSync(join(target,'a'),{recursive:true});linkSync(join(source,'a'),join(target,'a'));expect(()=>prepareCopy(source,target,next)).toThrow(/hard-linked/)
    rmSync(join(target,'a'));symlinkSync(target,join(root,'alias'));expect(()=>prepareCopy(source,join(root,'alias'),next)).toThrow(/Symlink/)
  })
  it('rejects executable local edits, malformed provenance and nested symlink escapes',()=>{
    put(source,'src/a','one',0o755);copy(['src/a']);chmodSync(join(target,'src/a'),0o644);expect(()=>prepareCopy(source,target,createManifest(source,sha,['src/a']))).toThrow(/Local edit/)
    put(target,PROVENANCE,'{"version":2}');expect(()=>prepareCopy(source,target,createManifest(source,sha,['src/a']))).toThrow(/Invalid manifest/)
    rmSync(join(target,PROVENANCE));rmSync(join(target,'src'),{recursive:true});symlinkSync(source,join(target,'src'));expect(()=>prepareCopy(source,target,createManifest(source,sha,['src/a']))).toThrow(/Symlink/)
  })
  it('checks target again immediately before each operation',()=>{
    put(source,'a','one');put(source,'b','two');const plan=prepareCopy(source,target,createManifest(source,sha,['a','b']))
    expect(()=>applyCopy(source,target,plan,i=>{if(i===1)put(target,'b','consumer')})).toThrow(/restored/)
    expect(()=>statSync(join(target,'a'))).toThrow();expect(readFileSync(join(target,'b'),'utf8')).toBe('consumer');expect(()=>statSync(join(target,PROVENANCE))).toThrow()
  })
  it('revalidates reviewed plan and source before any mutation',()=>{
    put(source,'a','one');const next=createManifest(source,sha,['a']);const plan=prepareCopy(source,target,next);put(source,'a','changed');expect(()=>applyCopy(source,target,plan)).toThrow(/Source mismatch/);expect(()=>statSync(join(target,PROVENANCE))).toThrow()
    put(source,'a','one');put(target,'a','consumer');expect(()=>applyCopy(source,target,plan)).toThrow(/Unmanaged/)
  })
  it('rolls back ordinary partial failure without publishing new provenance',()=>{
    put(source,'a','one');put(source,'b','two');copy(['a','b']);const provenance=readFileSync(join(target,PROVENANCE));put(source,'a','new');put(source,'b','new');const plan=prepareCopy(source,target,createManifest(source,'b'.repeat(40),['a','b']))
    expect(()=>applyCopy(source,target,plan,i=>{if(i===1)throw new Error('disk fault')})).toThrow(CopyFailure);expect(readFileSync(join(target,'a'),'utf8')).toBe('one');expect(readFileSync(join(target,'b'),'utf8')).toBe('two');expect(readFileSync(join(target,PROVENANCE))).toEqual(provenance)
  })
  it('rolls back files when external provenance becomes unwritable before publication',()=>{
    put(source,'a','one');const external=join(root,'metadata','c4-sdk-source.json');const next=createManifest(source,sha,['a']);const plan=prepareCopy(source,target,next,external)
    expect(()=>applyCopy(source,target,plan,()=>put(root,'metadata','blocked'),external)).toThrow(CopyFailure)
    expect(()=>statSync(join(target,'a'))).toThrow();expect(()=>statSync(external)).toThrow()
  })
  it('reports incomplete rollback honestly and rejects a partial state on retry',()=>{
    put(source,'a','one');put(source,'b','two');copy(['a','b']);const provenance=readFileSync(join(target,PROVENANCE));put(source,'a','new');put(source,'b','new');const plan=prepareCopy(source,target,createManifest(source,'b'.repeat(40),['a','b']))
    let error:CopyFailure|undefined
    try { applyCopy(source,target,plan,i=>{if(i===1){rmSync(join(target,'a'));symlinkSync(join(source,'a'),join(target,'a'));throw new Error('fault')}}) } catch(e){error=e as CopyFailure}
    expect(error?.rollbackErrors).toHaveLength(1);expect(error?.message).toMatch(/incomplete/);expect(readFileSync(join(target,PROVENANCE))).toEqual(provenance);expect(()=>prepareCopy(source,target,plan.next)).toThrow(/Symlink/)
  })
})
