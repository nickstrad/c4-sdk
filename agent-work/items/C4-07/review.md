# C4-07 independent review

Status: PASS. No blocking defects; follow-up limitations are recorded below.

Reviewer: fresh independent Codex Sol session, cross-company to Claude Sonnet builder. Date: 2026-10-14 UTC.

Reviewed exact commit: `e6e53c13af0b1596a7ce6ebb80901bdd252db7ae`.
Builder base: `11913f0`. Payload includes implementation `7cd4189`, separate knowledge `84bf5b5`, and checkpoint `e6e53c1`.
Review branch/worktree: `review/c4-07-sol`, `/tmp/c4-sdk-c4-07-review`.

## Method and independent validation

Read repository instructions, root/item checkpoints, brief/claims, coordination/event-log instructions, knowledge index/gotchas, normative plan and relevant existing pipeline code. Inspected all 36 changed paths against the exact builder base, including the complete parsed fixture and matching public copy, removed wrappers, public exports, tests, documentation and knowledge changes. No product edits, nested agents, merge or push.

Fresh dependencies installed with `npm ci --prefer-offline`; no manifest/lockfile changes. Initial typecheck attempt before installation could not find `tsc`. After installation:

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS; SDK/apps/tests compile. |
| `npm run test:unit` | 189/189 PASS, 22 files; `/tmp/c4-07-review-unit.log`. First combined attempt reached Vitest then exited 143 without a test verdict; standalone rerun exited 0. Interruption cause was not established. |
| `npm run test:prop` | 29/29 PASS, 8 files; `/tmp/c4-07-review-property.log`. Ran after unit completion. |
| `npm run lint` | Exit 0; existing `src/components/ui/button.tsx:57` fast-refresh warning. |
| `npm run test:browser -- tests/browser/seven-types tests/browser/component-docs tests/browser/dynamic tests/browser/deployment --workers=1 --output=/tmp/c4-07-review-evidence` | 20/20 PASS, desktop Chromium and Pixel 7 mobile; production generic/demo builds both passed, existing large-chunk warnings remain. Seven-types matrix is 10 tests, affected regressions are 10. |
| Scratch mobile framing probe | 1/1 PASS; keyboard focus on OrderService pans its member compartment into the canvas. Horizontal and bottom bounds asserted; screenshot inspected. Config/spec: `/tmp/c4-07-framing.config.ts`, `/tmp/c4-07-framing.spec.ts`; artifacts `/tmp/c4-07-framing-evidence`. No probe added to the repository. |
| `git diff --check 11913f0 e6e53c1` | PASS. |

Inspected builder desktop/mobile code-compartment screenshots in `/tmp/c4-07-evidence2`, builder broad-suite mobile component-docs failure context in `/tmp/c4-07-full`, independent desktop/mobile landscape and desktop code captures in `/tmp/c4-07-review-evidence`, and independent focused mobile code capture in `/tmp/c4-07-framing-evidence`. Focused code card has legible wrapped declarations and a complete member compartment. Default framing limitations are real; see findings.

**Broad-suite evidence remains qualified:** builder reported 56 PASS, 1 existing skip, 1 intermittent mobile component-docs FAIL (expected “No explanation is provided”, retained Transaction preparation text). Builder isolated component-docs rerun passed 2/2; independent targeted component-docs also passed 2/2. This review did not run the complete broad suite, prove the intermittent failure's cause, or establish that it predates C4-07. Do not report a fully clean broad run.

## Acceptance evidence

| Acceptance area | Evidence and assessment |
| --- | --- |
| Landscape contract | MET. Strict schema accepts optional scope; semantic validation restricts members to people/systems (physical elements rejected by existing deployment validator) and requires any scope to be a visible system. Fixture has shared Customer and separately owned Shop/Billing; catalog adds it after the existing default. Unit scope/membership rejection cases and desktop/mobile direct URLs/drill journeys pass. |
| Code containment, ancestry and scope | MET. Pure `domain/codeview.ts` walks component/code ancestry with cycle detection and depth ceiling 32; missing/illegal parents reject. Code scopes require components, symbols descend from that component unless external, and non-code members reject. Unit cases cover nested OrderLine, illegal/missing parents, cycle/depth, scope leakage and external PaymentPort; rewiring properties pass. |
| Members, relationship kinds and identity | MET. Strict text-only member objects, bounded declarations/arrays, visibility defaults and seven symbol kinds; JSX renders literal text. Model/scene retain members and declared endpoints. Code-only inheritance/implementation/composition validate; implementation targets interface/type, self inheritance rejects; dependency/association remain supported. Symbol/member keys use valid element ID and member index, not names; injectivity property runs 400 cases. Accessible sibling lists avoid labelled-button child flattening; measurement probes/fallback include compartments. |
| Seven wrappers and routed kind | MET. All seven wrappers set fixed `expectedKind` after spreading props and share ArchitectureViewer. Check runs after `useNavigation` resolves the route, before DiagramView renders; documentation/legend also suppress mismatched content. Table drives 7 wrappers × 7 route targets, plus route-over-prop precedence and drill-to-mismatch. Direct browser URLs exercise the route pipeline; default hash adapter feeds the same parser/check as injected ports. Unknown routes retain diagnostics/recovery. |
| Shared controller, parts and slots | MET. One ArchitectureProvider owns route/navigation/context/session; navigation/view/legend/documentation consume it. Public `useViewerController` reads that controller rather than starting another subscription. Slots receive presentation props; public exports include provider, parts, wrappers and types. README composition example is compile-checked, compared byte-for-byte by the hook test, rendered at a hash code URL, and exercises separate legend/documentation placement. |
| Detail navigation and existing behavior | MET. Pure next-scope checks enforce landscape system→its context and component→its code alongside existing context/container/deployment rules. Unit/property wrong-destination cases pass; desktop/mobile real Back, Up, breadcrumb and direct-element journeys pass. Existing dynamic controls/history and deployment collapse/replica/logical drill regressions pass 8/8; responsive Markdown/docs regressions pass 2/2. |
| Provenance, accessibility and framing | MET with explicit limitation. Generic fixture labels teaching data as invented, has draft STE/provenance and all seven symbol kinds; fixture/public bytes match. Cursor demo dataset is unchanged; no implementation internals are invented. Matrix checks all seven node counts/legend/docs. Members expose names/signatures/visibility, serious/critical axe violations are absent, compartments remain within cards. Keyboard focus makes a readable mobile compartment visible; initial viewport can show empty canvas and is not claimed to frame all symbols. |

## Findings and follow-up

1. **Low, non-blocking — initial canvas framing and test coverage** (`src/lib/c4/react/containers/DiagramCanvas.tsx`, existing canvas/session pipeline, `tests/browser/seven-types/seven-types.spec.ts:32`). Default code viewport shows an empty mobile region and partial desktop layout; mobile landscape clips its first card. Committed `toBeVisible()` and list-within-card bounds do not establish viewport intersection/readability. Independent keyboard-focus probe demonstrates recovery with a complete visible member compartment. Coordinator should carry this disclosed framing issue into C4-10 and add viewport-based focused/Fit checks there. No claim of automatic fit or full initial visibility is approved.
2. **Low, non-blocking — inherited stale README passages** (`README.md`, “Supported contract and current limits” and “Navigation and extension seams”). These still say auto layout lacks ELK, groups await C4-04, documentation is literal text rather than Markdown, and later C4 kinds are deferred. New wrapper/composition/code sections accurately describe C4-07, but older paragraphs contradict delivered earlier slices. Coordinator should assign documentation reconciliation; this does not invalidate the tested new API.
3. **Validation limitation — intermittent mobile component-docs** (`tests/browser/component-docs/component-docs.spec.ts:38`). Preserve builder failure and rerun evidence above. Passing reruns do not diagnose the lost selection. Coordinator should retain artifacts and track investigation if it recurs; no reproducible C4-07 blocker was found.

## Coordinator-owned-file caveat

`git diff --name-only 11913f0 e6e53c1 -- STATE.md agent-work/COORDINATION.md` is empty: builder did not modify coordinator-owned root status. Both inherited files contain stale dispatch/push descriptions, including C4-07 active/to-be-dispatched and C4-06 push pending. This PASS approves the exact item payload, **not** those stale status assertions. Coordinator must reconcile root STATE/COORDINATION when landing. Item brief also retains superseded Codex-only staffing text; actual builder/claims/checkpoint and this cross-company review are explicit. Review only changes this record; event publication is skipped under root checkpoint's existing read-only exception.

## Verdict, knowledge assessment and handoff

**PASS** on exact `e6e53c13af0b1596a7ce6ebb80901bdd252db7ae`. No required repair or product edits; landing/integration checks, shared status updates and push remain coordinator responsibilities.

Post-review knowledge/scripts assessment: existing separately committed C4-07 gotchas/index already capture routed-kind checks, member-list accessibility, stable identity and initial framing. Review adds verification and coverage limits here; no new durable knowledge page or reusable helper is warranted. Scratch framing probe is review evidence, not an indexed reusable script. No separate knowledge/script commit needed.

Review checkpoint: validation complete, verdict recorded, only review.md to be committed. Preserve review branch/commit for coordinator, then remove clean review worktree; preserve `/tmp` evidence/logs. Root/item builder checkpoints remain untouched.
