# P-02 — Installable SDK package

## Goal

Implement the installable `c4-sdk` package candidate against the frozen P-01 contract. Build ESM and CJS, bundled declarations, CSS and worker assets, and validate the exact packed tarball in real clean consumers. Do not publish or tag.

## Permission profile

Repository-only changes in the P-02 Owns paths. One read-only npm registry availability query for `c4-sdk` is authorized and required before creating the package artifact. Do not log in, write to the registry, publish, or add credentials. Do not push or merge.

## Owns

- Root `package.json` and package lockfile, including license field and package metadata/exports.
- Library build and declaration configuration/scripts and SDK generated-output wiring.
- `tests/package/**` including consumer fixtures and packaged browser tests.
- P-02 item checkpoint only.

P-03 owns `LICENSE`, `THIRD_PARTY_NOTICES.md`, and `docs/release/licenses.md`; do not edit them. Root README, Makefile/release driver/work-scripts/CI, shared `STATE.md` and COORDINATION are also read-only. Keep planned notice paths in the allowlist, and coordinate with the lead if P-03 files are not yet landed when validating the final package.

## Reads

Repository `AGENTS.md`/`CLAUDE.md`, root `STATE.md`, `agent-work/COORDINATION.md`, `docs/plans/productionization.md`, P-01 brief/claims/STATE/review records, API docs, package/build configs and current work-scripts index.

## Acceptance

- Verify current `c4-sdk` registry availability before making the package artifact; record exact command/result/date. A prior availability report does not replace this check. Stop and report if unavailable; do not choose a new name.
- Implement dual ESM/CJS JS and declarations for the frozen root/core surfaces, externalizing React peers and preserving shared context identity across mixed module systems.
- Ship CSS and worker public assets with no source-relative or repo-root escapes; support worker host override, lazy creation, cleanup, non-root base path, failure/fallback and cancellation.
- Add clean package consumer fixtures under `tests/package/`: ESM, CJS, `.mts`, `.cts`, bundler TSX with strict declarations, all public paths, and mixed-context interoperability. Include build/test coverage for public API runtime discovery so P-01 tests are included in SDK checks/CI without touching the root runner config outside claims.
- Build once, inspect actual `npm pack --json` inventory, and install/test that exact tarball in isolated consumers outside the source checkout; capture tarball hash and source SHA. No registry writes. Exclude repository-only files and include planned license/notice paths.
- Validate all seven fixture types in production browser consumer; test CSS/worker subpaths, keyboard/focus, worker startup/disposal, no console errors and screenshots, including a CJS-based browser fixture. Record actual tested Node/React/TS/bundler versions without expanding support promises beyond exercised targets.
- Preserve existing app/demo builds and copied-consumer behavior. Run package/module/type/browser checks, relevant unit/property/typecheck/lint and production regressions.
- Assess finished work for project knowledge and reusable scripts/info; commit work first, then any justified knowledge/scripts changes separately. Update STATE with exact evidence and cleanup this worktree after commits.

## Explicit exclusions

No root README, examples, MIT text/notices, Makefile, release driver/runbook, CI workflow, shared knowledge/index, shared project STATE/COORDINATION, push, merge, npm publish, tagging, or ts-db changes. Actual publication requires Nick present for login/2FA.
