# c4-sdk

React components and pure TypeScript functions for rendering [C4 model](https://c4model.com/) architecture diagrams from validated JSON. One pipeline draws all seven diagram kinds:

| Kind | Wrapper component | Shows |
| --- | --- | --- |
| `landscape` | `SystemLandscape` | People and systems across an organisation |
| `context` | `SystemContext` | One system and its neighbours |
| `container` | `ContainerDiagram` | Deployable parts inside a system |
| `component` | `ComponentDiagram` | Parts inside one container |
| `code` | `CodeDiagram` | Declared classes, interfaces and members as display text |
| `dynamic` | `DynamicDiagram` | Numbered or parallel interaction scenarios |
| `deployment` | `DeploymentDiagram` | Physical nodes and replicas |

> **Publication status.** The package name `c4-sdk` is a candidate. Nothing in this document claims that it has been published to the npm registry. Until Nick publishes it, install the packed `.tgz` that your release process produced (`npm install ./c4-sdk-<version>.tgz`). The commands below use the registry name that publication will provide.

## Install

```sh
npm install c4-sdk react@19.3.0 react-dom@19.3.0
```

`react` and `react-dom` are **peer dependencies** (exactly `19.3.0`); the package never bundles a second copy. Zod, React Flow, ELK and the Markdown renderer are bundled and need no separate install.

## Supported and exercised versions

Only the versions below are tested against the exact packed tarball. Other versions may work but are not promised.

| Area | Exercised version |
| --- | --- |
| Node.js | 22.23.2 (Linux x64) |
| npm | 10.9.8 |
| React / React DOM | 19.3.0 |
| TypeScript | 6.0.3, `strict`, `skipLibCheck: false`; NodeNext `.mts`/`.cts` and bundler-resolution TSX |
| Vite | 8.3.4, non-root base path |
| Browser | Chromium from Playwright 1.64.0, desktop and Pixel 7 emulation |

Server rendering and hydration, Node workers, Firefox/WebKit and other bundlers are not tested.

## Quick start

This is a complete app: valid data, decoding with error handling, a worker, the stylesheet and the viewer. Create these three files in a Vite + React + TypeScript project (Vite 8, `"jsx": "react-jsx"`, `"resolveJsonModule": true`, `"types": ["vite/client"]`).

`index.html`:

<!-- example: examples/readme/index.html -->
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>c4-sdk quick start</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

`main.tsx`:

<!-- example: examples/readme/main.tsx -->
```tsx
import { createRoot } from 'react-dom/client'
import { ArchitectureViewer, createElkLayoutPort } from 'c4-sdk'
import { decodeArchitecture } from 'c4-sdk/core'
import workerUrl from 'c4-sdk/layout-worker.js?url'
import 'c4-sdk/styles.css'
import bundle from './bundle.json'

const layoutPort = createElkLayoutPort(() => new Worker(workerUrl, { type: 'module' }))
const decoded = decodeArchitecture(bundle)
const root = createRoot(document.getElementById('root')!)

if (decoded.ok) {
  root.render(<ArchitectureViewer validatedBundle={decoded.value} layoutPort={layoutPort} />)
} else {
  root.render(
    <ul role="alert">
      {decoded.diagnostics.map(item => (
        <li key={`${item.code}${item.path}`}>{item.code} at {item.path}: {item.message}</li>
      ))}
    </ul>,
  )
}
```

`bundle.json` (a landscape and a context diagram with legends and an STE explanation):

<details>
<summary>bundle.json</summary>

<!-- example: examples/readme/bundle.json -->
```json
{
  "schemaVersion": 1,
  "id": "shop",
  "title": "Shop architecture",
  "revision": "readme-1",
  "defaultDiagramId": "landscape",
  "model": {
    "elements": [
      {
        "id": "customer",
        "kind": "person",
        "name": "Customer",
        "description": "A person who buys goods from the shop.",
        "status": "existing",
        "tags": [],
        "plannedNotes": [],
        "docIds": [
          "d-landscape"
        ],
        "sourceIds": [
          "guide"
        ]
      },
      {
        "id": "shop",
        "kind": "softwareSystem",
        "name": "Shop",
        "description": "Retail system that takes and tracks orders.",
        "status": "existing",
        "tags": [
          "owner-retail"
        ],
        "plannedNotes": [],
        "docIds": [
          "d-context"
        ],
        "sourceIds": [
          "guide"
        ]
      },
      {
        "id": "billing",
        "kind": "softwareSystem",
        "name": "Billing",
        "description": "Finance system that charges customers.",
        "status": "existing",
        "tags": [
          "owner-finance",
          "external"
        ],
        "plannedNotes": [],
        "docIds": [],
        "sourceIds": [
          "guide"
        ]
      },
      {
        "id": "mail",
        "kind": "softwareSystem",
        "name": "Mail service",
        "description": "Sends order notices to customers.",
        "status": "existing",
        "tags": [
          "external"
        ],
        "plannedNotes": [],
        "docIds": [],
        "sourceIds": [
          "guide"
        ]
      }
    ],
    "relationships": [
      {
        "id": "c-shop",
        "sourceId": "customer",
        "targetId": "shop",
        "label": "Places orders",
        "technology": "HTTPS",
        "status": "existing",
        "plannedNotes": [],
        "docIds": [],
        "sourceIds": [
          "guide"
        ]
      },
      {
        "id": "c-billing",
        "sourceId": "customer",
        "targetId": "billing",
        "label": "Receives invoices",
        "technology": "Email",
        "status": "existing",
        "plannedNotes": [],
        "docIds": [],
        "sourceIds": [
          "guide"
        ]
      },
      {
        "id": "shop-billing",
        "sourceId": "shop",
        "targetId": "billing",
        "label": "Requests charges",
        "technology": "HTTPS",
        "status": "existing",
        "plannedNotes": [],
        "docIds": [],
        "sourceIds": [
          "guide"
        ]
      },
      {
        "id": "shop-mail",
        "sourceId": "shop",
        "targetId": "mail",
        "label": "Sends notices",
        "technology": "SMTP",
        "status": "existing",
        "plannedNotes": [],
        "docIds": [],
        "sourceIds": [
          "guide"
        ]
      }
    ]
  },
  "diagrams": [
    {
      "id": "landscape",
      "kind": "landscape",
      "title": "Shop landscape",
      "status": "existing",
      "nodes": [
        {
          "elementId": "customer"
        },
        {
          "elementId": "shop",
          "detail": {
            "diagramId": "context"
          }
        },
        {
          "elementId": "billing"
        },
        {
          "elementId": "mail"
        }
      ],
      "edges": [
        {
          "relationshipId": "c-shop"
        },
        {
          "relationshipId": "c-billing"
        },
        {
          "relationshipId": "shop-billing"
        },
        {
          "relationshipId": "shop-mail"
        }
      ],
      "legend": {
        "title": "Landscape key",
        "entries": [
          {
            "id": "person",
            "label": "Person",
            "description": "A human user",
            "swatch": {
              "shape": "person",
              "tone": "default",
              "stroke": "solid"
            }
          },
          {
            "id": "box",
            "label": "Element",
            "description": "A system, container, component or code symbol",
            "swatch": {
              "shape": "box",
              "tone": "default",
              "stroke": "solid"
            }
          },
          {
            "id": "external",
            "label": "External element",
            "description": "Outside the scope of this view",
            "swatch": {
              "shape": "box",
              "tone": "external",
              "stroke": "solid"
            }
          },
          {
            "id": "edge",
            "label": "Relationship",
            "description": "The arrow points to the supplier",
            "swatch": {
              "shape": "line",
              "tone": "default",
              "stroke": "solid",
              "arrow": "forward"
            }
          }
        ]
      },
      "docIds": [
        "d-landscape"
      ],
      "sourceIds": [
        "guide"
      ],
      "layout": {
        "mode": "auto",
        "direction": "TB"
      }
    },
    {
      "id": "context",
      "kind": "context",
      "title": "Shop context",
      "status": "existing",
      "nodes": [
        {
          "elementId": "customer"
        },
        {
          "elementId": "shop"
        },
        {
          "elementId": "billing"
        },
        {
          "elementId": "mail"
        }
      ],
      "edges": [
        {
          "relationshipId": "c-shop"
        },
        {
          "relationshipId": "shop-billing"
        },
        {
          "relationshipId": "shop-mail"
        }
      ],
      "legend": {
        "title": "Context key",
        "entries": [
          {
            "id": "person",
            "label": "Person",
            "description": "A human user",
            "swatch": {
              "shape": "person",
              "tone": "default",
              "stroke": "solid"
            }
          },
          {
            "id": "accent",
            "label": "Element in focus",
            "description": "The scope being explored",
            "swatch": {
              "shape": "box",
              "tone": "accent",
              "stroke": "solid"
            }
          },
          {
            "id": "external",
            "label": "External element",
            "description": "Outside the scope of this view",
            "swatch": {
              "shape": "box",
              "tone": "external",
              "stroke": "solid"
            }
          },
          {
            "id": "edge",
            "label": "Relationship",
            "description": "The arrow points to the supplier",
            "swatch": {
              "shape": "line",
              "tone": "default",
              "stroke": "solid",
              "arrow": "forward"
            }
          }
        ]
      },
      "docIds": [
        "d-context"
      ],
      "sourceIds": [
        "guide"
      ],
      "layout": {
        "mode": "auto",
        "direction": "TB"
      },
      "parent": {
        "diagramId": "landscape"
      },
      "scopeId": "shop"
    }
  ],
  "documents": [
    {
      "id": "d-landscape",
      "title": "Shop landscape",
      "plain": "The landscape shows people and systems across the organisation. Retail and finance own different systems that share one customer.",
      "ste": {
        "text": "This diagram shows people and systems. Two groups own the systems.",
        "issue": "ASD-STE100 Issue 9",
        "reviewStatus": "draft"
      },
      "termIds": [],
      "sourceIds": [
        "guide"
      ]
    },
    {
      "id": "d-context",
      "title": "Shop context",
      "plain": "The context shows the Shop and the people and systems around it.",
      "ste": {
        "text": "This diagram shows the Shop and its neighbours.",
        "issue": "ASD-STE100 Issue 9",
        "reviewStatus": "draft"
      },
      "termIds": [],
      "sourceIds": [
        "guide"
      ]
    }
  ],
  "sources": [
    {
      "id": "guide",
      "title": "Shop teaching example",
      "url": "https://example.com/shop",
      "notes": "Invented teaching data."
    }
  ]
}
```

</details>

Notes:

- `decodeArchitecture` accepts parsed JSON (`unknown`), not a JSON string. Parse text yourself and handle `SyntaxError` in your host.
- It returns `{ ok: true, value, diagnostics }` or `{ ok: false, diagnostics }`. Each diagnostic has `code`, `path`, `severity` and `message`. Treat codes as an open set; do not parse `message`.
- `import 'c4-sdk/styles.css'` once. It is scoped under `.c4-sdk`, has no global reset, and exposes the tokens `--c4-ink`, `--c4-muted`, `--c4-surface`, `--c4-border`, `--c4-accent` and `--c4-external`.

## Choosing a diagram and navigating

The seven wrappers each require one kind and show a `diagram-kind` diagnostic when the routed diagram has another kind:

Pass `diagramId` to choose the starting diagram. See `SystemContext` in the strict-TypeScript example below for a wrapper.

The route (a URL hash such as `#/architectures/shop/diagrams/context/elements/shop`) owns the selection. Inject a `RoutePort` to control it from your router; `createHashRoutePort()` is the default.

## Composing legend, navigation and documentation

`ArchitectureViewer` composes navigation, the diagram, the legend and the explanation. To place the parts yourself, wrap them in one `ArchitectureProvider`. A separate `DiagramLegend` pairs with `DiagramView legendSlot={() => null}`, so the key is not shown twice. The documentation slot receives the selected `document`, the `mode` (`'plain'` or `'ste'`) and callbacks. `useViewerController` reads the same provider and offers `navigate`.

<!-- example: examples/readme/compose.tsx -->
```tsx
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
```

`compose.html` is the same HTML shell as `index.html` with `compose.tsx` as its module.

STE text is draft guidance with advisory review metadata. The package makes no claim of ASD-STE100 certification.

## ESM and CommonJS

The package ships `.mjs` and `.cjs` with matching `.d.mts` and `.d.cts` declarations. Both entry points have the same runtime names, share one React context, and import without touching `window` or `document`. Import `c4-sdk/core` in Node for decoding and pure selectors.

ESM (`.mts`, NodeNext):

<!-- example: examples/readme/node-esm.mts -->
```ts
import { readFileSync } from 'node:fs'
import { buildScene, decodeArchitecture, resolveLegend, selectDocumentation } from 'c4-sdk/core'
import type { Diagnostic } from 'c4-sdk/core'

const text = readFileSync(new URL('./bundle.json', import.meta.url), 'utf8')
const decoded = decodeArchitecture(JSON.parse(text))
if (!decoded.ok) throw new Error(decoded.diagnostics.map(item => item.code).join())

const { index } = decoded.value
const scene = buildScene(index, 'context')
const docs = selectDocumentation(index, 'context')
console.log(JSON.stringify({
  title: decoded.value.bundle.title,
  nodes: scene.ok ? scene.value.nodes.length : -1,
  legend: resolveLegend(index, 'context')?.title,
  ste: docs.documents[0]?.ste.text,
}))

// Failures are values, not exceptions. Paths point into the JSON document.
const broken = JSON.parse(text)
broken.diagrams[0].nodes[0].elementId = 'missing'
const rejected = decodeArchitecture(broken)
if (rejected.ok) throw new Error('expected rejection')
const first: Diagnostic = rejected.diagnostics[0]!
console.log(JSON.stringify({ code: first.code, path: first.path }))
```

CommonJS (`.cts`, NodeNext):

<!-- example: examples/readme/node-cjs.cts -->
```ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildScene, decodeArchitecture, resolveLegend, selectDocumentation } from 'c4-sdk/core'
import type { Diagnostic } from 'c4-sdk/core'

const text = readFileSync(join(__dirname, 'bundle.json'), 'utf8')
const decoded = decodeArchitecture(JSON.parse(text))
if (!decoded.ok) throw new Error(decoded.diagnostics.map(item => item.code).join())

const { index } = decoded.value
const scene = buildScene(index, 'context')
const docs = selectDocumentation(index, 'context')
console.log(JSON.stringify({
  title: decoded.value.bundle.title,
  nodes: scene.ok ? scene.value.nodes.length : -1,
  legend: resolveLegend(index, 'context')?.title,
  ste: docs.documents[0]?.ste.text,
}))

// Failures are values, not exceptions. Paths point into the JSON document.
const broken = JSON.parse(text)
broken.diagrams[0].nodes[0].elementId = 'missing'
const rejected = decodeArchitecture(broken)
if (rejected.ok) throw new Error('expected rejection')
const first: Diagnostic = rejected.diagnostics[0]!
console.log(JSON.stringify({ code: first.code, path: first.path }))
```

Both examples print the title, node count, legend title and STE text, then print the `code` and `path` of the first diagnostic for a deliberately broken copy.

Named React wrappers and core diagram types share names (`ContainerDiagram` and so on). Alias one when you import both into one module.

## Layout worker

Layout runs in a browser module worker. There are two supported recipes.

**Vite (bundler asset URL).** Import the asset with `?url` and pass a factory, as in `main.tsx` above. Vite fingerprints the file and respects `base`.

**Static host at a sub-path.** With no factory, `createElkLayoutPort()` requests `layout-worker.js` relative to `document.baseURI`. Copy `node_modules/c4-sdk/dist-sdk/layout-worker.js` next to your page and serve it from the same base path:

<!-- example: examples/readme/static.tsx -->
```tsx
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
```

Each layout request creates a worker and terminates it on completion, failure, timeout or abort. There is no public message protocol.

## Strict TypeScript and misuse

The declarations compile under `strict` with `skipLibCheck: false`. Misuse is a compile error:

<!-- example: examples/readme/misuse.tsx -->
```tsx
import { ArchitectureViewer, SystemContext } from 'c4-sdk'
import type { ValidatedArchitecture } from 'c4-sdk/core'

declare const validated: ValidatedArchitecture

export const ok = <ArchitectureViewer validatedBundle={validated} />
export const kindChecked = <SystemContext validatedBundle={validated} />

// @ts-expect-error validatedBundle is required.
export const missing = <ArchitectureViewer />
// @ts-expect-error Raw JSON is not validated data.
export const raw = <ArchitectureViewer validatedBundle={{ schemaVersion: 1 }} />
// @ts-expect-error Named wrappers fix the expected kind.
export const kind = <SystemContext validatedBundle={validated} expectedKind="container" />
```

## API reference

- [Public API contract](https://github.com/nickstrad/c4-sdk/blob/main/docs/api/public-api.md): every export, signature, diagnostic code and limit.
- [Support matrix](https://github.com/nickstrad/c4-sdk/blob/main/docs/api/support-matrix.md)
- [Acceptance and resource envelope](https://github.com/nickstrad/c4-sdk/blob/main/docs/api/acceptance.md)
- [License and attribution record](https://github.com/nickstrad/c4-sdk/blob/main/docs/release/licenses.md)

Package entries: `c4-sdk` (React components, ports, adapters), `c4-sdk/core` (decoding, selectors, navigation, types), `c4-sdk/styles.css`, `c4-sdk/layout-worker.js`.

## Demo

The repository contains a showcase application, "Git at any scale". To run it:

```sh
git clone https://github.com/nickstrad/c4-sdk.git
cd c4-sdk
npm ci
npm run dev:demo
```

`npm run dev` starts the generic reference viewer on its own sample catalog.

## Tests and release verification

From a repository checkout:

```sh
npm run sdk:check            # typecheck, lint, unit, property and API-snapshot tests
npm run sdk:build            # builds dist-sdk/
npm pack                     # creates c4-sdk-<version>.tgz
npm run test:package         # needs TARBALL=<absolute path>; installs it in a clean consumer
node tests/readme/verify.mjs <absolute-tarball-path>
```

`tests/readme/verify.mjs` installs the exact tarball in a clean temporary consumer, checks that every snippet above equals its file in `examples/readme/`, compiles the ESM, CJS and TSX examples with strict declarations, runs the Node examples, builds the Vite app at a sub-path and drives the quick start in Chromium (ports 4187 and 4188). It never builds or packs. Set `README_REPORT=<path>` to write a JSON report with the tarball `sha256`, `version` and `passed`.

Publication is a separate, manual step that is not part of these commands.

## Limitations

- Browser rendering only; no server rendering or hydration.
- Read-only: no editing, dragging or persistence.
- Layout of very large views is slow: a 200-node/400-edge diagram took about 4.8 to 5.2 seconds in tests on 4 shared vCPUs. Limits (5,000 elements, 10,000 relationships, 200 diagrams and others) are resource guards, not timing guarantees.
- Markdown in documentation supports safe links and literal text; HTML, images and components are rejected.
- Only the versions in the table above are exercised.

## Schema evolution

`schemaVersion` is exactly `1` and is independent of the package version. Unknown versions and unknown fields are rejected. A change to schema 1 must keep accepted data and its meaning or introduce a new schema version. In `0.x` releases, API changes are reviewed and recorded; from `1.0` removal or renaming of public symbols, fields, diagnostics or CSS tokens needs a major version. There is no cross-version migration tool.

## Contributing and bug reports

Report bugs and request features at [github.com/nickstrad/c4-sdk/issues](https://github.com/nickstrad/c4-sdk/issues). Pull requests are welcome: run `npm run sdk:check` first and keep one logical change per commit.

## License

MIT, Copyright (c) 2026 Nick Strad. See [LICENSE](https://github.com/nickstrad/c4-sdk/blob/main/LICENSE). Bundled third-party code keeps its own licenses in [THIRD_PARTY_NOTICES.md](https://github.com/nickstrad/c4-sdk/blob/main/THIRD_PARTY_NOTICES.md).
