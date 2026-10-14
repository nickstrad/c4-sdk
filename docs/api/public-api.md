# Public SDK contract

Frozen source contract: 2026-10-14, P-01, inspected at `a585d97` (landed C4-01–10).
This defines the candidate API; there is no published package yet. Distribution, declarations,
CSS extraction, worker URLs and module compatibility are P-02 acceptance work. See the
[support proposal](support-matrix.md) and [item checkpoint](../../agent-work/items/P-01/STATE.md).

## Entries and inventory

| Candidate import | Source facade | Contract |
| --- | --- | --- |
| `c4-sdk` | [`src/index.ts`](../../src/index.ts) | React components, composition hook, browser adapters and their types |
| `c4-sdk/core` | [`src/core/index.ts`](../../src/core/index.ts) | Unknown-data decoding, structural model/port types, pure navigation and scene membership |
| `c4-sdk/styles.css` | P-02 asset | Explicit stylesheet; no consumer Tailwind pipeline or demo fonts |
| `c4-sdk/layout-worker.js` | P-02 asset | Browser module-worker asset; use the worker factory below, never its private message protocol |

The existing `src/lib/c4/index.ts` remains the historical source-consumer barrel. It is not the package
export list. No wildcard or `src/`/`dist/` deep-import contract is proposed. Runtime/schema engines,
private contexts, renderer hooks, React Flow nodes/edges, layout caches and app/demo code stay private.
The exact exported names, callable signatures, optional fields and read-only fields are recorded in the
[compiler-resolved snapshot](../../tests/api/public-api.snapshot.json). Changes require explicit review;
regenerating a snapshot does not itself approve an API change.

## React entry

The exact runtime exports are `ArchitectureViewer`, `ArchitectureProvider`, `DiagramNavigation`,
`DiagramView`, `DiagramLegend`, `DiagramDocumentation`, `SystemLandscape`, `SystemContext`,
`ContainerDiagram`, `ComponentDiagram`, `CodeDiagram`, `DynamicDiagram`, `DeploymentDiagram`,
`CatalogViewer`, `Legend`, `useViewerController`, `createFetchLoader`, `createHashRoutePort`,
and `createElkLayoutPort`.

| Symbol | Signature / behavior |
| --- | --- |
| `ArchitectureViewer` | `(props: ArchitectureViewerProps) => JSX.Element`; composes one provider, navigation, diagram/key and documentation |
| `ArchitectureProvider` | `(props: ArchitectureProviderProps) => JSX.Element`; owns the single controller/session for its descendants |
| Seven named wrappers | `(props: NamedDiagramProps) => JSX.Element`; respectively require routed kinds `landscape`, `context`, `container`, `component`, `code`, `dynamic`, `deployment` |
| `DiagramNavigation` | `(props: { slot?: NavigationSlot }) => JSX.Element`; navigation and route announcement |
| `DiagramView` | `(props: { legendSlot?: LegendSlot }) => JSX.Element`; renders routed scene, diagnostics or accessible pending/failure text alternative |
| `DiagramLegend` | `(props: { slot?: LegendSlot }) => JSX.Element \| null`; current routed key |
| `DiagramDocumentation` | `(props: { slot?: DocumentationSlot }) => JSX.Element \| null`; current selection's explanation |
| `CatalogViewer` | `(props: CatalogViewerProps) => JSX.Element`; loads catalog and routed resource; preserves the last valid resource on rejected replacement |
| `Legend` | `(props: LegendProps) => JSX.Element`; reusable props-only key; use within a `.c4-sdk` ancestor for styles |
| `useViewerController` | `() => { readonly route: Route; readonly diagram: Diagram \| undefined; readonly validatedBundle: ValidatedArchitecture; readonly navigate: (action: NavigationAction) => void }`; reads the existing provider only |

The root type exports are `ArchitectureViewerProps`, `ArchitectureProviderProps`, `NamedDiagramProps`,
`CatalogViewerProps`, `LegendProps`, `NavigationSlot`, `LegendSlot`, `DocumentationSlot`,
`DocumentationViewProps`, `DestinationLinkProps`, `NavigationViewProps`, `FetchLoaderLimits`,
`ElkLayoutLimits`, and `LayoutWorker`. Model/port data types are imported from `core`.

`ArchitectureViewerProps` requires `validatedBundle: ValidatedArchitecture`; optional fields are
`diagramId: string`, `routePort: RoutePort`, `layoutPort: LayoutPort`, `expectedKind: Diagram['kind']`,
`navigationSlot: NavigationSlot`, `legendSlot: LegendSlot`, and `documentationSlot: DocumentationSlot`.
`ArchitectureProviderProps` picks the first five data/port/kind fields and adds `children?: ReactNode`.
`NamedDiagramProps` omits `expectedKind`. `CatalogViewerProps` requires `catalogUrl: string` and accepts
`loader?: ArchitectureLoader`, `title?: string`, and `routePort?: RoutePort`; it has no layout-port prop.
`LegendProps` extends `LegendSpec` with `compact?: boolean`.

`diagramId` is a starting/fallback choice, not a controlled selection prop. The actual route snapshot
owns diagram/element/step selection. A host controls it by implementing `RoutePort` and publishing
snapshots/subscriptions. There is no separate `selectedElementId` or `onSelectionChange` prop. Slot
callbacks and `navigate(action)` request route changes through that port; a rejected transition performs
no push. Named-wrapper checks follow the actual routed kind and display `diagram-kind` diagnostics on
mismatch, even if the initial `diagramId` was correct.

Parts and the composition hook require the same `ArchitectureProvider`; outside it they throw
`Error('Diagram parts must be rendered inside an ArchitectureProvider.')`. A separate `DiagramLegend`
can be paired with `DiagramView legendSlot={() => null}` to avoid a duplicate key. Custom slots receive
state plus callbacks and return `ReactNode`; they do not create another controller:

| Slot | Props / callbacks |
| --- | --- |
| `NavigationSlot` | `NavigationViewProps`: breadcrumbs (`id`, `title`, `current`, `href`, `onClick`), `onBack()`, optional Up destination, related destinations (`label`, `href`, `onClick`) |
| `LegendSlot` | `LegendProps`: `title`, read-only `entries`, optional `compact` |
| `DocumentationSlot` | `DocumentationViewProps`: `selection: DocumentSelection`, `mode: 'plain' \| 'ste'`, `onPlain()`, `onSte()`, optional `document`, `documentId`, `onDocument(id: string)` |

`DestinationLinkProps` is `{ readonly href: string; readonly onClick: MouseEventHandler<HTMLAnchorElement> }`.
Render both fields on an anchor: modified clicks retain native browser behavior. Plain/STE/document
choice is controlled by the supplied documentation props/callbacks; the default viewer owns its memory.
Markdown rejects executable HTML/images/components. STE diagnostics and review metadata are advisory;
the accepted material remains draft guidance, with no ASD-STE100 certification claim.

## Core entry and data boundary

The exact core runtime exports are:

```ts
decodeArchitecture(input: unknown, limits?: DecodeLimits): Result<ValidatedArchitecture>
architectureJsonSchema: Readonly<Record<string, unknown>>
buildScene(index: ModelIndex, diagramId: string): Result<SceneInput>
selectDocumentation(index: ModelIndex, diagramId: string, elementId?: string): DocumentSelection
resolveLegend(index: ModelIndex, diagramId: string): LegendSpec | undefined
parseRoute(hash: string): Result<Route | undefined>
formatRoute(route: Route): string
validateRoute(index: ModelIndex, route: Route): readonly Diagnostic[]
transition(index: ModelIndex, route: Route, action: NavigationAction, canGoBack?: boolean): Result<NavigationEffect>
breadcrumbs(index: ModelIndex, route: Route): readonly Target[]
```

This is signature notation, not an executable declaration file. `decodeArchitecture` is the only public
promotion from unknown input to validated viewer data. It accepts parsed JSON, not a JSON text string;
parse text first and handle JSON syntax failure in the host. It checks shape, references, ancestry,
semantic diagram rules, source URL/path safety and resource limits, normalizes defaults into new data,
freezes the normalized bundle/index, and preserves the caller input. Warnings can accompany success.
`architectureJsonSchema` describes editor shape only and does not establish semantic validity; its public
type deliberately contains no Zod types. Do not mutate that shared editor object.

```ts
interface Diagnostic {
  readonly code: string
  readonly path: string
  readonly severity: 'error' | 'warning'
  readonly message: string
}
type Result<T> =
  | { readonly ok: true; readonly value: T; readonly diagnostics: readonly Diagnostic[] }
  | { readonly ok: false; readonly diagnostics: readonly Diagnostic[] }
interface ValidatedArchitecture {
  readonly bundle: ArchitectureBundle
  readonly index: ModelIndex
  readonly diagnostics: readonly Diagnostic[]
}
```

Narrow on `ok` before accessing `value`. Invalid decode limits produce `resource-limit` at `$.limits`;
shape/version failures use `schema`; safety failures use `unsafe-url`/`unsafe-path`. Reference and semantic
failures carry specific codes such as `missing-reference`, `invalid-parent`, `invalid-scope`,
`endpoint-not-visible`, `invalid-detail`, `scenario-reference`, `deployment`, and group/code-cycle codes.
`route`, `projection`, `layout`, and `diagram-kind` identify those boundaries. `layout-pending` is a
warning/status, not a usable initial scene. `missing-protocol`, `legend-coverage` and `large-view` are
advisory warnings. Codes are open strings: hosts must tolerate new diagnostics. Existing code meanings,
severity and path conventions are compatibility commitments; English message wording is not a machine
interface. Paths identify JSON fields/indices from `$`, with separate `$.route`/`$.layout` boundaries.

Structural types do not certify a fabricated `ValidatedArchitecture` object. Pass successful decode
values, or an unchanged value from a trusted host boundary that preserves those invariants. The low-level
`architectureSchema`, `validateArchitecture` and `buildIndex` are not package exports: shape-only or
semantic-only validation is not an alternative safe promotion path.

`buildScene` preserves declared order and the validated element/relationship/group object identities.
It returns presentation membership without worker execution or geometry. The legacy fixed-grid
`projectDiagram` is excluded (it rejects groups); hosts that need geometry inject `LayoutPort`.
Selectors return read-only contracts but not every projection/selection container is deeply frozen at
runtime. Treat all returned data as immutable; create separate host state instead of editing it. Keep
validated references unchanged across layout. No public class, nominal brand or Zod/Effect identity is
required. `ModelIndex` maps collection IDs to validated objects; IDs match
`[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}`. Missing selectors yield diagnostics/empty selections/undefined as
their signature indicates; pure selectors expect a trusted normalized index, not arbitrary JSON.

Core type exports, grouped by use (all exact names):

| Group | Exports |
| --- | --- |
| Versioned model | `Id`, `Status`, `Diagnostic`, `References`, `Element`, `Target`, `Link`, `Relationship`, `RelationshipKind`, `Member`, `Group`, `EdgeRef`, `Swatch`, `LegendEntry`, `LegendSpec`, `ArchitectureBundle`, `ModelIndex`, `Result`, `ValidatedArchitecture` |
| Diagrams/code/scenario | `LandscapeDiagram`, `ContextDiagram`, `ContainerDiagram`, `ComponentDiagram`, `CodeDiagram`, `DynamicDiagram`, `DeploymentDiagram`, `Diagram`, `SymbolKind`, `Visibility`, `CodeMember`, `InteractionStep`, `Step` |
| Content | `Document`, `Source`, `Term`, `DocumentSelection` |
| Scene/geometry | `SceneInput`, `Scene`, `SceneNode`, `SceneEdge`, `SceneGroup`, `Bounds`, `Point`, `Size`, `EdgeSection`, `GeometryLimits` |
| Navigation | `Route`, `NavigationAction`, `NavigationEffect`, `RoutePort`, `RouteSnapshot` |
| Async ports/limits | `LayoutPort`, `LayoutRequest`, `LayoutResponse`, `LayoutMeasurements`, `ArchitectureLoader`, `Catalog`, `CatalogEntry`, `DecodeLimits` |

`ArchitectureBundle.schemaVersion` is exactly `1`; bundle `revision` is host content identity, independent
of package version. The model and diagram unions support seven diagram kinds, code declarations as
display text, scenario sequence/parallel trees and deployment instances. The [model source](../../src/lib/c4/domain/model.ts)
and snapshot specify every structural field. Named React wrappers and core diagram data types intentionally
share names in separate entries; alias one when both are imported into the same module.

## Ports, adapters and cleanup

| Contract | Exact supported seam |
| --- | --- |
| `RoutePort` | `getSnapshot(): RouteSnapshot`, `subscribe(listener: () => void): () => void`, `push(route: Route): void`, `replace(route: Route): void`, `back(): void` |
| `RouteSnapshot` | Read-only `hash: string`, `canGoBack: boolean`; keep the object stable until either changes |
| `LayoutPort` | `layout(request: LayoutRequest): Promise<LayoutResponse>` |
| `LayoutRequest` | Read-only `scene: SceneInput`, `generation: number`, `signal: AbortSignal`, optional `measurements: LayoutMeasurements`, `timeoutMs: number` |
| `LayoutResponse` | Read-only `generation: number`, `result: Result<Scene>`, optional `measurementRevision: string` |
| `LayoutMeasurements` | Read-only `revision`, node/edge-label size dictionaries and optional group-label sizes |
| `ArchitectureLoader` | `loadCatalog(url: string, signal: AbortSignal): Promise<Catalog>`, `loadBundle(url: string, signal: AbortSignal): Promise<Result<ValidatedArchitecture>>` |
| `createHashRoutePort` | `(browser?: Window) => RoutePort`; defaults to browser window only when invoked |
| `createFetchLoader` | `(fetchResource?: typeof fetch, limits?: FetchLoaderLimits) => ArchitectureLoader`; defaults to fetch only when invoked |
| `createElkLayoutPort` | `(factory?: () => LayoutWorker, limits?: ElkLayoutLimits) => LayoutPort`; worker created lazily by an automatic layout request |

Routes use `#/architectures/<id>/diagrams/<id>[/elements/<id>][?step=<id>]`. An empty hash/`#` parses as
no route. Malformed encoding/grammar returns route diagnostics. Navigation actions are `step` with
optional `stepId`; `activate`/`inspect` with `elementId`; `diagram`/`up`/`back`; or `target` with a
`Target`. Effects are `push` with `Route` or `back`. Back uses host history, not an SDK duplicate stack;
without available history it follows Up/default behavior. The built-in adapter subscribes to hash/popstate
only while there are listeners and removes listeners when the final subscription is cancelled.

Async hooks abort obsolete requests on replacement/unmount and reject stale generation/measurement
responses. A custom layout must preserve ordered membership, validated object identity, endpoints and
group ancestry, and return absolute finite geometry within bounds. Responses echo generation and, for
measured requests, measurement revision. Current viewer integration sends custom layout ports unmeasured
requests; the built-in port receives measured requests. Invalid geometry cannot replace a published scene.
Loader HTTP/byte/UTF-8/JSON/catalog failures reject their promise; the built-in catalog shape error can
originate in Zod, but its error class/fields are not public. Bundle semantic rejection resolves `ok: false`.
Adapter configuration errors throw synchronously. Handle rejected promises independently from Result failures.

`LayoutWorker` is a structural browser-worker subset: `postMessage(unknown): void`, `terminate(): void`,
and nullable `onmessage`, `onerror`, `onmessageerror` handlers. A native browser Worker fits it. P-02 must
validate a host factory such as `() => new Worker(publicWorkerUrl, { type: 'module' })` against the packed
asset and non-root base paths. There is no string-URL option, public worker message protocol, Node worker
support, external focus port, or `dispose()` method in the landed API. Signal cancellation is the cleanup
seam: the built-in layout terminates its request worker and clears handlers/timers on completion, failure,
timeout or abort. Its bounded geometry cache belongs to the port closure; release the port reference when
the host no longer needs it. Focus/viewport restoration is internal to the mounted host slot (256 recent
views each), not injectable state.

Default limits are decode 5,000 elements/10,000 relationships/200 diagrams, JSON depth32 (96 within
dynamic scenarios); fetch 5MiB bundle/256KiB catalog; layout 5,000 nodes/10,000 edges/24 cache entries,
10s timeout and coordinate/extent ceilings10,000,000. Count/byte/depth/cache/geometry ceilings can only
be lowered. Layout default timeout is a positive integer ≤2,147,483,647ms; request overrides are finite
positive values within the same maximum. Semantic group/code/scenario depth32 and scenario count1,000
remain independent guards. See [limits and measured performance](acceptance.md#resource-envelope).
These are resource guards, not timing guarantees; the 200-node/400-edge 2s target remains unmet.

## Import safety and compatibility

Core has no React/browser/I/O runtime imports; Zod stays an internal runtime implementation dependency.
The root source graph contains CSS imports in existing renderer modules. P-01 verifies transformed
source import with no browser globals or started worker/fetch/observer, using Vitest's inert CSS handling.
It does **not** prove raw Node loading, lack of Vite CSS injection, ESM/CJS parity or package identity.
P-02 must extract/neutralize those CSS imports, emit explicit assets and prove both packed JS entries
import without touching window/document, starting work, fetching or injecting styles. Browser rendering
is the supported UI feature; SSR rendering/hydration has not been demonstrated.

Schema version and package SemVer are separate. Unknown schema versions/fields are rejected; schema1
changes must preserve accepted data and meaning or introduce an explicit new schema version. During
`0.1.0-beta.*`, compatibility changes require review, changelog entries and downstream revalidation;
the prerelease is not a 1.0 stability guarantee. Once stable, removal/renaming or incompatible changes to
public symbols, fields, callbacks, diagnostics, CSS tokens, ports or worker configuration require a major
package version. Compatible additions use a minor version, compatible bug fixes a patch. Changes to
internal helpers do not permit changing externally observed contracts silently.

The candidate stylesheet exposes six theme tokens: `--c4-ink`, `--c4-muted`, `--c4-surface`,
`--c4-border`, `--c4-accent`, `--c4-external`, set on `.c4-sdk`. P-02 must retain these and verify the
shipped styles are scoped; existing `.c4-*`/React Flow rules are implementation details rather than a
host selector API. Do not load the demo reset/fonts as SDK styles. No editing/dragging, persistence,
server-rendered UI, arbitrary HTML, cross-version schema migration or renderer internals are promised.

## Contract checks

`tests/api/public-api.test.ts` compares the compiler-resolved snapshot, source runtime names, browser-free
core import graph, decode/ownership/projection and navigation boundaries. `tests/api/structural-contract.tsx`
compiles structural host composition and checks intentional misuse errors. Existing Vitest discovery does
not include `tests/api`; P-01 runs it explicitly with a scratch config. P-02 must register both checks in
the shared SDK check/CI path without copying test logic. See STATE for exact commands/results. Snapshot
updates must use the supported TypeScript version and record the compatibility rationale.
