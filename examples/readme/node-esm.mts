import { readFileSync } from 'node:fs'
import { buildScene, decodeArchitecture, resolveLegend, selectDocumentation } from 'c4-sdk/core'
import type { Diagnostic } from 'c4-sdk/core'

const text = readFileSync(new URL('./bundle.json', import.meta.url), 'utf8')
const decoded = decodeArchitecture(JSON.parse(text))
if (!decoded.ok) throw new Error(decoded.diagnostics.map(item => item.code).join())

const { index } = decoded.value
const scene = buildScene(index, 'context')
const docs = selectDocumentation(index, 'context')
console.log(JSON.stringify({
  title: decoded.value.bundle.title,
  nodes: scene.ok ? scene.value.nodes.length : -1,
  legend: resolveLegend(index, 'context')?.title,
  ste: docs.documents[0]?.ste.text,
}))

// Failures are values, not exceptions. Paths point into the JSON document.
const broken = JSON.parse(text)
broken.diagrams[0].nodes[0].elementId = 'missing'
const rejected = decodeArchitecture(broken)
if (rejected.ok) throw new Error('expected rejection')
const first: Diagnostic = rejected.diagnostics[0]!
console.log(JSON.stringify({ code: first.code, path: first.path }))
