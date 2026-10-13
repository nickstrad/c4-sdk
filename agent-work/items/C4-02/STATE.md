# C4-02 checkpoint

Goal: authorized navigation/container vertical slice, [brief.md](brief.md). Builder c4_02_builder (Sol); branch item/c4-02-navigation; worktree /tmp/c4-sdk-c4-02; base541e41a. Final builder commit is this checkpoint’s commit/branch HEAD, reported to coordinator on handoff. Exact ownership: [claims.md](claims.md). Review: [review.md](review.md), pending. No merge/push authority. Root STATE/coordination/knowledge index remain lead-owned.

## Current status — 2026-10-13

Independent Sol review of79aa4ce returned NITS. Authorized corrections are complete and validated; fix commit/branch HEAD is ready for independent re-review. Native codec-derived destination anchors preserve ordinary route-port activation and modified-click/new-tab behavior. Focus/viewport lifecycle now lives in useViewerSession; catalog route/resource lifecycle lives in useCatalogViewer; scene props live in useDiagramRenderer. Containers compose hooks and views; pure selectors choose detail/related/recovery targets. Catalog selections wait for a successful matching bundle before publishing its declared default. Delayed/failed replacements retain route, history and previous whole dataset; catalog/bundle ID mismatch rejects replacement. A menu request is tied to its originating RouteSnapshot identity, so leaving then revisiting an identical hash cannot revive a failed old request. Stronger unit/browser Back/Forward assertions cover the discovered regression. No preflight started. Codex seats only per latest Nick allowance steering; no Claude calls. Schema supports strict context/container views, container parent/technology and declared detail/parent/related targets. Wrong scopes, invisible targets, inappropriate context/container members and canonical parent cycles are rejected; related cycles are permitted. Scene/document/layout modules are separated. Props-only documentation slot and async generation/abort layout port are provided, with finite positive geometry/member/endpoint validation; deterministic fixed layout remains default. No components or ELK.

Hash route port owns routes/history. Same-tab owner is retained in session storage across reload and browser entry depth enables actual Back; direct visitors fall back to Up/root. Catalog IDs now match bundle IDs for deep resource lookup. Viewer supports explicit Inspect, drill, Up, Back/Forward, canonical breadcrumbs/related links, invalid route recovery, title announcements and focus/viewport memory scoped by dataset/revision/diagram for the mounted viewer. Cursor’s container boundaries are labelled inference grounded in the primary article. Runtime JSON remains separate from08a research content.

Desktop inspection found collinear arrows and overlapping labels; manual triangle positions now separate server→repository and server→S3. A narrow fixed-layout rule places labels at stable actual midpoints where horizontal gap≥310 permits a270px label with margin; original small-gap context geometry remains intact. Both runtime and navigation fixture use server(40,260), repository(650,130), S3(650,460). Unused accent legend entry removed from container; context accent validation retained.

## Verified final source

- npm run typecheck: PASS.
- npm run lint: PASS exit0; only pre-existing src/components/ui/button.tsx Fast Refresh warning.
- npm run test:unit: PASS43 tests across9 files (unit + hooks).
- npm run test:prop: PASS10 tests across2 files; architecture seed4012026, navigation/containment seed4022026, manual finite geometry retained.
- npm run test:browser: PASS24 tests in1.2m on the final review-fix source (builder standalone escalated session10249, approved prefix). Both production builds run via Playwright webServer harness; demo `/c4-preview/` and generic app. All20 original flows retained. Additional cases cover desktop real Ctrl-click new tab without current-route mutation, native hrefs and keyboard activation on both widths, planned native-link dashed styling, gated load of two distinct non-context defaults, rejected replacement with no history mutation, and native Back/Forward across datasets. First new run hit an ambiguous status locator (test fixed); next run exposed stale request revival on Forward (product fixed with snapshot identity). Final24/24 passed.
- git diff --check: PASS.
- npm installed existing locked dependencies without manifest/lockfile changes.

Builder re-inspected final review-fix desktop and mobile containers screenshots using view_image with explicit original detail on both the tool and image helper. Native destination controls preserve the prior appearance and labels. Initial implementation mobile200% image was also inspected; final review-fix200% browser/axe checks pass. Desktop labels sit beside their own distinct arrows; no node lies on another arrow. Mobile controls/docs/key/relationship list wrap and remain readable; the fixed canvas intentionally scrolls horizontally, including at200% zoom. Screenshot artifacts are ignored and uncommitted:

- test-results/navigation-navigation-dril-43b2e-ard-restore-route-and-focus-desktop-chromium/containers.png
- test-results/navigation-navigation-dril-43b2e-ard-restore-route-and-focus-mobile-chromium/containers.png
- test-results/navigation-navigation-cont-e67d2-ercent-zoom-remain-readable-mobile-chromium/containers-zoom.png

Earlier root browser run also passed20/20 before visual refinements. Event publication skipped under Nick’s existing read-only common-Git exception; no event fabricated.

## Handoff and remaining work

Independent re-review of the fix commit is pending;79aa4ce had NITS, not approval. Builder completion never implies approval. Coordinator lands after review, never this builder. Lead should record durable catalog-ID/history/contract deltas in project knowledge. Before concurrent03/04, root will separately serialize and review a group/measurement/routed-geometry contract preflight plus dependency pins. Suggested geometry type split: scene.ts retains input/projection, an04-owned geometry.ts holds group bounds and routed-edge output. Current02 still rejects groups;04 must not be dispatched without that preflight. This follow-up is not started or authorized by this checkpoint.

## Independent review and landing

Sol build_reviewer PASS on363a16e after all three NITS were fixed; lead integrating to main. 43 unit/hook,10 property and24 production browser tests passed. Next: separately reviewed batch C contract/dependency preflight.
