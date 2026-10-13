import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/browser', fullyParallel: true, reporter: 'list',
  outputDir: 'test-results', use: { baseURL: 'http://127.0.0.1:4173/c4-preview/', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } }, { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }],
  webServer: [
    { command: 'npm run build:demo -- --base=/c4-preview/ && npx vite preview --config demos/git-at-any-scale/vite.config.ts --base=/c4-preview/ --host 127.0.0.1 --port 4173 --strictPort', url: 'http://127.0.0.1:4173/c4-preview/', reuseExistingServer: false },
    { command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4174 --strictPort', url: 'http://127.0.0.1:4174', reuseExistingServer: false },
  ],
})
