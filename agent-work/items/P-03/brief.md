# P-03 — MIT license and third-party notices

## Goal

Add the project's MIT license and accurate third-party/original-asset notices for the productionization candidate. Do not implement packaging, UI, release tooling or publish.

## Permission profile

Repository-only read/write in the P-03 Owns paths. No network, registry access, publication, Git push or merge.

## Owns

- `LICENSE`
- `THIRD_PARTY_NOTICES.md`
- `docs/release/licenses.md`
- P-03 item checkpoint only.

Root package license metadata belongs to P-02 and is read-only here. Coordinate evidence of exact bundled assets/dependencies with P-02; do not edit their files.

## Reads

Repository `AGENTS.md`/`CLAUDE.md`, root `STATE.md`, `agent-work/COORDINATION.md`, productionization plan, P-01 API/support contract, source/assets/attribution and dependency inventory, P-02 checkpoint/claims.

## Acceptance

- Add complete standard MIT text with verified actual copyright holder and correct year; no template placeholders.
- Inventory actual bundled dependencies and original assets and their required notices/attributions. Distinguish project license from third-party content; do not claim the Cursor article or external artwork is relicensed.
- Reconcile proposed notice inventory with P-02's actual package output. Document evidence sources and any material uncertainty; do not invent bundled content.
- Add direct validation appropriate to the license/notices, inspect exact text/links, and run `git diff --check`; no artificial UI tests.
- Assess finished work for durable project knowledge and reusable scripts/info; commit implementation, then justified knowledge/scripts separately. Update STATE and clean the worktree after commits.

## Explicit exclusions

No `package.json`, lockfiles, app/source/build/test configuration, UI, README, Makefile/release driver/CI, shared knowledge/index, root STATE/COORDINATION, merge, push, registry access or publication. Coordinate with P-02 if evidence shows the actual bundled dependency/asset inventory differs from current assumptions.
