# C4-03 exact claims

Base: 3ea5789. Worktree: /tmp/c4-sdk-c4-03. Coordinator assigned these before dispatch; builder updates only with coordinated additions.

## Owns

- `src/lib/c4/domain/model.ts`
- `src/lib/c4/domain/architecture.ts`
- `src/lib/c4/domain/scene.ts`
- `src/lib/c4/domain/documentation.ts`
- `src/lib/c4/schema/decode.ts`
- `src/lib/c4/index.ts`
- `src/lib/c4/react/containers/ComponentDiagram.tsx`
- `src/lib/c4/react/contracts/views.ts`
- `src/lib/c4/react/hooks/useContext.ts`
- `src/lib/c4/react/hooks/useDocumentation.ts`
- `src/lib/c4/react/views/DocumentationView.tsx`
- `src/lib/c4/react/views/DocumentationSheet.tsx`
- `src/lib/c4/react/views/SourceList.tsx`
- `src/lib/c4/styles/documentation.css`
- `fixtures/component-docs.json`
- `tests/unit/component-docs.test.ts`
- `tests/property/component-docs.test.ts`
- `tests/hooks/documentation.test.tsx`
- `tests/browser/component-docs/component-docs.spec.ts`
- `agent-work/items/C4-03/brief.md`
- `agent-work/items/C4-03/claims.md`
- `agent-work/items/C4-03/review.md`
- `agent-work/items/C4-03/STATE.md`

## Reads

All repository instructions, plan/contracts, source ledger and landed SDK/test code. Concurrent peer claims are read-only. No root state, knowledge index, manifest/lock/config/shared CSS or existing browser regression edits.

## Coordinator integration edits

Root owns and has adapted `tests/browser/context/context.spec.ts` and `tests/browser/navigation/navigation.spec.ts` to exercise the responsive documentation sheet, plus the deferred-kind assertion in `tests/unit/architecture.test.ts` (component is now supported; code remains deferred). Include these exact coordinator edits in the C4-03 review and commit. Builder may run but must coordinate further edits.
