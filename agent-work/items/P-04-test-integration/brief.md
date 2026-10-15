# P-04 test integration brief

Fresh Sonnet 5.5 builder, branch `fix/p-04-doc-test-integration`, base `927740f`, worktree `/tmp/c4-sdk-doc-test-integration`. Not a P-05 repair.

## Goal
The combined release-check (`/tmp/c4-p04-p05-integration.log`) fails two old source tests tied to the pre-P-04 README:
- `tests/hooks/composition.test.tsx` "the README composition example is the tested, compile-checked example" expects a `<!-- composition-example -->` marker and `tests/hooks/composition-example.tsx`.
- `tests/unit/showcase.test.ts` "reconciles only the delivered contract claims in root README" expects retired exact prose (`asynchronous ELK worker`, `Documentation renders Markdown`).

Reconcile both with the current README without deleting tests or weakening invariants.

## Owns
`tests/hooks/composition.test.tsx`, `tests/unit/showcase.test.ts`, this item's `brief.md`, `claims.md`, `STATE.md`.

## Read-only
README.md, `examples/readme/**`, `tests/readme/**`, all release code/tests, product source, manifest/lock, config, coordination/root STATE.

## Acceptance
Targeted and full unit/hooks, properties, API, typecheck, lint and `make sdk-check` pass. No publish/tag/push/merge/auth/delegation. Implementation+evidence commit, then separate assessment/checkpoint commit.
