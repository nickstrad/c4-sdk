# C4 SDK build state

Updated: 2026-10-13. Status: BUILD AUTHORIZED; C4-01 landed541e41a; C4-02 landed0561126; C4-08a landed9849515; batch C preflight PASS and integrating.

## Authorization and current work

Nick’s build-kickoff.md authorizes all implementation items, independent reviews, item-by-item commits and pushes. Prior plan-only restrictions are historical and superseded. No site deployment or npm publication. Work is regular agent-work or sq-* side quests; no experiment board/protocol.

Nick’s latest steering: Claude weekly allowance is15%, estimated reset2026-10-13 05:59UTC. Assign ALL builds and reviews to Codex seats (Astra/Sol/Luna) until Twin explicitly confirms reset; time alone does not lift this restriction. Existing assignments already comply. No Claude CLI builders/reviewers.

Root coordinator owns this checkpoint, shared coordination, manifests during integration and knowledge index. Builders use separate worktrees and item-local checkpoints. Preserve user kickoff files.

## Plan and sequence

Authoritative plan: docs/plans/implementation.md, reviewed payload 340baa4, published plan branch 6491825. Main prior to plan merge: 967d573. Merge reconciles AGENTS with side-quest-only protocol; state lifecycle unified under root coordinator. Independent Sol build_reviewer PASS on merge3524a26.

Batches: A 01; B 02 + 08a; C 03 + Astra04 + 09a after contracts/dependencies preflight; D 05 then06 then07; E 08 +09; F10. Integrate in plan order. Sol default builders/reviewers; Astra only04; Luna high08a. Every item has exact ownership, tests and independent review before landing.

## Validation and next actions

Plan merge3524a26 PASS, pushedae1014d. C4-01 reviewed commit45b7d3e3a708385a5f72d1806965fb2792b4d3aa PASS by independent Sol build_reviewer after geometry fix; landed and pushed as main541e41a. Builder worktree /tmp/c4-sdk-c4-01 branch item/c4-01-context. Checks25unit/hook+5properties(4×150,geometry300), typecheck/lint(existing button warning), both builds. Browser12journeys covered by full8pass plus affected6pass after locator/zoom fixes. Actual desktop/mobile/200zoom screenshots inspected, artifacts in worktree test-results and test-results-final. Review independently reran unit/property checks; no further browser rerun needed for numerical geometry fix.

Current: C4-02 landed and pushed0561126; reviewed commit363a16e684a54c7877f6bdc68d4674eab53921c2 PASS by independent Sol build_reviewer after three NITS fixes (native links, thin containers, declared-default catalog routing). Integrated to main without conflicts; combined-tree typecheck,43 unit/hooks and10 properties PASS after refreshing stale local dependencies (lockfile unchanged). Final typecheck,43 unit/hooks,10 properties,24 production browser tests PASS; desktop/mobile/200% screenshots inspected. A real failed-request revival after Back/Forward was fixed using originating route snapshot identity and regression tested.

C4-08a reviewed exactc7d65b4 PASS (source fidelity,11 article anchors,local links,scope); landed and pushed9849515 after02 without conflicts. Batch C remains gated on serial reviewed shared group/schema/projection, measurement and routed-geometry contracts plus dependency setup. Preflight draft /tmp/c4-preflight-brief.md; later drafts /tmp/c4-03-brief.md,/tmp/c4-04-brief.md,/tmp/c4-09a-brief.md. Registry checked React Flow12.12.0,ELK0.12.0,react-markdown10.1.0, compatible React peers; installed in /tmp/c4-sdk-preflight; coordinator setup11f6b69 independently reviewed PASS (exact pins/compatible peers,98 added lock records, no existing version/resolution/integrity changes). Root owns package/lock/INDEX. New useDiagramRenderer/useViewerSession hooks belong04 during batch C. Sol c4_02_builder assigned preflight at /tmp/c4-sdk-preflight branch item/c4-preflight base9849515; exact brief in agent-work/items/C4-preflight/brief.md. Builder owns shared contract code/tests/docs, root owns dependencies/INDEX. Contract code db7f1ef reviewed; docs correction0c4d86552604875b3457c64d64e6a40163502774 independently PASS. Landing order remains03→04→09a. ArchitectureViewer composition/fallback belongs04;03 adds separate ComponentDiagram and feeds docs through useContext/documentationProps. Integrated without conflicts; combined typecheck,52 unit/hooks and15 properties PASS. Concurrent Vitest processes raced on cache cleanup once; unit suite rerun sequentially passed. Future worktrees need separate node_modules/cache and sequential unit/property commands.52unit/hooks,15properties,24productionbrowser,typecheck/build PASS; current desktop/mobile screenshots preserved. Independent Sol review before batch C dispatch.

Browser-localhost sandbox EPERM: root approved standalone `npm run test:browser` works; child escalations stalled. Have root run browser gates if approval stalls. Do not duplicate live test servers. Common Git event publication denied; Nick permits skipping. Root owns shared STATE/coordination/knowledge index; builders own item-local state/claims. User kickoff files remain untracked.

## Later consumer preparation

Read-only preparation: ts-db main checkout /root/Software/ts-db is clean at dedef4f; read AGENTS.md, CLAUDE.md and knowledge index. No ts-db edits or build started. Its local protocol describes isolated item worktrees and a top-tier review (Astra allowed by model duality), plus a follow-up diagram-impact review. Nick’s build-kickoff model assignment remains authoritative; do not infer permission to use Claude or change the mission’s assigned tiers from local defaults. Scope C4-09 separately before editing. Environment kb search304 found no useful copy-integration guidance; feedback recorded.

## Source evidence and history

Plan sources and requirements follow for restart context. The ts-db plan pointer was published at 187f4f9; no ts-db implementation has begun.

## Full task and requirements received

### Original brief

`/root/c4-react-plan-brief.md` requests **plan only**, not a build. Working name was c4-react: interactive
C4 diagrams as React components, initially proposed under ts-db `pages/` but designed standalone. Nick later
moved the framework and plan into c4-sdk now, so the old location is superseded.

The original brief requires:

- Vite, React, TypeScript, Tailwind CSS and shadcn/ui.
- Evaluate/justify Zod, Effect and fast-check; other libraries only where useful.
- All seven C4 types: System Landscape, System Context, Container, Component, Code, Dynamic, Deployment.
- Native detail links, drill-down, breadcrumbs, Back/Up, deep links to diagrams and elements.
- A reusable per-diagram Legend primitive.
- JSON data loaded and validated at runtime, decoupled from components; no hard-coded project content.
- Mandatory dumb views, hooks/pure functions, and containers composing hook+view. Show concrete examples
  for both the renderer and navigation/drill-down state.
- Attach STE100 and plain explanations to diagrams and individual elements.
- A milestone converting current ts-db architecture plus proposed FFI architecture from `docs/ffi-c4` and
  `research/fable-lang-switch`, preserving source fidelity and distinguishing current vs proposed.
- Goals/non-goals, folder structure, JSON schema and worked FFI context example, component inventory,
  navigation, legend, library choices, implementation sequence/model assignments, risks/open questions.
- Commit on `plan/c4-react` and push. No scaffold/code implementation during this task.

### Subsequent user requirements incorporated before the stop

- Framework/SDK owns `github.com/nickstrad/c4-sdk`, cloned at `/root/Software/c4-sdk`; existing scaffold is
  being set up separately. Make this an **implementation plan for that repository**.
- Plan document itself lives in c4-sdk, not ts-db.
- ts-db GitHub Pages consumes it by copying the project in (crude copy). No npm packaging or publishing
  now; publishing is a later open item.
- Include a showcase under c4-sdk `demos/` based on https://cursor.com/blog/git-at-any-scale. Fetch/read
  the post first. Model it using JSON diagrams plus STE100 write-ups.
- Port ts-db's `docs/knowledge` durable-memory pattern.
- Use Playwright throughout validation/implementation, not only at the end.
- Structure as vertical slices wherever possible.
- Unit tests plus fast-check properties for logic in addition to Playwright.
- Lean heavily on pure business/domain functions independent of framework logic; thin hooks plus dumb
  views should enforce this division.
- Latest testing/model/concurrency/state/delegation refinements are incorporated as listed at the top and independently reviewed.

### Earlier, separate language research history

Nick earlier requested language-switch research, ultimately dropping Postgres-only completely and retaining
per-tenant SQLite files as the primitive to master (language switch, concurrency, file descriptors).
That work was completed on ts-db `research/astra-lang-switch`, commit `c3a2d77`, pushed:
`docs/architecture/language-switch-astra.md`, recommendation Go sidecar hybrid. It is not the active task.
Nick explicitly allowed skipping the log-event step if it fails. Do not revive the abandoned Postgres scope.


## Research and source evidence

- Cursor article was fetched and read before planning demo, via web tool, source `turn15view0` in prior
  context: Vicent Martí, “Git at any scale”, 2026-08-18,
  https://cursor.com/blog/git-at-any-scale.
- It describes Continuity behind Origin, local Git caches, S3 WAL/index, CAS publication, rendezvous
  placement, gossip/conditional freshness reads, rebuild and compaction. Plan includes a short sourced
  summary and labels proposed decompositions. Avoid copying the article/diagrams or claiming unexposed
  process boundaries/languages/topology as fact. Re-fetch on restart if detailed review requires contents.
- Prior primary docs checked/linked: c4model.com diagram taxonomy/code/dynamic/deployment/notation;
  React Flow custom nodes, accessibility, layout, subflows; ELK GitHub; React Router; Zod JSON Schema;
  Vite build; Tailwind/shadcn Vite; fast-check, Vitest, react-markdown; Playwright accessibility; ASD-STE100.
- Pinned ts-db content sources in plan:
  - Current main `e808983cefcabe9ba1fe28ce7ea54fb6725a7e0c`.
  - FFI diagrams `bc1a1b55e368a730fc1d8300e14cae566d246a31` (`docs/ffi-c4`).
  - Fable rationale `d97bcf8f145e94279b882665c70412eabdaba775` (`research/fable-lang-switch`).
- Conversions preserve planned/current distinctions, mapping inventories and documented-read path fidelity;
  libsqlite3 is not an independent running container, measurements are historical observations, and a point
  read does not prove a hard wall-clock bound.

## Hardening follow-up

Online npm audit in preflight confirmed 7 high-severity entries from one underlying braces <=3.0.3 stack-exhaustion advisory, propagated through micromatch/fast-glob/ts-morph/shadcn. Primary advisory https://github.com/advisories/GHSA-vfj7-8cjw-p6xm lists no patched version (checked2026-10-13). Existing app references shadcn only through its CSS import; no direct runtime glob imports found. This is an initial exposure assessment, not proof of absence from final bundles. C4-10 must verify the production bundle and document toolchain exposure or resolve with a supported dependency change. Do not apply npm audit force downgrade to shadcn1.0.0. Offline audit returned empty data and is not evidence of a clean audit.
