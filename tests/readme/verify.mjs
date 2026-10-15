// Usage: node tests/readme/verify.mjs <absolute-tarball-path>
// Installs the exact tarball in a clean consumer and proves the README against it.
// Never builds or packs. README_REPORT=<path> writes the JSON report.
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const arg = process.argv[2]
if (!arg || !isAbsolute(arg)) throw new Error('Usage: node tests/readme/verify.mjs <absolute-tarball-path>')
if (!existsSync(arg)) throw new Error(`Missing tarball: ${arg}`)
const tarball = arg
const sha256 = createHash('sha256').update(await readFile(tarball)).digest('hex')
const examples = join(repo, 'examples/readme')

// 1. Snippet synchronization: each marked block equals its example file exactly.
const readme = await readFile(join(repo, 'README.md'), 'utf8')
const pattern = /<!-- example: (\S+) -->\n```[a-z]*\n([\s\S]*?)```/g
const checked = []
for (const match of readme.matchAll(pattern)) {
  const file = await readFile(join(repo, match[1]), 'utf8')
  if (file !== match[2]) throw new Error(`README snippet differs from ${match[1]}`)
  checked.push(match[1])
}
for (const required of ['index.html', 'main.tsx', 'bundle.json', 'compose.tsx', 'node-esm.mts', 'node-cjs.cts', 'static.tsx', 'misuse.tsx']) {
  if (!checked.includes(`examples/readme/${required}`)) throw new Error(`README lacks a synchronized snippet for ${required}`)
}
if (/^\s*\.\.\.\s*$|\/\/\s*\.\.\./m.test(readme)) throw new Error('README contains an ellipsis placeholder')

// 2. Clean consumer with only the tarball and pinned tools.
const consumer = await mkdtemp(join(tmpdir(), 'c4-sdk-readme-'))
const run = (bin, args, extra = {}) => execFileSync(bin, args, { cwd: consumer, stdio: 'inherit', env: process.env, ...extra })
await writeFile(join(consumer, 'package.json'), JSON.stringify({
  private: true,
  type: 'module',
  dependencies: { 'c4-sdk': `file:${tarball}`, react: '19.3.0', 'react-dom': '19.3.0' },
  devDependencies: { typescript: '6.0.3', '@types/react': '19.2.18', '@types/react-dom': '19.2.7', '@types/node': '24.13.3', vite: '8.3.4' },
}, null, 2))
run('npm', ['install', '--prefer-offline', '--ignore-scripts', '--no-audit', '--no-fund'])
const installedDir = join(consumer, 'node_modules/c4-sdk')
const installed = JSON.parse(await readFile(join(installedDir, 'package.json'), 'utf8'))
if ((await readFile(join(installedDir, 'README.md'), 'utf8')) !== readme) throw new Error('Tarball README differs from the repository README under test')

for (const name of await readdir(examples)) await cp(join(examples, name), join(consumer, name))
const common = { strict: true, skipLibCheck: false, noEmit: true, target: 'ES2023', resolveJsonModule: true }
await writeFile(join(consumer, 'tsconfig.node.json'), JSON.stringify({
  compilerOptions: { ...common, noEmit: false, module: 'NodeNext', moduleResolution: 'NodeNext', outDir: 'out', types: ['node'] },
  include: ['node-esm.mts', 'node-cjs.cts'],
}))
await writeFile(join(consumer, 'tsconfig.bundler.json'), JSON.stringify({
  compilerOptions: { ...common, module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', types: ['vite/client'] },
  include: ['main.tsx', 'compose.tsx', 'static.tsx', 'misuse.tsx'],
}))
await writeFile(join(consumer, 'vite.config.mjs'), `import { defineConfig } from 'vite'
export default defineConfig(({ mode }) => mode === 'static'
  ? { base: '/consumer/static/', build: { outDir: 'dist-static', rollupOptions: { input: 'static.html' } } }
  : { base: '/consumer/subpath/', build: { outDir: 'dist', rollupOptions: { input: ['index.html', 'compose.html'] } } })
`)
const tsc = join(consumer, 'node_modules/typescript/bin/tsc')
run('node', [tsc, '-p', 'tsconfig.node.json'])
run('node', [tsc, '-p', 'tsconfig.bundler.json'])
await cp(join(consumer, 'bundle.json'), join(consumer, 'out/bundle.json'))

// 3. Node ESM and CJS examples must agree and show the documented results.
const output = file => execFileSync('node', [file], { cwd: consumer, encoding: 'utf8' }).trim().split('\n').map(line => JSON.parse(line))
const esm = output('out/node-esm.mjs')
const cjs = output('out/node-cjs.cjs')
if (JSON.stringify(esm) !== JSON.stringify(cjs)) throw new Error('ESM and CJS example output differ')
if (esm[0].nodes !== 4 || esm[0].legend !== 'Context key' || esm[1].code !== 'missing-reference') throw new Error(`Unexpected example output ${JSON.stringify(esm)}`)

// 4. Production builds, static worker asset and browser run.
run('node', [join(consumer, 'node_modules/vite/bin/vite.js'), 'build'])
run('node', [join(consumer, 'node_modules/vite/bin/vite.js'), 'build', '--mode', 'static'])
await cp(join(installedDir, 'dist-sdk/layout-worker.js'), join(consumer, 'dist-static/layout-worker.js'))
const outputDir = join(consumer, 'browser-output')
run('node', [join(repo, 'node_modules/@playwright/test/cli.js'), 'test', '--config', join(repo, 'tests/readme/playwright.config.ts')], {
  cwd: repo,
  env: { ...process.env, CONSUMER_DIR: consumer, README_OUTPUT_DIR: outputDir },
})
const screenshots = []
const walk = async dir => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walk(path)
    else if (entry.name.endsWith('.png')) screenshots.push(path)
  }
}
await walk(outputDir)
if (screenshots.length < 8) throw new Error(`Expected desktop and mobile screenshots, found ${screenshots.length}`)

if (process.env.README_REPORT) {
  const evidenceDir = join(dirname(resolve(process.env.README_REPORT)), `readme-evidence-${sha256.slice(0, 12)}`)
  await mkdir(evidenceDir, { recursive: true })
  for (const [i, path] of screenshots.entries()) {
    const target = join(evidenceDir, `${path.split('/').slice(-2).join('--')}`)
    await cp(path, target)
    screenshots[i] = target
  }
}

const report = {
  passed: true,
  tarball,
  sha256,
  version: installed.version,
  sourceSha: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
  versions: {
    node: process.version,
    npm: execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim(),
    ...Object.fromEntries(await Promise.all(['react', 'react-dom', 'typescript', 'vite'].map(async name => [name, JSON.parse(await readFile(join(consumer, `node_modules/${name}/package.json`), 'utf8')).version]))),
  },
  snippets: checked,
  evidence: { consumer, output: { esm: esm, cjs: cjs }, screenshots: screenshots.sort() },
}
if (process.env.README_REPORT) await writeFile(process.env.README_REPORT, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
