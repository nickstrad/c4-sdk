# c4-sdk

A React C4 SDK with a generic reference viewer and a small Cursor-based showcase. All seven C4 diagram kinds (landscape, context, container, component, code, dynamic, deployment) render through one pipeline; the [implementation plan](docs/plans/implementation.md) tracks the showcase and consumer work.

## Run and validate

```sh
npm install
npm run dev                 # generic viewer, own sample catalog
npm run dev:demo            # Git at any scale showcase
npm run build
npm run build:demo
npm run typecheck           # SDK, both apps, configs and tests
npm run lint
npm run test:unit           # Node unit tests and jsdom hook tests
npm run test:prop           # fast-check: architecture seed4012026; navigation seed4022026
npx playwright install chromium
npm run test:browser        # actual production builds, desktop/mobile Chromium
npm run check               # all of the above checks and builds
```

Browser tests build the demo at `/c4-preview/`, serve it with that base, and test the generic production app separately. They cover valid/invalid resources, preserved last-valid state, keyboard focus, drill/Inspect/Up, actual Back/Forward across reload, deep URLs, native destination links/new tabs, delayed and failed catalog selections, separate fixture catalogs, axe, reduced motion and 200% zoom. Screenshots and failure traces go to ignored `test-results/`; a human must inspect the screenshots. Tests use local ports 4173/4174. No hosting or publication occurs.

Vitest discovers future `tests/copy-consumer/policy/**/*.test.ts` and `tests/hooks/**/*.test.{ts,tsx}`. Pure tests run in Node; hooks use jsdom. Existing Vite/React/Tailwind/shadcn primitives are preserved. Effect is installed by the scaffold but is not used in domain logic.

## Source SDK API

Import from `src/lib/c4/index.ts` and import `src/lib/c4/styles/c4.css` once in the host. The CSS is scoped under `.c4-sdk`, has no global reset, and provides `--c4-ink`, `--c4-muted`, `--c4-surface`, `--c4-border`, `--c4-accent` and `--c4-external` tokens. React, React DOM and Zod are runtime dependencies; Tailwind is used by the generic host, not required by SDK views.

```tsx
import { decodeArchitecture, ArchitectureViewer, Legend } from './src/lib/c4'
import './src/lib/c4/styles/c4.css'

const decoded = decodeArchitecture(json)
if (decoded.ok) {
  const viewer = <ArchitectureViewer validatedBundle={decoded.value} />
  const independentKey = <Legend {...decoded.value.bundle.diagrams[0].legend} />
}
```

`decodeArchitecture(unknown)` returns either a whole immutable validated value with indexes and warnings, or structured diagnostics with code/path/severity/message. `ArchitectureViewer` renders whatever diagram the route selects; the seven named wrappers below are kind-checked entries to the same pipeline. `projectDiagram`, `selectDocumentation`, `resolveLegend`, `validateArchitecture` and `buildIndex` are pure functions; callers should index only successfully validated data. `architectureSchema` and `architectureJsonSchema` expose the runtime shape and editor schema; reference, URL safety and metadata checks additionally run in the decoder.

`CatalogViewer` accepts a `catalogUrl`, optional loader/route ports and title. Catalog entry IDs must match their valid bundle IDs so a deep architecture URL selects its resource; mismatches reject the replacement. Selecting a resource keeps the current route/history until its whole valid bundle loads, then opens that bundle’s declared default diagram. `createFetchLoader` reads a strict `{entries:[{id,title,url}]}` catalog, resolves relative URLs against its location, bounds catalog bytes at 256 KiB and bundle bytes at 5 MiB before JSON parsing, and forwards AbortSignals. Failed replacements retain the entire last valid dataset. Stale requests cannot replace a newer resource or catalog. The generic app accepts `VITE_C4_CATALOG_URL` at its application boundary; the SDK contains no consumer-specific resource paths.

### Seven named wrappers and composition

| Wrapper | Accepts | Natural drill target |
| --- | --- | --- |
| `SystemLandscape` | `landscape`: people and software systems, optional scoped system | a system's `context` |
| `SystemContext` | `context`: one system with people and external systems | its `container` view |
| `ContainerDiagram` | `container` | a container's `component` view |
| `ComponentDiagram` | `component` | a component's `code` view |
| `CodeDiagram` | `code`: selected symbols of one component with member compartments | — |
| `DynamicDiagram` | `dynamic`: ordered interactions | — |
| `DeploymentDiagram` | `deployment`: nested physical nodes and instances | an instance's logical container or component |

Every wrapper takes the same `NamedDiagramProps` as `ArchitectureViewer` and renders it with `expectedKind` set. The check uses the **routed** diagram, after the route port, direct URL or a followed drill link has chosen it, so a wrapper never silently renders another kind: it shows a `diagram-kind` diagnostic naming the expected and actual kinds. Use `ArchitectureViewer` when any kind is acceptable (the catalog viewer does).

For a custom layout, wrap parts in one `ArchitectureProvider`. The provider owns the single route, navigation and session controller; `DiagramNavigation`, `DiagramView`, `DiagramLegend` and `DiagramDocumentation` read it from context, and `useViewerController()` gives custom parts the current route, diagram and `navigate`. Parts throw outside a provider, and there is no exported hook that starts a second route controller. `navigationSlot`, `legendSlot` and `documentationSlot` (on `ArchitectureViewer`, or `slot`/`legendSlot` on the parts) replace the default navigation, key and explanation with props-only render functions.

<!-- composition-example -->
```tsx
import { ArchitectureProvider, DiagramDocumentation, DiagramLegend, DiagramNavigation, DiagramView, useViewerController } from './src/lib/c4'
import type { ValidatedArchitecture } from './src/lib/c4'

function CurrentKind() {
  const { diagram } = useViewerController()
  return <p>Showing a {diagram?.kind} diagram</p>
}

export function ShopWorkspace({ validatedBundle }: { validatedBundle: ValidatedArchitecture }) {
  return <ArchitectureProvider validatedBundle={validatedBundle}>
    <aside><DiagramNavigation /><DiagramLegend /></aside>
    <main><CurrentKind /><DiagramView legendSlot={() => null} /></main>
    <DiagramDocumentation slot={props => <section aria-label="Explanation">{props.document?.plain}</section>} />
  </ArchitectureProvider>
}
```

The example above is `tests/hooks/composition-example.tsx`; a hooks test type-checks it, renders it and fails if this README block drifts.

### Code views

A `code` element has `parentId` (a component, or another code element for nested symbols, up to depth 32), `symbolKind` (`class`, `interface`, `function`, `type`, `enum`, `table`, `module`) and optional `members`: each `name`, optional `signature` and `visibility` (`public`, `protected`, `private`, `package`; default `public`). Members are literal display text, never parsed, fetched or executed, and are rendered as an accessible list inside the symbol card and in the text alternative. A code view's scope is a component; its members must descend from that component unless tagged `external`. Relationship `kind` adds `inheritance`, `implementation` (target interface or type) and `composition`, which connect code elements only. Symbol and member rendering keys (`symbolKey`, `memberKey`) are derived from element ID and member index, never from member names. The fixture `fixtures/seven-types.json` is generic, invented teaching data; the Cursor showcase has no code view.

This is source-copy consumption, with one private root package and lockfile. There is no npm package publication. See the plan for the later reviewed copy/provenance workflow.

## Supported contract and current limits

Version 1 uses separate model identities and diagram membership. The model supports person/softwareSystem/container/component/code/deployment elements; containers require a software-system `parentId` and `technology`, with application/datastore `containerType`; dependency/association/inheritance/implementation/composition relationships; all seven diagram kinds: landscape (optional system scope), context, container, component, code, dynamic scenarios and deployment environments; declared detail/parent/related targets, manual positions/sizes or deterministic auto LR/TB arrangements; legend swatches; sources, technical terms and Plain/STE documents. Unsupported element/diagram kinds, relationship kinds, later containment kinds, arbitrary HTML/SVG and unknown keys are rejected explicitly. See `fixtures/context.json` and `fixtures/navigation.json` for complete inputs. Optional arrays normalize to empty without mutating caller data.

Validation rejects duplicate IDs/members/edges, invalid scopes/containment, wrong detail scopes, cyclic canonical parents, hidden navigation targets/edge endpoints, absent document/source/term references, mixed entities without planned notes, reviewed STE without reviewer/date, unsafe sources and incomplete manual positions. Missing protocols, missing key notation and large views are visible warnings. Default enforced limits are 5,000 elements, 10,000 relationships, 200 diagrams and raw JSON depth 32 (96 inside dynamic scenarios); these are guardrails, not performance benchmarks.

Groups validate and project with separate IDs, direct membership and bounded parent ancestry. Auto layout uses an asynchronous ELK worker for compound groups, measured cards and routed edges in LR/TB directions; manual positions remain authored. Geometry validation rejects unsafe or non-finite spans and invalid sizes. The canvas offers pan/zoom and a complete directed relationship list; dynamic views also provide a scenario text alternative. Documentation renders Markdown with safe links and no executable HTML, images or user components, plus sources, technical terms and review metadata. STE100 text remains draft unless human review metadata exists; diagnostics are advisory and schema validation does not certify language compliance. The [implementation plan](docs/plans/implementation.md) tracks remaining consumer and hardening work.

## Navigation and extension seams

The default browser adapter uses hash URLs such as `#/architectures/cursor-continuity/diagrams/containers/elements/repository`, preserving the host’s base path. A single injected `RoutePort` owns the route snapshot, subscriptions and history operations; `getSnapshot()` must return the same object until the URL or history availability changes. The pure `parseRoute`, `formatRoute`, `transition`, `validateRoute` and `breadcrumbs` functions own route decisions. Detail, related, breadcrumb, Up and recovery destinations are native anchors with codec-derived hash hrefs. Ordinary primary activation goes through the route port; modified clicks and new-tab actions retain browser behavior. Nodes without a detail remain Inspect buttons; linked nodes also have an explicit Inspect button for their own explanation. Up selects the canonical parent anchor. Back uses real same-tab viewer history, including after reload; a new visitor falls back to Up then the dataset root. Invalid diagrams/elements show diagnostics and an Open diagram recovery action. Related cycles are permitted; canonical parent cycles are rejected.

Focus and canvas scroll are retained per dataset revision and diagram for the mounted viewer. Up restores the parent node; route changes announce the diagram title. Browser history carries only route entry ownership/depth, not a separate private route stack. Session storage carries the tab’s viewer identity so reload retains safe Back availability; if storage is unavailable, Back falls back safely after recreation.

`buildScene` produces pure membership/relationship inputs in `domain/scene.ts`. `domain/documentation.ts` owns document selection. `domain/layout.ts`, `ports/layout.ts`, `useDiagramLayout.ts` and `DiagramCanvas.tsx` form the replaceable layout/canvas seam. An injected `LayoutPort` receives an abort signal and request generation, then returns that generation and a geometry result or diagnostics. Stale, aborted and mismatched generations cannot publish; accepted geometry must preserve scene membership/endpoints and be finite and positive. Initial async layout shows a link-enabled text alternative while geometry is pending; a previously published scene for the same input can remain visible during measurement replacement. Optional measured sizes and a measurement revision extend the port without changing unmeasured adapters. SceneInput includes architecture/revision, groups and pure presentation attributes; geometry uses absolute bounds, parent IDs and optional routed sections/label bounds. Workers must return geometry and reattach original validated objects before publication. The default adapter uses an ELK worker with cancellation, bounded geometry caching and font/resize measurement; authored manual positions remain exact. See the [reviewed seam contract](docs/plans/batch-c-contracts.md) for cache and two-pass contracts.

`ArchitectureViewer` also accepts a `documentationSlot(props)` with the same props as `DocumentationView`; the slot receives selected documents and format callbacks without owning navigation or geometry. Document and layout adapters can change separate modules. Viewer containers compose hooks and views; useViewerSession owns focus/scroll lifecycle, useCatalogViewer owns route/resource lifecycle, and pure domain selectors choose related/detail targets. Browser tests inject independent fixture catalogs through the same production `CatalogViewer`, so future slices need not edit the showcase JSON.

## Project workflow

[AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), [coordination](agent-work/COORDINATION.md), [event log](agent-work/event-log.md) and [work-script index](work-scripts/INDEX.md) define repository work and review.
