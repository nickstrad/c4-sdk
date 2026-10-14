import { readFileSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
async function withExplanation(page: Page, check: () => Promise<void>) {
  const sheet = await page.evaluate(() => matchMedia('(max-width: 760px)').matches)
  if (sheet) await page.getByRole('button', { name: 'Open explanation', exact: true }).click()
  await expect(page.locator('.c4-documentation:visible')).toBeVisible()
  await check()
  if (sheet) await page.getByRole('button', { name: 'Close explanation', exact: true }).click()
}
const fixture = JSON.parse(readFileSync('fixtures/layout.json', 'utf8'))
async function catalog(page: Page) {
  const other = structuredClone(fixture); other.id = 'other-layout'; other.title = 'Other laboratory'; other.diagrams[0].title = 'Other nested diagram'
  await page.route('**/catalog.json', route => route.fulfill({ json: { entries: [{ id: fixture.id, title: fixture.title, url: 'diagrams/layout.json' }, { id: other.id, title: other.title, url: 'diagrams/other-layout.json' }] } }))
  await page.route('**/diagrams/layout.json', route => route.fulfill({ json: fixture }))
  await page.route('**/diagrams/other-layout.json', route => route.fulfill({ json: other }))
}
async function ready(page: Page) { await expect(page.locator('.c4-flow-canvas')).toBeVisible(); await expect(page.locator('.react-flow__node-c4Node')).toHaveCount(3) }
test('production worker, nested geometry, readable labels and controls at both viewport sizes', async ({ page }, info) => {
  await catalog(page)
  const workerUrls: string[] = []; page.on('worker', worker => workerUrls.push(worker.url()))
  await page.goto('./'); await ready(page)
  await expect(page.locator('[data-group-id]')).toHaveCount(2)
  await expect.poll(() => page.workers().length).toBe(0)
  expect(workerUrls.length).toBeGreaterThan(0); expect(workerUrls.every(url => new URL(url).pathname.startsWith('/c4-preview/assets/worker-'))).toBe(true)
  expect(workerUrls.length).toBeLessThanOrEqual(3) // StrictMode may cancel an initial mount before the two passes.
  const geometry = await page.locator('.c4-flow-canvas').evaluate(root => {
    const rect = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }
    return { nodes: [...root.querySelectorAll('[data-node-id]')].map(el => ({ id: el.getAttribute('data-node-id'), ...rect(el) })), groups: [...root.querySelectorAll('[data-group-id]')].map(el => ({ id: el.getAttribute('data-group-id'), ...rect(el) })), overflow: [...root.querySelectorAll('.c4-node, foreignObject .c4-edge-label, .c4-group-label')].some(el => el.scrollHeight > el.clientHeight + 2) }
  })
  const child = geometry.nodes.find(node => node.id === 'developer')!; const inner = geometry.groups.find(group => group.id === 'inner')!
  expect(child.x).toBeGreaterThanOrEqual(inner.x); expect(child.y).toBeGreaterThan(inner.y); expect(child.x + child.width).toBeLessThanOrEqual(inner.x + inner.width)
  expect(geometry.overflow).toBe(false)
  await page.getByRole('button', { name: 'Fit View', exact: true }).click()
  await page.screenshot({ path: info.outputPath('compound-fit.png'), fullPage: true })
  await page.getByRole('button', { name: 'Actual size', exact: true }).click()
  await page.getByRole('button', { name: 'Inspect Git developer', exact: true }).focus()
  await page.keyboard.press('Enter')
  await withExplanation(page, async () => { await expect(page.locator('.c4-documentation:visible h2')).toHaveText('Git developer') })
  await page.screenshot({ path: info.outputPath('compound-readable-focus.png'), fullPage: true })
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  const count = workerUrls.length
  await page.getByRole('button', { name: 'Inspect Git developer', exact: true }).click()
  expect(workerUrls.length).toBe(count)
})
test('viewport and focus survive diagram navigation and actual dataset remounts', async ({ page }) => {
  await catalog(page); await page.goto('./'); await ready(page)
  const detail = page.getByRole('link', { name: 'Open detail for Continuity', exact: true })
  await detail.focus()
  await page.getByRole('button', { name: 'Zoom Out', exact: true }).click()
  const before = await page.locator('.react-flow__viewport').getAttribute('style')
  await detail.press('Enter'); await ready(page)
  await page.getByRole('link', { name: 'Up', exact: true }).click(); await ready(page)
  await expect(detail).toBeFocused()
  // Remember the post-focus viewport (focusing an off-screen node legitimately pans it).
  const prior = await page.locator('.react-flow__viewport').getAttribute('style')
  expect(prior).toContain('scale('); expect(before).toContain('scale(')
  await page.getByLabel('Architecture resource').selectOption({ label: 'Other laboratory' }); await ready(page)
  await expect(page).toHaveURL(/architectures\/other-layout/)
  await page.goBack(); await ready(page)
  await expect(page).toHaveURL(/architectures\/layout-lab/)
  await expect(detail).toBeFocused()
  await expect(page.locator('.react-flow__viewport')).toHaveAttribute('style', prior!)
})
test('worker load failure retains a link-enabled text alternative and rapid navigation cancels work', async ({ page }) => {
  await catalog(page)
  await page.route('**/assets/worker-*.js', route => route.abort())
  await page.goto('./')
  await expect(page.getByLabel('Resource diagnostics')).toContainText('worker')
  const detail = page.getByRole('link', { name: 'Open detail for Continuity', exact: true })
  await expect(detail).toHaveAttribute('href', '#/architectures/layout-lab/diagrams/containers')
  await expect(page.getByRole('heading', { name: 'Relationships (2)', exact: true })).toBeVisible()
  await detail.click(); await ready(page) // manual view needs no worker
  await page.getByRole('link', { name: 'Up', exact: true }).click()
  await expect(page.getByLabel('Resource diagnostics')).toContainText('worker')
  await expect.poll(() => page.workers().length).toBe(0)
})
test('keyboard pan, reduced motion and 200 percent zoom keep the host within its viewport', async ({ page }, info) => {
  await catalog(page); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('./'); await ready(page)
  const canvas = page.getByRole('region', { name: 'Context diagram canvas', exact: true })
  const before = await page.locator('.react-flow__viewport').getAttribute('style')
  await canvas.focus(); await page.keyboard.press('ArrowRight')
  await expect(page.locator('.react-flow__viewport')).not.toHaveAttribute('style', before!)
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  const developer = canvas.getByRole('button', { name: 'Inspect Git developer', exact: true })
  await developer.focus(); await developer.scrollIntoViewIfNeeded()
  const box = (await developer.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down(); await page.mouse.move(0, 0); await page.mouse.up()
  // Releasing outside must not leave pointer focus suppression active for Tab.
  await developer.focus(); await expect(developer).toBeFocused()
  await page.keyboard.press('Tab')
  const linked = canvas.getByRole('link', { name: 'Open detail for Continuity', exact: true })
  await expect(linked, await page.evaluate(() => document.activeElement?.outerHTML)).toBeFocused()
  try { await expect.poll(() => linked.evaluate(node => {
    const target = node.getBoundingClientRect(); const host = node.closest('.c4-flow-canvas')!.getBoundingClientRect()
    return Math.abs(target.left + target.width / 2 - host.left - host.width / 2)
  })).toBeLessThan(2) } finally {
    const diagnostic = await linked.evaluate(node => { const chain = []; let parent: HTMLElement | null = node as HTMLElement; while (parent) { chain.push({ name: parent.className, rect: parent.getBoundingClientRect().toJSON(), left: parent.scrollLeft, top: parent.scrollTop, width: parent.offsetWidth, transform: parent.style.transform }); parent = parent.parentElement } return chain })
    writeFileSync(info.outputPath('zoom-hit-diagnostic.json'), JSON.stringify(diagnostic, null, 2))
  }
  await linked.scrollIntoViewIfNeeded()
  expect(await linked.evaluate(node => { const b = node.getBoundingClientRect(); return node.contains(document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2)) })).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: info.outputPath('compound-zoom.png'), fullPage: true })
})

test('navigation terminates a worker whose production module is still loading', async ({ page }) => {
  await catalog(page)
  await page.addInitScript(() => {
    const Native = window.Worker; const counts = { created: 0, terminated: 0 }
    Object.assign(window, { layoutWorkerCounts: counts })
    window.Worker = class extends Native {
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); counts.created++ }
      terminate() { counts.terminated++; super.terminate() }
    }
  })
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/assets/worker-*.js', async route => { await gate; await route.continue() })
  await page.goto('./')
  await expect.poll(() => page.evaluate(() => (window as unknown as { layoutWorkerCounts: { created: number } }).layoutWorkerCounts.created)).toBeGreaterThan(0)
  await page.getByRole('link', { name: 'Open detail for Continuity', exact: true }).click()
  await ready(page)
  await expect(page).toHaveURL(/diagrams\/containers$/)
  release()
  await expect.poll(() => page.evaluate(() => { const counts = (window as unknown as { layoutWorkerCounts: { created: number; terminated: number } }).layoutWorkerCounts; return counts.created - counts.terminated })).toBe(0)
  await expect(page.getByRole('heading', { level: 1, name: 'Continuity: logical containers', exact: true })).toBeVisible()
  await expect.poll(() => page.workers().length).toBe(0)
})

test('records a production 200-node 400-edge layout timing without claiming a budget', async ({ page }, info) => {
  test.skip(!info.project.name.startsWith('desktop'), 'One reference browser timing; mobile is covered by the visual journeys.')
  test.setTimeout(60000)
  const benchmark = structuredClone(fixture)
  benchmark.id = 'layout-benchmark'; benchmark.diagrams = [benchmark.diagrams[0]]
  benchmark.diagrams[0].groups = []; benchmark.diagrams[0].title = 'Layout timing fixture'
  benchmark.model.elements = Array.from({ length: 200 }, (_, i) => ({ ...benchmark.model.elements[1], id: i === 0 ? 'continuity' : `n${i}`, name: `Service ${i}`, description: 'A benchmark service with a short descriptive label.' }))
  benchmark.model.relationships = Array.from({ length: 400 }, (_, i) => ({ ...benchmark.model.relationships[1], id: `r${i}`, sourceId: benchmark.model.elements[Math.floor(i / 2)].id, targetId: benchmark.model.elements[(Math.floor(i / 2) + 1 + (i % 2) * 4) % 200].id, label: `Request ${i}` }))
  benchmark.diagrams[0].nodes = benchmark.model.elements.map((element: { id: string }) => ({ elementId: element.id }))
  benchmark.diagrams[0].edges = benchmark.model.relationships.map((relationship: { id: string }) => ({ relationshipId: relationship.id }))
  await page.route('**/catalog.json', route => route.fulfill({ json: { entries: [{ id: benchmark.id, title: benchmark.title, url: 'diagrams/benchmark.json' }] } }))
  await page.route('**/diagrams/benchmark.json', route => route.fulfill({ json: benchmark }))
  await page.addInitScript(() => {
    const Native = window.Worker; const timings: { elapsed: number; completed: boolean; requested: boolean }[] = []
    Object.assign(window, { layoutTimings: timings })
    window.Worker = class extends Native {
      started = performance.now(); completed = false; layoutId = -1; requested = false
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); this.addEventListener('message', event => { if (this.requested && event.data.id === this.layoutId && event.data.data?.id === 'root') this.completed = true }) }
      postMessage(message: unknown) { const command = message as { cmd?: string; id: number }; if (command.cmd === 'layout') { this.requested = true; this.layoutId = command.id } super.postMessage(message) }
      terminate() { timings.push({ elapsed: performance.now() - this.started, completed: this.completed, requested: this.requested }); super.terminate() }
    }
  })
  const openedAt = performance.now()
  await page.goto('./')
  await expect(page.locator('.c4-flow-canvas, .c4-diagnostics')).toBeVisible({ timeout: 30000 })
  const overallWallMs = performance.now() - openedAt
  const result = await page.evaluate(overallWallMs => ({ overallWallMs, workerTimingsMs: (window as unknown as { layoutTimings: unknown }).layoutTimings, hardwareConcurrency: navigator.hardwareConcurrency, userAgent: navigator.userAgent, rendered: !!document.querySelector('.c4-flow-canvas'), diagnostics: document.querySelector('.c4-diagnostics')?.textContent }), overallWallMs)
  writeFileSync(info.outputPath('production-layout-timing.json'), JSON.stringify(result, null, 2))
  await info.attach('production-layout-timing.json', { body: JSON.stringify(result, null, 2), contentType: 'application/json' })
  expect(result.rendered, JSON.stringify(result)).toBe(true)
  expect((result.workerTimingsMs as { completed: boolean }[]).some(item => item.completed)).toBe(true)
  // Repeat the same bounded fixture from a fresh page: cancellation does not reuse a cache hit.
  await page.goto('./')
  await expect.poll(() => page.workers().length).toBeGreaterThan(0)
  const cancelledAt = performance.now()
  await page.goto('about:blank')
  await expect.poll(() => page.workers().length).toBe(0)
  // Wall time to destruction includes navigation and browser teardown, not only AbortSignal dispatch.
  const cancellation = { elapsedMs: performance.now() - cancelledAt }
  writeFileSync(info.outputPath('production-cancellation.json'), JSON.stringify(cancellation, null, 2))
  await info.attach('cancellation-note', { body: JSON.stringify({ workerCountAfterNavigation: page.workers().length, wallClockMethod: 'Node performance.now around navigation and zero-worker poll', cancellation }), contentType: 'application/json' })
})


test('host font changes get one measured replacement and preserve focused native controls', async ({ page }) => {
  await catalog(page); const workers: string[] = []; page.on('worker', worker => workers.push(worker.url()))
  await page.goto('./'); await ready(page); await expect.poll(() => page.workers().length).toBe(0)
  const node = page.getByRole('button', { name: 'Inspect Git developer', exact: true })
  await node.focus(); const before = workers.length
  await page.addStyleTag({ content: '.c4-sdk .c4-node strong, .c4-sdk .c4-node-probe strong { font-size: 32px; }' })
  await expect.poll(() => workers.length).toBeGreaterThan(before)
  await expect.poll(() => page.workers().length).toBe(0)
  await expect(node).toBeFocused()
  expect(workers.length).toBe(before + 1)
  expect(await node.evaluate(element => element.scrollHeight <= element.clientHeight + 2)).toBe(true)
  await page.setViewportSize({ width: 800, height: 900 })
  await node.focus(); await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/elements\/developer$/)
  expect(workers.length).toBe(before + 1)
})
