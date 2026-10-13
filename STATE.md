# C4 SDK build state

Updated: 2026-10-13. BUILD AUTHORIZED. Main includes reviewed C4-04; combined checks PASS; C4-09a landed713e5df; combined typecheck,106unit/hooks,21properties PASS. The mission continues through C4-10.

## Authorization and ownership

Nick's `build-kickoff.md` authorizes the whole implementation plan, independent reviews, commits and pushes as items land. Historical plan-only restrictions are superseded. No manual site deployment or npm publication is requested. Existing remote commit `0e32ef9` added automatic Pages deployment on main pushes; preserve it. Authorized pushes invoke that workflow.

Latest staffing instruction: use **Codex Astra/Sol/Luna only** until Twin explicitly confirms the Claude reset. The estimated 2026-10-13 05:59 UTC reset time does not itself lift the restriction. No Claude builders or reviewers have been used.

Work has only regular `agent-work` items and `sq-*` side quests; no experiment protocol/board. The scaffold and correction landed as `486db29` and `967d573`; experiment files are absent and mandatory STATE conventions are in AGENTS. Preserve untracked user files `build-kickoff.md` and `kickoff-brief.md`.

Root owns this checkpoint, COORDINATION, shared configuration/manifests, integration and knowledge reconciliation. Builders maintain item-local STATE/claims in separate worktrees. Every item requires independent exact-commit review before landing. Common Git event publication is denied; Nick explicitly permits skipping it. Do not fabricate events.

## Plan and completed items

Authoritative plan: `docs/plans/implementation.md` (reviewed payload `340baa4`, plan branch `6491825`, merged `3524a26`). Shared batch-C contract: `docs/plans/batch-c-contracts.md`.

Order: A01; B02+08a; C03+04+09a; D05→06→07; E08+09; F10. Integrate03→04→09a. Sol is default builder/reviewer, Astra for04's difficult layout problem, Luna high for08a. Do not dispatch serial05 before04/09a land.

| Item | Reviewed payload / landing | Evidence |
| --- | --- | --- |
| C4-01 | Sol PASS `45b7d3e`; landed `541e41a` | 25 unit/hooks,5 properties; production context journeys/screenshots; finite geometry fixes |
| C4-02 | Sol PASS `363a16e`; landed `0561126` | 43 unit/hooks,10 properties,24 browser; native links, route/history/default-catalog fixes |
| C4-08a | Sol PASS `c7d65b4`; landed `9849515` | Cursor source fidelity,11 article anchors/local links, original glossary/ledger |
| Preflight | Sol PASS `0c4d865`; landed `f4f7321`, reconciled/pushed `3ea5789` | 52 unit/hooks,15 properties,24 browser; groups/projection/measurement/geometry contracts; pinned dependencies |
| C4-03 | Sol PASS `5bb3750`; record `35fa16c`; landed `1139a64`, pushed `944530f` | Independent57 unit/hooks+18 properties/typecheck; baseline24+component2+mobile viewport1 browser through affected reruns; source/screenshot review |
| C4-09a | Sol PASS `8fce8d4`; review record `5216e93`; merged after04 | Builder88 unit/hooks+15 properties; reviewer36 focused/400FC plus symlink/tampered-plan refusal cases |

C4-03 merged without conflicts; root combined-tree typecheck,57 unit/hooks and18 properties passed. Root adapted baseline context/navigation tests for responsive Sheet and changed deferred-kind unit assertion to code. Rich docs choice keys include dataset/revision/diagram/element; sources/terms follow selected document. Mobile fixed dialog validated with viewport capture plus bounds, because full-page stitching can mislead. Knowledge recorded in `docs/knowledge/gotchas.md`.

## C4-04 review and integration

Astra builder `/root/c4_04_builder` completed exact `0b45a9b1ccef209e28a060ab1a9719a3b502d7c5`; independent Astra `/root/layout_reviewer` PASS. Review record `f94f234`; merged without conflicts. Combined-tree typecheck,70unit/hooks,21properties PASS before push. Browser lease free.

Independent 70 unit/hooks,21 properties,8 targeted production desktop/mobile browser journeys and both builds/typechecks PASS. Builder final affected20/20 PASS after fixing two failures in earlier full37/2/1 run. Do not describe the earlier full run as clean. Artifacts: `/tmp/c4-04-final-affected-evidence`, `/tmp/c4-04-zoom-final-evidence`, `/tmp/c4-04-production-evidence`; earlier failure/diagnostic directories preserved in item STATE.

Native ELK worker uses elk-api workerFactory and worker importing elk-worker.min.js. Manual authored positions remain exact; labels avoid collisions; edge.container sets local route origin. Output validation, cancellation, bounded geometry cache, font/resize measurement and host-slot session restoration reviewed. Focus pan uses absoluteScene+RFviewport/client dimensions because ReactFlow resets temporary native scroll; pointer down must not pan before click. Root shared CSS heading wrap and canvas-scoped assertions included in reviewed payload. See item STATE/review for full evidence.

Real 200-node/400-edge worker completed4109.2ms on4sharedvCPU/7.8GiB Linux, provisional cancelled254.2ms; this exceeds target and C4-10 must tune/report. No2second claim. Large bundles and existing lint warning tracked.

## Other worktrees and next actions

- C4-03 `/tmp/c4-sdk-c4-03`, branch `item/c4-03-components`: complete/clean; payload `5bb3750`, record `35fa16c`, already landed. Reviewer `/root/components_reviewer` Sol PASS. Final Sheet artifact in `test-results-sheet-viewport/.../component-docs-sheet-viewport.png`.
- C4-09a `/tmp/c4-sdk-c4-09a`, branch `item/c4-09a-copy-policy`: clean at `5216e93`, merged after04. Independent `/root/copy_policy_reviewer` Sol PASS exact `8fce8d4`. Trusted/exclusively owned trees; no multi-file crash atomicity. Single external provenance file option supports pages/c4-sdk-source.json. C4-09 must verify tracked reviewed source inventory.
- Root pushed04 atfc3d43b and merged09a; combined typecheck,106unit/hooks,21properties PASS; push09a and dispatch05. Re-review semantic conflict resolutions.
- Dispatch serial05,06,07 with exact claims based on landed tree. Drafts `/tmp/c4-05-brief.md`, `/tmp/c4-06-brief.md`, `/tmp/c4-07-brief.md`.05 explicitly preserves partial-order parallel semantics; no zipped branch barriers or fabricated execution order.
- Later08+09 concurrent, then10. Drafts `/tmp/c4-08-brief.md`, `/tmp/c4-09-brief.md`, `/tmp/c4-10-brief.md`. Root read all seven pinned Mermaid sources and FFI README flows; prep notes `/tmp/c4-09-source-preparation.md`. Terminal counterparts and full implementation/source conversion review remain09 work.
- C4-10 should assess mobile documentation discoverability (Open explanation currently below canvas+legend), production bundle audit exposure and measured layout target.

Each worktree has its own installed node_modules. **Run Vitest unit and property commands sequentially per checkout**; concurrent processes race on `.vitest-cache`. No reinstalls/config changes without a concrete reason. Browser runners require the single lease. Existing button fast-refresh lint warning and large-chunk build warning are known; no false clean/performance claims.

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

## Concurrent remote change

Preflight push was rejected because origin/main advanced with0e32ef9 (.github/workflows/pages.yml only). Fetched and merged without conflict, preserving the existing automatic Pages workflow. Its base is /c4-sdk/ and it builds dist-demo. No force push or manual deployment was performed.
