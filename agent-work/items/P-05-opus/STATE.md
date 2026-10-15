# P-05 Opus checkpoint

Prepared for Nick-authorized fresh Opus correction from 216d7f9. See [brief](brief.md)/[claims](claims.md). One fresh Sol review then PASS-gated integration, FAIL returns Nick. Never publish.

## Status (2026-10-15): implementation committed; awaiting one fresh Sol exact-commit review

- Builder: fresh Claude Opus 5.5, no delegation. Branch `fix/p-05-opus-human-ruling`, worktree `/tmp/c4-sdk-p-05-opus`, base `216d7f9`.
- Implementation commit: `0026e49` (`policy.mjs` README validation only, `tests/release/{policy,cli}.test.mjs`, new `tests/release/fixtures/p04-readme-report.json`, one runbook bullet). This checkpoint commit follows it; the final HEAD is the commit that contains this file.
- Read before editing: [human ruling](/root/c4-lead-p05-human-ruling.md), [arbitration](../P-05-fixup/arbitration.md), [final review](../P-05-correction/review.md) and its checkpoint, correction brief/STATE, AGENTS/CLAUDE, knowledge index, event log, real report `/tmp/p04-review-evidence/report.json` and main's `tests/readme/verify.mjs` producer (`evidence: { consumer, output: { esm, cjs }, screenshots }`).

## Contract implemented (`checkReadmeReport` → `evidenceErrors`/`scanLocations`)

- A location is a non-whitespace string. Arrays and plain objects must be nonempty at every depth; every other value (number, boolean, null, non-plain object) is malformed.
- Designated fields are typed wherever they appear among locations, in either field: `consumer` one location; `screenshots` a nonempty flat array of locations.
- Only the top-level `output` of `evidence` is execution evidence: it must be a nonempty object or array, its contents are not inspected, and it never counts as a location. Nested `output` keys and `evidenceLocations.output` are ordinary locations.
- `evidence` and `evidenceLocations` are each validated when present (`undefined` = absent; `null` present and malformed). Any malformed node in either rejects; together they must name at least one location. Neither present → reject.
- Errors keep the `evidence locations` wording and name every bad path (e.g. `evidence.screenshots must be a nonempty array of nonempty strings`). Identity checks (`passed === true`, sha256, version) unchanged.

## Evidence

- Reproduced on base 216d7f9 (`node /tmp/p05-opus-scratch/repro.mjs <checkout>`): all 7 final-review cases accepted (`malformed accepted: 7/7`); after the fix `0/7`, each with a path-specific reason. Real report (`/tmp/p04-review-evidence/report.json`, file sha256 `674e87e3…c2fb`, tarball sha256 `bfdfaf8c…04263`, version `0.1.0-beta.1`) returns `[]` directly; committed verbatim as the fixture.
- New tests: policy +12 (fixture with own identity, final-review reproductions, designated-type matrix beside siblings/in producer shape/nested/in `evidenceLocations`, empty nested containers beside valid locations, output scoping, both-field union, plain-object/odd-key reporting; five fast-check properties: generated valid trees accepted in either/both fields, any single generated defect anywhere outside output rejects whatever the companion, designated fields reject every JSON value outside their type, output contents never change the verdict nor count as a location, identity independent of evidence). cli +1: real fixture evidence passes `releaseVerify` README stage with injected IO; screenshots string, consumer array and empty extra object fail the stage with `readme: failed`.
- Mutation check (scratch, restored): original 216d7f9 validator fails 8/53 policy tests; removing designated typing 3, accepting nested screenshots 3, dropping empty-object check 4, empty-array check 3, output container check 1, exempting `output` at any depth 1, exempting `evidenceLocations.output` 1, fallback-only evaluation 8, accepting whitespace 5, accepting non-plain objects 1. Restored: 53/53.
- `npm ci --prefer-offline --no-audit --no-fund` ok (543 packages), Node v22.23.2 / npm 10.9.8. `make sdk-check` (subprocess permissions, no sandbox failures) exit 0: typecheck ok; lint only the inherited `src/components/ui/button.tsx:57:18 react(only-export-components)` warning; unit/hooks 204/204; properties 34/34; API 5/5; release 108/108 (95 previous + 13 new; all six realfs tests incl. F2 pass). Log `/tmp/p05-opus-sdk-check.log`, install `/tmp/p05-opus-install.log`.
- `git diff --check` clean; no tracked `dist-sdk/**` or `artifacts/**`; F2/`cli.mjs`/`process.mjs`/P-04 unchanged (`git diff 216d7f9 -- work-scripts/node/release/cli.mjs work-scripts/node/release/process.mjs tests/readme` empty).
- Not claimed: the real combined `release-verify`/`release-check` with actual `tests/readme/verify.mjs` and tarball is coordinator-owned after integration. No pack/browser/registry/publish/tag/push/merge/auth.

## Knowledge and script assessment

- Durable lesson for the coordinator to record in `docs/knowledge/gotchas.md` (coordinator-owned; not in this item's Owns): validate structured evidence against its full field schema by generating valid trees and injecting single defects at every node, not only enumerated example shapes. Generic recursive "location-shaped" checks miss mistyped designated fields and empty containers beside valid siblings. Evidence: this STATE and [final review](../P-05-correction/review.md).
- No reusable script warranted: the repro and mutation loops are one-off scratch work (`/tmp/p05-opus-scratch/`); the regressions live in the release suite.

## Next

- One fresh Codex Sol cross-family review of the exact final HEAD. PASS → coordinator `integration/p-04-p-05` and combined real release-check; FAIL → stop and escalate to Nick, no further loop. P-06 follows the combined gate. `npm publish` remains a human gate.
- Builder removes its own worktree after the commits are durable; the branch is kept.
