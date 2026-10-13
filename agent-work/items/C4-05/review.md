# C4-05 independent review

**Verdict: PASS** for the exact builder checkpoint `c8c403e06a226c13dc82b5cbfc517cadcac1d3a6` (implementation `18d954508f421d0ae08bab63979f958e6d58f553`, knowledge `bca3d25e2639f045520dc0656dca254c3b7ed3f9`). Review performed in fresh worktree `/tmp/c4-sdk-c4-05-review`, branch `review/c4-05-dynamic-luna`. No feature changes were made.

## Review findings

The bounded recursive `Step` schema and domain validator enforce unique IDs, visible declared relationship references, nonempty groups, at most 1,000 tree nodes, and semantic depth 32 (with JSON traversal separately bounded). Scenario helpers keep branch-local precedence and add no cross-branch ordering; controls and text alternative explicitly call out reading order and do not claim that parallel selections execute simultaneously. Repeated/reversed interactions keep their own IDs and direction while reading relationship endpoints from the unchanged model. Route validation rejects missing/wrong-diagram step IDs, and transitions preserve a selected step through Inspect while clearing it on diagram changes. Dynamic selection derives overlays from the existing scene and the browser test confirms stable geometry/no extra layout work.

The Cursor stories label inferred roles, separate read outcomes, place WAL persistence and preparation before CAS publication, and describe gossip as optional while freshness checks guard reads. Desktop and mobile screenshots show the scenario tree and relationship text alternative are readable; the mobile selector fits the regression threshold. The test suite exercises direction, repeated overlays, URL reload/history, Inspect, diagram changes, and invalid step diagnostics.

## Validation

- `npm run typecheck` — PASS.
- `npm run test:unit` — 114 tests PASS across 18 files.
- `npm run test:prop` — 23 tests PASS across 6 files.
- `npm run test:browser -- tests/browser/dynamic/dynamic.spec.ts --workers=1 --output=/tmp/c4-05-review-dynamic` — 4/4 PASS in 1.5m: desktop Chromium and Pixel 7 mobile Chromium. Both production apps built; Vite emitted the existing large-chunk advisory.
- Independently inspected builder screenshots at `/tmp/c4-05-astra-dynamic-evidence/dynamic-dynamic-scenario-r-92736-ct-preserve-stable-geometry-{desktop,mobile}-chromium/dynamic-story.png` and confirmed readable mobile controls/tree and truthful text alternative.

## Baseline zoom limitation

The requested isolated regression check confirms the mobile 200% document-zoom click failure is **pre-existing**, not introduced by this slice. The identical test file hash at base `c715e1d` and checkpoint is `74cd9bddcf2d5f223556f4a1d29b47fe35b60c05d657f9c4194983921186b872`. With the same Chromium version, viewport, command, and 30s Playwright test timeout, the current checkpoint failed at `tests/browser/context/context.spec.ts:53` in 31.4s (run began ~12:43 UTC, ended 12:45:42); base `c715e1d` failed the same line in 31.2s (12:45:59–12:47:05). Both traces report the S3 node outside the viewport or its click intercepted by the developer node after `documentElement.style.zoom = '2'`. Failure screenshots from both show the same oversized, clipped context node. Evidence: `/tmp/c4-05-review-current-context/context-context-axe-reduce-d6927--percent-zoom-remain-usable-mobile-chromium/` and `/tmp/c4-05-review-base-context/context-context-axe-reduce-d6927--percent-zoom-remain-usable-mobile-chromium/`.

The dynamic implementation does not change that existing context browser spec or its viewport/layout rules. The current and baseline reproduction make this an unrelated context accessibility/layout issue for follow-up, not a C4-05 landing blocker. This review does not claim the zoom case passes, and it does not claim the full browser suite or full repository gate passes.

Reviewed builder commits and checkpoint in the assigned exact-target checkout. Review record committed separately; coordinator owns integration and landing.
