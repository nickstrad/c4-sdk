import { createRoot } from 'react-dom/client'
import {
  ArchitectureProvider,
  DiagramDocumentation,
  DiagramLegend,
  DiagramNavigation,
  DiagramView,
  createElkLayoutPort,
  useViewerController,
} from 'c4-sdk'
import type { DocumentationSlot } from 'c4-sdk'
import { decodeArchitecture } from 'c4-sdk/core'
import workerUrl from 'c4-sdk/layout-worker.js?url'
import 'c4-sdk/styles.css'
import bundle from './bundle.json'

const layoutPort = createElkLayoutPort(() => new Worker(workerUrl, { type: 'module' }))
const decoded = decodeArchitecture(bundle)
if (!decoded.ok) throw new Error(decoded.diagnostics.map(item => item.message).join('\n'))

// A documentation slot receives the selection, the active mode and mode callbacks.
const steSlot: DocumentationSlot = ({ document, mode, onPlain, onSte }) => (
  <section aria-label="Explanation">
    <button aria-pressed={mode === 'plain'} onClick={onPlain}>Plain</button>
    <button aria-pressed={mode === 'ste'} onClick={onSte}>STE</button>
    <h2>{document?.title ?? 'No explanation'}</h2>
    <p id="explanation-text">{mode === 'ste' ? document?.ste.text : document?.plain}</p>
  </section>
)

function Heading() {
  const { diagram, navigate } = useViewerController()
  return (
    <header>
      <h1 id="heading">{diagram?.title}</h1>
      <button onClick={() => navigate({ type: 'up' })}>Go up</button>
    </header>
  )
}

createRoot(document.getElementById('root')!).render(
  <ArchitectureProvider validatedBundle={decoded.value} layoutPort={layoutPort}>
    <Heading />
    <DiagramNavigation />
    <DiagramView legendSlot={() => null} />
    <DiagramLegend />
    <DiagramDocumentation slot={steSlot} />
  </ArchitectureProvider>,
)
