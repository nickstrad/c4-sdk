# P-04 — Documented consumer

Status: prepared; dispatch gated on P-02 independent PASS and landing.
Branch: `item/p-04-documented-consumer`; worktree `/tmp/c4-sdk-p-04`. Exact base recorded at dispatch.

## Goal and acceptance

Replace README with complete executable consumer guidance for the actual public API. Follow productionization section5 in full: all seven types, exact exercised support versions, install/peers, complete runnable valid JSON/decode/error/viewer/CSS quick start; legend/detail-navigation/docs/STE examples; ESM/CJS; worker Vite and static subpath recipes; API/demo/test/release links; MIT, limitations/schema evolution and contribution/bugs. No claim that npm publication has happened. Keep snippets extracted from or checked against executable examples; no necessary code ellipses. All fixture SDK imports must use public package paths. Validate exact tarball externally, strict declarations and intentional misuse where relevant, full browser example with inspected desktop/mobile screenshots. Render README and inspect links. Record actual commands, hashes and results. No root runner changes; use a dedicated config under tests/readme. Existing package tarball may be repacked after README edits for preliminary proof; final docs must be inside tested tarball. Interface above mandatory.

## Owns

- `README.md`
- `examples/readme/**`
- `tests/readme/**`
- `agent-work/items/P-04/STATE.md`
- `agent-work/items/P-04/claims.md`

## Reads

All repository inputs outside Owns; especially frozen P-01 contract, landed P-02 tests/build and P-03 notices.

## Protocol and permissions

Fresh Sol/Sonnet builder in its own assigned worktree, independent cross-family review afterward. Read root/item STATE, AGENTS.md, CLAUDE.md, COORDINATION, productionization plan, knowledge index, event log and work-scripts index before editing. Update claims before edits. Repository changes only within Owns; dependency installs and local builds/browser tests authorized. No publish, tag, merge, push, credential change or ts-db changes. Commit implementation/evidence, then a separate knowledge/script assessment checkpoint (knowledge path additions need coordinator reservation). Keep root STATE/coordination/index read-only. Clean your worktree after commits are durable. Existing event skip exception applies.

Final candidate will be 0.1.0 with rolldown1.2.14/plugin-dts0.28.8 in serial P-06. Do not change manifest/lock here. Preliminary beta artifacts are valid inputs for this item's tests but are not release candidates. npm login is satisfied; publication remains separately gated.

## Shared P-04/P-05 interface

P-04 provides `node tests/readme/verify.mjs <absolute-tarball-path>`. This command checks snippet synchronization, compiles ESM/CJS/TSX and runs the complete README production browser example against that exact installed tarball in a clean temporary consumer. It fails nonzero on any mismatch; writes a JSON report at the path in `README_REPORT` when supplied, with `sha256`, `version`, `passed: true`, and evidence locations. It never rebuilds or packs. Ports4187/4188 reserved for README tests. P-05 invokes this exact command with README_REPORT; missing command or report is failure in final release verification. P-05 may use temporary test fixtures for its own pre-integration tests but must not claim combined release-check success before P-04 lands. P-02 package browsers use4185/4186; coordinate leases with lead. Do not alter other item's files. Integrate P-04 before P-05, then combined check.
