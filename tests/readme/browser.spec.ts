import { expect, test, type Page } from '@playwright/test'

const quick = 'http://127.0.0.1:4187/consumer/subpath/'
const fixed = 'http://127.0.0.1:4188/consumer/static/'

function watch(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}

test('quick start renders, navigates to detail and goes back', async ({ page }, info) => {
  const errors = watch(page)
  const workers: string[] = []
  page.on('worker', worker => workers.push(worker.url()))
  await page.goto(`${quick}index.html#/architectures/shop/diagrams/landscape`)
  await expect(page.locator('.c4-flow-canvas')).toBeVisible()
  await expect(page.locator('.c4-flow-canvas .c4-node')).toHaveCount(4)
  await expect(page.locator('.c4-legend')).toBeVisible()
  await expect(page.locator('.c4-sdk').first()).toBeVisible()
  expect(await page.locator('.c4-sdk').first().evaluate(node => getComputedStyle(node).getPropertyValue('--c4-accent').trim())).toBe('#124e69')
  const first = page.locator('.c4-flow-canvas .c4-node').first()
  await first.focus()
  await expect(first).toBeFocused()
  await page.screenshot({ path: info.outputPath('quick-start-landscape.png') })
  await page.locator('.c4-flow-canvas').getByRole('link', { name: 'Open detail for Shop' }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/diagrams\/context$/)
  await expect(page.locator('.c4-flow-canvas .c4-node')).toHaveCount(4)
  await page.screenshot({ path: info.outputPath('quick-start-context.png') })
  await page.goBack()
  await expect(page).toHaveURL(/diagrams\/landscape$/)
  expect(workers.length).toBeGreaterThan(0)
  expect(workers.every(url => url.includes('/consumer/subpath/assets/') && url.includes('layout-worker'))).toBe(true)
  await expect.poll(() => page.workers().length).toBe(0)
  expect(errors).toEqual([])
})

test('composition example swaps STE text and uses controller', async ({ page }, info) => {
  const errors = watch(page)
  await page.goto(`${quick}compose.html#/architectures/shop/diagrams/context`)
  await expect(page.locator('.c4-flow-canvas')).toBeVisible()
  await expect(page.locator('#heading')).toHaveText('Shop context')
  await expect(page.locator('.c4-legend')).toHaveCount(1)
  await expect(page.locator('#explanation-text')).toContainText('The context shows the Shop')
  await page.getByRole('button', { name: 'STE' }).click()
  await expect(page.locator('#explanation-text')).toHaveText('This diagram shows the Shop and its neighbours.')
  await page.getByRole('button', { name: 'Go up' }).click()
  await expect(page.locator('#heading')).toHaveText('Shop landscape')
  await expect(page.locator('.c4-flow-canvas .c4-node')).toHaveCount(4)
  await expect(page.getByText('Arranging diagram')).toHaveCount(0)
  await page.screenshot({ path: info.outputPath('compose.png') })
  expect(errors).toEqual([])
})

test('static recipe uses layout-worker.js beside the page', async ({ page }, info) => {
  const errors = watch(page)
  const workers: string[] = []
  page.on('worker', worker => workers.push(worker.url()))
  await page.goto(`${fixed}static.html#/architectures/shop/diagrams/context`)
  await expect(page.locator('.c4-flow-canvas')).toBeVisible()
  await expect(page.locator('.c4-flow-canvas .c4-node')).toHaveCount(4)
  expect(workers).toContain(`${fixed}layout-worker.js`)
  await page.screenshot({ path: info.outputPath('static.png') })
  expect(errors).toEqual([])
})
