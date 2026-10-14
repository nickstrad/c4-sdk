import {test,expect,type Page} from '@playwright/test'
import {readFileSync} from 'node:fs'
const bundle=JSON.parse(readFileSync('fixtures/seven-types.json','utf8'))
const root=(port:number)=>`http://127.0.0.1:${port}/consumer/subpath/`
const open=async(page:Page,port:number,id:string)=>{await page.goto(`${root(port)}#/architectures/seven-types/diagrams/${id}`);await expect(page.locator('.c4-flow-canvas')).toBeVisible()}
test('default worker supports a static host at a non-root base',async({page})=>{
 const workerUrls:string[]=[];page.on('worker',worker=>workerUrls.push(worker.url()))
 await page.goto(`${root(4185)}?static#/architectures/seven-types/diagrams/code`)
 await expect(page.locator('.c4-flow-canvas')).toBeVisible()
 expect(workerUrls.some(url=>url===`${root(4185)}layout-worker.js`)).toBe(true)
 await expect.poll(()=>page.workers().length).toBe(0)
})
for(const [mode,port] of [['esm',4185],['cjs',4186]] as const){
 test(`${mode}: all seven kinds, CSS isolation, navigation, focus and explanations`,async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text())})
  const workers:string[]=[];page.on('worker',worker=>workers.push(worker.url()))
  for(const diagram of bundle.diagrams){
   await open(page,port,diagram.id)
   await expect(page.locator('.c4-flow-canvas .c4-node')).toHaveCount(diagram.nodes.length)
   await expect(page.locator('.c4-legend')).toBeVisible()
   expect(await page.locator('.c4-sdk').evaluate(node=>getComputedStyle(node).getPropertyValue('--c4-accent').trim())).toBe('#124e69')
   expect(await page.locator('#host-control').evaluate(node=>getComputedStyle(node).getPropertyValue('--c4-accent'))).toBe('')
   const first=page.locator('.c4-flow-canvas .c4-node').first();await first.focus();await expect(first).toBeFocused()
   await expect.poll(()=>first.evaluate(node=>{const b=node.getBoundingClientRect(),c=node.closest('.c4-flow-canvas')!.getBoundingClientRect();return b.left>=c.left-2&&b.right<=c.right+2&&b.top>=c.top-2&&b.bottom<=c.bottom+2})).toBe(true)
   if(info.project.name==='mobile'){await page.getByRole('button',{name:'Open explanation'}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog')).toHaveCSS('position','fixed');await page.getByRole('button',{name:'Close explanation'}).click()}
   else await expect(page.locator('.c4-documentation:visible')).toContainText(diagram.title)
   await page.screenshot({path:info.outputPath(`${mode}-${diagram.id}.png`),fullPage:true})
  }
  await open(page,port,'landscape');await page.locator('.c4-flow-canvas').getByRole('link',{name:'Open detail for Shop'}).focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/diagrams\/context$/);await page.goBack();await expect(page).toHaveURL(/diagrams\/landscape$/)
  expect(workers.length).toBeGreaterThan(0);expect(workers.every(url=>url.includes('/consumer/subpath/assets/')&&url.includes('layout-worker'))).toBe(true)
  expect(errors).toEqual([])
 })
 test(`${mode}: worker disposal, cancellation, accessible failure fallback`,async({page})=>{
  await open(page,port,'code')
  await expect.poll(()=>page.evaluate(()=>{const m=(window as unknown as {packageMetrics:{starts:number,stops:number}}).packageMetrics;return m.starts===m.stops&&m.starts>0})).toBe(true)
  await page.getByRole('button',{name:'Cancel layout',exact:true}).click();await expect(page.locator('#cancel-result')).toHaveText('cancelled')
  await page.getByRole('button',{name:'Toggle failure'}).click();await expect(page.getByLabel('Resource diagnostics')).toContainText('test worker failure');await expect(page.locator('.c4-layout-fallback')).toBeVisible()
  await page.getByRole('button',{name:'Toggle viewer'}).click();await expect(page.locator('.c4-sdk')).toHaveCount(0)
  await expect.poll(()=>page.evaluate(()=>{const m=(window as unknown as {packageMetrics:{starts:number,stops:number}}).packageMetrics;return m.starts===m.stops})).toBe(true)
  await expect.poll(()=>page.workers().length).toBe(0)
 })
}
