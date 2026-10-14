# C4-08 — finish the independent Cursor showcase

Status: ready for build.

Builder seat: fresh Codex Sol (`gpt-6.1-sol`). Independent reviewer: fresh Claude Sonnet, cross-company. The post-reset paired model mapping is active. Root coordinator owns integration and landing. The C4-07 verdict directs Wave E to proceed with C4-08, then C4-09.

## Goal

Complete `demos/git-at-any-scale/` as a source-grounded, independently useful showcase of the Cursor Git-at-scale article using the shared C4 SDK. Reconcile stale statements in the root SDK README that contradict delivered slices.

## Scope and ownership

### Owns

- `demos/git-at-any-scale/README.md`
- `demos/git-at-any-scale/content/research/` (including source ledger and glossary)
- `demos/git-at-any-scale/public/catalog.json`
- `demos/git-at-any-scale/public/diagrams/continuity.json`
- `demos/git-at-any-scale/src/style.css`
- `tests/browser/showcase/`
- `tests/unit/showcase.test.ts`
- `tests/property/showcase.test.ts`
- Root `README.md`, only for the explicitly assigned stale-contract reconciliation below
- `agent-work/items/C4-08/{brief,claims,review,STATE}.md`

### Read-only

- `docs/plans/implementation.md`, `docs/knowledge/index.md`, `docs/knowledge/gotchas.md`
- `demos/git-at-any-scale/index.html`, `src/main.tsx`, `vite.config.ts`, existing fixtures and the source ledger
- SDK source, fixtures, existing tests, and the C4-07 review record
- The original article at <https://cursor.com/blog/git-at-any-scale>

Do not edit SDK source, package/config/manifests/lockfiles, copier code, the generic seven-types fixture, consumer fixture, root `STATE.md`, or `agent-work/COORDINATION.md`. Root owns the latter two and integration.

## Requirements

Complete the source-linked context, containers, explicitly inferred components, dynamic push/read/compaction stories, and illustrative deployment using only common SDK features. Preserve local disposable Git caches, rendezvous placement, WAL upload versus CAS publication, gossip optimization versus conditional freshness, rebuild/compaction, and the partial order in the source. Do not invent Cursor source classes, implementation language, real host topology, process boundaries, a total order, or incompatible simultaneous failure paths.

Every diagram and element needs original Plain and draft Issue 9 STE text, sources, glossary terms, source-to-ID mapping, evidence status, and review metadata. STE diagnostics are advisory, not certification. The guided path should expose inspection, legend, documentation modes, drill, scenarios, alternatives, and shareable links. Keep content in JSON and documents, without demo-specific renderer branches.

Update root `README.md` sections “Supported contract and current limits” and “Navigation and extension seams” so they describe delivered ELK/group layout from C4-04, rich Markdown documentation, and all seven diagram kinds. Preserve other correct guidance and reference the implementation plan for remaining work.

## Acceptance and validation

- Content and tests cover inventories, provenance, valid references, every supported selection, source links, review state, and the corrected root README claims.
- Production browser journeys exercise real reading, diagram selection, legend/docs modes, drill/scenarios/shareable links, and fresh deep links on desktop and mobile. Include keyboard and 200% zoom where useful; inspect screenshots.
- Run unit/property checks for content logic, relevant typecheck/build/lint checks, and the production browser suite. Report any failures and their reruns accurately; do not turn intermittent failures into a clean-suite claim.
- Review exact committed builder head with a new Claude Sonnet session. Builder commits implementation first, then separately assesses/commits durable project knowledge and reusable scripts/info when justified; updates this item's STATE and cleans its worktree. No merge or push by builder.
- C4-09 does not start until C4-08 is reviewed and integrated.
