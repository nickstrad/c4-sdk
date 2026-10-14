# C4 SDK build state

## Restart pickup — 2026-10-14 23:35 UTC

Latest Nick directives: first published version **0.1.0**, npm login verified by Twin as `nickstrad`; no publication authorized. P-06 must serialize manifest/lock and identity-doc updates to rolldown **1.2.14**, rolldown-plugin-dts **0.28.8**, version **0.1.0** before its final rebuild/repack and full exact-tarball matrix. All beta packs are preliminary. This supersedes older version/login and paused-verification status below.

Main at pickup `f59dc8d`, synchronized with origin. P-02 completed builder HEAD `c4722a6` (implementation `dc20b45`) has passing clean consumer matrix, packaged browser10/10, API5/5, unit204, properties34, typecheck/lint/builds, notices76/76. Fresh independent Sonnet review is active on `review/p-02-sonnet-restart` in `/tmp/c4-sdk-p-02-review-restart`; brief `/tmp/c4-p02-review-restart.md`, machine output `/tmp/c4-p02-review-restart.json`, exit status `/tmp/c4-p02-review-restart.exit`. Owns only P-02 review.md/review-STATE.md, ports4185/4186. No verdict yet. On PASS integrate and push, then P-04/P-05 concurrently, integrate04 then05; P-06 alone last.

Dispatch gauges checked: Claude weekly20% used (session0%); Codex weekly40% used (latest session telemetry); Muse `/usage` reports subscription currently unavailable. No paid API tier or credentials added. Event skip remains authorized. Preserve untracked kickoff files and prior builder worktrees.

## Current status — 2026-10-14

Nick signed off the human STE review gates for C4-08 and C4-10 on 2026-10-14; both items are fully accepted. The delivered material remains draft STE guidance and is not represented as formal ASD-STE100 certification. Productionization is now the active authorized track. Its approved boundary ends at tested pre-publication readiness; stop before `npm publish`, which requires Nick present for npm account login/2FA. P-01 public API contract work runs alone first. See [`docs/plans/productionization.md`](docs/plans/productionization.md), [`agent-work/items/P-01/STATE.md`](agent-work/items/P-01/STATE.md), and [`agent-work/COORDINATION.md`](agent-work/COORDINATION.md).

P-01 was dispatched to a fresh Codex Sol agent (`/root/p01_public_contract_builder`) in `/tmp/c4-sdk-p-01`, branch `item/p-01-public-contract`, from base `a585d97`. Its exact claims and required checks are recorded in the P-01 brief/checkpoint. The task-start event helper failed because `.git/agent-work` is read-only (`mkdir: ... Read-only file system`); no event was published. This failure is recorded here rather than claiming an event.

P-01 implementation/evidence commit `3799c9e`, snapshot-strengthening commit `5ab5279`, and separate knowledge/scripts assessment checkpoint `5346c38` are complete at exact branch HEAD `5346c383a06d8540d8d2c48c45cd0965f06e3f5b`. Validation passed: 204 unit/hooks, 34 properties, public API 5/5, root TypeScript build, explicit structural compile, lint (inherited button warning), generic/demo production builds, and browser regression 34/34 across desktop/mobile context/navigation/seven-types. Fresh Sonnet review PASS `f92d8d2`; the package identity correction to `c4-sdk` was reviewed, its cosmetic line-wrap NIT was repaired, and fresh Sonnet re-review PASS `68d7915` on exact final fixup HEAD `230fd42`. P-01 plus review records are integrated on local main at `dbd8875`; coordinator knowledge reconciliation is committed separately. Builder/reviewer worktrees are cleaned. Local integration awaits push; P-02/P-03 are now authorized as the concurrent next batch. No publication.

Fresh Claude Sonnet independently returned PASS on `5346c38` in review commit `f92d8d2`. It reran API 5/5, unit/hooks 204/204, properties 34/34, typecheck and lint, and confirmed two deliberate API mutations fail the snapshot. It did not rerun Playwright because no source behavior changed; builder browser evidence is 34/34. Four low/info notes are recorded in the review. Coordinator dispatched a fresh documentation-only fixup because Nick's approval note names the unscoped `c4-sdk` availability check (2026-10-12), while the candidate docs recommend the scoped name. This fixup aligns docs with Nick's direction; P-02 must recheck current registry availability before creating/publishing an artifact. New exact claims are in `agent-work/items/P-01-fixup-package-name/STATE.md`.

Package-name fixup is assigned to a new Codex Sol builder (`/root/p01_package_name_fixup_builder`) in `/tmp/c4-sdk-p-01-name-fixup`, branch `fix/p-01-package-name`, starting at `0d5100596152d1486b7003e3637995923915e5a4`. It combines the reviewed P-01 payload with current coordinator checkpoint records; it changes only approved planning/API/support docs and its own checkpoint.

Updated: 2026-10-14 17:40 UTC. Nick removed C4-09 on 2026-10-14: stop the c4-sdk copy-consumer hack. The seven C4-09-only commits were removed from main by resetting to `7ec65a711daaf3bf4aa730569e54385c96a7356e`; the C4-09 implementation was never pushed. Its removal records and the independently reviewed C4-10 landing were later pushed together; origin reached `4347174` with no C4-09 copy-consumer code. Historical C4-09 builder/review branches remain. New consumption path: productionize and publish c4-sdk to npm, then ingest it in ts-db as a loaded module. Interim ts-db work is separately coordinated: an isolated folder may copy React code and build the components so the copied c4-sdk code can later be deleted wholesale and replaced by the loaded module. No ts-db action is assigned here. C4-10 builder HEAD `b15c88f24dc6bbee7dea15e58be740daa2fd2afb` received fresh Claude Sonnet NITS review `41cf06a`; fresh Codex Sol repaired the two documentation nits in `99142e8`, and fresh Claude Sonnet re-review passed in `2ab4368`. C4-10 is merged at `1bd0ca8`; integration unit/hooks, property, typecheck and production build checks pass. Two test-strategy nits remain non-blocking; Nick signed off C4-08/C4-10 human STE review on 2026-10-14 (draft content acceptance, not formal certification). Later module-consumer validation remains a separate follow-up.

Nick latest: each item/review/fix gets a **new fresh-context agent in its own worktree**; never reuse subagents. The builder commits implementation and separate post-work knowledge/script changes, updates item STATE and cleans its worktree. Independent review is mandatory. See `AGENTS.md` and `agent-work/COORDINATION.md`.

The Codex-only exception ended at 2026-10-13 05:59 UTC per Nick; normal paired seat mapping is restored: Sol/Sonnet, Astra/Opus, Luna/Haiku-high. Respect real provider usage; one fresh Codex Sol C4-05 builder hit its usage limit until Oct18.

Twin's Pages workflow is complete (`0e32ef9`); first deploy succeeded at https://nickstrad.github.io/c4-sdk/. Every main push redeploys automatically; do not duplicate it.

## Authorization and ownership

Nick's `build-kickoff.md` authorizes the whole implementation plan, independent reviews, commits and pushes as items land. Historical plan-only restrictions are superseded. No manual site deployment or npm publication is requested. Twin's completed Pages workflow commit `0e32ef9` deployed successfully and the demo is live; every main push invokes its deployment. Do not duplicate it.

Latest staffing instruction: normal paired mapping is Sol/Sonnet, Astra/Opus, Luna/Haiku-high, with independent review from a different company than the builder. Nick's 2026-10-13 16:43 CDT lead review note says the Codex weekly pool is nearly exhausted and Twin is dispatching C4-06 review as a standalone Muse Wonder Full session. No C4-06 local review or landing until Twin's verdict is recorded. C4-05's earlier Sol quota limit was recorded in its history.

Work has only regular `agent-work` items and `sq-*` side quests; no experiment protocol/board. The scaffold and correction landed as `486db29` and `967d573`; experiment files are absent and mandatory STATE conventions are in AGENTS. Preserve untracked user files `build-kickoff.md` and `kickoff-brief.md`.

Root owns this checkpoint, COORDINATION, shared configuration/manifests, integration and knowledge reconciliation. Builders maintain item-local STATE/claims in separate worktrees. Every item requires independent exact-commit review before landing. Common Git event publication is denied; Nick explicitly permits skipping it. Do not fabricate events.

## Plan and completed items

Authoritative plan: `docs/plans/implementation.md` (reviewed payload `340baa4`, plan branch `6491825`, merged `3524a26`). Shared batch-C contract: `docs/plans/batch-c-contracts.md`.

Order: A01; B02+08a; C03+04+09a; D05→06→07; E08+09; F10. Integrate03→04→09a. Sol is default builder/reviewer, Astra for04's difficult layout problem, Luna high for08a. Do not dispatch serial05 before04/09a land.

| Item | Reviewed payload / landing | Evidence |
| --- | --- | --- |
| C4-01 | Sol PASS `45b7d3e`; landed `541e41a` | 25 unit/hooks,5 properties; production context journeys/screenshots; finite geometry fixes |
| C4-02 | Sol PASS `363a16e`; landed `0561126` | 43 unit/hooks,10 properties,24 browser; native links, route/history/default-catalog fixes |
| C4-08a | Sol PASS `c7d65b4`; landed `9849515` | Cursor source fidelity,11 article anchors/local links, original glossary/ledger |
| Preflight | Sol PASS `0c4d865`; landed `f4f7321`, reconciled/pushed `3ea5789` | 52 unit/hooks,15 properties,24 browser; groups/projection/measurement/geometry contracts; pinned dependencies |
| C4-03 | Sol PASS `5bb3750`; record `35fa16c`; landed `1139a64`, pushed `944530f` | Independent57 unit/hooks+18 properties/typecheck; baseline24+component2+mobile viewport1 browser through affected reruns; source/screenshot review |
| C4-09a | Sol PASS `8fce8d4`; review record `5216e93`; merged after04 | Builder88 unit/hooks+15 properties; reviewer36 focused/400FC plus symlink/tampered-plan refusal cases |

C4-03 merged without conflicts; root combined-tree typecheck,57 unit/hooks and18 properties passed. Root adapted baseline context/navigation tests for responsive Sheet and changed deferred-kind unit assertion to code. Rich docs choice keys include dataset/revision/diagram/element; sources/terms follow selected document. Mobile fixed dialog validated with viewport capture plus bounds, because full-page stitching can mislead. Knowledge recorded in `docs/knowledge/gotchas.md`.

## C4-04 review and integration

Astra builder `/root/c4_04_builder` completed exact `0b45a9b1ccef209e28a060ab1a9719a3b502d7c5`; independent Astra `/root/layout_reviewer` PASS. Review record `f94f234`; merged without conflicts. Combined-tree typecheck,70unit/hooks,21properties PASS before push. Browser lease free.

Independent 70 unit/hooks,21 properties,8 targeted production desktop/mobile browser journeys and both builds/typechecks PASS. Builder final affected20/20 PASS after fixing two failures in earlier full37/2/1 run. Do not describe the earlier full run as clean. Artifacts: `/tmp/c4-04-final-affected-evidence`, `/tmp/c4-04-zoom-final-evidence`, `/tmp/c4-04-production-evidence`; earlier failure/diagnostic directories preserved in item STATE.

Native ELK worker uses elk-api workerFactory and worker importing elk-worker.min.js. Manual authored positions remain exact; labels avoid collisions; edge.container sets local route origin. Output validation, cancellation, bounded geometry cache, font/resize measurement and host-slot session restoration reviewed. Focus pan uses absoluteScene+RFviewport/client dimensions because ReactFlow resets temporary native scroll; pointer down must not pan before click. Root shared CSS heading wrap and canvas-scoped assertions included in reviewed payload. See item STATE/review for full evidence.

Real 200-node/400-edge worker completed4109.2ms on4sharedvCPU/7.8GiB Linux, provisional cancelled254.2ms; this exceeds target and C4-10 must tune/report. No2second claim. Large bundles and existing lint warning tracked.

## C4-05 — landed and pushed

Plan seat is Sol/Sonnet. Prior builders made uncommitted implementation changes in `/tmp/c4-sdk-c4-05` on `item/c4-05-dynamic` (base `dd2faf8`); neither committed nor completed review. A fresh Codex Sol builder passed typecheck, 114 unit/hooks, 23 properties and the initial dynamic browser 4/4 (55.1s) across desktop/mobile. Screenshots are in `/tmp/c4-05-dynamic-evidence`. Root inspected them and found the mobile step selector collapsed to roughly 8px and wrapped one character per line. The builder fixed owned CSS and added a >180px assertion, but then its Sol usage limit hit until Oct18; browser result for the CSS fix was not recorded. The earlier production build and pre-fix browser run passed. No Playwright/preview/Chromium process remains at 08:46 UTC, so the earlier process is not hung and cannot be killed. Rerun owned dynamic plus context/navigation production suites after transferring latest sources into a fresh agent's own worktree.

Root prepared review brief `/tmp/c4-05-review-brief.md`. Fresh Astra builder completed on `item/c4-05-dynamic-astra` from base `c715e1d` in its own worktree, then cleaned it. Commits: `18d9545` implementation, `bca3d25` indexed knowledge, `c8c403e` checkpoint. Fresh Luna reviewer independently reviewed exact `c8c403e`, passed typecheck, unit/hooks 114/114, properties 23/23, and dynamic production browser 4/4 on desktop and Pixel 7 mobile. Both builder and reviewer inspected screenshots and confirmed the mobile selector fix. Review record `9330f58` is PASS. The context/navigation 200%-zoom mobile S3 click timeout is a pre-existing defect: identical unchanged test at base `c715e1d` and current payload failed the same line in 31.2/31.4s with the same clipped-node evidence. It is recorded as a follow-up limitation, not a C4-05 blocker. All C4-05 commits and review record were merged in `f27b3811f970445ea92982820793dadceb24a8d6`, state/coord updated in `14ac790fbd5b32d0aec2466d1c11b0f8405f2362`, and pushed to `origin/main`. C4-06 is now active in a new agent/worktree.

## C4-06 — reviewed and ready to land

Fresh Astra builder `/root/c4_06_astra_fresh` completed C4-06 from `14ac790` in its own worktree and is cleaning it. Branch `item/c4-06-deployment` HEAD is `be53937187cf8cb3fbe99fd114ee1440f763f2a7`; implementation `233a698`, separate indexed project-knowledge commit `8ce2ffa`, initial checkpoint `2f455ef`, final regression checkpoint `be53937`. Unit/hooks 122/122, properties 25/25, typecheck and build passed. Production deployment journeys passed 4/4; final deployment+compound-layout regressions 17 PASS / 1 existing skip; dynamic/component regressions on final source passed 6/6 with both builds and typechecks. Desktop/mobile screenshots inspected, including selected replica focus and viewport bounds. Builder corrected Back focus restoration and initial focus-pan race; exact evidence is under `/tmp/c4-06-final-evidence` and `/tmp/c4-06-final-dynamic-component`.

Per `/root/c4-lead-c4-06-verdict.md`, the Twin-dispatched standalone Muse Wonder Full reviewer returned PASS on exact HEAD `be53937187cf8cb3fbe99fd114ee1440f763f2a7`. Independent checks: typecheck and lint pass (one pre-existing warning), unit/hooks 122/122, properties 25/25, deployment browser 4/4, and layout/dynamic/component browser 19 pass/1 existing skip. No blocking defects; four non-blocking nits are recorded in `agent-work/items/C4-06/review.md`. Full report: `/root/wonder-c4-06-review.log`. The reviewed implementation, indexed knowledge and checkpoint are now merged in `f5f0a03`; push remains pending.

## C4-07 — dispatch next

The fresh Sonnet C4-07 builder completed and cleaned `/tmp/c4-sdk-c4-07`; exact HEAD `e6e53c13af0b1596a7ce6ebb80901bdd252db7ae`. Implementation `7cd4189`, separate project-knowledge commit `84bf5b5`, final checkpoint `e6e53c1`. Fresh cross-family Codex Sol review returned PASS on that exact commit. Independent checks: typecheck, 189/189 unit, 29/29 properties, lint (pre-existing warning), targeted production browser 20/20 desktop/mobile; broad suite was not fully clean (56 pass, 1 existing skip, 1 intermittent mobile component-docs failure, not diagnosed; isolated reruns pass). Merge `a569c36` and status checkpoint `bf06843` are pushed; review is recorded at `agent-work/items/C4-07/review.md`. Review worktree has been removed and its record collected. The C4-07 item brief now reflects post-reset paired staffing.

Carry these C4-07 follow-ups into C4-10: initial mobile code canvas framing can be empty/partial despite keyboard-focus recovery, so add viewport-based focused/Fit checks; the broad-suite mobile component-docs selection failure remains unexplained, so rerun and investigate if it recurs. The stale root README claims were reconciled in C4-08; verify the fix and close this item unless a contradiction remains. The C4-07 item brief's Codex-only staffing sentence is superseded by the post-reset mapping.

Wave E C4-08 is complete. Fresh Codex Sol builder's implementation is `398782b`; its separate assessment/checkpoint is exact HEAD `e3b33fa1f9da89cb551dd4af492f6e09b792f6e4`. Fresh Claude Sonnet reviewer committed `21f91d3` and returned PASS on that exact HEAD. Independent checks: typecheck, lint (existing fast-refresh warning), 194 unit/hooks, 31 properties, both production builds, and 12/12 affected desktop/mobile showcase/dynamic/deployment browser tests; screenshots inspected. Review caveats: broad browser suite was not rerun, so C4-07's unexplained mobile component-docs failure remains untested; full JSON/article hand-audit was not performed. Nick signed off the human STE review gate on 2026-10-14; C4-08 is fully accepted. Low mobile canvas framing/partially clipped edge follows up in C4-10. Coordinator merged item plus review record as `bdbfd4a`; checks pass, with main and status pushed through `f4bbff2`.

C4-09 is removed per Nick's 2026-10-14 direction. The reviewed local C4-09 implementation was never pushed to origin; its local-only commits were removed by resetting main to `7ec65a7`. C4-10 was then independently merged and pushed; current main includes C4-10 and the removal records, but no C4-09 copy-consumer implementation. C4-09 builder/reviewer branches are retained only as historical refs. The copy-consumer approach is abandoned. Consumption now depends on a c4-sdk productionization/publishing track followed by ts-db ingesting the published package as a loaded module. The interim isolated React-code copy/build folder, if needed, is owned by ts-db and should be structured for wholesale replacement by the module later. No ts-db work is dispatched from c4-sdk. Keep the completed C4-09a policy work as historical repository work; it no longer authorizes or implies a copy-consumer implementation. C4-10 continues independently with no C4-09 landing gate.

C4-10 implementation was independently reviewed by fresh Claude Sonnet at exact HEAD `b15c88f24dc6bbee7dea15e58be740daa2fd2afb`; initial verdict NITS, review commit `41cf06a`. Fresh Codex Sol addressed the stale C4-09 and README geometry/limit wording in fix commit `99142e8`; fresh Claude Sonnet re-review PASS is `2ab4368`. Two test-strategy nits remain documented as non-blocking. Reviewer independently passed 204 unit/hooks, 34 properties, typecheck/lint and focused 16/16 desktop/mobile browser checks. Root reran 204 unit/hooks, 34 properties, typecheck and production build on the merged tree. The full browser matrix, stress timings and audit were not rerun by the reviewer; builder evidence remains recorded. C4-10 is merged as `1bd0ca8` and pushed with shared status at `4347174`. Nick signed off the human STE review gate on 2026-10-14; C4-10 is fully accepted. Later module-consumer validation remains a separate follow-up.

## Other worktrees and next actions

- C4-03 `/tmp/c4-sdk-c4-03`, branch `item/c4-03-components`: complete/clean; payload `5bb3750`, record `35fa16c`, already landed. Reviewer `/root/components_reviewer` Sol PASS. Final Sheet artifact in `test-results-sheet-viewport/.../component-docs-sheet-viewport.png`.
- C4-09a `/tmp/c4-sdk-c4-09a`, branch `item/c4-09a-copy-policy`: clean at `5216e93`, merged after04. Independent `/root/copy_policy_reviewer` Sol PASS exact `8fce8d4`. Historical policy/filesystem helper work remains in the pre-C4-09 main lineage; Nick's removal direction means it no longer authorizes a c4-sdk copy-consumer implementation.
- Root pushed04 atfc3d43b and merged09a; combined typecheck,106unit/hooks,21properties PASS; pushed09a atdd2faf8; C4-05 dispatched next. Re-review semantic conflict resolutions.
- Dispatch serial05,06,07 with exact claims based on landed tree. Drafts `/tmp/c4-05-brief.md`, `/tmp/c4-06-brief.md`, `/tmp/c4-07-brief.md`.05 explicitly preserves partial-order parallel semantics; no zipped branch barriers or fabricated execution order.
- C4-09's former source-copy/FFI-conversion task is removed per Nick; the old research/preparation notes are historical only. Current/proposed diagram arrangement and interim React copy/build are ts-db-owned and separately coordinated. Productionization/publishing is now the SDK-side prerequisite for module consumption.
- Draft07 now explicitly includes public lower-level composition/provider/slots as planned, with tested examples; do not hide this feature in10. Draft09 notes no current tracked LICENSE: preserve attribution, do not invent a license grant.
- C4-10 implementation and review are complete and fully accepted; its exact HEAD, evidence, and non-blocking test nits are recorded under `agent-work/items/C4-10/`. Nick's human STE sign-off is recorded in `docs/api/acceptance.md`. Main integration checks passed. The next SDK-side direction is the approved active productionization track.

Each worktree has its own installed node_modules. **Run Vitest unit and property commands sequentially per checkout**; concurrent processes race on `.vitest-cache`. No reinstalls/config changes without a concrete reason. Browser runners require the single lease. Existing button fast-refresh lint warning and large-chunk build warning are known; no false clean/performance claims.

## Later consumer preparation

Read-only preparation: ts-db main checkout `/root/Software/ts-db` was inspected previously; no ts-db edits were made from c4-sdk. Nick's latest direction cancels the C4-09 c4-sdk copy/provenance workflow and assigns any interim isolated code copy to ts-db separately. Environment KB feedback for search353 could not be recorded because the SQLite index was unavailable.

## Source evidence and history

Plan sources and requirements follow for restart context. The ts-db plan pointer was published at 187f4f9; no ts-db implementation has begun.

## Full task and requirements received

### Original brief

`/root/c4-react-plan-brief.md` requests **plan only**, not a build. Working name was c4-react: interactive
C4 diagrams as React components, initially proposed under ts-db `pages/` but designed standalone. Nick later
moved the framework and plan into c4-sdk now, so the old location is superseded.

The original brief requires:

- Vite, React, TypeScript, Tailwind CSS and shadcn/ui.
- Evaluate/justify Zod, Effect and fast-check; other libraries only where useful.
- All seven C4 types: System Landscape, System Context, Container, Component, Code, Dynamic, Deployment.
- Native detail links, drill-down, breadcrumbs, Back/Up, deep links to diagrams and elements.
- A reusable per-diagram Legend primitive.
- JSON data loaded and validated at runtime, decoupled from components; no hard-coded project content.
- Mandatory dumb views, hooks/pure functions, and containers composing hook+view. Show concrete examples
  for both the renderer and navigation/drill-down state.
- Attach STE100 and plain explanations to diagrams and individual elements.
- A milestone converting current ts-db architecture plus proposed FFI architecture from `docs/ffi-c4` and
  `research/fable-lang-switch`, preserving source fidelity and distinguishing current vs proposed.
- Goals/non-goals, folder structure, JSON schema and worked FFI context example, component inventory,
  navigation, legend, library choices, implementation sequence/model assignments, risks/open questions.
- Commit on `plan/c4-react` and push. No scaffold/code implementation during this task.

### Subsequent user requirements incorporated before the stop

- Framework/SDK owns `github.com/nickstrad/c4-sdk`, cloned at `/root/Software/c4-sdk`; existing scaffold is
  being set up separately. Make this an **implementation plan for that repository**.
- Plan document itself lives in c4-sdk, not ts-db.
- Earlier plan: ts-db GitHub Pages would consume it by copying the project in, with npm packaging deferred.
  Superseded 2026-10-14 by Nick: publish c4-sdk to npm and ingest it as a loaded ts-db module; an interim
  isolated React-code copy/build folder is ts-db-owned and should be easy to remove wholesale.
- Include a showcase under c4-sdk `demos/` based on https://cursor.com/blog/git-at-any-scale. Fetch/read
  the post first. Model it using JSON diagrams plus STE100 write-ups.
- Port ts-db's `docs/knowledge` durable-memory pattern.
- Use Playwright throughout validation/implementation, not only at the end.
- Structure as vertical slices wherever possible.
- Unit tests plus fast-check properties for logic in addition to Playwright.
- Lean heavily on pure business/domain functions independent of framework logic; thin hooks plus dumb
  views should enforce this division.
- Latest testing/model/concurrency/state/delegation refinements are incorporated as listed at the top and independently reviewed.

### Earlier, separate language research history

Nick earlier requested language-switch research, ultimately dropping Postgres-only completely and retaining
per-tenant SQLite files as the primitive to master (language switch, concurrency, file descriptors).
That work was completed on ts-db `research/astra-lang-switch`, commit `c3a2d77`, pushed:
`docs/architecture/language-switch-astra.md`, recommendation Go sidecar hybrid. It is not the active task.
Nick explicitly allowed skipping the log-event step if it fails. Do not revive the abandoned Postgres scope.


## Research and source evidence

- Cursor article was fetched and read before planning demo, via web tool, source `turn15view0` in prior
  context: Vicent Martí, “Git at any scale”, 2026-08-18,
  https://cursor.com/blog/git-at-any-scale.
- It describes Continuity behind Origin, local Git caches, S3 WAL/index, CAS publication, rendezvous
  placement, gossip/conditional freshness reads, rebuild and compaction. Plan includes a short sourced
  summary and labels proposed decompositions. Avoid copying the article/diagrams or claiming unexposed
  process boundaries/languages/topology as fact. Re-fetch on restart if detailed review requires contents.
- Prior primary docs checked/linked: c4model.com diagram taxonomy/code/dynamic/deployment/notation;
  React Flow custom nodes, accessibility, layout, subflows; ELK GitHub; React Router; Zod JSON Schema;
  Vite build; Tailwind/shadcn Vite; fast-check, Vitest, react-markdown; Playwright accessibility; ASD-STE100.
- Pinned ts-db content sources in plan:
  - Current main `e808983cefcabe9ba1fe28ce7ea54fb6725a7e0c`.
  - FFI diagrams `bc1a1b55e368a730fc1d8300e14cae566d246a31` (`docs/ffi-c4`).
  - Fable rationale `d97bcf8f145e94279b882665c70412eabdaba775` (`research/fable-lang-switch`).
- Conversions preserve planned/current distinctions, mapping inventories and documented-read path fidelity;
  libsqlite3 is not an independent running container, measurements are historical observations, and a point
  read does not prove a hard wall-clock bound.

## Hardening follow-up

Online npm audit in preflight confirmed 7 high-severity entries from one underlying braces <=3.0.3 stack-exhaustion advisory, propagated through micromatch/fast-glob/ts-morph/shadcn. Primary advisory https://github.com/advisories/GHSA-vfj7-8cjw-p6xm lists no patched version (checked2026-10-13). Existing app references shadcn only through its CSS import; no direct runtime glob imports found. This is an initial exposure assessment, not proof of absence from final bundles. C4-10 must verify the production bundle and document toolchain exposure or resolve with a supported dependency change. Do not apply npm audit force downgrade to shadcn1.0.0. Offline audit returned empty data and is not evidence of a clean audit.

## Concurrent remote change

Preflight push was rejected because origin/main advanced with0e32ef9 (.github/workflows/pages.yml only). Fetched and merged without conflict, preserving the existing automatic Pages workflow. Its base is /c4-sdk/ and it builds dist-demo. No force push or manual deployment was performed.

## Productionization handoff — 2026-10-14 18:31 UTC

P-01 and its `c4-sdk` identity fixup have independent PASS reviews and are integrated on local main at
`dbd8875`. The accepted surface/support decisions and P-02 packaging gates are reconciled in
`docs/knowledge/decisions.md`. P-02 (fresh Codex Sol) continues package/type/browser verification. P-03
(fresh Codex Luna high) is reviewed PASS after a fresh repair/re-review cycle and integrated with its
review records at `a42eb03`. Its MIT holder is inferred from repository identity/authorship, without a
separate legal-holder attestation; package inventory remains provisional pending P-02's exact
`npm pack --json` reconciliation. P-02's first package-browser run failed 8/8 on a real Node-conditional
dependency bug; rebuilding for browser conditions fixed the Markdown startup error, but the rebuilt bundle
reveals stripped embedded minpath/Node contributor notices. A separate fresh P-03 attribution fixup is
assigned before final repack. Actual `npm publish` remains outside this mission
until Nick is present for login/2FA. P-02's exact packed Node ESM/CJS, mixed-context, worker, strict type,
Vite ESM/CJS consumer matrix and API 5/5 passed on an intermediate artifact. Its first browser matrix
found an actual Node-conditional Markdown failure (8/8); a browser-platform repair then broke Node import
safety. P-02 is rebuilding with neutral platform and explicit module/main selection; the latest bundle
inventory is 76 packages, SHA `88f62f2709fb334629bf36035bd57c7753721295b3c803f460367a041bd01ebc`.
Unit/hooks 204 and properties 34 passed, as did source/demo builds and root typecheck. Fresh P-03 attribution
fixup agents are updating notices for the stripped `vfile@6.0.3` embedded minpath MIT headers and restoring
the 76th package row; final pack and browser revalidation remain pending. The registry check returned
404/unregistered for `c4-sdk`; no registry write occurred. Current pushed main is `21baf86`.

## Productionization checkpoint — 2026-10-14 19:50 UTC

P-03's embedded attribution fixup is integrated locally with both independent Sonnet PASS review records
at `9dff4765d234d9db11bfb581b08f4eec5cfdae2e`. It preserves the full MIT notices for
`vfile@6.0.3/lib/minpath.browser.js`, restores `character-entities@2.0.2`, and documents the future
committed inventory path without relying on a `/tmp` link. Exact pack comparison remains pending.

P-02 found a packaged browser theme failure affecting all-seven-type fixtures: the public facade did not
include the base `c4.css`. Its current source build includes all five SDK CSS sources. The regenerated
inventory has 76 package rows and SHA-256
`b1613ddd1e889f00380ba5c436fe922f86131ec967434c4f637d7bd929a9d93b`; this is inventory evidence, not
yet a verified tarball. Rebuild, clean Node/type/Vite consumers, packaged browser fixtures including the
all-seven-type themes, final `npm pack --json` reconciliation, and fresh independent P-02 review remain
required. Earlier artifacts with the conditional-import, Node-safety, or missing-style defects are rejected.
The registry result for `c4-sdk` is E404/unregistered; no registry write occurred. Do not publish: Nick must
be present for npm account login/2FA. Preserve untracked `build-kickoff.md` and `kickoff-brief.md`.

## Productionization recovery checkpoint — 2026-10-14 20:21 UTC

The CSS-inclusive candidate's first 10-case browser run passed 8/10; both mobile dialog-close checks
exposed a real portal-selector issue in generated package CSS. A fresh builder identified and implemented
the fix: portal self-rules now use `.c4-sdk.c4-docs-sheet` and `.c4-sdk.c4-docs-backdrop`, the generated
backdrop receives the scope class, and the mobile browser test asserts fixed positioning before clicking
Close. This rebuilt artifact (`d7980de2...edd33f8`) has not completed its exact-tarball consumer/browser
matrix and is not accepted.

Two P-02 builder sessions stopped responding for several minutes at tool-return boundaries and were
paused. A third fresh Codex Sol builder now owns the same P-02 work in `/tmp/c4-sdk-p-02-verify`, branch
`item/p-02-sdk-package-verify`, based on current pushed main `00bf66a`. Its isolated worktree has the
transferred package implementation and tests; it must rebuild against current P-03 notices, finish the
exact consumer and 10-case browser checks, reconcile the 15-file pack and 76 notices, run source gates,
commit implementation/evidence and a separate assessment, and clean its worktree before a fresh Sonnet
review. The inventory expectation is 76 rows, SHA `b1613ddd1e889f00380ba5c436fe922f86131ec967434c4f637d7bd929a9d93b`. No publication or registry write is authorized. Preserve the two interrupted worktrees as handoff evidence until P-02 is complete.

## Install permission checkpoint — 2026-10-14 20:28 UTC

The fresh P-02 verifier started `npm ci` in its own worktree. The restricted attempt stalled; it requested
the required escalated install permission to retry. That approval is still pending, so the builder has not
run the final artifact matrix or browser suite. Do not proceed with package tests until the approval
returns. No package artifact has been accepted and no registry write or publication occurred.
