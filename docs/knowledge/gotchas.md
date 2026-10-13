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
