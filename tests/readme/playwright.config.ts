import { defineConfig, devices } from '@playwright/test'
import { resolve } from 'node:path'

const consumer = process.env.CONSUMER_DIR
if (!consumer) throw new Error('CONSUMER_DIR must identify the clean README consumer directory')

// Ports 4187 (quick start and composition) and 4188 (static worker recipe) are reserved for README tests.
export default defineConfig({
  testDir: '.',
  testMatch: 'browser.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: process.env.README_OUTPUT_DIR ?? '/tmp/c4-sdk-p-04-browser',
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    { command: 'node node_modules/vite/bin/vite.js preview --outDir dist --host 127.0.0.1 --port 4187 --strictPort', cwd: resolve(consumer), url: 'http://127.0.0.1:4187/consumer/subpath/' },
    { command: 'node node_modules/vite/bin/vite.js preview --mode static --outDir dist-static --host 127.0.0.1 --port 4188 --strictPort', cwd: resolve(consumer), url: 'http://127.0.0.1:4188/consumer/static/static.html' },
  ],
})
