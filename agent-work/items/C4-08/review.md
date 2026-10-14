# C4-08 independent review

Status: complete. A commit is not approval; coordinator owns integration and landing.

Reviewer: fresh Claude Sonnet (cross-company to the Codex Sol builder).

Reviewed commit: `e3b33fa1f9da89cb551dd4af492f6e09b792f6e4` (branch `review/c4-08-sonnet`). Implementation `398782b`, builder checkpoint `e3b33fa`. Base `5330433`.

## Acceptance criteria

- [x] Showcase content and source mapping are complete, faithful to the source, and distinguish facts, inference and unknowns. (Checked via the inventory/provenance unit and property tests and screenshots: inferred responsibilities are labelled "Evidence: inferred decomposition; not Cursor source classes or actual process boundaries". I did not re-read the live article or hand-audit every JSON entry against it.)
- [x] Plain and draft STE documentation, sources, glossary and review metadata cover every diagram and element. (Enforced by the new unit/property tests, which pass; STE stays Issue 9 draft, human review pending, as the source map states.)
- [x] Guided desktop/mobile production journeys, deep links, screenshots and relevant unit/property checks pass.
- [x] Root README reconciliation accurately describes the delivered SDK without removing correct limits. (Diff reviewed: seven kinds, ELK worker/groups, Markdown docs, advisory STE diagnostics, pointer to the implementation plan; the "No ELK is implemented here" claim is removed. The README edit is confined to the two claimed sections.)

## Evidence (all run by this reviewer at the exact HEAD above)

- `npm run typecheck`: PASS.
- `npm run lint`: exit 0; only the existing `src/components/ui/button.tsx:57` fast-refresh warning.
- `npm run test:unit`: 194/194 (23 files) PASS.
- `npm run test:prop`: 31/31 (9 files) PASS.
- `npm run build` and `npm run build:demo`: PASS, with the known large-chunk warning.
- `npm run test:browser -- tests/browser/showcase tests/browser/dynamic tests/browser/deployment --workers=1`: 12/12 PASS (2.1m) on desktop Chromium and Pixel 7 mobile, first run, no retries. Artifacts: `/tmp/c4-08-review-evidence`.
- Screenshots inspected: desktop inferred-responsibilities (three role cards labelled inferred/planned, Plain/STE toggle, terms visible); mobile publication (canvas shown with relationships list below); mobile 200% zoom (explanation sheet wraps, no clipping seen).

## Caveats and preserved history

- The builder's STATE records earlier failures that I did not reproduce and that stay on record: three selector timeouts plus one interrupted run, then an 8 pass / 4 fail run (deployment related-link and persisted-STE expectations), both fixed; and one unexplained demo-build startup failure (exit 1 during gzip reporting) with no cause established. My fresh builds and runs did not fail.
- The broad browser suite (all of `tests/browser`) was NOT run by me or the builder after this change; only the affected showcase, dynamic and deployment specs were. Earlier C4-07 records note an intermittent, undiagnosed mobile component-docs failure in the broad suite; it is untested here.
- Known inherited framing limits (builder-documented, consistent with what I saw): the default canvas does not show every node at once (mobile publication shows only the first node with an edge leaving the viewport; roles are reached by pan/Fit/keyboard and the relationship list), and long headings can split at 200% desktop zoom. This is SDK framing, a C4-10 follow-up, not a C4-08 defect. No fit-to-view claim is made.
- STE diagnostics are advisory, not certification; human STE review is still pending.
- The builder's claim of "no knowledge/script commit needed" is a judgement I did not contest.

## Findings

- No blocking defects.
- Nit (low): the mobile Pixel 7 publication capture shows one node and a clipped edge in the first viewport, which is weak as a reading entry point; consider a viewport-based Fit check in C4-10.

## Verdict

**PASS** at `e3b33fa1f9da89cb551dd4af492f6e09b792f6e4` (one low non-blocking nit above). Not merged or pushed by the reviewer. C4-09 may follow coordinator integration.
