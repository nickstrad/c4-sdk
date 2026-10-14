import { readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const bundle = JSON.parse(readFileSync('fixtures/seven-types.json', 'utf8'))
const kinds: readonly [string, string, string][] = bundle.diagrams.map((item: { id: string; kind: string; title: string }) => [item.id, item.kind, item.title])
test.beforeEach(async ({ page }) => {
  await page.route('**/catalog.json', route => route.fulfill({ json: { entries: [{ id: bundle.id, title: bundle.title, url: 'diagrams/seven-types.json' }] } }))
  await page.route('**/diagrams/seven-types.json', route => route.fulfill({ json: bundle }))
})
const open = async (page: Page, id: string, element?: string) => {
  await page.goto(`./#/architectures/${bundle.id}/diagrams/${id}${element ? `/elements/${element}` : ''}`)
  await expect(page.locator('.c4-flow-canvas')).toBeVisible()
}
const canvas = (page: Page) => page.locator('.c4-flow-canvas')
async function inCanvas(locator: import('@playwright/test').Locator) {
  await expect.poll(() => locator.evaluate(node => {
    const box = node.getBoundingClientRect(); const host = node.closest('.c4-flow-canvas')!.getBoundingClientRect()
    return box.width >= 100 && box.left >= host.left - 2 && box.right <= host.right + 2 && box.top >= host.top - 2 && box.bottom <= host.bottom + 2
  })).toBe(true)
}
test('all seven kinds render declared members, key and explanation from direct URLs', async ({ page }, info) => {
  const mobile = info.project.name.startsWith('mobile')
  for (const [id, kind, title] of kinds) {
    await open(page, id)
    await expect(page.getByRole('heading', { name: title, exact: true, level: 1 }).first()).toBeVisible()
    const declared = bundle.diagrams.find((item: { id: string }) => item.id === id)
    await expect(canvas(page).locator('.c4-node')).toHaveCount(declared.nodes.length)
    await expect(canvas(page)).toHaveAttribute('aria-label', new RegExp(`^${kind} diagram canvas$`, 'i'))
    await expect(page.locator('.c4-legend').first()).toBeVisible()
    if (mobile) await page.getByRole('button', { name: 'Open explanation' }).focus()
    // Documentation is reachable at both sizes; mobile opens it as a sheet.
    if (mobile) { await page.keyboard.press('Enter'); await expect(page.getByRole('dialog')).toBeVisible(); await page.getByRole('button', { name: 'Close explanation' }).click() }
    else await expect(page.locator('.c4-documentation:visible').first()).toContainText(declared.title)
    await page.screenshot({ path: info.outputPath(`${id}.png`), fullPage: true })
  }
})
test('code compartments expose every declared member as accessible text', async ({ page }, info) => {
  await open(page, 'code')
  await canvas(page).scrollIntoViewIfNeeded()
  const entry = canvas(page).locator('[data-node-id="OrderService"]')
  await inCanvas(entry)
  await page.screenshot({ path: info.outputPath('code-initial-viewport.png') })
  const symbols = bundle.model.elements.filter((item: { kind: string; parentId: string }) => item.kind === 'code')
  const shown = bundle.diagrams.find((item: { id: string }) => item.id === 'code').nodes.map((item: { elementId: string }) => item.elementId)
  for (const symbol of symbols.filter((item: { id: string }) => shown.includes(item.id))) {
    const members: { name: string; visibility?: string; signature?: string }[] = symbol.members ?? []
    const node = canvas(page).locator(`[data-node-id="${symbol.id}"]`)
    await expect(node).toBeVisible()
    if (!members.length) { await expect(node).toContainText('No declared members'); continue }
    await node.locator('.c4-node').focus()
    await inCanvas(node)
    const list = node.getByRole('list', { name: `Members of ${symbol.name}` })
    await expect(list.getByRole('listitem')).toHaveCount(members.length)
    for (const member of members) {
      const item = list.getByRole('listitem').filter({ hasText: member.name }).first()
      await expect(item).toContainText(member.visibility ?? 'public')
      if (member.signature) await expect(item).toContainText(member.signature)
    }
    expect(await list.evaluate(element => element.scrollHeight <= element.clientHeight + 2)).toBe(true)
    expect(await list.evaluate(element => { const scale = element.getBoundingClientRect().width / (element as HTMLElement).offsetWidth; return parseFloat(getComputedStyle(element).fontSize) * scale })).toBeGreaterThanOrEqual(8)
    // The compartment is inside its card: no clipped text.
    const box = await node.boundingBox(); const inner = await list.boundingBox()
    expect(inner!.y + inner!.height).toBeLessThanOrEqual(box!.y + box!.height + 2)
  }
  await page.getByRole('button', { name: 'Fit View', exact: true }).click()
  await expect.poll(() => canvas(page).locator('[data-node-id]').evaluateAll(nodes => nodes.every(node => { const b = node.getBoundingClientRect(); const c = node.closest('.c4-flow-canvas')!.getBoundingClientRect(); return b.left >= c.left - 2 && b.right <= c.right + 2 && b.top >= c.top - 2 && b.bottom <= c.bottom + 2 }))).toBe(true)
  await page.screenshot({ path: info.outputPath('code-fit-viewport.png') })
  await canvas(page).getByRole('button', { name: 'Inspect OrderService', exact: true }).focus()
  await inCanvas(entry)
  const external = canvas(page).locator('[data-node-id="PaymentPort"] .c4-node')
  await expect(external).toContainText('Code · interface')
  await page.getByRole('button', { name: 'Actual size', exact: true }).click()
  await canvas(page).getByRole('button', { name: 'Inspect OrderService', exact: true }).focus()
  const first = canvas(page).locator('.c4-node').first()
  const bounds = await first.boundingBox(); expect(bounds!.width).toBeGreaterThan(120)
  const relation = page.getByText('inheritance ·').first(); await expect(relation).toBeAttached()
  await page.screenshot({ path: info.outputPath('code-compartments.png') })
  expect((await new AxeBuilder({ page }).analyze()).violations.filter(item => item.impact === 'critical' || item.impact === 'serious')).toEqual([])
})
test('landscape drills to a system context, then to code through Up and detail links with real history', async ({ page }) => {
  await open(page, 'landscape')
  await canvas(page).getByRole('link', { name: 'Open detail for Shop' }).click()
  await expect(page.getByRole('heading', { name: 'Shop context', exact: true, level: 1 }).first()).toBeVisible()
  await expect(page).toHaveURL(/diagrams\/context$/)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Shop landscape', exact: true, level: 1 }).first()).toBeVisible()
  await open(page, 'components')
  await canvas(page).getByRole('link', { name: 'Open detail for Order handling' }).click()
  await expect(page.getByRole('heading', { name: 'Order handling code', exact: true, level: 1 }).first()).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Diagram navigation' }).getByRole('listitem')).toHaveCount(5)
  await page.getByRole('link', { name: 'Up' }).click()
  await expect(page.getByRole('heading', { name: 'Orders API components', exact: true, level: 1 }).first()).toBeVisible()
})
test('direct element URL selects a code symbol and an unknown element is diagnosed', async ({ page }) => {
  await open(page, 'code', 'OrderService')
  await expect(canvas(page).getByRole('button', { name: 'Inspect OrderService' })).toHaveAttribute('aria-pressed', 'true')
  await page.goto(`./#/architectures/${bundle.id}/diagrams/code/elements/customer`)
  await expect(page.getByLabel('Resource diagnostics')).toContainText('not in this diagram')
})
test('generic production viewer lists the seven-type catalog entry and opens it by URL', async ({ page }) => {
  await page.unroute('**/catalog.json'); await page.unroute('**/diagrams/seven-types.json')
  await page.goto(`http://127.0.0.1:4174/#/architectures/${bundle.id}/diagrams/code`)
  await expect(page.getByRole('heading', { name: 'Order handling code', exact: true, level: 1 }).first()).toBeVisible()
  await expect(page.getByRole('list', { name: 'Members of OrderService' }).first()).toBeVisible()
})
