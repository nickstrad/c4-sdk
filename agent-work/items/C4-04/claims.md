# C4-04 exact claims

Base: 3ea5789. Worktree: /tmp/c4-sdk-c4-04. Coordinator assigned these before dispatch; builder updates only with coordinated additions.

## Owns

- `src/lib/c4/domain/geometry.ts`
- `src/lib/c4/domain/layout.ts`
- `src/lib/c4/ports/layout.ts`
- `src/lib/c4/adapters/layout/elk-input.ts`
- `src/lib/c4/adapters/layout/elk-output.ts`
- `src/lib/c4/adapters/layout/worker.ts`
- `src/lib/c4/adapters/layout/client.ts`
- `src/lib/c4/react/hooks/useDiagramLayout.ts`
- `src/lib/c4/react/hooks/useDiagramRenderer.ts`
- `src/lib/c4/react/hooks/useViewerSession.ts`
- `src/lib/c4/react/hooks/useDiagramMeasurements.ts`
- `src/lib/c4/react/containers/DiagramCanvas.tsx`
- `src/lib/c4/react/containers/ArchitectureViewer.tsx`
- `src/lib/c4/react/views/CanvasNode.tsx`
- `src/lib/c4/react/views/CanvasEdge.tsx`
- `src/lib/c4/react/views/CanvasGroup.tsx`
- `src/lib/c4/react/views/DiagramFallback.tsx`
- `src/lib/c4/styles/canvas.css`
- `fixtures/layout.json`
- `tests/unit/layout-worker.test.ts`
- `tests/unit/layout.test.ts`
- `tests/unit/preflight.test.ts`
- `tests/property/layout-worker.test.ts`
- `tests/hooks/layout.test.tsx`
- `tests/hooks/navigation.test.tsx` (lead granted 2026-10-13 for async layout adaptation)
- `tests/browser/layout/layout.spec.ts`
- `agent-work/items/C4-04/brief.md`
- `agent-work/items/C4-04/claims.md`
- `agent-work/items/C4-04/review.md`
- `agent-work/items/C4-04/STATE.md`

## Reads

All repository instructions, plan/contracts, source ledger and landed SDK/test code. Concurrent peer claims are read-only. No root state, knowledge index, manifest/lock/config/shared CSS or existing browser regression edits.

## Coordinator integration edits

Root owns `playwright.config.ts` and enabled explicit webServer stdout/stderr piping in this worktree to expose production build/startup failures. Include this exact root change in review/commit. Existing context/navigation browser regression specs remain root-owned.

Root adapted `tests/browser/context/context.spec.ts` relationship-label assertion to the visible canvas so the new hidden measurement rack cannot satisfy it. Include this coordinator-owned regression edit in review/commit.

Root additionally adapted `tests/browser/navigation/navigation.spec.ts` native-link status test to wait for the actual canvas link, and `src/lib/c4/styles/c4.css` diagram heading child sizing/wrapping for200% mobile zoom. Preserve pending-layout navigation coverage in the first journey. Include these exact coordinator edits in review/commit.
