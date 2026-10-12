# C4 SDK planning state

Updated: 2026-10-12 UTC. Status: **Planning complete; reviewed plan published. No implementation started.**

## Current workspace and authorization

- Repository: https://github.com/nickstrad/c4-sdk; main checkout `/root/Software/c4-sdk`.
- Active branch/worktree: `plan/c4-react`, `/tmp/c4-sdk-plan`.
- Baseline scaffold: `486db29babd40f0b2780e3eac448a5189ea0fd00`.
- Initial plan commit: `3fb8227b08f171d2b2281c6065d829c851a71d8c`, now published in branch history.
- Revision `a0eefc0` plus checkpoint correction `340baa4` apply Nick's restart instructions. Plan only: commit/push authorized; no SDK build or merge.
- Main checkout's unrelated `kickoff-brief.md` remains untouched. This STATE is mirrored there for restart.
- ts-db pointer worktree `/tmp/tsdb-c4-react-plan`, branch `plan/c4-react`, published at
  `187f4f9d03b06f032b3916159664728fa5b1c863`. The old plan is now only a relocation pointer.

## Latest rules now incorporated

- Sol default builder/reviewer; Astra only for justified difficulty (compound layout/worker lifetime C4-04).
- Luna high for tightly scoped work, including production source ledger C4-08a; not always an experiment.
- Vertical slices wherever useful, unit/fast-check for logic and Playwright throughout visual slices.
  Nonvisual work uses direct validation instead of fabricated screens/browser tests.
- Explicit concurrent batches and shared-file integration ownership; separate worktrees and item records.
- Maintain STATE.md at dispatch, decisions, review/integration and every pause/handoff/completion.
- Use subagents where helpful. A read-only concurrency audit completed; coordinator owns synthesis.

## Written changes and current plan

Authoritative plan: `docs/plans/implementation.md`. Includes all seven types, complete FFI JSON example,
pure domain / thin hooks / dumb views, navigation, legend, safe Plain/STE docs, runtime validation,
React Flow/ELK adapters, Cursor demo and ts-db copy consumer. No npm packaging/publication now.
Knowledge index/decisions/glossary populated. AGENTS now contains model/concurrency/testing/state protocol.
CLAUDE unchanged: shared branch/commit sections were not changed. Task brief/claims own all these docs.

Concurrency: 01 solo; 02 + source ledger08a; 03 + layout04 + pure copy09a after contract/dependency preflight;
05/06/07 serial because they share schema/dispatch; final demo08 + copied consumer09; final hardening10.
Preflight can serialize 03/04 if current code does not support their claimed separation. Coordinator owns
root manifests/configs, STATE, board and knowledge index; exact claims precede dispatch.

The copy workflow pins SHA/inventory, protects local/unmanaged content, preserves ts-db-owned JSON outside
snapshot and tests the production `/ts-db/` subpath. Cursor data distinguishes sourced claims, inferred
components and illustrative deployment. Code-level demo uses generic/source-grounded fixtures.

## Agents, checks and pending work

- `concurrency_audit`: read-only planning suggestions received; no files edited. Integrated ownership,
  serialization and nonvisual-test recommendations. Coordinator retains final plan design.
- Previous `/root/review_plan` review of initial plan was interrupted on Nick's STOP. No verdict claimed.
- Current JSON/link/whitespace and AGENTS/CLAUDE overlap validation passed (10 elements, 8 relationships,
  2 diagrams). No runtime unit/property/Playwright tests run for this docs-only task.
- Event publication failed again due read-only Git common directory; skipped under Nick's exception.
- `/root/final_plan_review` returned PASS on `340baa4183c9dfbc0fbc935cb8552d7f0312ec72`;
  initial checkpoint/whitespace nits were corrected. See the task review record.
- Reviewed c4-sdk payload and ts-db pointer were pushed; both remote SHAs verified with git ls-remote.
  This administrative completion record follows the reviewed payload; use git log for its own SHA.
- Next work, only after build authorization: C4-01 brief/claims and first working context. Plan defines
  later concurrency; no active builders or pending plan review remain. No main merge occurred.
- Keep STATE current through those steps. Implementation starts only with a later authorized build session.

## Environment and work protocol

Read AGENTS, CLAUDE, docs/knowledge/index and agent-work/items/implementation-plan/{brief,claims,review}.
Use existing isolated worktree; product files/configs/dependencies are out of scope. Writable roots are
/tmp and /root/Software/ts-db; c4-sdk common Git writes and main-checkout STATE mirror require escalation.
No formatter/test runner was configured in baseline; do not claim future npm scripts ran. Reusable helpers
need work-scripts INDEX review/registration; oneoff document checks need no repo helper.
Environment questions use kb with feedback; project knowledge is Markdown, not kb. Search297 was already
judged none. Do not access raw knowledge corpus. Coordinator alone pushes; no main merge authorized.

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
