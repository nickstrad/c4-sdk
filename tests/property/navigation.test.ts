import { expect, it } from 'vitest'
import fc from 'fast-check'
import fixture from '../../fixtures/navigation.json'
import { decodeArchitecture } from '../../src/lib/c4/schema/decode'
import { breadcrumbs, formatRoute, parseRoute, transition, validateRoute } from '../../src/lib/c4/domain/navigation'
const opts = { seed: 4022026, numRuns: 200 }
const id = fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}$/)
it('generated route identities round trip through the one codec', () => {
  fc.assert(fc.property(id, id, fc.option(id, { nil: undefined }), (architectureId, diagramId, elementId) => {
    const route = { architectureId, diagramId, ...(elementId ? { elementId } : {}) }
    expect(parseRoute(formatRoute(route))).toMatchObject({ ok: true, value: route })
  }), opts)
})
it('generated forests terminate and every Up identifies the declared parent anchor', () => {
  fc.assert(fc.property(fc.array(fc.nat({ max: 1000 }), { minLength: 1, maxLength: 30 }), choices => {
    const diagrams = choices.map((choice, i) => ({ ...fixture.diagrams[0], id: `d${i}`, nodes: fixture.diagrams[0].nodes.map(({ elementId }) => ({ elementId })), ...(i ? { parent: { diagramId: `d${choice % i}`, elementId: 'continuity' } } : {}) }))
    const input = { ...fixture, defaultDiagramId: 'd0', diagrams }
    const result = decodeArchitecture(input); expect(result.ok).toBe(true); if (!result.ok) return
    diagrams.forEach(diagram => {
      const route = { architectureId: input.id, diagramId: diagram.id }
      const trail = breadcrumbs(result.value.index, route)
      expect(new Set(trail.map(target => target.diagramId)).size).toBe(trail.length)
      expect(trail.length).toBeLessThanOrEqual(diagrams.length)
      expect(trail[0].diagramId).toBe('d0')
      const up = transition(result.value.index, route, { type: 'up' }); expect(up.ok).toBe(true)
      if (up.ok && up.value.type === 'push' && diagram.parent) expect(up.value.route).toEqual({ architectureId: input.id, ...diagram.parent })
    })
    if (diagrams.length > 1) {
      const cycle = { ...input, diagrams: diagrams.map((diagram, i) => ({ ...diagram, parent: { diagramId: `d${(i + 1) % diagrams.length}` } })) }
      expect(decodeArchitecture(cycle).ok).toBe(false)
    }
  }), opts)
})
it('generated valid navigation sequences never select hidden or foreign elements', () => {
  const decoded = decodeArchitecture(fixture); if (!decoded.ok) throw new Error('fixture')
  fc.assert(fc.property(fc.array(fc.nat({ max: 20 }), { maxLength: 100 }), commands => {
    let route = { architectureId: fixture.id, diagramId: fixture.defaultDiagramId }
    for (const command of commands) {
      const diagram = decoded.value.index.diagrams[route.diagramId]
      const elementId = diagram.nodes[command % diagram.nodes.length].elementId
      const action = command % 4 === 0 ? { type: 'up' as const } : command % 4 === 1 ? { type: 'diagram' as const } : { type: command % 4 === 2 ? 'activate' as const : 'inspect' as const, elementId }
      const result = transition(decoded.value.index, route, action)
      expect(result.ok).toBe(true)
      if (result.ok && result.value.type === 'push') route = result.value.route
      expect(validateRoute(decoded.value.index, route)).toEqual([])
      const parsed = parseRoute(formatRoute(route)); expect(parsed).toMatchObject({ ok: true, value: route })
    }
  }), opts)
})
it('generated system/container scopes accept their own detail and reject cross-scope drill or wrong containment', () => {
  fc.assert(fc.property(fc.uniqueArray(fc.nat({ max: 1000000 }), { minLength: 2, maxLength: 15 }), numbers => {
    const elements = numbers.flatMap(n => [{ id: `s${n}`, kind: 'softwareSystem', name: `System ${n}`, description: 'Generated scope.', status: 'existing' }, { id: `c${n}`, kind: 'container', parentId: `s${n}`, technology: 'Generated runtime', name: `Container ${n}`, description: 'Generated application.', status: 'existing' }])
    const diagrams = numbers.flatMap(n => [
      { id: `context${n}`, kind: 'context', title: 'Context', status: 'existing', scopeId: `s${n}`, nodes: [{ elementId: `s${n}`, detail: { diagramId: `container${n}` } }], edges: [], legend: fixture.diagrams[0].legend },
      { id: `container${n}`, kind: 'container', title: 'Containers', status: 'existing', scopeId: `s${n}`, parent: { diagramId: `context${n}`, elementId: `s${n}` }, nodes: [{ elementId: `c${n}` }], edges: [], legend: fixture.diagrams[1].legend },
    ])
    const input = { schemaVersion: 1, id: 'generated', title: 'Generated', revision: '1', defaultDiagramId: `context${numbers[0]}`, model: { elements, relationships: [] }, diagrams, documents: [], sources: [], terms: [] }
    const result = decodeArchitecture(input); expect(result.ok).toBe(true); if (!result.ok) return
    for (const n of numbers) {
      const child = transition(result.value.index, { architectureId: 'generated', diagramId: `context${n}` }, { type: 'activate', elementId: `s${n}` })
      expect(child).toMatchObject({ ok: true, value: { route: { diagramId: `container${n}` } } })
      expect(breadcrumbs(result.value.index, { architectureId: 'generated', diagramId: `container${n}` })).toHaveLength(2)
    }
    const crossed: any = structuredClone(input)
    crossed.diagrams[0].nodes[0].detail.diagramId = `container${numbers[1]}`
    const invalidDetail = decodeArchitecture(crossed); expect(invalidDetail.ok).toBe(false); expect(invalidDetail.diagnostics.some(item => item.code === 'invalid-detail')).toBe(true)
    const corrupt: any = structuredClone(input); corrupt.model.elements[1].parentId = `c${numbers[1]}`
    const invalidParent = decodeArchitecture(corrupt); expect(invalidParent.ok).toBe(false); expect(invalidParent.diagnostics.some(item => item.code === 'invalid-parent')).toBe(true)
  }), opts)
})
