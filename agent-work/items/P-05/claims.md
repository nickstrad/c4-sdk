# P-05 claims

Status: implemented, awaiting independent review. Fresh Sonnet builder, exact base `a1929e4`, branch `item/p-05-repeatable-release`, worktree `/tmp/c4-sdk-p-05`. Files touched: only the Owns paths below.

## Owns

- `Makefile`
- `work-scripts/node/release/**` (pre-registered `cli.mjs`, `policy.mjs`, `process.mjs` only; no additional helper filenames)
- `tests/release/**`
- `.github/workflows/release-check.yml`
- `docs/release/runbook.md`
- `agent-work/items/P-05/STATE.md`
- `agent-work/items/P-05/claims.md`

All other paths read-only (no manifest/lock, root runner, `.gitignore`, work-scripts index, knowledge index or Pages workflow edits). Coordinator owns shared indexes, STATE and COORDINATION. No overlap between P-04 and P-05.

## Scope notes

- Consumes P-02 `tests/package/verify.mjs` + `tests/package/playwright.config.ts` (ports 4185/4186) and P-04 `tests/readme/verify.mjs` (ports 4187/4188, not started here) unchanged.
- Artifact output defaults to `artifacts/release/<version>-<sha12>/` (outside Owns for ignore rules: lead should add `/artifacts/` to `.gitignore`).
