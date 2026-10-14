# P-01 path claims

Builder: fresh Codex Sol agent, assigned after this claim pack is committed. Reviewer: fresh independent Claude Sonnet after builder completion. Coordinator owns integration, root STATE/COORDINATION, plan, and any shared-file conflict resolution.

## Owns

- `src/index.ts`, optional `src/public/**`
- `src/core/index.ts`, optional `src/core/public/**`
- `docs/api/public-api.md`
- `docs/api/support-matrix.md`
- `tests/api/public-api.test.ts`, optional structural fixtures under `tests/api/**`
- `agent-work/items/P-01/STATE.md`

## Read-only

All other paths, especially `package.json`, lockfiles, Vite/Vitest/Playwright configuration, CI/workflows, root README, `docs/plans/**`, `STATE.md`, `agent-work/COORDINATION.md`, shared knowledge pages/index, and all existing source behavior outside a minimal export-facade adjustment.

## Coordination

No active productionization item may overlap these paths. Report any necessary ownership expansion to the coordinator before editing. Implementation and knowledge/script follow-up are separate commits. Builder does not merge or push. Review the exact final builder commit from a new cross-family worktree.
