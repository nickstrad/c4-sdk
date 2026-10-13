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

Hidden natural-size probes must not satisfy visible-label tests. Ignore unchanged ResizeObserver size snapshots to avoid layout loops. Actual 200-node/400-edge worker timing was 4109.2 ms on 4 shared vCPUs; C4-10 must assess the 2-second target rather than infer it from smaller tests.

## 2026-10-13 — copy policy boundaries

[C4-09a](../../agent-work/items/C4-09a/review.md) implements managed-only copying with digest/mode provenance, unmanaged/local-edit refusal and symlink/hardlink checks. Its caller must establish that the inventory is tracked at a reviewed source commit; syntactically valid 40-character hexadecimal identity alone is not proof. Target/source trees must be trusted and exclusively owned. Individual file replacement is atomic and caught failures get best-effort rollback, but multi-file crash atomicity and hostile TOCTOU protection are not promised.

The optional external provenance path allows one authoritative `pages/c4-sdk-source.json`; do not also create an internal marker. Empty directories may remain after rollback/deletion. C4-09 adds the actual CLI/consumer workflow.

## 2026-10-13 — dynamic reading order is not execution order

[C4-05](../../agent-work/items/C4-05/brief.md) keeps each parallel branch's local sequence without imposing cross-branch precedence or lockstep barriers. Scenario tree numbers identify reading positions; `EdgeRef.displayNumber` remains source numbering. Repeated or reverse calls have distinct interaction IDs and overlays, and selecting a scope shows membership rather than simultaneous execution. Keep overlays outside memoized scene inputs so step-only route changes do not start new layout workers. The analysis-only `precedence` selector can produce about 500,000 pairs near the 1,000-step ceiling; do not put it on the rendering path.

Scenario semantic depth32 is distinct from JSON object/array depth. The decoder allows JSON depth96 inside a dynamic scenario, then validates at most32 Step levels and1,000 total steps. Preserve both guards when extending recursive models. Unit tests cover accepted32/rejected33 semantic levels.

The initial mobile browser journeys passed while the scenario selector collapsed visually. Use a responsive flex basis for labels between controls, inspect actual screenshots and assert useful control geometry. The final dynamic suite passed4/4 with selector width>180px. Affected regression testing also reproduced an unresolved mobile CSS200% context click timeout: S3 was intercepted/offscreen. Do not describe that regression suite as clean or assume the timeout predates this item. Exact commands, traces and reviewer handoff are in [C4-05 STATE](../../agent-work/items/C4-05/STATE.md).

## 2026-10-13 — physical topology and selected replicas

[C4-06](../../agent-work/items/C4-06/brief.md) derives visual groups from declared physical parents. A deployment node remains one inspectable model card inside its own visual boundary; the group ID is separate from model identity. Require every ancestor in the authored view, keep each replica's distinct instance ID, and do not synthesize edges to collapsed ancestors. Collapse filters descendants and incident edges in a new projection, leaving the validated model frozen. The complete topology and all declared relationships remain available in an accessible inventory. Authored deployment groups are currently rejected to avoid ambiguous competing containment trees.

Selected-instance ancestors override stored collapse temporarily, including direct URLs and Back. Opening a containing region does not erase a separately collapsed host. Memoize layout input by the effective visible set, so switching between visible replicas only updates selection and documentation. Logical-detail breadcrumbs keep the declared model parent; browser history returns to the physical instance. See [deployment properties](../../tests/property/deployment.test.ts) and [browser evidence](../../agent-work/items/C4-06/STATE.md).

## 2026-10-13 — asynchronous route and viewport focus races

A user can drill into a logical view and go Back before that view finishes layout. Track the requested route separately from the last completed focus restoration, or the return route can look already restored while focus was lost. Initial canvas viewport application can also finish after a MutationObserver restores focus and overwrite its pan. Reconcile the focused card after initial viewport application, using only the owning viewer's focused element. Do not read global focus and pan another viewer with coincident IDs. C4-06 tests exact restored viewport, selected-card bounds on mobile and desktop, and viewer-local focus; the deployment/layout suite passed17 with one existing mobile performance skip. Commands and artifact paths are in [C4-06 STATE](../../agent-work/items/C4-06/STATE.md).

## 2026-10-13 — named wrappers, code symbols and composition

[C4-07](../../agent-work/items/C4-07/brief.md) found that kind-checking wrappers must test the **routed** diagram, not the `diagramId` prop or catalog default: a route port or direct URL can select another kind after mount. Keep the check inside the one `ArchitectureViewer` pipeline (`expectedKind`) so a wrapper cannot create a second route controller; the seven named wrappers are thin and a table-driven hooks test drives every wrapper against every diagram.

Code symbol cards place members in a sibling `<ul>` inside the node, not inside the node's button or link: an `aria-label` on that control and button-children flattening would hide a list inside it. The text alternative repeats the list. Render keys come from element ID plus member index (`symbolKey`/`memberKey`); valid IDs exclude `#`, so keys cannot collide, and member text is never part of identity. Measurement probes must include the same compartment or auto layout under-sizes code cards.

When a diagram kind becomes valid, existing tests that used it as the "unsupported kind" example (here `code` in `architecture.test.ts`) must switch to a still-unsupported value. A fresh worktree has no `node_modules`: `npm ci --prefer-offline` from the lockfile works without manifest changes. A wide code layout on mobile can open on an empty part of the canvas (initial viewport 20,20 at zoom 1); framing belongs to C4-10.
