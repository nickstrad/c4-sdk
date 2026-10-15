# P-05 Opus correction — Nick human ruling

Authorized by Nick via /root/c4-lead-p05-human-ruling.md (2026-10-14 ~21:28 CDT). Fresh Opus builder, exact base216d7f9, branch fix/p-05-opus-human-ruling, worktree /tmp/c4-sdk-p-05-opus. Prior builder7850005 failed final review9e1dd9c/checkpoint216d7f9. Muse173f12f arbitration otherwise remains binding. Opus has not previously attempted the correction; Wonder Full adjudicated only.

Goal: fully enforce the README evidence contract, not merely the earlier enumerated examples. Validate every present location field, with consumer a nonempty string and screenshots a nonempty flat array of nonempty strings, reject empty nested objects even beside valid locations, and preserve mixed execution-output compatibility. See final review and full arbitration for exact semantics of evidence plus evidenceLocations and output-only evidence with valid companion locations. Read real P-04 report /tmp/p04-review-evidence/report.json and actual landed producer at main tests/readme/verify.mjs. Do not change P-04 or stringify/remove its execution evidence. F2 is closed; preserve its implementation unchanged.

## Owns

- work-scripts/node/release/policy.mjs (README report/evidence validation only)
- tests/release/** (focused contract regressions and meaningful property tests)
- docs/release/runbook.md only if semantics need clarification
- agent-work/items/P-05-opus/brief.md, claims.md, STATE.md

All other paths read-only, including cli.mjs/process.mjs, P-04 files, manifest/lock, product, Makefile/CI, original reviews/arbitration, shared STATE/COORDINATION/knowledge indexes. No delegation. Auto permission profile, local installs/build/tests and owned commits authorized. No publish/tag/push/merge/auth; no paid API or cap bypass. Event skip authorized.

## Acceptance

Read root/item state, instructions, knowledge/event indexes and original/final reviews before edits. Update claims first. Derive tests from the complete field schema: malformed designated types, nested empty objects beside valid siblings, multiple present evidence fields, nesting/arrays, real mixed producer output, all arbitration accept/reject and identity cases. Meaningful fast-check coverage must check contract invariants beyond copying validator logic. Reproduce all final-review failures then prove rejection; real P-04 report and injected releaseVerify must pass. Keep all previous cleanup/provenance/declaration/digest regression checks passing. Run full release tests and make sdk-check with subprocess permissions; report warnings exactly. No generated files committed, git diff --check clean, explicit staging only.

Commit implementation/evidence first; separate knowledge/script assessment and checkpoint with exact final SHA. Wait to announce final HEAD until all commits final. Cleanup own worktree after durability; coordinator may remove it if necessary. Fresh Sol exact-commit re-review once; if FAIL stop and escalate Nick, no further repair loop. integration/p-04-p-05 must wait until PASS, then combined real release-check. P-06 remains next after combined gate, final0.1.0/toolchain bump; no npm publish.
