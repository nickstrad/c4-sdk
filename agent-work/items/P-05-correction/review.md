# P-05 correction final independent review — FAIL / HUMAN

- Exact reviewed commit: **78500057cbc78323dbf99f44621cbdf12a8613ce**, implementation **2dbe6fc**; correction base **173f12f**.
- Fresh independent Codex Sol review of fresh Sonnet correction, 2026-10-15. Branch `review/p-05-correction-sol`, assigned worktree `/tmp/c4-sdk-p-05-correction-review`. No delegation or product edits. Owns only this file and `review-STATE.md`; event skip applies.
- Read the full [final arbitration](../P-05-fixup/arbitration.md), correction brief/claims/STATE, original reviews from exact `20cbece` and `f258963`, repository instructions/checkpoints/coordination and knowledge/event indexes. This verdict applies the binding arbitration contract, including its designated-field requirements beyond the enumerated examples.

## Blocking finding — F1 designated location fields are still not validated

**Medium; `work-scripts/node/release/policy.mjs:207–223`.** `scanLocations` recursively accepts any location-shaped value without checking designated field types. Arbitration F1 clause 2 explicitly requires `consumer` to be a nonempty string and `screenshots` to be a nonempty array of nonempty strings; clause 3 says no present designated location field may be malformed. All these malformed reports instead return `[]` from `checkReadmeReport` with matching identity and `passed:true`:

```js
{ evidence: { consumer: ['/tmp/x'] } }
{ evidence: { consumer: { path: '/tmp/x' } } }
{ evidence: { screenshots: '/tmp/x.png' } }
{ evidence: { screenshots: { path: '/tmp/x.png' } } }
{ evidence: { screenshots: [['/tmp/x.png']] } }
```

The object branch also reports `{ malformed:false, count:0 }` for an empty object. Consequently `{ evidence:{ consumer:'/tmp/x', a:{} } }` is accepted despite the nonempty-object location rule; an empty `evidence:{}` alongside valid `evidenceLocations` is also accepted. These are plain JSON cases. The committed tests enumerate the requested examples but omit designated-field type mismatches and empty objects accompanied by another location. The real producer integration failure is repaired, but the bounded correction does not fulfill the complete binding F1 contract.

Minimal reproduction from exact reviewed checkout:

```sh
node --input-type=module <<'JS'
import { checkReadmeReport } from './work-scripts/node/release/policy.mjs';
const id = { sha256: 'a'.repeat(64), version: '0.1.0' };
for (const evidence of [{consumer:['/tmp/x']}, {screenshots:'/tmp/x.png'}, {screenshots:[['/tmp/x.png']]}, {consumer:'/tmp/x', a:{}}]) {
  console.log(evidence, checkReadmeReport({passed:true, ...id, evidence}, id));
}
JS
```

Each returns no errors. This is a contract defect in report validation; no actual publication was attempted. **Return to HUMAN under final arbitration; no automatic repair or re-review loop and no landing authorization.**

## Independently verified repairs and non-regressions

- **F1 producer compatibility:** the actual `/tmp/p04-review-evidence/report.json` (sha256 `bfdfaf8c3404e139360d08df07972f33f9e42361d6bc04c034071f98ed704263`, version `0.1.0-beta.1`) passes directly. All mandated accept shapes, evidenceLocations alone and beside output-only evidence pass. Every enumerated rejection, missing fields, malformed additional evidenceLocations, and passed/hash/version mismatch reject. The actual report's evidence also passes through `releaseVerify` with injected IO and adapted fixture identity; readme stage is passed.
- **F2:** independently exercised actual `releasePack`/`createIo` on a disposable real filesystem, replacing only git/process calls. Build creates an artifacts-ancestor symlink; pack rejects before outside candidate directory or marker creation. In a scratch copy only, removing the new pre-mkdirp branch makes the same independent absence assertion fail (`true !== false`). Product checkout remained unchanged. Existing pre-deletion physical/lexical checks, regular marker check, and post-mkdirp check remain intact.
- **R1/R2:** full suite includes outside/protected-source ancestor, candidate/marker symlinks and positive replacement; dirty-after-build, moved HEAD, clean override and ordinary clean provenance tests exercise the injected publish boundary. No source changes to these guards beyond the authorized F2 ordering.
- **Declarations/digest:** independently confirmed runtime-only `.mjs`/`.cjs` targets reject and corresponding `.d.mts`/`.d.cts` targets resolve; integer size increment changes inventory digest. Committed digest property uses `files[index].size + 1`.
- **Scope:** exact correction diff `173f12f..7850005` is eight files: policy/cli, three release test files and three correction records. Only the README validation and containment ordering changed in guard source. `git diff --check` passes from both correction base and original review. Target tree has no tracked `dist-sdk/**` or `artifacts/**`; neither correction commit touches generated paths. Historical accidentally generated commits remain historical and were removed before this correction, as arbitration records.

## Validation and evidence

`npm ci --prefer-offline --no-audit --no-fund` succeeded (543 packages), Node 22.23.2 / npm 10.9.8. `make sdk-check` with subprocess permissions exited **0**: typecheck passed; lint passed with only inherited button.tsx fast-refresh warning; unit/hooks **204/204**, properties **34/34**, API **5/5**, full release suite **95/95** (four files, including all six real-filesystem tests). Logs: `/tmp/p05-correction-review-install.log`, `/tmp/p05-correction-review-sdk-check.log`. These passing tests do not cover the blocking malformed designated-field cases above.

Scratch reproduction: `node /tmp/p05-correction-independent.mjs`, log `/tmp/p05-correction-independent.log`. Mutation driver/log: `/tmp/p05-correction-mutant-driver.mjs`, `/tmp/p05-correction-mutant.log`. These scripts import the assigned checkout by absolute path; restore it at that path or adjust imports to rerun after cleanup. The matrix intentionally prints binding malformed-field failures without aborting, so its exit 0 does not imply contract approval.

No fresh pack, real consumer/browser matrix or combined release-check claimed. The actual README-plus-package combined gate remains coordinator-owned on the integrated tree. No publish, tag, push, merge or auth change occurred.

## Knowledge and reusable-script assessment

The durable lesson is to test designated evidence field schemas as well as generic recursive location shapes, including empty subobjects beside valid locations. Coordinator may index this finding with the arbitration; reviewer owns no shared knowledge/index paths. No reusable helper warranted: existing release regression harness is the proper home, and review repros are one-off scratch files. Final arbitration routes this non-PASS to a human.
