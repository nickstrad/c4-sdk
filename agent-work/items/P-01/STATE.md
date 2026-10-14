# P-01 checkpoint

Status: builder complete; required validation PASS; fresh independent review pending. Not merged or pushed.

Goal: freeze the public SDK API and support proposal before package implementation. Nick approved the productionization track on 2026-10-14; P-01 is its required first, serialized item.

Plan: [`docs/plans/productionization.md`](../../../docs/plans/productionization.md). Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Root checkpoint: [`STATE.md`](../../../STATE.md).

Builder: fresh Codex Sol `/root/p01_public_contract_builder`, isolated worktree `/tmp/c4-sdk-p-01`, branch `item/p-01-public-contract`, base `a585d97`. Independent reviewer: fresh Claude Sonnet, only after the builder commits and cleans its worktree.

Owned paths are enumerated in claims. Coordinator retains STATE/COORDINATION and plan ownership. No package/release work is allowed before P-01 is reviewed and landed. Actual `npm publish` is outside the approved boundary and requires Nick present for account login/2FA.

## Progress

- Added deliberate root/core facade entries; existing source-consumer barrel and behavior unchanged.
- Added public contract, proposed support matrix/name/version and compiler-resolved API snapshot.
- Added source-entry/decode/ownership/navigation/core-graph checks and structural host composition with intentional misuse errors.
- No registry queries, installs, publication, manifest/build/test-runner edits, or out-of-claim product edits.
- API runtime tests: 5/5 PASS on the final strengthened snapshot; structural/API-test compilation: PASS; unit/hooks: 204/204 PASS; properties: 34/34 PASS; full typecheck: PASS; lint: exit0 with inherited button fast-refresh warning; generic/demo production builds: PASS with existing chunk-size warning; targeted production browser: 34/34 PASS.
- Root `tsconfig.tests.json` already includes `tests/api`, so root typecheck checks the structural fixture. Existing Vitest projects exclude API runtime tests; P-02 must register API discovery in sdk-check/CI.
- Existing renderer source imports CSS transitively. Vitest neutralizes CSS for source import tests; plain Node entry safety and explicit stylesheet extraction are P-02 artifact gates, not established P-01 claims.
- Knowledge pages/index and script paths are read-only under the claims. Durable decisions will be reported to the coordinator for reconciliation rather than edited outside ownership.
- Live event inbox inspected: zero live event files. Publication remains skipped under the existing root-checkpoint exception; no event is fabricated.

## Validation and reproduction

Existing repository node_modules were reused via an ignored symlink; no install/registry access. Runtime versions: Node22.23.2, React/React DOM19.3.0, TypeScript6.0.3, Vite8.3.4, Vitest5.0.4, ELK0.12.0, React Flow12.12.0, Zod4.6.7, Playwright1.64.0.

Completed checks:

| Check | Command | Evidence |
| --- | --- | --- |
| API snapshot/runtime/graph | `node node_modules/vitest/vitest.mjs run --config /tmp/c4-sdk-p-01-vitest.config.mjs` | Final 5 PASS, `/tmp/c4-sdk-p-01-api-verified.log`; initial passing source check `/tmp/c4-sdk-p-01-api.log` |
| Structural contracts/API test types | `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --jsx react-jsx --module esnext --moduleResolution bundler --target es2023 --types vite/client,node --resolveJsonModule tests/api/public-api.test.ts tests/api/structural-contract.tsx` | Exit0; root typecheck also includes tests/api |
| Unit/hooks | `npm run test:unit -- --reporter=dot` | 204 PASS, `/tmp/c4-sdk-p-01-unit.log` |
| Properties | `npm run test:prop` | 34 PASS, `/tmp/c4-sdk-p-01-property.log` |
| Typecheck | `npm run typecheck` | Final exit0, `/tmp/c4-sdk-p-01-typecheck-verified.log`; initial `/tmp/c4-sdk-p-01-typecheck.log` |
| Lint | `npm run lint` | Final exit0, inherited warning, `/tmp/c4-sdk-p-01-lint-verified.log`; initial `/tmp/c4-sdk-p-01-lint.log` |
| Production build | `npm run build` | Exit0, existing large-chunk warning, `/tmp/c4-sdk-p-01-build.log` |
| Production browser | `npm run test:browser -- tests/browser/context tests/browser/navigation tests/browser/seven-types --workers=1 --output=/tmp/c4-sdk-p-01-browser-verified` | 34 PASS (3.6m), desktop/mobile, both production builds; `/tmp/c4-sdk-p-01-browser-verified.log` and artifacts directory |
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

Implementation/evidence commit: `3799c9ea8dea15845d0dc43066ec8d23ccd717bd`. Snapshot strengthening commit: `5ab5279` (captures common union/private-base fields and applies a local compiler-test timeout; public source/API unchanged).

Browser history: root granted ports4173/4174 after confirming them free. The initial sandbox run exited1 during demo Vite gzip reporting before any tests ran (`/tmp/c4-sdk-p-01-browser.log`, output `/tmp/c4-sdk-p-01-browser`); its startup cause remains unestablished and it is not a browser verdict. The exact targeted command then ran outside the sandbox with output `/tmp/c4-sdk-p-01-browser-verified` and log `/tmp/c4-sdk-p-01-browser-verified.log`: exit0, 34/34 PASS, no skips. Coordinator was notified at the next tool boundary and confirmed the builder runner was active; a separate coordinator retry collided with the occupied ports and failed before tests without stopping this builder runner. That duplicate failure is not a product/test failure. Root confirmed lease release after the successful runner exited.

Final snapshot-check history: diff inspection found that union signatures retained a private `ElementBase` name; the snapshot helper now also captures common union fields, so private-base name/description/etc. changes cannot escape the fingerprint. A concurrent regeneration/typecheck/API-check run then exceeded Vitest's default5s compiler-test timeout (7.2s); `/tmp/c4-sdk-p-01-api-final.log` records1 timeout/4 passes, not a contract mismatch. Regeneration completed and the timeout was raised to30s only for the compiler-resolving test. The sequential final rerun passed5/5 in6.82s, `/tmp/c4-sdk-p-01-api-verified.log`. Typecheck/lint reruns after the final change passed.

Screenshot inspection: desktop and mobile `seven-types-seven-types-co-f8b35-d-member-as-accessible-text-*/code-initial-viewport.png` show the first code card/member compartment readable and bounded. Mobile explanation entry is present above the canvas. Surrounding routes extend out of the reading viewport as documented; no all-members-at-readable-scale entry claim is introduced. All context/navigation/seven-kind screenshots are retained in the verified artifacts directory.

## Post-work knowledge and reusable-script assessment — 2026-10-14

Assessed the final public source diff, contract/snapshot fixtures, validation corrections and browser history after implementation commits. Durable project decisions are already documented authoritatively in [`public-api.md`](../../../docs/api/public-api.md) and [`support-matrix.md`](../../../docs/api/support-matrix.md):

- The root facade supports UI composition and host adapters; core exposes structural data/navigation/membership, preserving the historical source barrel.
- `decodeArchitecture` is the supported unknown-input promotion boundary. Shape-only Zod, semantic-only validation/index builders, the group-rejecting legacy fixed projector, private contexts/renderers and specialized helpers are excluded.
- A transformed source import with inert CSS does not prove packed Node import safety. P-02 must extract CSS, prove dual module/context identity, bundle declarations and register API runtime discovery in SDK CI.
- Installed exact versions are evidence; manifest ranges are not support guarantees. Initial scoped identity/version are recommendations until ownership/artifact gates are verified.

The coordinator retains shared knowledge pages/index ownership; this is the delta for reconciliation into `docs/knowledge/decisions.md` with links to this item and the authoritative API docs. No out-of-claim knowledge edits were made and no separate knowledge-content commit is claimed. This checkpoint is the separate post-work assessment commit.

No new indexed work-script is justified. The compiler snapshot generator is a maintained API-test fixture; a duplicate work-script would repeat that logic. The remaining compile/config-generation commands are one-off validation steps already recorded above. No VM/environment finding warrants a kb update.

## Handoff

Next: commit this separate assessment/checkpoint, then remove only `/tmp/c4-sdk-p-01` and its linked-worktree metadata; retain `item/p-01-public-contract` and its commits. Cleanup is verified in the builder's completion report after the checkpoint is durable. Coordinator reviews the exact final branch HEAD with a new Claude Sonnet agent/worktree, reconciles the knowledge delta and lands only after PASS. P-02/P-03 remain gated; no publication or ts-db action is authorized by this checkpoint.
