import {defineConfig,devices} from '@playwright/test'
import {resolve} from 'node:path'
const consumer=process.env.CONSUMER_DIR
if(!consumer)throw new Error('CONSUMER_DIR must identify the exact tarball consumer report directory')
export default defineConfig({testDir:'.',testMatch:'browser.spec.ts',fullyParallel:false,workers:1,reporter:'list',outputDir:'/tmp/c4-sdk-p-02-browser',use:{baseURL:'http://127.0.0.1:4185/consumer/subpath/',trace:'retain-on-failure'},projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['Pixel 7']}}],webServer:[{command:'node node_modules/vite/bin/vite.js preview --outDir dist-esm --host 127.0.0.1 --port 4185 --strictPort',cwd:resolve(consumer),url:'http://127.0.0.1:4185/consumer/subpath/'},{command:'node node_modules/vite/bin/vite.js preview --outDir dist-cjs --host 127.0.0.1 --port 4186 --strictPort',cwd:resolve(consumer),url:'http://127.0.0.1:4186/consumer/subpath/'}]})
