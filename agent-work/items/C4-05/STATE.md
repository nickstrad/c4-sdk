# C4-05 checkpoint

Updated 2026-10-13. Build authorized; independent review is pending. Read the [brief](brief.md), [claims](claims.md), and [review](review.md). Coordinator owns root STATE/COORDINATION, landing and push.

## Fresh owner and transfer

Fresh agent `/root/c4_05_astra_fresh` works only in `/tmp/c4-sdk-c4-05-astra`, branch `item/c4-05-dynamic-astra`, base `c715e1d`. Source changes were transferred from `item/c4-05-dynamic` in `/tmp/c4-sdk-c4-05` (base `dd2faf8`), through `item/c4-05-dynamic-handoff` (base `c715e1d`). Predecessors remain preserved and are not edited by this agent.

Scoped seat exception: prior Sol hit quota and fresh Sonnet CLI attempts stalled without source changes. Nick requested immediate completion; coordinator assigned available Astra for this item. Default plan seat mapping is unchanged. Earlier browser run ended when its builder stopped; no process remained to kill. Event writing is skipped under Nick's existing common-directory exception.

## Implementation

Strict recursive sequence/parallel/interaction AST, unique IDs and resource/reference guards; pure reading selectors, partial-order analysis and interaction directions; canonical `?step=` routing with Inspect/history preservation; thin hook, props-only controls/tree/overlays, stable scene geometry and public DynamicDiagram wrapper. Original source-linked Cursor push, distinct read paths, compaction and optional gossip stories remain draft content. Source display numbers are separate from scenario tree identifiers. Geometry/layout engine contracts and existing Pages workflow are unchanged.

A pre-transfer screenshot exposed a collapsed mobile selector despite four passing browser tests. Transferred CSS now gives its label a responsive 240px flex basis and the browser test checks width >180px. Fresh desktop/mobile screenshots confirm the fix.

## Validation

- Fresh unit/hooks: 114/114 PASS (11.13s).
- Fresh properties: 23/23 PASS (4.98s).
- Typecheck PASS. Lint reports only existing button.tsx fast-refresh warning.
- Dynamic production browser: 4/4 PASS (1.1m), desktop and Pixel 7 Chromium. Both production builds PASS with existing large-chunk warnings.
- Dynamic command: `npm run test:browser -- tests/browser/dynamic/dynamic.spec.ts --workers=1 --output=/tmp/c4-05-astra-dynamic-evidence`.
- Inspected both `dynamic-story.png` files in that evidence directory. Mobile selector and scenario text are readable; controls wrap cleanly; canvas retains the intended pannable viewport. Assertions cover >180px select, no new worker/layout on step selection, stable node geometry, distinct repeated overlays, reversed marker, reload, Inspect, Back/Forward, Up and wrong/missing-step diagnostics.
- Context/navigation production regression: 23 PASS, 1 mobile context zoom case timed out after 30s (3.0m suite). Trace preserved at `/tmp/c4-05-astra-regression-evidence/context-context-axe-reduce-d6927--percent-zoom-remain-usable-mobile-chromium/trace.zip`. Timeout occurred in `withExplanation` media-query evaluation after selecting S3 at 200% zoom, not an assertion failure. Isolated rerun FAILED (31.7s): `context.spec.ts:53` native S3 click at CSS 200% zoom was repeatedly intercepted by the developer node or outside the viewport. Full trace and screenshot are preserved under `/tmp/c4-05-astra-context-rerun-evidence/context-context-axe-reduce-d6927--percent-zoom-remain-usable-mobile-chromium/`. Dynamic4/4 remains passing. Viewport logic was not changed, but demo related-links change page height; baseline causality is unproven. This is an unresolved independent-review/integration finding, not a clean regression result. Coordinator owns the existing spec; no forced clicks or timeout increases were applied.

## Commits and next steps

Implementation commit: `18d9545` (`dynamic: add partial-order scenarios and stable interaction overlays`). Record durable lessons/index in a separate knowledge commit, checkpoint both SHAs, clean this worktree and hand the durable branch to a new independent reviewer. Reviewer must assess the unresolved mobile 200% context-click timeout against baseline and resolve it before a PASS/landing. No merge/push by builder. No review approval implied.

Post-work analysis completed: added dated/indexed project lessons on partial-order reading semantics, semantic versus JSON depth, analysis-only precedence cost, stable overlays and mobile geometry verification. No reusable script emerged; existing npm/browser commands cover reproduction and no one-off helper was added. Knowledge commit: `bca3d25e2639f045520dc0656dca254c3b7ed3f9`. Implementation full SHA: `18d954508f421d0ae08bab63979f958e6d58f553`.

Final builder handoff: all code and knowledge changes are durable on `item/c4-05-dynamic-astra`; final checkpoint commit follows those two commits. No product change followed the recorded tests. Browser processes have exited and lease is free. Builder will remove its own clean worktree after this checkpoint commit. Fresh reviewer must inspect final branch HEAD, reproduce/compare the unresolved mobile context zoom case against base `c715e1d`, and record exact SHA/verdict in its own worktree. Preserve evidence directories outside the removed builder worktree. Landing awaits PASS.
