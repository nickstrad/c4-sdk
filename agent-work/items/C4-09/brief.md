# C4-09 — consume the copied project in ts-db

Status: unpaused after the FFI gate. This first unit builds the c4-sdk-owned generic copy command, consumer tests, and guide. A separate fresh ts-db unit will own the Pages content, copy/provenance integration, production fixture, and diagrams surface after this command is reviewed and landed.

## Context and outcome

The implementation plan's dispatch gate is met: ts-db `origin/main` includes FFI-01 through FFI-08 and FFI-04b; FFI-08 is `0b82504290d7eaeac3751f519dd85fdd221ebe63`. C4-09a's safe manifest policy and filesystem adapter are already on c4-sdk `main` and reviewed. Implement a reusable c4-sdk command that stages a selected reviewed source revision into an isolated copy, creates and applies a safe managed-file plan using C4-09a, and writes external provenance. Add tests using temporary Git repositories and a guide that a later ts-db unit can follow.

The later ts-db unit must use a reviewed c4-sdk source revision and own `pages/c4-sdk/`, `pages/content/`, `pages/c4-sdk-source.json`, the `/ts-db/` build/consumer configuration, and `pages/diagrams/` (or a link). Current and proposed C4 diagrams must be visible side by side and clearly distinguished; diagrams should be used more during feature design. This design surface supplements the Pages consumer content and copy workflow.

## Builder work

Implement only the c4-sdk-owned generic copy tooling, its isolated consumer tests, and its user-facing guide. The command must select an existing reviewed c4-sdk commit, stage its tracked project without `.git`, dependencies, build output, browser artifacts or local-only data, compute exact checksums/modes, and produce a reviewable plan. It must refuse local edits or unsafe/unmanaged conflicts, replace/delete only files in the previous managed inventory, preserve consumer content outside the vendor subtree, write provenance last, and leave a repeated same-revision copy unchanged. Require an explicit apply operation after preview. Keep the source license and attribution.

Use existing Node APIs and the landed C4-09a policy/filesystem functions; do not add dependencies, npm packaging, Git/npm dependencies, automatic publishing, or deployment. Do not mutate ts-db or add ts-db-specific paths/content to the generic command. If C4-09a APIs cannot support the contract without changes to its owned modules, stop and hand that gap to the coordinator.

## Acceptance

- Tests create temporary source and consumer repositories, copy one revision, prove exact managed inventory/checksums/modes and provenance, repeat with no content change, then copy a changed source revision while preserving consumer-owned files.
- Refusal tests cover modified/missing managed targets, malformed or unsafe source inventories, unmanaged conflicts, and a provenance-write failure; describe the documented partial-write limits honestly.
- The existing unit/property suites pass, and the command can be run with the repository's supported Node/TypeScript invocation without changing package manifests.
- The guide shows preview then explicit apply, update/re-copy, provenance interpretation, owned versus consumer content, and recovery boundaries.
- Commit implementation, then any separately justified project knowledge/reusable-script assessment; update this item STATE. Return an exact commit for a fresh independent Claude Sonnet review. Do not merge or push main.

## Exclusions

No edits to c4-sdk app/SDK/demo source, package manifests/locks/config, existing C4-09a policy/filesystem/type modules, existing C4-09a tests, root README, C4-10 files, root STATE/COORDINATION, or any ts-db file. The coordinator owns shared records and integration. The separate ts-db unit starts from a reviewed c4-sdk revision after this unit lands.
