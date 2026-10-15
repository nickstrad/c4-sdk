# P-05 Opus independent review — PASS

- Exact reviewed HEAD: **d7183b7b09c5023061361472e7226f2427f910f0**, implementation **0026e49**, base **216d7f9**.
- Fresh independent Codex Sol reviewer of Claude Opus, 2026-10-15. Assigned branch `review/p-05-opus-sol`, worktree `/tmp/c4-sdk-p-05-opus-review`. No delegation or repair; product code read-only. Owns only this record and `review-STATE.md`. Event skip applied.
- Authority: Nick's `/root/c4-lead-p05-human-ruling.md` authorizes this one cross-family re-review and supersedes the prior stop at final review **9e1dd9c**. Read that ruling, the full [Muse arbitration](../P-05-fixup/arbitration.md), prior final review/checkpoint, Opus [brief](brief.md)/[claims](claims.md)/[STATE](STATE.md), repository instructions, root checkpoint, coordination, and knowledge/event indexes. Historical original/fixup findings were also inspected.

**PASS. No blocking defects or nits found.** The complete evidence schema required by the human ruling is enforced, including designated types and empty nested containers beyond the prior enumerated cases. This is review approval; the actual combined release gate remains coordinator-owned and pending.

## Independent contract validation

- Independently exercised **264 malformed cases** across both `evidence` and `evidenceLocations`, with valid companions and wrappers at multiple object/array depths. Invalid consumer arrays/objects/scalars, screenshots strings/objects/nested arrays/malformed entries, and empty nested objects/arrays all reject with evidence-locations errors. A valid sibling or other evidence field cannot mask a defect. All seven prior final-review failures reject.
- Required valid strings, arrays, nested objects and browser locations pass. Both fields are evaluated; valid locations alone or together pass, missing fields reject, and output-only evidence requires a valid companion location.
- Only root `evidence.output` receives the execution exception. Nonempty object/array execution output containing numbers, booleans, nulls and malformed location-like names is allowed without counting as a location. Empty/scalar output rejects. Nested output and `evidenceLocations.output` remain subject to location validation. Execution output cannot independently satisfy the location requirement.
- Committed `tests/release/fixtures/p04-readme-report.json` matches `/tmp/p04-review-evidence/report.json` **byte-for-byte**. The real report passes with its original identity: tarball SHA256 `bfdfaf8c3404e139360d08df07972f33f9e42361d6bc04c034071f98ed704263`, version `0.1.0-beta.1`. Inspected main's landed `tests/readme/verify.mjs` read-only: it emits `{ consumer, output: { esm, cjs }, screenshots }`, including numeric `nodes: 4`. The actual report's evidence passes the real `releaseVerify` orchestrator with injected IO and adapted fake-artifact identity; readme stage is passed. Committed orchestrator tests also reject malformed consumer, screenshots and empty extra object.
- `passed !== true`, hash mismatch and version mismatch still reject. The identity code is unchanged by this correction.

## Properties, mutations and closed findings

The new properties construct valid location trees independently, inject single defects into generated node paths with valid companions, generate designated-field type violations, vary execution output, and vary identity. These test contract invariants rather than restating the validator. Deterministic tests cover designated fields at depth and the producer shape.

Independently replayed six mutations in a disposable scratch copy: remove designated typing (**3** failing tests), allow empty objects (**4**), allow empty arrays (**3**), inspect only one evidence field (**8**), exempt output at any depth (**1**), and exempt evidenceLocations output (**1**). Each was caught; restored policy suite **53/53** passed. Reviewed the builder's broader mutation assessment; the additional mutations listed there are builder evidence, not claimed as independently rerun. Assigned code was never mutated.

- **F2:** independently used actual `releasePack`/`createIo` on a disposable real filesystem, replacing only git/process calls. Build introduces an artifacts-ancestor symlink; rejection occurs with outside candidate directory and marker both absent. All six committed real-filesystem tests pass.
- **R1:** outside/protected-source ancestor, candidate/marker symlink and positive replacement tests pass. Physical/lexical checks and marker handling are unchanged from the corrected base.
- **R2:** clean override, dirty-after-build, moved HEAD and ordinary clean provenance tests pass; injected publication refuses all override evidence. `cli.mjs` and `process.mjs` are unchanged.
- **Declarations/digest:** independently confirmed runtime-only `.mjs`/`.cjs` imports reject and packed `.d.mts`/`.d.cts` counterparts resolve. Incrementing one integer size changes the digest; the committed property still uses `files[index].size + 1`.

## Required checks and scope

`npm ci --prefer-offline --no-audit --no-fund` succeeded: **543 packages**. `make sdk-check` with subprocess permissions exited **0**: typecheck passed; lint passed with only inherited `src/components/ui/button.tsx:57:18 react(only-export-components)` warning; unit/hooks **204/204**, properties **34/34**, API **5/5**, release **108/108** across four files, including all six real-filesystem cases. Install emitted four upstream yuku package deprecation warnings.

Exact base-to-target diff has eight authorized files: README policy validation, two release test files, real fixture, one runbook bullet and three Opus records. No P-04/product/manifest/lock/Makefile/CI/other-guard changes. `git diff --check 216d7f9 d7183b7` is clean. Target has no tracked `dist-sdk/**` or `artifacts/**`; neither new commit adds generated output.

Evidence: `/tmp/p05-opus-review-{install,sdk-check,independent,mutations}.log`; independent driver `/tmp/p05-opus-review-independent.mjs`; scratch mutation driver `/tmp/p05-opus-review-mutations.py` and per-mutation logs. Drivers use the assigned checkout path; restore it there or adjust imports after cleanup.

No real combined release-check, pack, browser/consumer matrix or publication was run or claimed. Absence of the landed P-04 producer on this branch is not a defect. Coordinator may now proceed to the authorized integration and actual exact-tarball combined gate; P-06 final identity/toolchain work follows that gate. No publish, tag, push, merge or authentication change occurred.

## Knowledge and reusable-script assessment

The durable lesson already recorded by the builder and prior review remains sufficient: test full designated-field schemas and empty branches beside valid siblings, and preserve the distinction between location and execution evidence. Coordinator may index this evidence; reviewer owns no shared knowledge paths. No new durable VM finding or reusable helper warrants a separate addition. Review scripts are one-off scratch work; permanent regressions belong in the existing suite.
