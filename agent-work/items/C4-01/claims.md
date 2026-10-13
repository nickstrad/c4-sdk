# Claims C4-01

Builder owns the following exact paths on `item/c4-01-context` in `/tmp/c4-sdk-c4-01`. No concurrent writer.

- `src/lib/c4/domain/model.ts`
- `src/lib/c4/domain/architecture.ts`
- `src/lib/c4/domain/presentation.ts`
- `src/lib/c4/schema/decode.ts`
- `src/lib/c4/ports/loader.ts`
- `src/lib/c4/adapters/loaders/fetch.ts`
- `src/lib/c4/react/contracts/views.ts`
- `src/lib/c4/react/hooks/useArchitectureBundle.ts`
- `src/lib/c4/react/hooks/useContext.ts`
- `src/lib/c4/react/containers/ArchitectureViewer.tsx`
- `src/lib/c4/react/containers/CatalogViewer.tsx`
- `src/lib/c4/react/views/ContextView.tsx`
- `src/lib/c4/react/views/Legend.tsx`
- `src/lib/c4/react/views/DocumentationView.tsx`
- `src/lib/c4/react/views/DiagnosticView.tsx`
- `src/lib/c4/styles/c4.css`
- `src/lib/c4/index.ts`
- `src/App.tsx`
- `src/index.css`
- `demos/git-at-any-scale/index.html`
- `demos/git-at-any-scale/vite.config.ts`
- `demos/git-at-any-scale/src/main.tsx`
- `demos/git-at-any-scale/public/catalog.json`
- `demos/git-at-any-scale/public/diagrams/continuity.json`
- `demos/git-at-any-scale/public/diagrams/invalid.json`
- `demos/git-at-any-scale/README.md`
- `fixtures/context.json`
- `fixtures/invalid-context.json`
- `tests/unit/architecture.test.ts`
- `tests/unit/loader.test.ts`
- `tests/unit/boundaries.test.ts`
- `tests/property/architecture.test.ts`
- `tests/hooks/loading.test.tsx`
- `tests/browser/context/context.spec.ts`
- `package.json`
- `package-lock.json`
- `vitest.config.ts`
- `playwright.config.ts`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `tsconfig.tests.json`
- `tsconfig.json`
- `.gitignore`
- `README.md`
- `agent-work/items/C4-01/brief.md`
- `agent-work/items/C4-01/claims.md`
- `agent-work/items/C4-01/STATE.md`
- `agent-work/items/C4-01/review.md`

Reads: AGENTS.md, CLAUDE.md, implementation plan, knowledge index, coordination, event log and script index. No root state, coordination, knowledge or work-script edits.

Validation: `npm run typecheck`, `npm run lint`, `npm run test:unit` (23 tests), `npm run test:prop` (4 properties × 150 cases, seed 4012026), `npm run build` and `npm run build:demo` passed. Lint has only the pre-existing untouched UI button Fast Refresh warning.

Production browser run: 12/12 passed on desktop Chromium 1440×1000 and Pixel 7 Chromium. Demo built/served under `/c4-preview/`; generic production viewer also checked. Keyboard, axe (zero violations), reduced motion, 200% zoom, valid/invalid replacement and malformed initial JSON covered. Builder inspected actual desktop/mobile context images, desktop invalid-preserved image and mobile zoom image with `view_image`. Zoom inspection found key/catalog wrapping could improve; CSS wrapping and a no-page-overflow-at-200%-zoom assertion added. Final browser regression is delegated to coordinator because a second child-thread escalation remained pending despite the saved approval; no denial was returned. No leftover browser/server processes.

Ignored screenshot evidence under `/tmp/c4-sdk-c4-01/test-results/`:
- `context-context-real-catal-490a5-ontext-key-and-explanations-desktop-chromium/context.png`
- `context-context-real-catal-490a5-ontext-key-and-explanations-mobile-chromium/context.png`
- `context-context-invalid-re-4cad5-s-the-last-complete-dataset-desktop-chromium/invalid-preserved.png`
- `context-context-axe-reduce-d6927--percent-zoom-remain-usable-mobile-chromium/zoom-200.png`

Screenshots/traces/build outputs/dependencies are generated evidence, ignored and excluded from the commit. Final regression chronology: coordinator ran the complete suite after domain/status edits: 8 passed, 4 failed solely because `.c4-review` matched both lifecycle status and STE metadata. Builder changed lifecycle status to `.c4-status`, applied the zoom wrapping patch (the earlier bundled escalation had not executed it), and added page/key-item overflow assertions. Coordinator reran affected invalid/keyboard/zoom journeys with `--output=test-results-final`: all 6 passed. Together the unchanged successful 8 and affected 6 cover all 12 journeys. Builder inspected refreshed desktop/mobile context images and final desktop invalid-preserved/mobile zoom images with `view_image`. Final mobile zoom key text wraps inside the card; no spurious right gutter. Production subpath, keyboard, axe and zoom gates pass. Independent exact-commit review is still pending.

Additional final evidence under `/tmp/c4-sdk-c4-01/test-results-final/`:
- `context-context-invalid-re-4cad5-s-the-last-complete-dataset-desktop-chromium/invalid-preserved.png`
- `context-context-axe-reduce-d6927--percent-zoom-remain-usable-mobile-chromium/zoom-200.png`

Both test result directories are ignored and excluded from commits.

Additional root generic-viewer assets reserved before edits:
- `public/catalog.json`
- `public/diagrams/context.json`

Reserved demo host stylesheet before writing: `demos/git-at-any-scale/src/style.css`.

Reserved props-only host shell before writing: `src/lib/c4/react/views/CatalogView.tsx`.

Review follow-up for08054079d91f74d0d6f71bd6b4900c8f86460d06: stable geometry arithmetic and complete scene finite checks. Concrete overflow/underflow unit regressions and a300-case generated finite manual-coordinate/size property added. Final affected checks pass:25unit/hook tests,5properties (four150runs plus geometry300, seed4012026), typecheck. No browser rerun per independent reviewer/coordinator because ordinary geometry/UI unchanged; prior browser evidence remains applicable. Exact updated-commit review pending.
