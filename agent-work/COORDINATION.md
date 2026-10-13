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

| C4-05 | Fresh builder pending assignment (Sol/Sonnet) | item/c4-05-dynamic; successor receives a new worktree | Transfer in progress; previous builder reached its seat limit, source changes remain uncommitted; no stale Playwright process remains | Production browser verification and commit pending; then new independent review |

## Queued batches

B: C4-02 +08a after01. C:03 +Astra04 +09a after02 with contract/dependency preflight. D:05→06→07. E:08+09. F:10. Exact claims and integration order follow the plan. Batch C active from3ea5789 after reviewed preflight. Integrate03→04→09a. Root grants the shared browser-port lease and owns existing context/navigation regression specs.

Common-dir event publication failed read-only filesystem; skipped under Nick’s existing exception. This table and item checkpoints are the current status record; no event was fabricated.
