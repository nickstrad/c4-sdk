# Gotchas

Record verified environment, tooling, or behavior traps here. Include the date, symptom, cause, resolution, and a link to the relevant task or finding.

## Known traps

### 2026-10-13 — Production preview base must match build base

Pass the same base to Vite build and preview; building for a subpath alone does not configure the preview server. C4-01 browser harness tests `/c4-preview/` plus the root viewer.

### 2026-10-13 — IDs and geometry need runtime guards

Use null-prototype ID indexes so names such as `constructor` cannot resolve through Object.prototype. Finite input coordinates can overflow intermediate arithmetic: use stable midpoint calculations and verify every published node/edge/canvas value. Unrepresentable scenes return structured diagnostics. Evidence: [C4-01 review](../../agent-work/items/C4-01/review.md).

### 2026-10-13 — Catalog routes must wait for validated defaults

A catalog entry ID must match its loaded bundle ID. Never guess a diagram ID before loading: publish the selected bundle's declared default only after successful validation, retaining the current viewer and history on delay or failure. Bind pending selections to the originating route snapshot, not just its hash; otherwise Back then Forward can revive a failed request. See [C4-02 review](../../agent-work/items/C4-02/review.md).

### 2026-10-13 — Native links and real browser history

Use codec-derived anchors for diagram destinations and intercept only ordinary primary activation. Modified clicks retain native new-tab behavior. Persist the same-tab history owner across reloads; use browser history state to distinguish known viewer entries from external history, without a private route stack. See [C4-02](../../agent-work/items/C4-02/brief.md).

### 2026-10-13 — Serialize Vitest processes in one checkout

Running unit and property commands concurrently can race while Vitest clears node_modules/.vitest-cache, causing ENOTEMPTY before tests start. Run these suites sequentially in the same checkout, or use genuinely separate dependency/cache directories. The preflight integration property suite passed; only the unit startup needed a rerun. See [preflight review](../../agent-work/items/C4-preflight/review.md).

### 2026-10-13 — Document selection and responsive portals

Key document choice by architecture ID/revision plus diagram/element; derive sources and terms from the active document with pure selectors. Filter parser-decoded Markdown URLs, not just raw source text. The responsive Base UI dialog portal needs its own `c4-sdk` CSS scope. Validate fixed overlays with viewport screenshots and bounding-box checks: full-page screenshots can stitch a fixed dialog at the current scroll offset. See [C4-03 review](../../agent-work/items/C4-03/review.md).

## 2026-10-13 — production layout and native focus

[C4-04](../../agent-work/items/C4-04/review.md) verified the native Vite worker with ELK's `elk-api` workerFactory and `elk-worker.min.js`. Importing elk.bundled inside a native worker chooses an incompatible embedded-worker branch, despite passing Node checks. ELK `edge.container` defines route coordinate origin even when the edge remains in root.edges.

React Flow's readonly wrapper needs scoped pointer-events:auto on native interactive children. Do not pan on pointer focus between down and click. Native focus may temporarily scroll the wrapper before React Flow resets scroll; calculate keyboard visibility/pan from scene geometry, viewport and logical client dimensions rather than transient DOM rectangles. Clear pointer guards on capture-phase keyboard events after release outside.

Hidden natural-size probes must not satisfy visible-label tests. Ignore unchanged ResizeObserver size snapshots to avoid layout loops. Actual200-node/400-edge worker timing was4109.2ms on4sharedvCPU; C4-10 must assess the2second target rather than infer it from smaller tests.
