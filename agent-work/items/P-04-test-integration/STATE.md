# P-04 test integration checkpoint

Status 2026-10-15: implementation committed (`23fe559`); awaiting fresh cross-family review. Branch `fix/p-04-doc-test-integration`, base `927740f`. See [brief](brief.md) / [claims](claims.md).

## Replacement
- `tests/hooks/composition.test.tsx`: the old `<!-- composition-example -->` README test is split into (1) the retained ShopWorkspace behavior check (code diagram kind and explanation synchronized through one provider), (2) README snippet marked `examples/readme/compose.tsx` byte-equals that file, (3) the executable public-import example is run unchanged except specifiers resolved to repo facades (`src/index.ts`, `src/core/index.ts`) and ELK worker replaced by fixed layout; asserts heading, documentation, STE toggle, drill-down and Go up stay synchronized through one provider. The copy lives in git-ignored `node_modules/.cache/c4-readme-compose`; example root is captured and unmounted.
- `tests/unit/showcase.test.ts`: retired exact prose (`asynchronous ELK worker`, `Documentation renders Markdown`) replaced by current-contract checks: seven kinds, Layout worker section, createElkLayoutPort, safe-Markdown limitation line, manifest exports for core/styles/worker; stale-claim absence list kept.

## Evidence
`make sdk-check` exit 0 (log /tmp/c4-p04-test-integration-sdk-check.log): typecheck ok, lint warnings only (inherited button.tsx; examples/readme/compose.tsx only-export-components, read-only file), unit/hooks 206/206, properties 34/34, API 5/5, release 108/108.

## Knowledge/scripts
No durable lesson beyond the above; no reusable script.
