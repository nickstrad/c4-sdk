import { mkdtemp, mkdir, readFile, writeFile, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const tarball = resolve(process.env.TARBALL || process.argv[2] || '')
if (!process.env.TARBALL && !process.argv[2]) throw new Error('Pass the exact candidate with TARBALL=...; verification never builds or packs')
if (!existsSync(tarball)) throw new Error(`Missing tarball: ${tarball}`)
const hash = createHash('sha256').update(await readFile(tarball)).digest('hex')
const consumer = await mkdtemp(join(tmpdir(),'c4-sdk-consumer-'))
const run = (bin,args) => execFileSync(bin,args,{cwd:consumer,stdio:'inherit',env:process.env})
await writeFile(join(consumer,'package.json'),JSON.stringify({private:true,type:'module',dependencies:{'c4-sdk':`file:${tarball}`,react:'19.3.0','react-dom':'19.3.0'},devDependencies:{typescript:'6.0.3','@types/react':'19.2.18','@types/react-dom':'19.2.7','@types/node':'24.13.3',vite:'8.3.4'}},null,2))
// Everything resolves in this clean consumer. No workspace, link or source aliases.
run('npm',['install','--prefer-offline','--ignore-scripts','--no-audit','--no-fund'])
await cp('tests/package/consumer',consumer,{recursive:true})
for (const name of ['app.tsx','node.mts','node.cts']) await cp(join(consumer,`${name}.template`),join(consumer,name))
await cp('fixtures/seven-types.json',join(consumer,'bundle.json'))
const snapshot=JSON.parse(await readFile('tests/api/public-api.snapshot.json','utf8'))
await writeFile(join(consumer,'api-runtime.json'),JSON.stringify(Object.fromEntries(Object.entries(snapshot).map(([path,entry])=>[path.includes('/core/')?'core':'index',Object.keys(entry).filter(name=>entry[name].runtime).sort()]))))
await mkdir(join(consumer,'public'),{recursive:true})
await cp(join(consumer,'node_modules/c4-sdk/dist-sdk/layout-worker.js'),join(consumer,'public/layout-worker.js'))
const structural = (await readFile('tests/api/structural-contract.tsx','utf8')).replaceAll('../../src/index','c4-sdk').replaceAll('../../src/core/index','c4-sdk/core')
await writeFile(join(consumer,'structural.tsx'),structural)
run('node',['smoke.mjs'])
for (const mode of ['node','bundler']) run('node',['node_modules/typescript/bin/tsc','-p',`tsconfig.${mode}.json`])
for (const mode of ['esm','cjs']) run('node',['node_modules/vite/bin/vite.js','build','--mode',mode])
const installed = JSON.parse(await readFile(join(consumer,'node_modules/c4-sdk/package.json'),'utf8'))
const report={tarball,sha256:hash,consumer,sourceSha:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),version:installed.version,versions:{node:process.version,npm:execFileSync('npm',['--version'],{encoding:'utf8'}).trim()}}
for (const name of ['react','react-dom','typescript','vite']) report.versions[name]=JSON.parse(await readFile(join(consumer,`node_modules/${name}/package.json`),'utf8')).version
await writeFile(join(consumer,'report.json'),JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report,null,2))
