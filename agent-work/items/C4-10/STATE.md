# C4-10 checkpoint

Status: original builder complete; fresh Claude Sonnet review returned NITS on `b15c88f24dc6bbee7dea15e58be740daa2fd2afb`, recorded in `41cf06a1718b12a8cf66c99808cf8155767565f7`. Fresh documentation fix complete below; exact fix HEAD requires a new independent review before landing. Earlier pause/resume entries below are historical and superseded by Nick’s C4-09 removal on 2026-10-14.

## State

- C4-09 paused per Nick until FFI-06, FFI-07 and FFI-08 are all on ts-db `main`.
- C4-10 now covers current c4-sdk `main` and the Cursor demo. It cannot claim Pages-consumer acceptance until C4-09 resumes.
- The current C4-10 base and worktree must be recorded in `agent-work/COORDINATION.md` after the claim commit.
- Fresh Codex Sol builder; fresh Claude Sonnet independent reviewer. Never reuse prior C4-08 agents.

## Follow-ups to resolve

1. C4-07 viewport-based code-compartment framing/focused Fit checks.
2. C4-07 unexplained mobile component-docs broad-suite failure.
3. Verify C4-08 root README reconciliation; it is reported complete, so do not duplicate without new evidence.
4. C4-08 mobile publication clipping and 200%-zoom heading wrap.
5. Re-measure/tune/report 200-node/400-edge layout and cancellation; 4109.2ms/254.2ms on 4 vCPU/7.8 GiB is prior evidence, not a current pass.
6. Recheck known dependency advisory and inspect production bundle exposure with current evidence.
7. Complete current-consumer hardening and acceptance report; leave `/ts-db/` gate pending until C4-09 resumes.

## Next

1. Coordinator commits/pushes the C4-09 pause + corrected pages/diagrams resume shape and C4-10 claim pack.
2. Dispatch a fresh Codex Sol builder in its own worktree from the exact pushed base.
3. Builder completes changes, evidence, and separate knowledge/scripts assessment commits, then cleans its own worktree.
4. Fresh Claude Sonnet reviews exact builder head. Coordinator integrates only after PASS, runs combined checks and reports exact limits.

## Builder preflight — 2026-10-14

Fresh assigned builder confirmed clean branch `item/c4-10-hardening`, worktree `/tmp/c4-sdk-c4-10`, exact base `913b0f991a994cf7542f2e2de4bf5f745f3b0b60`. Read repository/root/item checkpoints, claims, coordination, event log, plan §10, C4-07/C4-08 review and STATE, and knowledge index. Ownership/exclusions confirmed; C4-09 and ts-db remain excluded. Common-dir event publication is skipped under the existing root exception.

Preflight evidence: CLI help exposes no noninteractive status subcommand. Direct `codex --no-alt-screen` failed opening `/root/.codex/app-server-daemon/daemon.lock` on the read-only filesystem before `/status`; `codex --no-daemon --no-alt-screen` also exited 1 with a read-only filesystem error before `/status`. These are access failures, not evidence of quota exhaustion.

Coordinator subsequently verified `/status`: Codex **68% weekly remaining**; Claude **84% weekly remaining**. Twin's later verified gauge note reports Claude **~83–85%** and Codex **~83%** weekly remaining, an active Muse Code Power Usage subscription, Wonder Full runs verified that day, and no Muse limit hit. Muse `/status` has no readable numeric window percentage; the value does not exist in headless-readable form. All three pools are healthy, so dispatch is cleared.

No product edits, dependency installation, tests, or build validation occurred during this initial quota preflight. Only this item checkpoint changed. No project knowledge or reusable script is justified by this access-only preflight; no separate knowledge/scripts commit. Coordinator owns shared status and integration. C4-09 remains paused and excluded.

## Dispatch cleared — 2026-10-14

Twin's verified Muse note clears the pool-aware dispatch hold. A NEW fresh Codex Sol builder is assigned in its own worktree from the current main, with the C4-10 scope and review gate unchanged. The initial preflight agent is complete and is not reused.

## Fresh builder start — 2026-10-14

Clean assigned worktree `/tmp/c4-sdk-c4-10-build`, branch `item/c4-10-hardening`, exact HEAD/base `59156023e3d1b888d87ccbc6e0173b3a2ea63de6`. Required records read; claims/exclusions confirmed. Current implementation focus: initial viewport framing and focused/Fit geometry, explicit host resource ceilings, full regression evidence and acceptance documentation. C4-09/ts-db remain paused/excluded. Dependencies installing from existing lockfile, no manifest change. Browser lease requested from root.

## Hardening progress — 2026-10-14 04:48 UTC

Owned implementation adds pure viewport bounds/framing, readable initial first-card framing for wide views, routed-edge/label-inclusive Fit, keyboard recovery from tiny overview zoom, mobile explanation entry placement, and 200% heading wrapping. Host limits now lower decoder JSON/count ceilings, streamed byte ceilings, and native layout node/edge/cache/geometry ceilings. Published geometry has coordinate/extent and aggregate routed-point budgets. Session focus/viewport memory is capped at 256 views. Source API guide is `docs/api/README.md`; the acceptance report will be `docs/api/acceptance.md` under the existing docs/api claim. No root README, coordinator files, plan, manifests, demo content, ts-db or C4-09 edits.

Dependencies installed with `npm ci --prefer-offline`, manifests unchanged. Latest unit/hooks 203 PASS before the last advertised-length reader-cancel test; final rerun required. Properties 33 PASS before the last extent property; final rerun required. Lint only existing button fast-refresh warning. Initial demo sourcemap build hit an implicit-any error in a route-budget reducer; corrected and rerun PASS. Generic/demo sourcemap module inventories (432/431 sources) contain no braces/micromatch/fast-glob/ts-morph/shadcn JS modules, in `/tmp/c4-10-dist-modules.json` and `/tmp/c4-10-dist-demo-modules.json`.

Online advisory evidence: GitHub GHSA-vfj7-8cjw-p6xm still lists braces <=3.0.3 with no patched release (checked 2026-10-14). Sandbox npm audit first failed DNS (preserved `/tmp/c4-10-audit.json`); escalated online audit succeeds and reports 7 high dependency entries (`/tmp/c4-10-audit-online.json`), suggested shadcn1.0 downgrade rejected by scope. Toolchain exposure remains; no runtime-module exposure observed in inspection builds, no claim of a clean audit.

Event helper attempted task_started and failed common-dir write (read-only filesystem); publication skipped under recorded exception. Coordinator is completed, no competing browser processes were present and root STATE says lease free; C4-10 required production checks use 4173/4174, lease recorded here and notified to root. Initial sandbox browser startup stopped at gzip reporting before tests (same unestablished symptom as C4-08): `/tmp/c4-10-browser-initial.log`. Escalated full run `/tmp/c4-10-browser-full` is in progress. Desktop all product journeys pass so far, including code initial/Fit viewport and publication/zoom. New observer instrumentation failed at both sizes because it counted observer objects after React Flow called `unobserve`; corrected to track target sets and retire empty observers, with rerun pending. This is an instrumentation defect, not established application leakage. Mobile component-docs passed in this full run; historical intermittent failure not reproduced so far.

First stress run completed 200 nodes/400 edges in 9664.3ms worker lifetime, provisional cancellation 759.2ms, while unit checks were also running. This is above the former2s target and close to the default10s cutoff. Final isolated sequential measurements and navigation cancellation JSON are still required. No performance success claim. Screenshots inspected so far: desktop code initial readable compartment, code Fit overview, desktop publication zoom (navigation/docs only, heading-specific capture added for next run), mobile publication entry (one readable card/edge leaves viewport) and Fit (all topology overview; tiny text).

Next: finish initial full run, preserve failures, run final unit/property/typecheck/lint and final full production matrix after fixes, inspect final mobile code/heading/sheet captures, repeat component-docs and stress without competing checks, write acceptance report, commit implementation/evidence, assess durable learning separately, checkpoint and clean worktree. Fresh Claude Sonnet review remains pending; builder does not land/push/self-review.

## Final-source validation progress — 2026-10-14

Final product source now passes204 unit/hooks (24 files),34 properties (10 files), lint with only prior warning, and production TypeScript/build checks. `/tmp/c4-10-browser-final` completed63 PASS/2 FAIL/1existing skip: all product journeys passed, including mobile showcase keyboard selection and unchanged mobile component-docs; remaining failures were observer instrumentation retaining detached native panes. Read pinned React Flow source: system `index.mjs` explicitly leaves pane extent ResizeObserver for GC at unmount, and React `useResizeHandler` cleanup can see a cleared DOM ref. Strong counter references prevent that lifetime. Instrumentation now uses WeakRefs and counts connected observed targets, documenting that this is not a heap-retention proof. Full fresh matrix `/tmp/c4-10-browser-verified` is running with the corrected counter and persistent lifecycle/wall-time JSON.

Sequential second-run200/400 completed-worker lifetime4647.0ms, provisional lifetime322.1ms; navigation destruction/zero-worker wall time213.5ms. Both differ from abort-dispatch latency; no2s claim. Product source frozen for the final run. Further test-only changes added overall navigation-to-canvas wall time to the benchmark artifact. Inspected second-run mobile code initial/readable compartments, mobile component sheet, and desktop/mobile publication heading200% captures: words wrap and source text stays inside cards/sheet. Entry still clips routes by design; Fit is a tiny complete overview.

README core C4-08 reconciliation verified. Found a residual unclaimed seam sentence: initial async layout shows a link-enabled text alternative, despite README saying fixed geometry appears while pending. Root was notified; report records this coordinator-owned correction rather than editing read-only README. New API guide states actual behavior and enforced ceilings; README also retains older “proposed” limits wording. Full consumer gate remains deferred to C4-09.

## Completed validation — 2026-10-14

- Final product unit/hooks204/204 (24files), properties34/34 (10files), typecheck PASS; lint exit0 with only pre-existing button fast-refresh warning. Logs `/tmp/c4-10-unit-final-source.log`, `/tmp/c4-10-property-final-source.log`, `/tmp/c4-10-typecheck-final.log`, `/tmp/c4-10-lint-final-source.log`. Property seed4102026,200runs per new property, no shrunk failures.
- Fresh full production matrix `/tmp/c4-10-browser-verified`: **65 PASS/1existing mobile reference-stress skip**,6.1min; both production builds/typechecks PASS. All seven kinds, component docs, dynamic/deployment/showcase/context/navigation and root/subpath deep links covered; viewport/Fit/focus/200% and axe/reduced-motion checks pass.
- Repeated component-docs +stress runner `/tmp/c4-10-repeats`:9 PASS/3intended mobile stress skips,2.1min. Mobile component-docs unchanged test passes all3broad runs plus3isolated repeats; old intermittent cause remains unestablished.
- Connected lifecycle counts after8cycles return to baseline at both sizes:4 ResizeObservers,1 MutationObserver,4 distinct window resize/hashchange/popstate listeners,0 workers. Counters use weak references and connected targets to avoid altering native GC lifetime; not a heap-retention claim.
- Three fresh sequential200/400 measurements: completed-worker4820.2–5241.6ms (median5010.3), navigation-to-canvas6593.1–7557.8ms, provisional lifetime281.8–328.5ms, navigation destruction to zero workers170.1–242.2ms. Earlier broad observations9664.3ms (concurrent unit load),4647.0ms,5224.9ms remain recorded. The2s target is not met; default10s worker cutoff and schema safety caps are not performance promises.
- Final screenshot inspection includes desktop/mobile code initial/readable members and Fit overview; mobile publication entry/Fit; desktop/mobile publication heading200% captures; mobile component explanation sheet. Bounds/font/overflow assertions and screenshots agree: readable first-card entry, tiny Fit overview, initial routes may leave viewport. Artifacts stay under `/tmp/c4-10-*`, outside cleaned worktree.
- Acceptance report `docs/api/acceptance.md`, API guide `docs/api/README.md`. Known7high toolchain audit residual, production-module evidence, full failure/rerun history, limits and C4-09/ts-db pending gate preserved. Root README core reconciliation verified; remaining pending-layout sentence/proposed-limits wording reported to coordinator under read-only exclusion.
- Browser/preview runners exited and ports4173/4174 lease released. No quota limit hit, no model/provider switch/API key, no ts-db/C4-09/shared-config/manifest/rootREADME/coordinator changes, no merge/push/manual deploy/npm publication. Event start failed read-only common-dir; completion publication skipped under same recorded exception.

Implementation/evidence commit is next. Knowledge/scripts assessment follows the committed diff, in a separate commit if warranted. Final exact review HEAD will be reported after the checkpoint commit and worktree cleanup.

## Final handoff and post-implementation assessment

Implementation/evidence: `ae411d295f2813b4ef038fee24f82512a3840224` (`sdk: Harden viewport framing and resource limits`). Post-implementation knowledge: `92322fe96053b5d7a8c88f6901254e731ad1f096` (`docs: Record hardening measurement and framing lessons`). Read the committed implementation diff, knowledge index and work-script index after implementation committed. Added dated, evidence-linked lessons to the existing gotchas page: readable entry versus Fit, weak observer tracking and timing definitions, and safety ceilings versus throughput. No new knowledge page/index reconciliation or reusable work script is warranted; repeat/stress/lifecycle checks are existing indexed test workflows, and authoring scratch commands are one-off. Coordinator-owned knowledge index and work-script index remain unchanged.

Final exact-source source-map builds both PASS: `/tmp/c4-10-build-generic-final.log`, `/tmp/c4-10-build-demo-final.log`; TypeScript checking included. Generic/demo source-entry counts432/431, affected advisory JS modules0, aggregate JS bytes2,182,964/2,182,988. Raw inspection summary `/tmp/c4-10-bundle-inspection.json`, inventories `/tmp/c4-10-dist-modules.json` and `/tmp/c4-10-dist-demo-modules.json`. Source maps are scratch output only; no tracked build/config/dependency changes.

Final source still passes204 unit/hooks,34 properties, lint with prior warning, full production65 PASS/1existing skip, repeated docs/stress9 PASS/3intended skips, and `git diff --check`. Review history remains pending; `review.md` was not marked approved. Acceptance and exact limits/history are authoritative in `docs/api/acceptance.md`. C4-09/ts-db, human STE review, advisory resolution and the missed2s target remain explicit limits/gates. Root README’s remaining pending-layout/proposed-limits wording needs coordinator-owned reconciliation; builder respected the read-only exclusion.

Assigned worktree `/tmp/c4-sdk-c4-10-build`, branch `item/c4-10-hardening`, exact base `59156023e3d1b888d87ccbc6e0173b3a2ea63de6`. This final checkpoint commit becomes the exact review HEAD; its SHA is reported to root and saved in `/tmp/c4-10-builder-result.json`. The managed permission profile permits owned source and `/tmp` writes; online npm audit and production server/Chromium commands used approved escalation after sandbox failures. No provider limit was hit.

All source, evidence, learning and checkpoint changes are durable before the builder removes its own worktree as the immediate next step. Branch and artifacts remain for the fresh cross-company reviewer. Root will receive cleanup verification and exact HEAD; it owns review dispatch, integration, shared status, README reconciliation and any push. No self-review, merge, push, deployment or npm publication occurred. Browser lease4173/4174 released; no preview/browser runner remains. Completion event publication is skipped under the previously recorded common-dir permission exception.


## Fresh documentation NITS fix — 2026-10-14

Root assigned a new Codex Sol fix agent for findings 1–2 in [review.md](review.md), with the current removal direction read from main's root STATE, COORDINATION and implementation plan. C4-09 is removed, not paused; C4-10 continues independently. Productionization/publication and later ts-db module ingestion are a separate track, not a pending C4-10 second-consumer gate. Earlier item brief/checkpoint/review language records historical scope, not current authorization.

Branch `fix/c4-10-doc-nits`, fresh worktree `/tmp/c4-sdk-c4-10-doc-nits`, exact base/review record `41cf06a1718b12a8cf66c99808cf8155767565f7`. Root explicitly assigned README ownership; [claims.md](claims.md) records the narrow exception. Corrected `docs/api/acceptance.md` to remove the obsolete pause/resume/copy-consumer gate and record the independent scope and remaining human STE review. Corrected README's pending-layout sentence against `useDiagramLayout.ts`: initial asynchronous layout has a text alternative; a successful same-input scene may remain during measurement replacement. Relabelled default limits as enforced and clarified the adjacent raw JSON/dynamic-scenario depth distinction against the API guide. Acceptance now records these corrections. The measured 2-second goal failure, resource ceilings and all prior validation evidence are preserved; application behavior is unchanged.

Verification: inspected the prose diff and adjacent statements; README limits agree with `docs/api/README.md`, pending-layout behavior agrees with `src/lib/c4/react/hooks/useDiagramLayout.ts`, and edited Markdown link targets exist. `git diff --check` passes. No broad tests/builds were run for this prose-only change; no new performance or security result is claimed. Independent re-review remains required; root owns landing/push. Event publication is skipped under the recorded common-dir permission exception.

Post-work knowledge/scripts assessment: the finished diff adds no durable technical finding beyond the existing hardening knowledge and authoritative removal direction, and no reusable helper is warranted for these one-off prose corrections. No additional knowledge/script commit is warranted. The documentation fix commit includes this checkpoint and the ownership record; its exact SHA is reported to root after committing (this commit is the branch HEAD). Worktree cleanup follows the durable commit; the branch remains available for fresh re-review. No merge, push, historical C4-09 ref change, ts-db work, dependency change or publishing action occurred.

## Coordinator integration — 2026-10-14

Fresh Claude Sonnet reviewed documentation fix HEAD `99142e8d564d56e7704025219a1a7743e6d18db0` and returned PASS in review-only commit `2ab43680ba968e9cfdaf4e37fa71a1893789e8bf`. The original implementation verdict remains NITS; documentation findings 1–2 are resolved, while non-blocking test-strategy findings 3–4 remain recorded. C4-09 removal invalidates the former second-consumer gate; module productionization/ingest is tracked separately. C4-10 implementation, review records and doc fix were merged into local main as `1bd0ca860b7860cbcd67e932beb01e0299a6cd58`, preserving local C4-09 removal records. Root integration checks on the merged tree passed: unit/hooks 204/204, properties 34/34, typecheck, production build, and `git diff --check`; the known large-chunk warning remains. The 2-second layout target is not met (4.82–5.24 seconds). Human STE review remains pending. No push has occurred; origin still points at `7ec65a7`.
