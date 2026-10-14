# P-05 — Repeatable release

Status: prepared; dispatch gated on P-02 independent PASS and landing.
Branch: `item/p-05-repeatable-release`; worktree `/tmp/c4-sdk-p-05`. Exact base recorded at dispatch.

## Goal and acceptance

Implement productionization section4 targets: sdk-check, sdk-build, release-pack, release-verify, release-check, separate explicit release-publish. Default make checks/help only. Build once, pack once into designated artifacts directory; bind artifact SHA256/version/source SHA/inventory to evidence. Verify exact tarball externally (P-02 matrix+browser, P-04 interface), no source alias/link/workspace resolution. Reject missing evidence, tampering/hash/version/inventory mismatch, unapproved exports, unresolved declarations. Publication must only consume already verified exact artifact, explicit tag/registry, no rebuild; test via process injection or dry mock, NEVER run real publication. Protect against lifecycle recursion and arbitrary destructive cleanup. Pure logic in own modules with meaningful unit and fast-check failure-path invariants. Dedicated test config under tests/release because root config is read-only. CI uses same Makefile commands; do not modify Pages workflow. Runbook records exact tested tools and auth/2FA operator gate, no credentials. Final candidate six-area report/changelog belongs P-06. Work-script helper filenames are pre-registered by lead as cli.mjs, policy.mjs, process.mjs; use these or ask for index reservation of concrete additional filenames. No package script/dependency additions. Record limits honestly if P-04 not yet available.

## Owns

- `Makefile`
- `work-scripts/node/release/**`
- `tests/release/**`
- `.github/workflows/release-check.yml`
- `docs/release/runbook.md`
- `agent-work/items/P-05/STATE.md`
- `agent-work/items/P-05/claims.md`

## Reads

All repository inputs outside Owns; especially frozen P-01 contract, landed P-02 tests/build and P-03 notices.

## Protocol and permissions

Fresh Sol/Sonnet builder in its own assigned worktree, independent cross-family review afterward. Read root/item STATE, AGENTS.md, CLAUDE.md, COORDINATION, productionization plan, knowledge index, event log and work-scripts index before editing. Update claims before edits. Repository changes only within Owns; dependency installs and local builds/browser tests authorized. No publish, tag, merge, push, credential change or ts-db changes. Commit implementation/evidence, then a separate knowledge/script assessment checkpoint (knowledge path additions need coordinator reservation). Keep root STATE/coordination/index read-only. Clean your worktree after commits are durable. Existing event skip exception applies.

Final candidate will be 0.1.0 with rolldown1.2.14/plugin-dts0.28.8 in serial P-06. Do not change manifest/lock here. Preliminary beta artifacts are valid inputs for this item's tests but are not release candidates. npm login is satisfied; publication remains separately gated.

## Shared P-04/P-05 interface

P-04 provides `node tests/readme/verify.mjs <absolute-tarball-path>`. This command checks snippet synchronization, compiles ESM/CJS/TSX and runs the complete README production browser example against that exact installed tarball in a clean temporary consumer. It fails nonzero on any mismatch; writes a JSON report at the path in `README_REPORT` when supplied, with `sha256`, `version`, `passed: true`, and evidence locations. It never rebuilds or packs. Ports4187/4188 reserved for README tests. P-05 invokes this exact command with README_REPORT; missing command or report is failure in final release verification. P-05 may use temporary test fixtures for its own pre-integration tests but must not claim combined release-check success before P-04 lands. P-02 package browsers use4185/4186; coordinate leases with lead. Do not alter other item's files. Integrate P-04 before P-05, then combined check.
