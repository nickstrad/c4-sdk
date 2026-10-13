# Claims C4-preflight

Builder: c4_02_builder (Sol). Branch item/c4-preflight; worktree /tmp/c4-sdk-preflight; base9849515. Status active. Root approved README.md and tests/unit/architecture.test.ts additions before edits.

## Owns (exact paths)

- `src/lib/c4/domain/model.ts`
- `src/lib/c4/domain/architecture.ts`
- `src/lib/c4/domain/scene.ts`
- `src/lib/c4/domain/layout.ts`
- `src/lib/c4/domain/geometry.ts`
- `src/lib/c4/domain/groups.ts`
- `src/lib/c4/schema/decode.ts`
- `src/lib/c4/ports/layout.ts`
- `src/lib/c4/react/contracts/views.ts`
- `src/lib/c4/react/views/ContextView.tsx`
- `src/lib/c4/react/containers/DiagramCanvas.tsx`
- `tests/unit/preflight.test.ts`
- `tests/property/preflight.test.ts`
- `tests/unit/architecture.test.ts`
- `docs/plans/batch-c-contracts.md`
- `README.md`
- `agent-work/items/C4-preflight/brief.md`
- `agent-work/items/C4-preflight/claims.md`
- `agent-work/items/C4-preflight/review.md`
- `agent-work/items/C4-preflight/STATE.md`

## Reads

AGENTS.md, CLAUDE.md, STATE.md, agent-work/COORDINATION.md/event-log.md, docs/knowledge/index.md, docs/plans/implementation.md, C4-02 records, SDK/test/config files, root-owned package manifest/lock/work-script index.

## Excludes and concurrency

Coordinator alone owns package.json, package-lock.json, work-scripts/INDEX.md, root STATE.md and shared coordination/knowledge index. No feature datasets, engine implementation, responsive UI or worker changes. Existing hooks are read-only; reserve useDiagramRenderer.ts/useViewerSession.ts/useDiagramLayout.ts for04 after preflight. Review scaffold stays pending; actual verdict reviewer-owned. Only coordinator merges/pushes.
