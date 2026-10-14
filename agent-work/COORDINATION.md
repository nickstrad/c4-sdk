# Work coordination

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
| C4-07 | Sonnet builder complete; fresh Codex Sol review PASS | `item/c4-07-seven-types` exact reviewed HEAD `e6e53c13af0b1596a7ce6ebb80901bdd252db7ae`; landed locally at `a569c36` | Builder `7cd4189` implementation, `84bf5b5` indexed project knowledge, checkpoint `e6e53c1`; review record in `agent-work/items/C4-07/review.md`. Reviewer ran typecheck, 189 unit, 29 properties, lint, targeted production browser 20/20. Broad builder suite caveat preserved: 56 pass, 1 existing skip, 1 unexplained intermittent mobile component-docs failure; isolated reruns pass. | PASS; merged and pushed as part of `bf06843`. Initial mobile framing → C4-10; README reconciliation → C4-08. Review task is waiting approval after report; its worktree remains retained |
| C4-08 | Fresh Codex Sol builder assigned; dispatch preparing | `item/c4-08-showcase` / `/tmp/c4-sdk-c4-08`, exact base to be recorded at worktree creation | C4-07 PASS releases Wave E. Claims-prep commit creates `agent-work/items/C4-08/{brief,claims,review,STATE}.md`. Includes demo showcase plus the bounded root `README.md` reconciliation. Fresh Claude Sonnet independent review after build; C4-09 follows integration. | Ready; not yet editing |

## Queued batches

B: C4-02 +08a after01. C:03 +Astra04 +09a after02 with contract/dependency preflight. D:05→06→07. Per Nick's 2026-10-13 lead verdict, Wave E proceeds serially: C4-08 showcase, then C4-09 ts-db consumption. C4-08 explicitly takes the README reconciliation follow-up; C4-07 mobile framing remains for C4-10 with viewport-based focused/Fit checks. F:10. Exact claims and integration order follow the plan. Batch C active from3ea5789 after reviewed preflight. Integrate03→04→09a. Root grants the shared browser-port lease and owns existing context/navigation regression specs.

Common-dir event publication failed read-only filesystem; skipped under Nick’s existing exception. This table and item checkpoints are the current status record; no event was fabricated.
