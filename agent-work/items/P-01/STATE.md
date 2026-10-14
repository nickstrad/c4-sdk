# P-01 checkpoint

Status: implementation complete; validation in progress, independent review pending.

Goal: freeze the public SDK API and support proposal before package implementation. Nick approved the productionization track on 2026-10-14; P-01 is its required first, serialized item.

Plan: [`docs/plans/productionization.md`](../../../docs/plans/productionization.md). Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Root checkpoint: [`STATE.md`](../../../STATE.md).

Builder: fresh Codex Sol `/root/p01_public_contract_builder`, isolated worktree `/tmp/c4-sdk-p-01`, branch `item/p-01-public-contract`, base `a585d97`. Independent reviewer: fresh Claude Sonnet, only after the builder commits and cleans its worktree.

Owned paths are enumerated in claims. Coordinator retains STATE/COORDINATION and plan ownership. No package/release work is allowed before P-01 is reviewed and landed. Actual `npm publish` is outside the approved boundary and requires Nick present for account login/2FA.

## Progress

- Added deliberate root/core facade entries; existing source-consumer barrel and behavior unchanged.
- Added public contract, proposed support matrix/name/version and compiler-resolved API snapshot.
- Added source-entry/decode/ownership/navigation/core-graph checks and structural host composition with intentional misuse errors.
- No registry queries, installs, publication, manifest/build/test-runner edits, or out-of-claim product edits.
- API runtime tests: 5/5 PASS; structural/API-test compilation: PASS; unit/hooks: 204/204 PASS; properties: 34/34 PASS; full typecheck: PASS; lint: exit0 with inherited button fast-refresh warning; generic production build: PASS with existing chunk-size warning.
- Root `tsconfig.tests.json` already includes `tests/api`, so root typecheck checks the structural fixture. Existing Vitest projects exclude API runtime tests; P-02 must register API discovery in sdk-check/CI.
- Existing renderer source imports CSS transitively. Vitest neutralizes CSS for source import tests; plain Node entry safety and explicit stylesheet extraction are P-02 artifact gates, not established P-01 claims.
- Knowledge pages/index and script paths are read-only under the claims. Durable decisions will be reported to the coordinator for reconciliation rather than edited outside ownership.
- Live event inbox inspected: zero live event files. Publication remains skipped under the existing root-checkpoint exception; no event is fabricated.

## Validation and reproduction

Existing repository node_modules were reused via an ignored symlink; no install/registry access. Runtime versions: Node22.23.2, React/React DOM19.3.0, TypeScript6.0.3, Vite8.3.4, Vitest5.0.4, ELK0.12.0, React Flow12.12.0, Zod4.6.7, Playwright1.64.0.

Completed checks:

| Check | Command | Evidence |
| --- | --- | --- |
| API snapshot/runtime/graph | `node node_modules/vitest/vitest.mjs run --config /tmp/c4-sdk-p-01-vitest.config.mjs` | 5 PASS, `/tmp/c4-sdk-p-01-api.log` |
| Structural contracts/API test types | `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --jsx react-jsx --module esnext --moduleResolution bundler --target es2023 --types vite/client,node --resolveJsonModule tests/api/public-api.test.ts tests/api/structural-contract.tsx` | Exit0; root typecheck also includes tests/api |
| Unit/hooks | `npm run test:unit -- --reporter=dot` | 204 PASS, `/tmp/c4-sdk-p-01-unit.log` |
| Properties | `npm run test:prop` | 34 PASS, `/tmp/c4-sdk-p-01-property.log` |
| Typecheck | `npm run typecheck` | Exit0, `/tmp/c4-sdk-p-01-typecheck.log` |
| Lint | `npm run lint` | Exit0, inherited warning, `/tmp/c4-sdk-p-01-lint.log` |
| Production build | `npm run build` | Exit0, existing large-chunk warning, `/tmp/c4-sdk-p-01-build.log` |
| Scope/links/whitespace | Owned-path inspection, local Markdown link targets, `git diff --check` | PASS |

Recreate the scratch API runner config (shared configs stay unchanged):

```bash
node --input-type=module -e 'import { writeFileSync } from "node:fs"; writeFileSync("/tmp/c4-sdk-p-01-vitest.config.mjs", "export default { test: { environment: \"node\", include: [\"tests/api/**/*.test.ts\"] } }\n")'
```

Snapshot generation is deliberate, not part of the passing check:

```bash
node --experimental-strip-types --input-type=module -e 'import { publicSnapshot } from "./tests/api/snapshot.ts"; import { writeFileSync } from "node:fs"; writeFileSync("tests/api/public-api.snapshot.json", JSON.stringify(publicSnapshot(), null, 2)+"\n")'
```

Initial validation corrections: TypeScript6 requires `--ignoreConfig` when explicit files are supplied; the first standalone command failed TS5112 before checking files. The first root typecheck caught an invalid ImportDeclaration `isTypeOnly` access in the new graph test; the guard was corrected to discriminate ExportDeclaration/ImportClause, then explicit/root compilation and API tests passed. These are resolved builder corrections, not unresolved support gaps.

## Handoff

Next: complete required validation (targeted production viewer regression pending browser-port lease), commit implementation/evidence, assess finished diff for durable knowledge/reusable scripts, checkpoint exact commits, then clean this worktree. Coordinator retains branch for fresh cross-family exact-commit review. Review/landing are not implied by builder completion.
