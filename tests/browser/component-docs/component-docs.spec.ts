import { readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const bundle=JSON.parse(readFileSync('fixtures/component-docs.json','utf8'))
test.beforeEach(async({page})=> {
 await page.route('**/catalog.json',route=>route.fulfill({json:{entries:[{id:bundle.id,title:bundle.title,url:'diagrams/component-docs.json'}]}}))
 await page.route('**/diagrams/component-docs.json',route=>route.fulfill({json:bundle}))
})
test('components, Markdown documents, safe links and responsive explanation keyboard',async({page},info)=> {
 await page.goto('./')
 await expect(page.getByRole('heading',{name:'Continuity: inferred components',exact:true}).first()).toBeVisible()
 await page.getByRole('button',{name:'Inspect Transaction preparation',exact:true}).click()
 const mobile=info.project.name.startsWith('mobile')
 if(mobile) { await page.getByRole('button',{name:'Open explanation'}).focus(); await page.keyboard.press('Enter') }
 const docs=page.locator('.c4-documentation:visible')
 await expect(docs.getByRole('heading',{name:'Transaction preparation',exact:true}).first()).toBeVisible()
 await expect(docs.locator('li').first()).toContainText('Read the current references')
 await expect(docs.getByRole('link',{name:'the source article'})).toHaveAttribute('rel','noopener noreferrer')
 await expect(docs).toContainText('Technical terms')
 await docs.getByLabel('Document',{exact:true}).selectOption('safety-doc')
 await expect(docs.getByText('unsafe link',{exact:true})).toBeVisible()
 await expect(docs.getByRole('link',{name:'unsafe link'})).toHaveCount(0)
 await expect(docs.getByRole('link',{name:'encoded link'})).toHaveCount(0)
 await expect(docs.locator('script,img')).toHaveCount(0)
 await expect(docs.getByRole('link',{name:'local reference'})).toHaveAttribute('href','guides/reference.md')
 await docs.getByRole('button',{name:'STE100 text',exact:true}).click()
 await expect(docs).toContainText('Fixture reviewer (illustrative) · 2026-10-13')
 if(mobile) {
   const bounds=await page.getByRole('dialog').boundingBox(); expect(bounds?.y).toBeCloseTo(0, 0); expect(bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width)
   await expect(page.getByRole('button',{name:'Close explanation'})).toBeVisible()
   await page.screenshot({path:info.outputPath('component-docs-sheet-viewport.png')})
 }
 await page.screenshot({path:info.outputPath('component-docs.png'),fullPage:true})
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
 if(mobile) { await page.keyboard.press('Escape'); await expect(page.getByRole('button',{name:'Open explanation'})).toBeFocused() }
 await page.getByRole('button',{name:'Inspect WAL publication',exact:true}).click()
 if(mobile) await page.getByRole('button',{name:'Open explanation'}).click()
 await expect(page.locator('.c4-documentation:visible')).toContainText('No explanation is provided')
 if(mobile) await page.keyboard.press('Escape')
 await page.evaluate(()=>{document.documentElement.style.zoom='2'})
 if(await page.getByRole('button',{name:'Open explanation'}).isVisible()) await page.getByRole('button',{name:'Open explanation'}).click()
 await expect(page.locator('.c4-documentation:visible')).toContainText('WAL publication')
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 await page.screenshot({path:info.outputPath('component-docs-zoom.png'),fullPage:true})
})
