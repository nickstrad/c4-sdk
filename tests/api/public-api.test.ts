import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import ts from 'typescript'
import fixture from '../../fixtures/context.json'
import { frozenSnapshot, publicSnapshot } from './snapshot'

describe('frozen public facade', () => {
  it('retains exact runtime/type exports, signatures and structural fields', () => {
    expect(publicSnapshot()).toEqual(frozenSnapshot())
  }, 30_000) // Resolves the complete TypeScript declaration graph on shared CI hosts.

  it('imports both source entries without starting browser or network work', async () => {
    const effects = ['fetch', 'Worker', 'ResizeObserver', 'MutationObserver'].map(name => {
      const effect = vi.fn(() => { throw new Error(`Import started ${name}`) })
      vi.stubGlobal(name, effect)
      return effect
    })
    try {
      // Vitest neutralizes CSS imports: plain Node/package CSS safety belongs to P-02.
      const ui = await import('../../src/index')
      const core = await import('../../src/core/index')
      for (const [path, entry] of [['src/index.ts', ui], ['src/core/index.ts', core]] as const) {
        const snapshot = frozenSnapshot()[path]
        expect(Object.keys(entry).sort()).toEqual(Object.keys(snapshot).filter(name => snapshot[name].runtime).sort())
      }
      expect(effects.every(effect => effect.mock.calls.length === 0)).toBe(true)
      expect('window' in globalThis).toBe(false)
      expect('document' in globalThis).toBe(false)
    } finally { vi.unstubAllGlobals() }
  })

  it('decodes unknown data, preserves caller ownership and keeps model identity through projection', async () => {
    const { decodeArchitecture, buildScene, selectDocumentation, resolveLegend } = await import('../../src/core/index')
    const input = structuredClone(fixture); const before = structuredClone(input)
    const result = decodeArchitecture(input)
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error(JSON.stringify(result.diagnostics))
    expect(input).toEqual(before); expect(Object.isFrozen(input)).toBe(false)
    expect(Object.isFrozen(result.value.bundle.model.elements)).toBe(true)
    const scene = buildScene(result.value.index, result.value.bundle.defaultDiagramId)
    if (!scene.ok) throw new Error(JSON.stringify(scene.diagnostics))
    expect(scene.value.nodes[0].element).toBe(result.value.bundle.model.elements[0])
    expect(resolveLegend(result.value.index, scene.value.diagram.id)).toBe(scene.value.diagram.legend)
    expect(selectDocumentation(result.value.index, scene.value.diagram.id).documents.length).toBeGreaterThan(0)
    expect(decodeArchitecture({ ...input, schemaVersion: 2 })).toMatchObject({ ok: false, diagnostics: [{ code: 'schema', path: '$.schemaVersion', severity: 'error' }] })
    expect(decodeArchitecture(input, { maxElements: 0 })).toMatchObject({ ok: false, diagnostics: [{ code: 'resource-limit', path: '$.limits' }] })
  })

  it('supports structural host navigation without browser history', async () => {
    const { decodeArchitecture, formatRoute, parseRoute, transition, validateRoute } = await import('../../src/core/index')
    const result = decodeArchitecture(fixture)
    if (!result.ok) throw new Error('Fixture rejected')
    const route = { architectureId: result.value.bundle.id, diagramId: result.value.bundle.defaultDiagramId }
    expect(parseRoute(formatRoute(route))).toMatchObject({ ok: true, value: route })
    expect(validateRoute(result.value.index, route)).toEqual([])
    expect(transition(result.value.index, route, { type: 'back' }, true)).toMatchObject({ ok: true, value: { type: 'back' } })
    expect(transition(result.value.index, route, { type: 'inspect', elementId: 'missing' })).toMatchObject({ ok: false })
  })

  it('keeps the core runtime graph free of React, browser adapters, CSS and I/O', () => {
    const visited = new Set<string>()
    const walk = (path: string) => {
      if (visited.has(path)) return
      visited.add(path)
      const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true)
      for (const statement of source.statements) {
        if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue
        if (ts.isExportDeclaration(statement) && statement.isTypeOnly || ts.isImportDeclaration(statement) && statement.importClause?.isTypeOnly) continue
        if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue
        const specifier = statement.moduleSpecifier.text
        expect(specifier, path).not.toMatch(/^(?:react(?:-dom)?(?:\/|$)|@xyflow\/|elkjs|effect|node:)|(?:react\/|adapters\/|\.css$)/)
        if (specifier.startsWith('.')) {
          const base = resolve(dirname(path), specifier)
          const child = [`${base}.ts`, `${base}/index.ts`].find(candidate => existsSync(candidate))
          expect(child, `${path}: ${specifier}`).toBeDefined()
          walk(child!)
        } else expect(specifier, path).toBe('zod')
      }
      expect(source.text, path).not.toMatch(/\b(?:window|document|localStorage|fetch|Worker)\s*[.(]/)
    }
    walk(resolve('src/core/index.ts'))
  })
})
