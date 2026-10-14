import {defineConfig} from 'vite'
export default defineConfig(({mode})=>({base:'/consumer/subpath/',build:{outDir:`dist-${mode}`,minify:false},server:{host:'127.0.0.1'}}))
