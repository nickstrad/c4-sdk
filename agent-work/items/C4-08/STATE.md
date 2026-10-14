# C4-08 checkpoint

Status: fully accepted. Implementation and validation complete; independent review PASS and Nick signed off the human STE review gate on 2026-10-14.

Builder: fresh Codex Sol. Branch/worktree: `item/c4-08-showcase` / `/tmp/c4-sdk-c4-08`. Exact base will be recorded by the builder before editing when the coordinator creates the worktree from the claims-preparation commit. Review: new Claude Sonnet reviewer required after build. Root status and integration remain coordinator-owned.

Read [brief](brief.md), [claims](claims.md), [review](review.md), root [STATE](../../../STATE.md), coordination, relevant event log, implementation plan and knowledge index before editing.

## Scope

Complete the Cursor showcase and the bounded root README correction described in the brief. No SDK, configuration, copier, consumer fixture, or coordinator status edits.

## Progress and evidence

- Assignment and exact path claims prepared by coordinator; awaiting their commit and the isolated worktree.
- No builder edits or validation yet.
- Pool check from the C4-07 verdict note: Codex 83% weekly remaining, Claude 90%, Muse no pressure (checked 2026-10-13 17:31 CDT; C4-07 review since consumed Codex capacity).

## Next steps

1. Builder reads root/item STATE, AGENTS, event log, source ledger, knowledge index and article.
2. Builder validates exact claims before editing and updates this checkpoint as work proceeds.
3. Run content/unit/property/build and desktop/mobile production browser checks; inspect screenshots.
4. Commit implementation, then separate justified knowledge/scripts assessment and commit; report exact heads and clean builder worktree.
5. Coordinator dispatches fresh Claude Sonnet independent review. Land C4-08 only after PASS, then begin C4-09.

## Builder start confirmation — 2026-10-14

Fresh Codex Sol builder in `/tmp/c4-sdk-c4-08`, branch `item/c4-08-showcase`, exact base `5330433d582d471d7fa07fd814ad3b36d0ad54e4`. Owned paths and read-only exclusions in the brief are confirmed. No shared-file conflicts. Root STATE/COORDINATION, SDK, fixtures, configuration and manifests remain read-only. Read normative plan, source ledger/glossary, original article, C4-07 review, repository checkpoints and knowledge. Live common-dir event inbox is absent; publication skipped under the recorded coordinator exception.

## Implementation checkpoint — 2026-10-14

Product content complete, validation in progress. Added four explicitly inferred server responsibilities, a separate missing-cache rebuild scenario, every-item original Plain/draft STE documents with sources/terms, source-to-ID/review inventory, concise related reading links and guided README. Root README correction is bounded to the claimed contract/navigation passages. No SDK/fixture/config/manifest/coordinator changes.

Validation so far: dependencies installed with `npm ci --prefer-offline` without manifest changes; typecheck/lint pass with the existing button fast-refresh warning. Unit/hooks 194/194 and property 31/31 pass. Initial typecheck caught the new property's incorrect `ScenarioItem.map` call; fixed by using `readingSelections` and subsequent typecheck/build passed.

Browser history: initial `/tmp/c4-08-showcase-evidence` run had three selector timeouts and one manually interrupted test (exit130): internal ReactFlow IDs were assumed unprefixed. Corrected to accessible link names. Next `/tmp/c4-08-final-evidence` run: 8 PASS / 4 FAIL; two deployment failures from the added illustrative-deployment related link in logical detail, and two new showcase failures from expecting Plain wording while STE mode persisted. Removed that related link, added explicit Plain selection in test helper. Fresh final-source affected12 rerun now running at `/tmp/c4-08-rerun-evidence`; no clean-suite claim before completion. Earlier artifacts preserved. Original context screenshot inspected; final desktop/mobile/zoom screenshots still to inspect. Browser lease 4173/4174 assigned by coordinator and remains held during this rerun.

The final-source affected12 rerun at `/tmp/c4-08-rerun-evidence` passed12/12 (2.7m), with both builds/typechecks. Inspected final desktop inferred-responsibility capture, mobile explanation sheet, mobile publication and desktop/mobile zoom captures. The mobile publication viewport showed navigation rather than the canvas; shortened dynamic related links to next/comparison stories and changed the capture to scroll to the canvas. This justified final visual follow-up at `/tmp/c4-08-final-reading-evidence`, but its demo webServer build exited1 during gzip reporting before any test ran, with no further error printed. Cause unestablished. Standalone demo build and subsequent fresh production rerun are pending; do not count the startup failure as a test verdict. Final unit/hooks194 and properties31 passed after the related-link change; final lint passes with the same existing warning.

## Final validation and handoff — 2026-10-14

- Exact base remains `5330433d582d471d7fa07fd814ad3b36d0ad54e4`; owned/read-only paths remain as confirmed above. No nested agents, merge, push, SDK/config/manifests/fixtures/copier/consumer/shared-state changes.
- `npm run test:unit -- --reporter=dot`: **194/194 PASS**, 23 files on final content.
- `npm run test:prop`: **31/31 PASS**, 9 files on final content; new showcase seeds4082026/4082027, 100 runs each.
- `npm run typecheck`: PASS after the corrected property selection helper; final production builds also ran `tsc -b` successfully.
- `npm run lint`: exit0; pre-existing `src/components/ui/button.tsx:57` fast-refresh warning only.
- `npm run build:demo -- --base=/c4-preview/`: standalone PASS after the unestablished startup failure.
- `npm run test:browser -- tests/browser/showcase tests/browser/dynamic tests/browser/deployment --workers=1 --output=/tmp/c4-08-final-verified-evidence`: **12/12 PASS** (1.9m), desktop Chromium + Pixel7 mobile, actual production generic/demo builds both PASS, existing large-chunk warnings. This is the affected suite, not a claim that the full broad browser suite was rerun. Covers real source reading, Plain/STE draft/terms/key, keyboard drill/Up/Back, scenario selection/partial order, separate304/200/gossip/rebuild/compaction paths, fresh copied step URL, physical-to-logical selection and 200% zoom. Serious/critical axe results empty in the reading journey.
- `git diff --check`: PASS. Earlier failures, interruptions, reruns and artifact directories above remain part of the evidence.

Screenshot inspection: inspected final desktop `publication.png` and `freshness-zoom.png`; final mobile `publication.png`, `inferred-responsibilities.png`, `freshness-zoom.png` and deployment `deployment-selected-replica.png` under `/tmp/c4-08-final-verified-evidence`. Also inspected desktop inferred-role view and mobile explanation/zoom captures from the preceding12/12 run. Role prose, provenance and glossary wrap in the narrow sheet, physical selection is visible, and zoom has no horizontal document overflow. The publication capture now shows the canvas rather than only navigation. Inherited framing remains a limitation: default canvas does not show every target/active overlay at once, and long headings can split words at200% desktop zoom. Pan/zoom/keyboard inspection and complete relationship/scenario alternatives remain available. No automatic-fit/full-initial-viewport claim; SDK framing remains C4-10 follow-up under coordinator scope.

The browser runner exited and tore down its preview servers;4173/4174 lease released to coordinator. STE remains Issue9 draft with human review pending; source map marks builder checking and pending independent review honestly. Fresh Claude Sonnet exact-head review is next; coordinator owns landing and later C4-09 dispatch.

## Post-implementation knowledge/scripts assessment and commits

Implementation/evidence commit: `398782b6ef723748dce9815742fd49bfebbc903f` (`demo: Complete source-grounded Continuity showcase`). Assessed the committed diff, source authoring and validation/debugging against `docs/knowledge/index.md`, existing decisions/gotchas and `work-scripts/INDEX.md`.

No additional durable project-knowledge page or reusable script is justified: existing decisions already require explicit source facts/inferred decomposition/illustrative topology; existing gotchas and C4-07 review already document framing and physical-to-logical navigation. The completed source ledger/map and guided README are the authoritative content evidence delivered in this implementation, not a second project-memory copy. Selector corrections and persisted Plain/STE mode are handled by the committed browser journey; the one unexplained startup failure is recorded here without an invented cause. The scratch authoring script contains one-off IDs and is not a reusable helper. No knowledge/script commit needed; coordinator-owned/read-only knowledge files were preserved.

This separate checkpoint commit records the assessment/handoff after implementation. Final exact builder head is the head of `item/c4-08-showcase` and is reported to the coordinator after this commit. No merge or push. Independent fresh Claude Sonnet review remains pending; this checkpoint does not authorize landing. All work is durable before removing the builder worktree; artifacts under `/tmp/c4-08-*evidence` remain available.

## Human acceptance — 2026-10-14

Nick signed off the C4-08 human STE review gate. The item is fully accepted. The delivered STE content remains Issue 9 draft material and is not represented as formal ASD-STE100 certification. Independent review and landing evidence above remain unchanged.
