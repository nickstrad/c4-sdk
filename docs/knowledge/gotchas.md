# Gotchas

Record verified environment, tooling, or behavior traps here. Include the date, symptom, cause, resolution, and a link to the relevant task or finding.

## Known traps

### 2026-10-13 — Production preview base must match build base

Pass the same base to Vite build and preview; building for a subpath alone does not configure the preview server. C4-01 browser harness tests `/c4-preview/` plus the root viewer.

### 2026-10-13 — IDs and geometry need runtime guards

Use null-prototype ID indexes so names such as `constructor` cannot resolve through Object.prototype. Finite input coordinates can overflow intermediate arithmetic: use stable midpoint calculations and verify every published node/edge/canvas value. Unrepresentable scenes return structured diagnostics. Evidence: [C4-01 review](../../agent-work/items/C4-01/review.md).
