# C4-01 — open a JSON context

Builder: Sol. Independent reviewer: Sol. Branch: item/c4-01-context. Worktree: /tmp/c4-sdk-c4-01.
State: agent-work/items/C4-01/STATE.md, builder-owned.

Implement docs/plans/implementation.md C4-01 as a working vertical slice: minimal SDK boundary, strict runtime decoder, pure domain indexes/semantic diagnostics/projection, fixed-layout context view, reusable legend, Plain/STE draft text and runnable small Cursor demo. Keep domains React/Zod/browser independent, views props-only, hooks thin. Follow normative model contract for supported context slice; reject unsupported types explicitly rather than accepting unusable data. Later items extend kinds.

## Owns

New src/lib/c4/** exact files (enumerate in claims before edits), src/App.tsx, src/main.tsx, src/index.css as needed; initial demos/git-at-any-scale/{index.html,vite.config.ts,src/**,public/**,README.md}; fixtures/**; tests/unit/**, tests/property/**, tests/hooks/**, tests/browser/context/**; package.json, package-lock.json, vite.config.ts, vitest.config.ts, playwright.config.ts, tsconfig*.json, .gitignore, .oxlintrc.json, README.md; agent-work/items/C4-01/**. Root manifests/config ownership delegated for this solo item. New paths must be enumerated before writing. No other builder active.

## Reads / exclusions

Read plan, repo instructions and knowledge. Do not edit AGENTS/CLAUDE, root STATE, shared coordination, knowledge index, work-scripts, existing UI primitive, source ledger research (reserved08a), unrelated files. Report durable findings to coordinator.

## Acceptance

- Load actual JSON via loader/catalog into demo; labelled context elements/relationships, independent legend and diagram/element Plain/STE explanations. Useful diagnostic on invalid JSON; prevent partial replacement with invalid state. Source article https://cursor.com/blog/git-at-any-scale must be read for demo claims; original text and honest draft metadata.
- Unit good/bad input with precise paths; fast-check ID/reference, immutable input and membership projection invariants. Test discovery must already include later tests/copy-consumer/policy and hooks (separate environment if needed).
- Playwright real valid/invalid loading, desktop/mobile, keyboard and axe; capture AND view actual screenshots, fix visual issues. No placeholder-only acceptance. Store evidence paths in claims.
- Add runnable test:unit/test:prop/test:browser and check/build:demo/dev:demo commands, typecheck demo/tests and preserve existing build/lint. Install compatible dependencies and browser if needed; don't bypass permissions.
- Commit implementation after tests, return SHA + checks/screenshots. Do not merge/push; coordinator reviews and lands. Do not start C4-02.

Ownership extension approved by coordinator: `public/catalog.json` and `public/diagrams/context.json` for generic-viewer default assets.
