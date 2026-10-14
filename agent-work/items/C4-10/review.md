# C4-10 independent review

Reviewer: fresh Claude Sonnet 5.5 (cross-company to builder Codex Sol).
Reviewed HEAD: `b15c88f24dc6bbee7dea15e58be740daa2fd2afb` (base `59156023e3d1b888d87ccbc6e0173b3a2ea63de6`; HEAD verified before review).

## Verdict: NITS

No blocking defects. Diff touches only claimed paths (src, tests, docs/api, docs/knowledge, item records); no ts-db/C4-09, package.json/lockfile, root README or workflow edits.

## Independent checks run (fresh worktree, `npm ci`)

- Unit/hooks: 24 files, 204 PASS (matches claim).
- Property: 10 files, 34 PASS (matches).
- `npm run typecheck` PASS; `npm run lint` exit 0 with the single pre-existing button.tsx fast-refresh warning.
- Production browser, desktop-chromium + mobile-chromium (Pixel 7), `tests/browser/{hardening,seven-types,component-docs}`: 16/16 PASS, 2.8 min, workers=1. Includes mobile component-docs (no recurrence; root cause remains unestablished, as the report says).
- Mobile `code-initial-viewport.png` inspected: OrderService card with all three members fully inside the canvas and readable; edges/labels leave the viewport, consistent with the documented "one readable card" framing.
- Built `dist/` grep for braces/micromatch/fast-glob/ts-morph: no hits, consistent with the builder's module inventory (inventories under /tmp not re-derived; advisory page not re-fetched).
- Not rerun: the full 65-test matrix, the stress measurement, `npm audit`. Their numbers are accepted as builder evidence only.

## Source review

- `domain/viewport.ts`: Fit uses routed edges + labels (fallback 240x76 label box); `initialViewport` fits when zoom >= 0.75, else frames `scene.nodes[0]`. Honest and bounded; no "all nodes framed" claim.
- `useCanvasViewport`: focus recovery re-frames when zoom < 0.75 or card is outside the viewport; min zoom lowered to 0.02 consistently in Fit and ReactFlow.
- Limits (`decode.ts`, `fetch.ts`, `layout.ts`, `client.ts`, `elk-output.ts`): host values can only lower defaults; invalid values throw/return diagnostics; limits checked before schema work and before cache/publish; errors do not publish partial scenes. Raw JSON depth vs semantic nesting separated.
- Session memory capped at 256 entries each via LRU-style `remember`.
- CSS: heading wraps; mobile explanation entry ordered before canvas.

## Findings (all non-blocking)

1. `docs/api/acceptance.md:77` (and "Deferred gate") says C4-09 "is paused". C4-09 has since unpaused; the second-consumer gate is still pending. Wording is stale, not wrong about the gate. Coordinator should update on landing.
2. `docs/api/acceptance.md:71`: builder correctly reports that root README still has an inaccurate seam sentence ("Fixed geometry appears while an optional async adapter is pending") and still labels limits "proposed". Unfixed because README is outside claims; coordinator must schedule that edit or the C4-07 stale-README follow-up is only partly closed.
3. Test strategy shift: several previously pointer-click journeys (`context.spec.ts`, `showcase.spec.ts`, mobile S3/Publication) now focus+Enter because the readable-first-card entry puts targets offscreen. Documented, and keyboard/Fit/pan recovery is tested, but touch users cannot tap those cards without panning/Fit; no touch-pan test asserts that path.
4. Publication entry assertion (`hardening.spec.ts`) checks only the first node in the viewport; the Fit assertion covers all nodes and labels. Adequate for the claim, but the C4-08 "clipped edge" at entry is intentionally retained, not resolved.
5. Performance: 200 nodes/400 edges completes 4.8-5.2 s (builder range 4820-5241 ms; 9.7 s under concurrent load). The 2 s goal is NOT met and the report states this correctly each time; nothing here should be summarized as passing. Cancellation 170-242 ms is navigation-to-zero-workers wall time, not AbortSignal latency (labelled as such).
6. Residual security: braces advisory unfixed upstream; toolchain-only exposure, no force downgrade; correctly characterized as not a clean audit.

## Gates still open

- Human STE review (separate gate).
- `/ts-db/` second-consumer validation after FFI-06/07/08 and C4-09 resume.

## Human acceptance — 2026-10-14

Nick signed off the human STE review gate for C4-10 on 2026-10-14. The item is fully accepted. This sign-off accepts the delivered STE content and does not claim formal ASD-STE100 certification. The former human STE pending gate above is historical and closed; future `/ts-db/` module-consumer validation remains outside C4-10.

## Documentation fix verification — fresh Claude Sonnet, fix head `99142e8d564d56e7704025219a1a7743e6d18db0`

Verdict: **PASS**. Reviewed `41cf06a..99142e8` (README.md, docs/api/acceptance.md, item STATE.md/claims.md); `git diff --check` clean; no broad tests run (prose-only).

- Original finding 1 (stale "C4-09 paused"/second-consumer gate): resolved. `acceptance.md` "Remaining scope and human gate" now states C4-09 was removed by Nick on 2026-10-14, C4-10 continues independently, productionization/npm publication then ts-db module ingestion is a separate track, and human STE review remains pending. Matches current main STATE/COORDINATION/implementation plan.
- Original finding 2 (README seam/limits): resolved. Pending-layout sentence matches `useDiagramLayout.ts` (initial async: `layout-pending` diagnostics with no scene, so text alternative; same-input prior published scene retained during measurement replacement). Limits are labelled enforced and match `defaultDecodeLimits` (5,000/10,000/200, `maxJsonDepth` 32, `maxScenarioJsonDepth` 96) and `docs/api/README.md` raw-JSON-depth wording.
- Scope: README exception recorded in claims.md and authorised by root; no `src/`, package, or config changes; links (`README.md`, `batch-c-contracts.md`) exist; measured 2 s layout failure remains stated; no behaviour change.
- Not addressed by this fix (original findings 3–4, test-strategy nits) remain as originally recorded, non-blocking. Stale "paused" wording in the item's earlier STATE entries is marked historical.
