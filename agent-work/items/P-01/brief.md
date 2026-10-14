# P-01 — Freeze the supported public API

## Goal

Inspect the landed C4-01–10 implementation and define the smallest legitimate SDK surface for the approved productionization track. Freeze exact names, signatures, data ownership, compatibility boundaries and supported runtime/tool matrix before any package/build/release work begins.

## Permission profile

Repository-only read/write in this worktree. No network access, registry calls, publication, Git push, or edits outside the Owns paths. This item may edit product source only where required to create a deliberate public facade; do not change application behavior or packaging/build configuration.

## Owns

- `src/index.ts` and any new public-facade source module under `src/public/` (create if useful).
- `src/core/index.ts` and any new core facade module under `src/core/public/` (create if useful).
- `docs/api/public-api.md`.
- `docs/api/support-matrix.md`.
- `tests/api/public-api.test.ts` and any narrowly scoped structural API fixture under `tests/api/`.
- `agent-work/items/P-01/STATE.md` for implementation/evidence/handoff updates.

If the existing path layout makes this ownership unsuitable, stop before editing and record a specific coordination request in the item checkpoint.

## Reads

- `STATE.md`, `agent-work/COORDINATION.md`, `agent-work/event-log.md`, repository `AGENTS.md`/`CLAUDE.md`.
- `docs/plans/productionization.md`, especially sections 1–3, 5–6 and P-01 acceptance.
- `docs/api/README.md`, `docs/api/acceptance.md`, root README and all public-facing source/types/tests.
- `docs/knowledge/index.md` and relevant knowledge pages; `work-scripts/INDEX.md`.

## Acceptance

- Freeze public root and core exports from the code actually landed, with explicit exclusions for implementation internals.
- Document symbol signatures, controlled state/callbacks, ports, errors/diagnostics, decode boundary, lifecycle/disposal, immutable-data expectations, schema policy and SemVer compatibility rules.
- Record tested Node, React, TypeScript and bundler support targets as evidence-backed proposals for P-02 to exercise; label unverified versions clearly. Do not invent support guarantees.
- Record package identity/version recommendation and evidence. `c4-sdk` was reported available on 2026-10-12; do not make new registry queries in this item.
- Add a stable API snapshot/contract test that fails on accidental additions or removals and structural type tests that do not mirror implementation details.
- Existing consumer behavior remains unchanged; if a facade move risks behavior, run targeted unit and browser regressions.
- Run relevant unit/property tests, typecheck and lint; run viewer Playwright regression if behavior or imported public entries change.
- Assess the finished diff for durable `docs/knowledge/` material and reusable `work-scripts/`; if useful, add/index and commit those separately. If none, explain why in STATE.
- Commit implementation/evidence and knowledge/scripts assessment separately where applicable. Update item STATE with exact commits, tests, outcome and next gate. Clean this worktree after commits; coordinator retains the branch for independent review.

## Explicit exclusions

No package manifest/lockfile, bundler configuration, generated package output, release driver, README rewrite, LICENSE/notices, CI changes, registry access or publication. P-01 runs alone; P-02/P-03 wait for its reviewed contract to land.
