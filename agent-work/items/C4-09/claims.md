# C4-09 c4-sdk copy-tool claims

Phase: generic c4-sdk tooling/tests/guide only. The ts-db Pages integration is a separate claim and fresh-agent unit after this phase is reviewed and landed.

Base: coordinator records the exact pushed c4-sdk main SHA before dispatch. Worktree: `/tmp/c4-sdk-c4-09`, branch `item/c4-09-copy-consumer`.

## Owns

- `work-scripts/node/copy-project/copy-project.ts` (new generic preview/apply command)
- `work-scripts/INDEX.md` (one index row for the new command)
- `vitest.config.ts` (one additive discovery glob for `tests/copy-consumer/cli.test.ts`; no other configuration edits)
- `tests/copy-consumer/cli.test.ts` (new isolated command/consumer tests)
- `tests/copy-consumer/fixtures/**` (new temporary-repo fixture helpers, if needed)
- `docs/embedding/copy-consumer.md` (new generic operator/consumer guide)
- `agent-work/items/C4-09/{brief,claims,review,STATE}.md`

## Reads / exclusions

Read all instructions, implementation plan §2 and §10, the landed `work-scripts/node/copy-project/{policy,filesystem,types}.ts`, its existing `tests/copy-consumer/policy/**`, and C4-09a review/STATE. The existing policy modules and tests are read-only. The only config permission is adding the exact new CLI test path to Vitest unit discovery; do not change any other test configuration, package manifest, or lockfile. Do not edit root coordinator records. Do not edit app/SDK/demo source, root README, C4-10, or any ts-db path. No publishing or deployment.
