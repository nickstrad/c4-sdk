# Decisions

Record dated decisions and rationale; link to authoritative detail. Mark superseded decisions instead of
removing history.

## 2026-10-12 — Standalone SDK and copied-project consumption

The framework belongs to c4-sdk, with its authoritative implementation plan here. ts-db Pages consumes a
reviewed project snapshot by copy, with provenance and consumer-owned content outside the copied tree.
There is no npm packaging or publishing in this implementation; publishing remains a later open item.
See [repository and copy workflow](../plans/implementation.md#2-repository-structure-and-copy-based-consumption).

## 2026-10-12 — Pure domain rules, thin hooks and dumb views

Pure TypeScript functions own model validity, navigation, projection and other domain decisions. Hooks
integrate framework lifecycle and effects through ports; views receive presentation props and callbacks.
This keeps the business rules testable without React or a browser. See
[component architecture](../plans/implementation.md#4-mandatory-view-hook-and-container-architecture).

## 2026-10-12 — Vertical slices with three test layers

Build usable paths through data, domain, hooks and presentation. Logic changes carry meaningful unit tests and fast-check properties; visual slices carry Playwright
journeys beginning with the first screen. Nonvisual work uses appropriate validation without artificial UI.
See [slice sequence](../plans/implementation.md#10-vertical-implementation-slices) and
[verification](../plans/implementation.md#11-verification-knowledge-and-open-decisions). These are future
implementation requirements, not test results for the documentation-only planning task.

## 2026-10-12 — Independent showcase and project memory

The showcase in `demos/git-at-any-scale/` uses architecture JSON and STE100/plain write-ups based on the
Cursor article. Source-documented facts, inferred decomposition and illustrative deployment stay explicit.
The existing ts-db architecture conversion remains a separate consumer milestone. See
[showcase and consumer milestones](../plans/implementation.md#9-showcase-and-consumer-milestones).

The scaffold already ported ts-db's Markdown knowledge-store pattern. Keep its index, dated decisions,
gotchas and glossary, but record c4-sdk knowledge rather than importing ts-db history. This planning task
populates those decisions; [its brief](../../agent-work/items/implementation-plan/brief.md) defines scope.

## 2026-10-12 — Dispatch, concurrency and maintained state

Nick's updated rule supersedes the initial Astra-heavy, serial draft: Sol is the default, Astra requires a
particularly difficult problem, and Luna can own tightly scoped production work. The plan names concurrent
batches, disjoint claims and serial integration gates. The coordinator maintains root `STATE.md` for every
session and handoff; builders report item-local state. See [protocol](../../AGENTS.md) and
[implementation slices](../plans/implementation.md#10-vertical-implementation-slices).

## 2026-10-13 — Shared contracts precede parallel features

Batch C has explicit seams: validated groups and immutable scene presentation inputs feed a geometry-only layout adapter. Worker clients reattach original validated objects after receiving geometry. Measurement records use own-key lookup, and group IDs have a separate namespace from element IDs. Component/docs work owns schema and projection; layout owns geometry, canvas and renderer composition. See [contracts](../plans/batch-c-contracts.md) and [review](../../agent-work/items/C4-preflight/review.md).
