# C4-03 checkpoint

Updated 2026-10-13. Build complete, independent review pending. Authorized Codex-only build in `/tmp/c4-sdk-c4-03`, branch `item/c4-03-components`, base `3ea5789`. Build payload is the commit containing this checkpoint; lead owns integration/shared state and actual review record. Read [brief](brief.md), [claims](claims.md), [contracts](../../../docs/plans/batch-c-contracts.md), [review](review.md).

## Completed

Component model/schema with required technology/container parent, scope/member/detail validation, pure component presentation, separate public ComponentDiagram. Rich constrained Markdown supports paragraphs/headings/lists/inline code/safe links; rejects images/raw HTML/scripts and unsafe parser-decoded URLs. Pure documentation selectors isolate diagram/element docs and active-document source/term references. Thin controller keys document selection by dataset ID/revision + diagram/element; props-only views show sources, glossary, Plain/STE and truthful issue/review metadata. Responsive Base UI Sheet supports named controls, focus return/Escape and SDK-local theme/styles.

Original source-linked component fixture explicitly marks inferred boundaries and illustrative planned responsibility/reviewer. Existing demo/catalog/config unchanged. Coordinator adapted context/navigation regression specs for responsive docs and architecture deferred-kind unit assertion; claims record their ownership and inclusion. Event helper skipped under explicit Nick exception because common Git directory is read-only.

## Validation

- `npm run test:unit`: 57 passed (12 files).
- `npm run test:prop`: 18 passed (4 files), new seeds403 with URL300/choice200/status100 runs.
- `npm run typecheck`: passed; production browser gates also typechecked final tree and built both generic/demo production artifacts under `/c4-preview/`.
- `npm run lint`: passed; only pre-existing button fast-refresh warning. Vite warns about 500kB chunk size (Markdown increases demo bundle); no performance claim made.
- Full `npm run test:browser`: baseline24 passed, component mobile passed, component desktop reached screenshot/axe but failed test-only unconditional Sheet click at CSS200% zoom. Fixed test to respect actual visible responsive trigger.
- `npm run test:browser -- tests/browser/component-docs/component-docs.spec.ts --output=test-results-component-final`: both projects passed (2).
- Mobile evidence rerun with `--project=mobile-chromium --output=test-results-sheet-viewport`: passed (1); actual dialog bounds y≈0 and width≤viewport, visible Close asserted.
- Actual desktop/mobile/200% and mobile viewport Sheet screenshots inspected. Mobile fullPage screenshot positions fixed popup at current scroll offset; viewport-only artifact confirms it covers screen correctly. No page-width overflow; canvas remains scrollable.
- `git diff --check`: passed.

Artifacts remain untracked in test-results, test-results-component-final and test-results-sheet-viewport. Browser lease released to lead. Earlier failures: ambiguous heading test locator, document selector accessible name (fixed explicit aria-label), coordinator mobile helper reload race (fixed matchMedia + click auto-wait), one generic webServer exit1 that did not recur after explicit successful demo build. None is reported as a passing run.

## Durable deltas and next steps

Lead should record: document choice identity includes dataset/revision/diagram/element; active document sources/terms are pure selectors; Markdown filter runs on decoded parser URLs; Base UI portal needs c4-sdk CSS scope; fullPage screenshots can stitch fixed dialogs at scroll offset, so viewport capture plus bounds checks validate overlays.

Independent Sol review must inspect exact build commit and brief. No merge/push by builder; lead integrates03→04→09a after actual review. Shared stylesheet/ArchitectureViewer/layout/canvas remain peer-owned. Review is pending, not implied by these checks.
