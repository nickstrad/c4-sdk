import { createRoot } from 'react-dom/client'
import { ArchitectureViewer, createElkLayoutPort } from 'c4-sdk'
import { decodeArchitecture } from 'c4-sdk/core'
import 'c4-sdk/styles.css'
import bundle from './bundle.json'

// Default port: requests layout-worker.js relative to document.baseURI.
// Copy node_modules/c4-sdk/dist-sdk/layout-worker.js beside the page.
const decoded = decodeArchitecture(bundle)
if (!decoded.ok) throw new Error('Invalid architecture')
createRoot(document.getElementById('root')!).render(
  <ArchitectureViewer validatedBundle={decoded.value} layoutPort={createElkLayoutPort()} />,
)
