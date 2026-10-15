import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
assert.equal('window' in globalThis,false);assert.equal('document' in globalThis,false)
for(const name of ['Worker','fetch','ResizeObserver','MutationObserver']) globalThis[name]=function(){throw new Error(`Import started ${name}`)}
const ui = await import('c4-sdk'); const cjs = require('c4-sdk')
const core = await import('c4-sdk/core');const ccore=require('c4-sdk/core')
const expected=JSON.parse(readFileSync('api-runtime.json','utf8'))
assert.deepEqual(Object.keys(ui).sort(),expected.index);assert.deepEqual(Object.keys(core).sort(),expected.core)
assert.deepEqual(Object.keys(ui).sort(),Object.keys(cjs).sort())
assert.deepEqual(Object.keys(core).sort(),Object.keys(ccore).sort())
for(const name of Object.keys(ui)) assert.equal(ui[name],cjs[name],`Mixed context/function identity: ${name}`)
for(const name of Object.keys(core)) assert.equal(core[name],ccore[name])
for(const name of ['Worker','fetch','ResizeObserver','MutationObserver']) delete globalThis[name]
assert.equal('window' in globalThis,false);assert.equal('document' in globalThis,false)
const bundle=JSON.parse(readFileSync('bundle.json','utf8'));const decoded=core.decodeArchitecture(bundle)
assert.equal(decoded.ok,true);assert.deepEqual(decoded,ccore.decodeArchitecture(bundle))
assert.equal(core.parseRoute(core.formatRoute({architectureId:bundle.id,diagramId:'code'})).ok,true)
const manifest=JSON.parse(readFileSync('node_modules/c4-sdk/package.json','utf8'))
for(const path of ['.','./core'])for(const mode of ['import','require'])for(const key of ['types','default'])assert.ok(existsSync(`node_modules/c4-sdk/${manifest.exports[path][mode][key]}`))
assert.ok(existsSync(require.resolve('c4-sdk/styles.css')));assert.ok(existsSync(require.resolve('c4-sdk/layout-worker.js')))
assert.throws(()=>require.resolve('c4-sdk/src/index.ts'),{code:'ERR_PACKAGE_PATH_NOT_EXPORTED'})
const { createElement }=require('react');const {renderToStaticMarkup}=require('react-dom/server')
function ReadMixedContext(){return createElement('span',null,ui.useViewerController().diagram.title)}
const routePort={getSnapshot:()=>({hash:'#/architectures/seven-types/diagrams/code',canGoBack:false}),subscribe:()=>()=>{},push(){},replace(){},back(){}}
const mixed=renderToStaticMarkup(createElement(cjs.ArchitectureProvider,{validatedBundle:decoded.value,routePort},createElement(ReadMixedContext)))
assert.match(mixed,/Order handling code/)
// Automatic layout creates workers only on request; cancellation clears handlers and terminates.
let starts=0,stops=0;const worker={onmessage:null,onerror:null,onmessageerror:null,postMessage(){},terminate(){stops++}}
const port=ui.createElkLayoutPort(()=>{starts++;return worker});assert.equal(starts,0)
const scene=core.buildScene(decoded.value.index,'code');assert.equal(scene.ok,true)
const abort=new AbortController();const pending=port.layout({scene:scene.value,generation:1,signal:abort.signal,timeoutMs:1000});abort.abort();const cancelled=await pending
assert.equal(starts,1);assert.equal(stops,1);assert.equal(cancelled.result.ok,false);assert.equal(worker.onmessage,null)
const failure=await ui.createElkLayoutPort(()=>{throw new Error('host worker unavailable')}).layout({scene:scene.value,generation:2,signal:new AbortController().signal,timeoutMs:100})
assert.equal(failure.result.ok,false);assert.match(failure.result.diagnostics[0].message,/host worker unavailable/)
// A core-only subprocess rejects every React resolution, establishing its runtime isolation.
const {execFileSync}=require('node:child_process')
execFileSync(process.execPath,['--input-type=commonjs','-e',`const Module=require('node:module');const load=Module._load;Module._load=function(id,...args){if(id==='react'||id==='react-dom'||id.startsWith('react/')||id.startsWith('react-dom/'))throw Error('core requested React');return load.call(this,id,...args)};require('c4-sdk/core')`],{stdio:'inherit'})
console.log('Packed ESM/CJS import safety, parity, mixed context, core isolation and worker lifecycle PASS')
