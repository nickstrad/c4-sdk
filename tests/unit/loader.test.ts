import { expect, it } from 'vitest'
import { createFetchLoader, readBoundedJson } from '../../src/lib/c4/adapters/loaders/fetch'
it('bounds actual streamed bytes even without content-length and cancels readers', async () => {
  let cancelled = false
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('x'.repeat(12))) }, cancel() { cancelled = true } })
  await expect(readBoundedJson(new Response(stream), 10)).rejects.toThrow('10-byte limit')
  expect(cancelled).toBe(true)
})
it('rejects HTTP failures, oversized advertised length, malformed JSON and invalid UTF-8', async () => {
  await expect(readBoundedJson(new Response('{}', { status: 404 }))).rejects.toThrow('HTTP 404')
  await expect(readBoundedJson(new Response('{}', { headers: { 'content-length': '100' } }), 10)).rejects.toThrow('10-byte limit')
  await expect(readBoundedJson(new Response('{broken'))).rejects.toThrow('valid UTF-8 JSON')
  await expect(readBoundedJson(new Response(new Uint8Array([255])))).rejects.toThrow('valid UTF-8 JSON')
})
it('resolves catalog relative resources to catalog location and forwards AbortSignal', async () => {
  const controller = new AbortController(); const calls: { url: string; signal: unknown }[] = []
  const loader = createFetchLoader(async (url, options) => { calls.push({ url: String(url), signal: options?.signal }); return new Response(JSON.stringify({ entries: [{ id: 'sample', title: 'Sample', url: 'diagrams/sample.json' }] })) })
  const catalog = await loader.loadCatalog('https://example.test/base/catalog.json', controller.signal)
  expect(catalog.entries[0].url).toBe('https://example.test/base/diagrams/sample.json'); expect(calls[0].signal).toBe(controller.signal)
})
it('rejects duplicate IDs and unsafe catalog resources', async () => {
  const entry = { id: 'sample', title: 'Sample', url: 'diagrams/sample.json' }
  const signal = new AbortController().signal
  const duplicate = createFetchLoader(async () => new Response(JSON.stringify({ entries: [entry, entry] })))
  await expect(duplicate.loadCatalog('https://example.test/catalog.json', signal)).rejects.toThrow('unique')
  const unsafe = createFetchLoader(async () => new Response(JSON.stringify({ entries: [{ ...entry, url: 'javascript:alert(1)' }] })))
  await expect(unsafe.loadCatalog('https://example.test/catalog.json', signal)).rejects.toThrow('safe')
})
