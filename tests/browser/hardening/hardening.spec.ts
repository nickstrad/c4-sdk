import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync, writeFileSync } from 'node:fs'
const fixture = JSON.parse(readFileSync('fixtures/seven-types.json', 'utf8'))
test('publication overview includes edge labels and zoom headings remain readable', async ({ page }, info) => {
  await page.goto('./#/architectures/cursor-continuity/diagrams/push?step=publish-cas')
  const canvas = page.locator('.c4-flow-canvas')
  await expect(canvas).toBeVisible(); await canvas.scrollIntoViewIfNeeded()
  await expect.poll(() => canvas.locator('[data-node-id]').first().evaluate(node => { const b = node.getBoundingClientRect(); const c = node.closest('.c4-flow-canvas')!.getBoundingClientRect(); return b.left >= c.left - 2 && b.right <= c.right + 2 && b.top >= c.top - 2 && b.bottom <= c.bottom + 2 })).toBe(true)
  await page.screenshot({ path: info.outputPath('publication-entry.png') })
  await page.getByRole('button', { name: 'Fit View', exact: true }).click()
  await expect.poll(() => canvas.locator('[data-node-id], .c4-edge-label').evaluateAll(nodes => nodes.every(node => { const b = node.getBoundingClientRect(); const c = node.closest('.c4-flow-canvas')!.getBoundingClientRect(); return b.left >= c.left - 2 && b.right <= c.right + 2 && b.top >= c.top - 2 && b.bottom <= c.bottom + 2 }))).toBe(true)
  await page.screenshot({ path: info.outputPath('publication-fit.png') })
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  const heading = page.locator('.c4-diagram-heading h1')
  expect(await heading.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await heading.scrollIntoViewIfNeeded()
  await page.screenshot({ path: info.outputPath('publication-heading-zoom.png') })
  if (info.project.name.startsWith('mobile')) {
    expect((await page.getByRole('button', { name: 'Open explanation' }).boundingBox())!.y).toBeLessThan((await canvas.boundingBox())!.y)
    await page.getByRole('button', { name: 'Open explanation' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  }
  await page.screenshot({ path: info.outputPath('publication-zoom.png') })
  expect((await new AxeBuilder({ page }).analyze()).violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([])
})
test('repeated view and viewport changes release workers and keep observers bounded', async ({ page }, info) => {
  test.setTimeout(60000)
  await page.addInitScript(() => {
    const active = { resize: new WeakMap<object, Set<WeakRef<Element>>>(), mutation: new Set<object>() }; const resizeRefs: WeakRef<object>[] = []
    const listeners = new Map<string, Set<EventListenerOrEventListenerObject>>()
    const add = window.addEventListener.bind(window); const remove = window.removeEventListener.bind(window)
    const listenerKey = (type: string, options?: boolean | EventListenerOptions) => `${type}:${typeof options === 'boolean' ? options : !!options?.capture}`
    window.addEventListener = ((...args: Parameters<Window['addEventListener']>) => { if (['resize', 'hashchange', 'popstate'].includes(args[0])) { const key = listenerKey(args[0], args[2]); const values = listeners.get(key) ?? new Set(); values.add(args[1]); listeners.set(key, values) } add(...args) }) as Window['addEventListener']
    window.removeEventListener = ((...args: Parameters<Window['removeEventListener']>) => { listeners.get(listenerKey(args[0], args[2]))?.delete(args[1]); remove(...args) }) as Window['removeEventListener']
    Object.assign(window, { observerCounts: () => ({ resize: resizeRefs.filter(ref => { const observer = ref.deref(); return observer && [...(active.resize.get(observer) ?? [])].some(target => target.deref()?.isConnected) }).length, mutation: active.mutation.size, listeners: [...listeners.values()].reduce((sum, values) => sum + values.size, 0) }) })
    const Resize = window.ResizeObserver; const Mutation = window.MutationObserver
    window.ResizeObserver = class extends Resize {
      observe(...args: Parameters<ResizeObserver['observe']>) { let targets = active.resize.get(this); if (!targets) { targets = new Set(); active.resize.set(this, targets); resizeRefs.push(new WeakRef(this)) } if (![...targets].some(target => target.deref() === args[0])) targets.add(new WeakRef(args[0])); super.observe(...args) }
      unobserve(target: Element) { const targets = active.resize.get(this); for (const ref of targets ?? []) if (ref.deref() === target) targets?.delete(ref); super.unobserve(target) }
      disconnect() { active.resize.delete(this); super.disconnect() }
    }
    window.MutationObserver = class extends Mutation { observe(...args: Parameters<MutationObserver['observe']>) { active.mutation.add(this); super.observe(...args) } disconnect() { active.mutation.delete(this); super.disconnect() } }
  })
  await page.route('**/catalog.json', route => route.fulfill({ json: { entries: [{ id: fixture.id, title: fixture.title, url: 'diagrams/seven-types.json' }] } }))
  await page.route('**/diagrams/seven-types.json', route => route.fulfill({ json: fixture }))
  await page.goto(`./#/architectures/${fixture.id}/diagrams/code`)
  await expect(page.locator('.c4-flow-canvas')).toBeVisible(); await expect.poll(() => page.workers().length).toBe(0)
  const counts = () => page.evaluate(() => (window as unknown as { observerCounts: () => { resize: number; mutation: number; listeners: number } }).observerCounts())
  const baseline = await counts(); const originalViewport = page.viewportSize()!
  for (let i = 0; i < 8; i++) {
    await page.evaluate(hash => { location.hash = hash }, `#/architectures/${fixture.id}/diagrams/${i % 2 ? 'code' : 'context'}`)
    await expect(page.locator('.c4-flow-canvas')).toHaveAttribute('aria-label', i % 2 ? 'Code diagram canvas' : 'Context diagram canvas')
    await page.setViewportSize({ width: i % 2 ? 393 : 800, height: 900 })
    await expect.poll(() => page.workers().length).toBe(0)
  }
  await page.evaluate(hash => { location.hash = hash }, `#/architectures/${fixture.id}/diagrams/code`)
  await expect(page.locator('.c4-flow-canvas')).toBeVisible(); await expect.poll(() => page.workers().length).toBe(0)
  await page.setViewportSize(originalViewport)
  await expect.poll(async () => (await counts()).resize).toBeLessThanOrEqual(baseline.resize)
  await expect.poll(async () => (await counts()).mutation).toBeLessThanOrEqual(baseline.mutation)
  await expect.poll(async () => (await counts()).listeners).toBeLessThanOrEqual(baseline.listeners)
  writeFileSync(info.outputPath('lifecycle-counts.json'), JSON.stringify({ baseline, final: await counts(), cycles: 8, windowListenerTypes: ['resize', 'hashchange', 'popstate'] }, null, 2))
})
