# P-05 checkpoint — repeatable release

Goal/ownership/acceptance: [brief.md](brief.md), [claims.md](claims.md). Latest direction: finish prepublication release productionization; never publish; 0.1.0/toolchain bumps are P-06's; P-04 README verifier not yet integrated.

## Status (2026-10-15): implementation complete, awaiting independent Sol review

- Branch `item/p-05-repeatable-release`, worktree `/tmp/c4-sdk-p-05`, exact base `a1929e4`.
- Implementation commits: `ab9f347` (Makefile, driver, tests), `b00ffea` (CI workflow, runbook). Evidence/claims commit and knowledge/script assessment commit are recorded below by their own SHAs (see `git log`).
- Builder: fresh Claude Sonnet 5.5 (paired middle tier); no delegation.

## What exists

- `Makefile`: default `help`; `sdk-check`, `sdk-build`, `release-pack`, `release-verify`, `release-check`, `release-publish`; operator inputs exported via environment, never interpolated into shell.
- `work-scripts/node/release/policy.mjs` (pure validators), `process.mjs` (filesystem/process/tar adapter), `cli.mjs` (orchestration with injectable `io`; only the three pre-registered filenames used).
- `tests/release/` (79 tests: unit + fast-check, real-tar inspection, mocked publication) with `tests/release/vitest.config.ts`; `make sdk-check` runs them after `npm run sdk:check`.
- `.github/workflows/release-check.yml` (same `make release-check`, Node 22.23.2, no publish/tag/push); `docs/release/runbook.md`.

## Validation evidence

- `make sdk-check`: pass (typecheck, lint, unit, property, API 5/5, release 79/79), Node 22.23.2 / npm 10.9.8.
- `make release-pack` on clean tree: one build, one `npm pack --ignore-scripts`; tarball sha256 `d7980de2c97d008e41c5ce6592eadfffea7eed36d3d8c4f6c214d0595edd33f8` for `c4-sdk-0.1.0-beta.1.tgz`, identical to the independently reproduced P-02 preliminary hash (build is deterministic).
- `make release-verify TARBALL=…`: real P-02 consumer matrix + packaged browser 10/10 (ports 4185/4186) passed against the exact tarball. With **no** `tests/readme/verify.mjs` it fails closed at the README stage and writes `passed:false`. With a temporary uncommitted mock P-04 verifier it passed all four stages; mock removed. `release-publish` then refused `latest` for the prerelease before any npm call.
- Real tamper rehearsal: appending bytes to a copy → rejected (hash/size/inventory); recursion env → refused; wrong confirmation → refused.
- No publication, tag, push, merge, credential or manifest/lock change occurred. Publication code is exercised only through injected `io`.

## Limitations / handoff for coordinator

- **Combined release-check is NOT claimed**: P-04's `tests/readme/verify.mjs` was unavailable. After integrating 04 then 05, run `make release-check` and confirm the README stage and `README_REPORT` shape (`passed`, `sha256`, `version`, `evidence` or `evidenceLocations` non-empty). Ports 4187/4188 were not started here.
- `.gitignore` is outside Owns: add `/artifacts/` (default output `artifacts/release/`). Until then `git status` shows `artifacts/` untracked; the driver excludes it, `dist-sdk` and `.sdk-types` from its dirty check.
- Driver enforces Node == `engines.node` exactly (P-06 must keep engines and CI Node in step when bumping).
- `release-publish` checks `npm view <name>@<version>` (network) and needs operator login/2FA; not exercised against a real registry by design.
- Evidence `dirty` is the pre-build source state; builds that modify tracked files fail pack unless `ALLOW_DIRTY=1`.
- Inspection reads the tarball with GNU `tar -tvzf`; other tar implementations' listing formats are untested.
- The P-02 verifier's consumer path is parsed from its stdout (`"consumer"` key) and then `report.json` is read; a change to that output shape fails closed.

## Next

Fresh Codex Sol independent review of the exact final builder commit; then coordinator integrates after P-04 and reruns combined `make release-check`.

## Knowledge and script assessment (2026-10-15)

Durable lessons exist but `docs/knowledge/` and `work-scripts/INDEX.md` are outside this item's claims; proposals for the coordinator to place:

- **gotchas.md**: (1) `sdk-build.mjs` is deterministic — rebuilding the same commit reproduced the P-02 preliminary tarball hash `d7980de2…`, so hash drift means a source/toolchain change. (2) `dist-sdk/` and `.sdk-types/` are not gitignored; any "clean tree" check must exclude generated output (the driver does). (3) The P-02 verifier prints its consumer location only in its JSON stdout; the release driver depends on that shape. (4) Verify and publish are bound by two sidecars (`.evidence.json`, `.verify.json`); a stale pass is deleted before each run.
- **decisions.md**: publication requires explicit TAG, https REGISTRY and `CONFIRM="publish <name>@<version> <sha12>"`; prerelease versions can never use `latest`; driver never rebuilds on publish failure.
- **work-scripts/INDEX.md rows** (replace the P-05 reservation table): `node/release/cli.mjs` (Makefile dispatcher; `node work-scripts/node/release/cli.mjs <sdk-check|sdk-build|pack|verify|check|publish>`), `node/release/policy.mjs` (pure validators; imported by tests/release), `node/release/process.mjs` (fs/process/tar adapter; imported by cli and tests). Dated 2026-10-15, author P-05, notes: Node 22.23.2, GNU tar, no network except `publish`.
- No additional helper filenames were needed; no one-off command was turned into a script.
