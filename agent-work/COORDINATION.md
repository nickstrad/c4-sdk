# Work coordination

## Published; productionization track closed — 2026-10-15

Per Twin's handoff in `/root/c4-lead-published.md` (2026-10-15, approximately 07:40 CDT), Nick published the retained `c4-sdk@0.1.0` candidate from vm-1 after the 2FA web-auth flow. Twin verified the registry packument: `latest = 0.1.0`, 15 files, and `dist.shasum = c92d3d195384380d67b95604df3c4750617ad3ba`, matching the verified tarball (SHA-256 `6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084`). This coordinator records Twin's verification; it did not republish or perform a new registry verification.

The registry also contains `0.0.0-stage`, described as "Temporary package placeholder for staged publishing", under maintainer `nickstrad`. Twin reported that early `npm view` reads briefly exposed only this stub during replication; the confirmed `latest` tag targets `0.1.0`, so the stub does not affect default installs.

P-01 through P-06 and the productionization track are complete and closed. Twin has triggered the npm module swap on the ts-db side; that work is separately owned. The publication-pending instructions below are historical and superseded. Existing browser limitations and Nick's mobile component-docs exception remain documented in the release report.


## P-06 complete: reviewed prepublication readiness — 2026-10-15

P-06 and its bounded browser correction landed at 9743c93. Fresh Sol final PASS290f51e/checkpoint3d4b229 on exact d7ee5ef resolves original R1/R2 FAIL2938f95. Independent48focused passes (24normal+24CPU4); builder fullsource65pass/1intendedskip, controlledCPU4/6 repeats36+16pass. Test changes reveal offscreen targets using existing focus-pan, assert viewport, then realclick; runtime/package inputs unchanged. Report/gotchas correct causality and disclose historical focus-return uncertainty. Nick mobile component-docs NONBLOCKING ruling explicitly retained with C4-07/C4-10/P06 recurrence and isolatedpasses.

Integration on main9743c93 PASS: typecheck/lint (two known warnings),206unit/hooks,34property,5API,108release. Logs /tmp/c4-p06-integration-{install,check}.log, check.exit0. Earlier exact clean release-check and independent exact-source release-verify PASS: package10browser/README6browser, module/types/mixed-context/React-freecore,15files/76noticepackages. Six requested distribution areas signed off.

Release report docs/release/0.1.0.md; final review agent-work/items/P-06-browser-fix/review.md. Version0.1.0, rolldown1.2.14/plugin-dts0.28.8, TS6.0.3/Vite8.3.4. EXACT retained candidate /tmp/c4-sdk-release-0.1.0/c4-sdk-0.1.0.tgz, SHA2566b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084, release-input sourcefb74a91c539614542769e97e3ebbfe0677dcc356. Preserve tarball/sidecars/screenshots; later report/test commits did NOT rebuild artifact. Corrected report copied alongside artifact. Final correction/review trees cleaned; branches/evidence retained.

Next: separate explicit Nick instruction for publication using docs/release/runbook.md and retained artifact. NO npm publish, tag or registry write occurred. npm identity nickstrad already verified by Twin; no new login work. Push this completion checkpoint to origin/main; automatic existing Pages workflow may redeploy. Preserve untracked build-kickoff.md/kickoff-brief.md. All older sections below are historical, superseded by this completion status.


## P-06 correction re-review active — 2026-10-15

Sonnet correction finalized/exited0 at d7ee5ef (tests fcc7f88, docs7e3f80a), cleaned own worktree. Only3browser specs, release report/gotchas and item records changed. Actual realclick preserved after viewer focus-reveal/inviewport assertion. CPU4before reproduced five click failures; CPU4after26hostedpass plus2known scratch generic-host failures, repetitions36pass, CPU6repeat16pass. Standard fullsource --workers=1 PASS65/skip1. No runtime/package inputs changed; exactartifact unchanged. Historical mobilefocus-afterUp remains unreproduced/unresolved, waived component-docs unchanged and noted. No defaultparallelfull repeat.

Fresh Sol re-review ACTIVE exactd7ee5ef, /tmp/c4-sdk-p06-rereview branch review/p-06-browser-sol. Dispatch /tmp/c4-p06-rereview.md; JSONL/stderr/exit prefix /tmp/c4-p06-rereview; finalresult /tmp/c4-p06-rereview-result.md; session16058. Own newitem review/checkpoint only. Review R1preservedinteractions/evidence and R2accuracy; no redundant unchangedartifactmatrix, no concurrent browser suites. Await finalizedverdict. SecondFAIL -> Muse arbitration per protocol. No landing/publish yet.


## P-06 review FAIL; bounded correction active — 2026-10-15

Sol review2938f95/checkpoint3acf790 of exactfd32c04 is FAIL. Independent six distribution areas PASS, exact-source release-verify10package/6README PASS, sdk206unit/34property/5API/108release PASS. Focused source6pass/2fail: desktop native-newtab click interception/offscreen and mobile showcase wrong explanation. Isolated navigation1pass does not close gate. Report/gotchas overclaim toolchain causal exclusion and isolated evidence. Human mobile-docs waiver honored; no request to fix waived test. Evidence /tmp/p06-review-evidence/review.md and source-browser traces.

Fresh Sonnet correction ACTIVE from3acf790, branch fix/p-06-browser-evidence, worktree /tmp/c4-sdk-p06-fix. Dispatch /tmp/c4-p06-fix.md; JSON/stderr/exit /tmp/c4-p06-fix.*, session9511. Coordinator reserves three tests/browser/{navigation,context,showcase} specs, release report, P06gotchas entry, new P-06-browser-fix local records ONLY. Runtime/source/manifest/lock/release readonly. Bounded evidence-based canvas interaction correction, preserve real click/newtab/focus/history/explanation assertions; no forcedclick/retries/timeout workaround or mobile-docs edits. Tests/docs-only leaves original artifact unchanged. Any product need requires concrete reclaim. After finalized/exited repair fresh cross-family review; second FAIL goes remaining-family arbitration. No landing/publication.


## P-06 final independent review active — 2026-10-15

Fresh Sonnet completed/exited0 at fd32c04 (release-input fb74a91, report74e9639). Clean release-check PASS, source serial Playwright65pass/skip1. Default-parallel candidate failures disclosed; baseline reproduced both navigation failures, not every failure. Mobile-docs explicitly nonblocking per Nick. Retained exact artifact SHA2566b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084 and all logs/screenshots at /tmp/c4-sdk-release-0.1.0.

Fresh Sol independent review ACTIVE at /tmp/c4-sdk-p06-review, branch review/p-06-sol, exact fd32c04. Dispatch /tmp/c4-p06-review.md; output /tmp/c4-p06-review-events.jsonl, .stderr, .exit and /tmp/c4-p06-review-result.md; session15309. Reviewer must assess causality claims and all nonwaived failures, while honoring mobile-docs ruling. Await final committed verdict before landing. Publication prohibited. Builder worktree remains only because coordinator edits to brief/COORDINATION were intentionally left; those rulings are already committed on main, safe to clean after preserving diff.


## Nick's P-06 mobile-docs ruling — 2026-10-15

Nick: "Don't block on mobile docs test but note it." Authoritative ruling: /root/c4-lead-mobile-nonblocking.md. The intermittent mobile component-docs Playwright failure is NON-BLOCKING for P-06, six-area signoff, and readiness. Final P-06 report must explicitly record recurrence across C4-07/C4-10/P-06 and passing isolated reruns. Publication still requires separate explicit authorization. Other browser failures are not waived.

Candidate source fb74a91 passed the clean exact-artifact release-check (SHA-256 6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084). Three source-suite runs had varying failures; baseline 316c4b6 passed 65 with one intended skip. Builder is checking candidate rehearsal again; retain all failed-run evidence. Independent review and landing remain pending.


Build authorized by Nick on 2026-10-12 in `build-kickoff.md`. Root checkpoint: [`STATE.md`](../STATE.md). The lead owns this file; fresh builders own item-local claims/state in isolated worktrees.

The temporary Codex-only staffing instruction ended at 2026-10-13 05:59 UTC, as Nick directed after the reset. Return to plan-assigned paired model seats: Sol/Sonnet (`gpt-6.1-sol` / Claude Sonnet), Astra/Opus (`gpt-6-astra` / Claude Opus), and Luna/Haiku (`gpt-6-luna` / Haiku 5.5+ at high effort). Respect each provider's actual usage budget. Reviews use a new, independent agent at the plan's assigned review tier; every fix/review is also a fresh agent. See mandatory lifecycle in [`AGENTS.md`](../AGENTS.md#fresh-agent-work-lifecycle).

Twin's GitHub Pages workflow is complete: `.github/workflows/pages.yml` landed as `0e32ef9`, first deployment succeeded, and the demo is live at https://nickstrad.github.io/c4-sdk/. It redeploys automatically on every push to `main`. Do not add a duplicate workflow or manually deploy the site.

| Task | Owner | Branch / worktree | Status | Review / landing |
| --- | --- | --- | --- | --- |
| Scaffold | Prior builder | main | Complete | PASS; landed486db29 |
| Protocol correction | Lead | main | Complete | PASSecb2c04; landed967d573 |
| Implementation plan | Planning agent / build lead | plan/c4-react → main | Complete | Payload PASS340baa4; merge PASS3524a26; pushedae1014d |
| C4-01 | c4_01_builder (Sol) | item/c4-01-context /tmp/c4-sdk-c4-01 | Complete | Independent Sol PASS45b7d3e; landed541e41a |
| C4-02 | c4_02_builder (Sol) | item/c4-02-navigation /tmp/c4-sdk-c4-02 | Complete | Independent Sol PASS363a16e; landed0561126 |
| C4-08a | c4_08a_builder (Luna high) | item/c4-08a-sources /tmp/c4-sdk-c4-08a | Complete | Independent Sol PASSc7d65b4; landed9849515 |
| C4-preflight | c4_02_builder (Sol) + lead dependencies | item/c4-preflight /tmp/c4-sdk-preflight | Complete | Independent Sol PASS0c4d865; landedf4f7321 |
| C4-03 | c4_03_builder (Sol) | item/c4-03-components /tmp/c4-sdk-c4-03 | Complete | Independent Sol PASS5bb3750; landed1139a64 |
| C4-04 | c4_04_builder (Astra) | item/c4-04-layout /tmp/c4-sdk-c4-04 | Complete | Independent Astra PASS0b45a9b; pushedfc3d43b |
| C4-09a | c4_09a_builder (Sol) | item/c4-09a-copy-policy /tmp/c4-sdk-c4-09a | Complete | Independent Sol PASS8fce8d4; record5216e93; landed713e5df |

| C4-05 | Astra builder complete; Luna independent review PASS (`9330f58`) | `item/c4-05-dynamic-astra` merged into `main` | Builder commits `18d9545`, `bca3d25`, checkpoint `c8c403e`; 114 unit/hooks, 23 properties, typecheck and dynamic browser 4/4 pass; mobile selector screenshots verified. Baseline zoom timeout reproduced identically at base `c715e1d`, recorded as pre-existing limitation. Merge commit `f27b3811f970445ea92982820793dadceb24a8d6`, state/coord update `14ac790fbd5b32d0aec2466d1c11b0f8405f2362`, pushed to origin/main. | Complete; Pages redeploy is automatic |
| C4-06 | Astra builder complete; Twin-dispatched standalone Muse Wonder Full reviewer PASS | `item/c4-06-deployment`, exact HEAD `be53937187cf8cb3fbe99fd114ee1440f763f2a7` | Implementation `233a698`, indexed knowledge `8ce2ffa`, final checkpoint `be53937`; review record `agent-work/items/C4-06/review.md`; 122 unit/hooks, 25 properties, deployment browser 4/4, layout/dynamic/component 19 pass/1 existing skip; lint/typecheck pass. Four non-blocking nits; no blocking defects. | Merged and pushed; main `11913f0` |
| C4-07 | Sonnet builder complete; fresh Codex Sol review PASS | `item/c4-07-seven-types` exact reviewed HEAD `e6e53c13af0b1596a7ce6ebb80901bdd252db7ae`; landed locally at `a569c36` | Builder `7cd4189` implementation, `84bf5b5` indexed project knowledge, checkpoint `e6e53c1`; review record in `agent-work/items/C4-07/review.md`. Reviewer ran typecheck, 189 unit, 29 properties, lint, targeted production browser 20/20. Broad builder suite caveat preserved: 56 pass, 1 existing skip, 1 unexplained intermittent mobile component-docs failure; isolated reruns pass. | PASS; merged and pushed as part of `bf06843`. Initial mobile framing → C4-10; README reconciliation completed in C4-08. Review record collected; review worktree cleaned |
| C4-08 | Codex Sol builder complete; fresh Claude Sonnet review PASS | `item/c4-08-showcase`, exact reviewed HEAD `e3b33fa1f9da89cb551dd4af492f6e09b792f6e4`; merged with review record as `bdbfd4a` | Builder `398782b` implementation, `e3b33fa` assessment/checkpoint; reviewer record commit `21f91d3` in `agent-work/items/C4-08/review.md`. Independent checks: typecheck/lint, 194 unit, 31 properties, generic/demo production builds, and 12/12 affected desktop/mobile browser tests. Earlier builder failures and one unexplained startup error remain documented; broad browser suite was not rerun. | Fully accepted: Nick signed off human STE review 2026-10-14; draft guidance, not formal certification. Low initial mobile framing/edge clipping → C4-10 |
| C4-09 | REMOVED per Nick, 2026-10-14 | Local main code lineage restored to pre-C4-09 `7ec65a7`. The attempted C4-09 implementation push was cancelled before reaching origin; its implementation never landed. Removal records were pushed later alongside independent C4-10 work; current origin includes no C4-09 copy-consumer implementation. Historical refs retained: `item/c4-09-copy-consumer` at `7042e0b`, `review/c4-09-sonnet` at `d5193e4`. | Copy-consumer hack is abandoned. New path: productionize/publish c4-sdk to npm, then ingest as a loaded module in ts-db. Any interim isolated React copy/build folder is ts-db-owned and should be easy to delete wholesale when module ingestion is ready. No ts-db work dispatched from c4-sdk. | Closed/removed; STATE and implementation plan record replacement direction. C4-10 continues independently. |
| C4-10 | Codex Sol builder; Claude Sonnet independent review; fresh Codex Sol docs repair; fresh Claude Sonnet re-review | Builder `item/c4-10-hardening` HEAD `b15c88f24dc6bbee7dea15e58be740daa2fd2afb`; original NITS review `41cf06a`; docs repair `99142e8`; re-review PASS `2ab4368`; merge `1bd0ca8`; shared status push `4347174` | Builder reported 204 unit/hooks, 34 properties, typecheck/lint/build, production browser 65 pass/1 existing skip, repeat browser 9 pass/3 intended skips; layout target remains unmet at 4.82–5.24s and is stated honestly. Reviewer independently passed 204 unit/hooks, 34 properties, typecheck/lint and focused desktop/mobile browser 16/16. Fixup/re-review resolves stale C4-09 gate and README async-layout/limit copy. Two non-blocking test nits remain: no touch-pan path assertion and publication entry asserts only the first node. Root integration reran 204 unit/hooks, 34 properties, typecheck and production build; large-chunk warning remains. | Fully accepted: Nick signed off human STE review 2026-10-14; draft guidance, not formal certification. Future module-consumer validation remains outside C4-10. |

## P-06 final candidate active — 2026-10-15

P05 landed and pushed through316c4b6 after combined actual release-check PASS. Fresh Sonnet P06 ACTIVE alone at base316c4b6, branch item/p-06-final-candidate, worktree /tmp/c4-sdk-p-06. Dispatch /tmp/c4-p06-build.md; JSON/stderr/exit prefix /tmp/c4-p06-build, session74602. Own exact P06 brief paths only. Version0.1.0, rolldown1.2.14/plugin-dts0.28.8 BEFORE final pack; clean committed-source checkout rehearsal/full matrix/source browsers, notice reconciliation/six-area report. Retain exact final artifacts outside worktree at /tmp/c4-sdk-release-0.1.0 before cleanup. No publish/tag/auth work. Fresh independent Sol review follows final committed output. Browser ports all P06-exclusive. Prior integration artifacts retained /tmp/c4-p04-p05-passed-artifacts; staged integration worktree can be cleaned after evidence retained.

## P-05 landed after full combined PASS — 2026-10-15

P-05 Opusd7183b7 exact Sol PASS8847703/3f0ecee and test-only integration27c909a PASS1d3a384/995ff63 landed at86fa3ea. Combined full make release-check on stagingfc484e0 PASSED:206unit,34property,5API,108release,typecheck/lint; exact package matrix,10package-browser and6README-browser. Actual real README report accepted. Tarball beta preliminary SHA256bfdfaf8c3404e139360d08df07972f33f9e42361d6bc04c034071f98ed704263, sourcefc484e0. Retained evidence/artifact/screenshots copied to /tmp/c4-p04-p05-passed-artifacts, log /tmp/c4-p04-p05-integration-final.log exit0. Earlier failed stale-test run remains documented.

Main merge has no product semantic conflict; completed checkpoints replaced scaffolds. Historical second-review records collected by path fromf258963 without generated-file ancestry. Helper index and knowledge reconciled. Push follows checkpoint; P-06 now authorized ALONE from resulting main:0.1.0, rolldown1.2.14/plugin-dts0.28.8 before final pack, clean rehearsal/full matrix/six-area signoff. No publish.

## Test integration builder completed; review active — 2026-10-15

Fresh Sonnet test-only fix finished/exited0 at27c909a (implementation23fe559), base927740f. Two owned test files only plus item records; current composition sync/behavior checked, legacy behavior retained. Builder make sdk-check PASS206unit/34property/5API/108release,typecheck/lint(two documented warnings). No P04 or release edits.

Fresh Sol review ACTIVE in /tmp/c4-sdk-doc-tests-review, branch review/p-04-doc-tests-sol, exact27c909a; dispatch /tmp/c4-doc-tests-review.md, JSONL/stderr/exit prefix /tmp/c4-doc-tests-review, final /tmp/c4-doc-tests-review-result.md, session15228. Owns item review/checkpoint only. Await PASS then merge into integration/p-04-p-05 and rerun full release-check. Opus guard review already PASS; no guard repair loop. Main P05 still not landed. No publish.

## Combined gate found stale README tests; test-only integration fix active — 2026-10-15

Actual `make release-check` at integration927740f exited2 during sdk-check:202/204source tests pass, two failures in tests/hooks/composition.test.tsx (retired composition-example README marker) and tests/unit/showcase.test.ts (retired exact phrase asynchronous ELK worker). Log `/tmp/c4-p04-p05-integration.log`. P05 Opus Sol PASS remains valid; guards/P04 untouched. No full combined gate success yet.

Separate fresh Sonnet test-only integration builder active at `/tmp/c4-sdk-doc-test-integration`, branch `fix/p-04-doc-test-integration`, base927740f. Owns ONLY those two old test files and new P-04-test-integration brief/claims/STATE. Preserve synchronization/behavior/truthful-contract invariants; no P04 README/examples/tests-readme or release changes. Dispatch `/tmp/c4-doc-test-integration.md`, JSON/stderr/exit prefix `/tmp/c4-doc-test-integration`, session17556. Fresh Sol review after completion. Then integrate fix into staging, rerun combined release-check; land/push only on PASS. This is not another P05 guard correction loop. P06 remains gated, no publish.

## Opus PASS; combined integration gate running — 2026-10-15

Fresh Sol PASS8847703/checkpoint3f0ecee on exact Opusd7183b7, no defects/nits. Independently108release/204unit/34property/5API,264malformed-schema cases, real producer, mutation and closed-guard checks PASS. Nick ruling fulfilled through review; no further repair needed.

Isolated integration/p-04-p-05 created after PASS, worktree `/tmp/c4-sdk-release-integration`, merge927740f combines main84e8a46 and review/p-05-opus-sol. Four add/add conflicts only item STATE/claims scaffolds; kept reviewed completed versions, no product conflict. `npm ci` then `make release-check` running as session49774; log `/tmp/c4-p04-p05-integration.log`, exit `/tmp/c4-p04-p05-integration.exit`. Await exact-artifact package+README gates before landing/push. Main still does not contain P-05. After PASS land integration, reconcile helper index/knowledge, dispatch P-06 alone. No publish.

## Opus completed; single Sol review active — 2026-10-15

Opus finished/exited0 and cleaned worktree. Exact final `d7183b7`, implementation0026e49, base216d7f9. Complete evidence-schema correction only; policy/tests/fixture/one runbook line plus item records. Builder reports108release,204unit,34property,5API,typecheck/lint PASS, real P-04 report/injected verification PASS, original failures rejected, ten mutation checks effective. F2/cli/process/P-04 unchanged. No generated files committed.

Fresh Sol review ACTIVE per Nick ruling in `/tmp/c4-sdk-p-05-opus-review`, branch `review/p-05-opus-sol`, exactd7183b7; brief `/tmp/c4-p05-opus-review.md`, JSONL/stderr/exit prefix `/tmp/c4-p05-opus-review`, final `/tmp/c4-p05-opus-review-result.md`, session65492. Owns only Opus review/checkpoint. Integration branch/worktree still absent and must WAIT for PASS. If FAIL stop and escalate Nick, no further loop. After PASS stage integration with P-04, real combined release-check then land/push, then P-06 final0.1.0 with mandated toolchain bumps/full matrix. No publish.

## Nick human ruling / fresh Opus active — 2026-10-15

Latest instruction `/root/c4-lead-p05-human-ruling.md`: fresh Opus corrects remaining evidence-schema defect; preserve closed F2, no P-04 edits; one fresh Sol exact-commit review. If FAIL, STOP and escalate Nick, no further loop. Integration waits until PASS; no publication. This supersedes prior arbitration stop only to authorize this one Opus attempt.

Prior final Sol review9e1dd9c/checkpoint216d7f9 on7850005 returned FAIL/HUMAN: malformed consumer/screenshots types and empty nested objects accepted. F2 and earlier guards passed. Aborted integration command did NOT execute: no integration branch/worktree exists. Main51c12db before this checkpoint, origin eb3b7a5; P-04 landed, P-05 not landed.

Fresh Opus5.5 headless builder ACTIVE from216d7f9, branch `fix/p-05-opus-human-ruling`, worktree `/tmp/c4-sdk-p-05-opus`. Brief/claims/checkpoint `agent-work/items/P-05-opus/`; dispatch `/tmp/c4-p05-opus-build.md`; JSON/stderr/exit prefix `/tmp/c4-p05-opus-build`, session17338. Owns policy README-validation only, release tests, optional runbook clarification, item records; no cli/process/P-04 changes. Explicit staged files, separate postwork assessment, wait for finalized commits/exited builder before review. Latest gauges: Claude27% weekly/35% current window, Codex54% weekly, Muse last gauge unavailable (successful arbitration completed). Do not confuse prior Sonnet attempts with Opus: this is first Opus product correction.

## Final bounded correction active — 2026-10-15

Muse173f12f upheld second FAIL and allowed exactly one bounded correction + fresh cross-family PASS + combined actual README gate. Further non-PASS returns human. Fresh Sonnet in `/tmp/c4-sdk-p-05-correction`, branch `fix/p-05-arbitrated-correction`, base173f12f, owns narrowly scoped policy/cli/tests/runbook/item records per arbitration. Await completion then fresh Sol review; no landing yet. Root STATE holds dispatch details.

## Arbitration active — 2026-10-15

P-05 repair3e8af96/checkpoint97648b6; second FAILf258963 on intermediate5203fb3 (generated files removed in97648b6, guard code identical). Never merge generated-file ancestry. Fresh Muse Wonder Full Standard-mode adjudication on97648b6 in `/tmp/c4-sdk-p-05-arbitration`, branch `arbitration/p-05-muse`; owns only fixup arbitration records. F1 real README report rejected; F2 post-build symlink causes outside mkdir. Await final disposition before new repair. P-04 pushed, P-06 gated. No publish.

## Current status — 2026-10-15

P-04 PASS f9cd615 exact b2b2a90 landed a65f293; integration typecheck/lint PASS. P-05 FAIL20cbece exact bc33229; fresh Sonnet repair `fix/p-05-release-guards` in `/tmp/c4-sdk-p-05-fixup` from20cbece active. Owns release cli/policy/process/tests/runbook/fixup state; all blockers and actionable notes assigned. Ports4185/4186. Fresh Sol re-review required before05landing; second FAIL escalates Muse.04review ports released. Full combined check then06alone; no publish.

## Current review batch — 2026-10-15

P-04 builder b2b2a90 and P-05 builder bc33229 complete, worktrees cleaned. Fresh independent Sol reviews active on `review/p-04-sol` / `review/p-05-sol`, worktrees `/tmp/c4-sdk-p-04-review` / `/tmp/c4-sdk-p-05-review`. Own review.md/review-STATE.md only; same browser leases. Verdicts pending. Integration order04 then05, full combined check, then serial06. Root STATE has evidence/output paths.

## Current productionization batch — 2026-10-15

P-02 landed at `393c5e9` after exact Sonnet PASS `a0517a3` on `c4722a6`; integration sdk-check PASS and pushed through `a1929e4`. Review worktree cleaned. P-04/P-05 fresh headless Sonnet builders ACTIVE from base `a1929e4` in `/tmp/c4-sdk-p-04` / `/tmp/c4-sdk-p-05`, branches `item/p-04-documented-consumer` / `item/p-05-repeatable-release`. Claims reserved in item briefs: P-04 README/examples/tests-readme, P-05 Makefile/release driver/tests-release/workflow/runbook. Sonnet builders and independent Sol reviewers keep plan middle tier and balance pools. Shared README verifier interface and report shape are frozen in both briefs. Integrate04 then05; P-06 runs alone. Browser leases: P-04 4187/4188, P-05 4185/4186 after P-02 review release. Coordinator owns knowledge/index/status.

## Restart directive — 2026-10-14

P-02 verification is complete at `c4722a6` (`dc20b45` implementation); stale paused row below is historical. Fresh Sonnet exact-commit review runs in `/tmp/c4-sdk-p-02-review-restart`, branch `review/p-02-sonnet-restart`, exclusive browser ports4185/4186; owns P-02 review.md and review-STATE.md only. Review pending. On PASS land/push, then P-04/P-05 concurrently. Final P-06 candidate must use 0.1.0, rolldown1.2.14 and rolldown-plugin-dts0.28.8. npm login is satisfied; npm publish still requires separate explicit authorization.

## Queued batches

Nick approved productionization as the active track on 2026-10-14. The approved work ends at pre-publication readiness; `npm publish` requires Nick present for npm login/2FA. See [`docs/plans/productionization.md`](../docs/plans/productionization.md).

| Productionization | Owner | Branch / worktree | Status | Review / landing |
| --- | --- | --- | --- | --- |
| P-01 public contract | Fresh Codex Sol builder; fresh Claude Sonnet reviewer; fresh Codex Sol identity fixup and wrap repair; two fresh Sonnet reviews | Builder `item/p-01-public-contract` HEAD `5346c383a06d8540d8d2c48c45cd0965f06e3f5b`; original review PASS `f92d8d2`; identity fixup `3454cc8`; first review NITS `3aadf1e`; wrap repair/assessment `78e3e33`/`230fd42`; final exact re-review PASS `68d7915`; integrated at `dbd8875` | Complete, reviewed, local main; awaiting push | Independent checks: 204 unit/hooks, 34 properties, API 5/5, type/structural, lint, builds; builder production-browser 34/34. Package candidate `c4-sdk`/`0.1.0-beta.1`; Nick's 2026-10-12 availability check is relayed evidence only; P-02 revalidates before artifact. Actual publish requires Nick for login/2FA. |
| P-02 SDK package | Fresh Codex Sol verification builder `/root/p02_package_verify`; fresh Claude Sonnet review after cleanup | `item/p-02-sdk-package-verify` / `/tmp/c4-sdk-p-02-verify`, base current main `00bf66a`; product diff transferred from prior fresh worktrees | Paused at dependency install; escalated `npm ci` permission pending; no package tests yet; no publish | Portal self-selector CSS fix is in generated build wiring and was rebuilt once as `d7980de2...edd33f8`, but that artifact's exact consumer/browser results are not established. Fresh builder attempted sandbox `npm ci`, then requested required escalated install permission after it stalled. Prior two builder sessions are paused. |
| P-03 MIT and notices | Fresh Codex Luna high builder; fresh Sonnet review NITS; fresh Luna high repair; fresh Sonnet re-review PASS | Builder branch final `8c0a1f0`; first review NITS `c0f3ab2`; repair/assessment `0656203`/`03515c9`; re-review PASS `e7a9d44`; integrated with reviews at `a42eb03` | Complete on local main; exact packed-inventory reconciliation remains a P-02 acceptance gate | MIT `Nick Strad` inferred from repository identity/authorship, no separate legal-holder attestation; full standard license and notices for provisional 76-package inventory. P-02 must confirm actual tarball files/dependencies/assets before candidate acceptance. |
| P-03 embedded attribution fixup | Fresh Luna corrections and two fresh Claude Sonnet reviews | `fix/p-03-minpath-final` and `fix/p-03-evidence-path`; integrated with reviews at `9dff476` | Complete locally; exact pack reconciliation remains P-02-owned | Embedded minpath MIT notices and restored `character-entities@2.0.2`; 76-row provisional inventory. Reviews `ba77093` and `3309ff6`. Earlier inventory SHA `88f62f...` is superseded by CSS-inclusive inventory SHA `b1613ddd...`; row count remains 76. |

B: C4-02 +08a after01. C:03 +Astra04 +09a after02 with contract/dependency preflight. D:05→06→07. Wave E C4-08 is complete and fully accepted; C4-09 has been removed by Nick. C4-10 is reviewed, merged/pushed and fully accepted without a C4-09 gate. Current SDK-side active track is productionization for later npm module ingestion by ts-db; any interim isolated source copy/build is ts-db-owned. Future module-consumer acceptance remains an explicit follow-up. Integrate03→04→09a. Root grants browser-port leases and owns existing context/navigation regression specs.

Common-dir event publication failed read-only filesystem; skipped under Nick’s existing exception. This table and item checkpoints are the current status record; no event was fabricated.
