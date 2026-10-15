import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve, relative, } from 'node:path'
import { rolldown } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import postcss from 'postcss'
import { execFileSync } from 'node:child_process'

// Library output is independent of the application/demo output. No lifecycle publishes it.
const output = resolve('dist-sdk')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
const styles = new Set(readdirSync('src/lib/c4/styles').filter(name => name.endsWith('.css')).map(name => resolve('src/lib/c4/styles', name)))
const modules = new Set()
const peers = id => /^(react|react-dom)(\/|$)/.test(id)
const wiring = {
  name: 'sdk-assets',
  load(id) { if (id.endsWith('.css')) { styles.add(id); return {code:'',moduleType:'js'} } },
  transform(code, id) {
    if (id.endsWith('/views/DocumentationSheet.tsx')) return code.replace('className="c4-docs-backdrop"', 'className="c4-sdk c4-docs-backdrop"')
    if (id.endsWith('/adapters/layout/client.ts')) {
      // The static-host default is relative to the host's base URI. Bundler consumers
      // inject a factory using the exported worker asset URL (see package fixtures).
      return code.replace("new URL('./worker.ts', import.meta.url)", "new URL('layout-worker.js', document.baseURI)")
    }
  },
  moduleParsed(info) { modules.add(info.id) },
}
const runtime = await rolldown({ input: { index: 'src/index.ts', core: 'src/core/index.ts' }, external: peers, platform: 'neutral', resolve: { mainFields: ['module', 'main'] }, plugins: [wiring], tsconfig: 'tsconfig.app.json', transform: { define: { 'import.meta.env': '{"MODE":"production"}' } }, onwarn(warning, warn) { if (warning.code === 'UNRESOLVED_IMPORT') throw new Error(warning.message); if(warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning) } })
await runtime.write({ dir: output, format: 'cjs', entryFileNames: '[name].cjs', chunkFileNames: 'shared-[hash].cjs', sourcemap: false })
await runtime.close()
for (const name of ['index', 'core']) {
  const snapshot = JSON.parse(await readFile('tests/api/public-api.snapshot.json', 'utf8'))
  const entry = snapshot[name === 'index' ? 'src/index.ts' : 'src/core/index.ts']
  const names = Object.keys(entry).filter(key => entry[key].runtime)
  await writeFile(`${output}/${name}.mjs`, `${name === 'index' ? "'use client'\n" : ''}import implementation from './${name}.cjs'\n${names.map(key => `export const ${key} = implementation.${key}`).join('\n')}\n`)
}
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.sdk.json'], { stdio: 'inherit' })
for (const name of ['index', 'core']) {
  const types = await rolldown({ input: resolve(`.sdk-types/${name === 'index' ? 'index' : 'core/index'}.d.ts`), plugins: [dts({ dtsInput: true })], external: id => peers(id) || id === 'zod' })
  const declarations = await types.generate({ format: 'es', codeSplitting: false })
  await types.close()
  if (declarations.output.length !== 1 || declarations.output[0].type !== 'chunk') throw new Error('Declarations must be bundled per facade')
  for (const suffix of ['mts', 'cts']) await writeFile(`${output}/${name}.d.${suffix}`, declarations.output[0].code)
}
await rm('.sdk-types', {recursive:true,force:true})
const worker = await rolldown({ input: 'src/lib/c4/adapters/layout/worker.ts', plugins: [{name:'worker-inventory',moduleParsed(info){modules.add(info.id)}}] })
const workerResult = await worker.write({ file: `${output}/layout-worker.js`, format: 'es', codeSplitting: false, sourcemap: false })
await worker.close()
if (workerResult.output.length !== 1) throw new Error('Worker must be self-contained')
const css = postcss.parse((await Promise.all([...styles].sort().map(path => readFile(path, 'utf8')))).join('\n'))
css.walkRules(rule => {
  if (rule.parent?.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return
  // Scope React Flow and older c4 class rules as well as the already-scoped rules.
  rule.selectors = rule.selectors.map(selector => {
    // Portal roots carry the SDK scope on the styled element itself.
    if (selector === '.c4-docs-sheet' || selector === '.c4-docs-backdrop') return `.c4-sdk${selector}`
    return selector.startsWith('.c4-sdk') ? selector : `.c4-sdk ${selector}`
  })
})
await writeFile(`${output}/styles.css`, css.toString())
const packages = new Map()
for (const id of modules) {
  if (!id.includes('/node_modules/')) continue
  let directory = dirname(id)
  while (!existsSync(resolve(directory,'package.json')) && dirname(directory) !== directory) directory = dirname(directory)
  if (!existsSync(resolve(directory,'package.json'))) continue
  const pkg = JSON.parse(readFileSync(resolve(directory,'package.json'),'utf8'))
  if (!pkg.name) continue
  packages.set(pkg.name, {name:pkg.name,version:pkg.version,license:pkg.license,licenseFiles:readdirSync(directory).filter(file => /^(license|licence|copying|notice)/i.test(file)).map(file => relative(resolve('.'),resolve(directory,file)))})
}
// Audit evidence stays outside the publish allowlist.
await mkdir('tests/package/evidence', {recursive:true})
await writeFile('tests/package/evidence/bundle-inventory.json', JSON.stringify({modules:[...modules].map(id=>relative(resolve('.'),id)).sort(),packages:[...packages.values()].sort((a,b)=>a.name.localeCompare(b.name)),styles:[...styles].map(id=>relative(resolve('.'),id)).sort()},null,2)+'\n')
console.log(`Built SDK: ${readdirSync(output).sort().join(', ')}`)
