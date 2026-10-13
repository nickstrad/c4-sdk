# C4-06 checkpoint

Updated 2026-10-13 16:59 UTC. Implementation complete and validation passed; independent fresh review remains pending. Builder c4_06_astra_fresh, branch `item/c4-06-deployment`, worktree `/tmp/c4-sdk-c4-06`, exact base `14ac790fbd5b32d0aec2466d1c11b0f8405f2362`. Coordinator explicitly assigned Astra after Sol quota exhaustion. No agent reuse.

Scope and acceptance: [brief](brief.md), [claims](claims.md), [review](review.md), normative plan C4-06. Root STATE/coordination remain coordinator-owned. Implementation commit: `233a698`. Knowledge analysis is complete: durable physical-projection and asynchronous-focus lessons are recorded in docs/knowledge/gotchas.md and indexed. No reusable script was justified; temporary fixture construction commands were one-off work. Knowledge SHA and final cleanup follow. Coordinator owns independent review, integration and push.

## Delivered behavior

- Physical deploymentNode/infrastructureNode/instance schema and pure validation: legal parents, bounded acyclic ancestry, environment agreement, logical instance targets, distinct IDs, physical edge endpoints, matching optional modelRelationshipId, no logical-view leakage.
- Deployment views explicitly declare every ancestor. Physical nesting derives separate compound groups; each model element retains exactly one inspectable card and original status/source/document metadata. Authored deployment groups are rejected rather than ambiguously combined with physical containment.
- Immutable projection hides collapsed descendants and their incident edges. No ancestor edges or new instance identities are invented. Full physical inventory and all declared relationships remain accessible outside the canvas.
- Expansion state is per architecture/revision/diagram. Selected instance ancestors override collapse for direct URLs and Back; independently collapsed siblings remain collapsed. Inspection with no visibility change reuses the exact layout input.
- Named DeploymentDiagram wrapper, props-only topology view, native logical-detail links and existing actual browser history. Component breadcrumbs remain the logical model's declared parent chain.
- Two session/viewport races fixed: distinguish requested route from completed focus restoration for immediate Back; reconcile focus after initial viewport application, scoped to the owning viewer.
- Hypothetical Cursor region, hosts, replicas, cache and infrastructure plus illustrative logical request-handler detail. Every new element/view has draft Plain/STE documentation; no actual host counts, regions, process boundaries or implementation language are asserted.

## Validation and evidence

- `npm run test:unit`: **122/122 PASS** including collapsed selection, stable input and viewer-local focus regressions.
- `npm run test:prop`: **25/25 PASS**, including deployment projection/environment/cycle properties.
- Typecheck and both production builds PASS. Lint only the pre-existing button fast-refresh warning; production large-chunk warnings remain.
- Final exact-source `npm run test:browser -- tests/browser/deployment/deployment.spec.ts tests/browser/layout/layout.spec.ts --workers=1 --output=/tmp/c4-06-final-evidence`: **17 PASS, 1 existing mobile performance-test skip** (2.0m). Deployment4/4 plus14 layout slots. Covers nested expand/collapse, hidden edges/full alternative, distinct replicas, keyboard, exact logical drill/Back selection, focus and viewport bounds/restoration, direct reload, worker/measurement/failure/cancellation and desktop/mobile zoom.
- Earlier same feature source dynamic4/component2 regressions all PASS in `/tmp/c4-06-browser-verified`, before the final narrow viewer-local focus getter. The final layout suite verifies affected session behavior after that hardening.
- Final desktop/mobile expanded and selected-replica screenshots: `/tmp/c4-06-final-evidence/deployment-deployment-nest-4a98c-tion-and-logical-drill-back-{desktop,mobile}-chromium/`. Builder visually inspected expanded nesting and selected mobile card; topology links/controls are readable without overflow. Fit View makes the full hierarchy small; native zoom and the complete text inventory remain available.
- Earlier browser failures are preserved in `/tmp/c4-06-browser-evidence` (Back focus), `/tmp/c4-06-browser-final` (test incorrectly expected sibling collapse to reset), `/tmp/c4-06-browser-verified` (Fit View selector capitalization). Fixed and rerun; do not report those earlier runs as clean. `/tmp/c4-06-deployment-pass` has intermediate4/4 PASS screenshots.
- Existing context/navigation200%-zoom timeout was not rerun or claimed fixed by this item. Full layout zoom suite passed; distinct pre-existing context defect remains per C4-05.

## Operational notes and next steps

Browser lease is released; all owned browser runners exited. Fresh worktree needed existing locked dependencies (`tsc` initially absent); no dependency/config changes. KB search325 returned no useful worktree setup guidance; feedback recorded. Event publication skipped under coordinator's documented Nick exception. A combined escalated edit/test call delayed tool completion until approximately16:53; later browser commands were direct approved npm invocations.

Next: commit indexed knowledge lessons separately, record both SHAs, clean worktree. Fresh independent reviewer checks exact final commit; root lands only PASS. No push/merge by builder.
