import { expect, test, type Locator, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
// Canvas nodes can lie outside the viewport. Playwright's native scroll-into-view races React Flow's scroll reset
// (@xyflow wrapperOnScroll), so focus first: the viewer's own focus-reveal pans the target into view, then deliver a real click.
async function reveal(target: Locator) {
  await target.focus()
  await expect(target).toBeInViewport()
  return target
}
// Exercise the responsive reader before returning to the navigation/canvas journey.
async function withExplanation(page: Page, check: () => Promise<void>) {
  const trigger = page.getByRole('button', { name: 'Open explanation', exact: true })
  const sheet = await page.evaluate(() => matchMedia('(max-width: 760px)').matches)
  if (sheet) await trigger.click()
  await expect(page.locator('.c4-documentation:visible')).toBeVisible()
  await check()
  if (sheet) await page.getByRole('button', { name: 'Close explanation', exact: true }).click()
}
test('real catalog JSON renders readable context, key and explanations', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message))
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Continuity and its collaborators', exact: true }).first()).toBeVisible()
  await expect(page.locator('.c4-node')).toHaveCount(3)
  await expect(page.getByRole('region', { name: 'Diagram key' })).toBeVisible()
  await expect(page.locator('.c4-flow-canvas .c4-edge-label').first()).toContainText('Pushes and fetches changes')
  await withExplanation(page, async () => { await expect(page.getByRole('region', { name: 'Explanation' })).toContainText('This small context interprets') })
  await page.screenshot({ path: info.outputPath('context.png'), fullPage: true })
  expect(errors).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
test('invalid replacement reports a precise path and preserves the last complete dataset', async ({ page }, info) => {
  await page.goto('./'); await expect(page.locator('.c4-node')).toHaveCount(3)
  await page.getByLabel('Architecture resource').selectOption({ label: 'Invalid resource (diagnostic example)' })
  await expect(page.getByText('Resource rejected. The last valid architecture remains visible.')).toBeVisible()
  await expect(page.getByLabel('Resource diagnostics')).toContainText('$.model.relationships[0].targetId')
  await expect(page.locator('.c4-node')).toHaveCount(3)
  await (await reveal(page.getByRole('button', { name: 'Inspect Continuity', exact: true }))).click()
  await withExplanation(page, async () => { await expect(page.locator('.c4-documentation:visible h2')).toHaveText('Continuity') })
  await withExplanation(page, async () => { await page.getByRole('button', { name: 'STE100 text' }).click(); await expect(page.locator('.c4-documentation:visible .c4-review')).toContainText('draft') })
  await page.screenshot({ path: info.outputPath('invalid-preserved.png'), fullPage: true })
})
test('keyboard can inspect a person, switch explanation, and return to diagram', async ({ page }) => {
  await page.goto('./'); await expect(page.locator('.c4-node')).toHaveCount(3)
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Architecture resource')).toBeFocused()
  await page.getByRole('button', { name: 'Diagram explanation' }).focus(); await expect(page.getByRole('button', { name: 'Diagram explanation' })).toBeFocused()
  await page.keyboard.press('Tab'); await expect(page.getByRole('region', { name: 'Context diagram canvas' })).toBeFocused()
  await page.keyboard.press('Tab'); await expect(page.locator('.c4-node').first()).toBeFocused()
  await page.keyboard.press('Enter'); await withExplanation(page, async () => { await expect(page.locator('.c4-documentation:visible h2')).toHaveText('Git developer') })
  await withExplanation(page, async () => {
    await page.getByRole('button', { name: 'STE100 text' }).focus(); await page.keyboard.press('Enter')
    await expect(page.locator('.c4-documentation:visible .c4-review')).toHaveText('ASD-STE100 Issue 9 · draft')
  })
  await page.getByRole('button', { name: 'Diagram explanation' }).focus(); await page.keyboard.press('Enter')
  await withExplanation(page, async () => { await expect(page.locator('.c4-documentation:visible h2')).toHaveText('Continuity and its collaborators') })
})
test('axe, reduced motion and 200 percent zoom remain usable', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('./'); await expect(page.locator('.c4-node')).toHaveCount(3)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  await page.locator('.c4-flow-canvas .c4-node').nth(2).focus(); await page.keyboard.press('Enter'); await withExplanation(page, async () => { await expect(page.locator('.c4-documentation:visible h2')).toHaveText('S3 object storage') })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await page.locator('.c4-legend li').evaluateAll(items => items.every(item => item.scrollWidth <= item.clientWidth))).toBe(true)
  await page.screenshot({ path: info.outputPath('zoom-200.png'), fullPage: true })
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
test('malformed JSON and initial invalid architecture never create a partial viewer', async ({ page }) => {
  await page.route('**/diagrams/continuity.json', route => route.fulfill({ contentType: 'application/json', body: '{broken' }))
  await page.goto('./'); await expect(page.getByLabel('Resource diagnostics')).toContainText('not valid UTF-8 JSON')
  await expect(page.locator('.c4-node')).toHaveCount(0)
  await page.getByLabel('Architecture resource').selectOption({ label: 'Invalid resource (diagnostic example)' })
  await expect(page.getByLabel('Resource diagnostics')).toContainText('missing-system'); await expect(page.locator('.c4-node')).toHaveCount(0)
})
test('generic production viewer has its own default catalog', async ({ page }) => {
  await page.goto('http://127.0.0.1:4174/')
  await expect(page.getByRole('heading', { name: 'Architecture explorer' })).toBeVisible()
  await expect(page.locator('.c4-node')).toHaveCount(3)
  await expect(page.locator('.c4-node').first()).toContainText('Customer')
  await withExplanation(page, async () => { await expect(page.locator('.c4-documentation:visible')).toContainText('illustrative context') })
})
