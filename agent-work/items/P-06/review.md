# P-06 independent exact-commit review

Completed independent review, 2026-10-15. Fresh Codex Sol, independent of the Sonnet builder; no delegation.

Exact reviewed SHA: `fd32c044754fc1a19af681860978166281726969`.
Release-input SHA: `fb74a91c539614542769e97e3ebbfe0677dcc356`; report commit `74e9639`.
Branch `review/p-06-sol`, assigned worktree `/tmp/c4-sdk-p06-review`.
Only this record and `review-STATE.md` are owned; no product repair, publication, tag, push, merge or authentication action.

**Verdict: FAIL.** Artifact/distribution checks pass, but the required source browser gate remains unresolved outside the human waiver. No evidence establishes that the toolchain bump caused the failures; no evidence justifies excluding that possibility for every path either. Review approval, landing and publication are separate, and none is granted here.

## Findings and required follow-up

R1 — **High, unwaived source acceptance failure** — `tests/browser/navigation/navigation.spec.ts:106` and `tests/browser/showcase/showcase.spec.ts:32`.

Independent focused source Playwright (`--workers=1`, no test edits/retries) finished **6 passed, 2 failed**, exit 1. Desktop new-tab navigation exhausts 30 seconds waiting for a page event. Its trace shows the parallel Control-click repeatedly intercepted by the React Flow pane/developer card or outside the viewport. Inspected failure screenshot shows the target mostly beyond the canvas edge. This is not evidence that popup creation itself is the root cause.

Mobile Cursor showcase fails after clicking “Inspect Local Git repository”: the explanation remains “Continuity: logical containers” and lacks expected “warm cache” text after the 5-second assertion timeout. Inspected screenshot confirms the wrong explanation. This failure was not in the builder’s retained failing-test list and is not the waived mobile component-docs test. Both desktop/mobile context replacement and mobile navigation pass in this focused run; desktop showcase also passes.

The source fixtures/product/tests are unchanged between release-input and reviewed report HEAD. The first focused run overlapped independent packaged-browser checks; one bounded desktop-navigation-only rerun after those complete **passed 1/1**, exit 0 (`source-navigation-isolated.log`). This confirms intermittency; neither result establishes a release-toolchain causal attribution. The mobile showcase failure was not rerun in isolation. Builder serial full-suite success remains valid historical evidence, not a guarantee that serial execution removes the failure. The final report’s “not reproduced serially” description cannot stand against the reviewer result.

Coordinator must reserve a bounded investigation/correction for these unwaived paths and obtain independent review, or seek a specific human disposition before approving readiness. Do not broaden the existing mobile component-docs waiver implicitly. Preserve failing traces and assertions; a passing isolated rerun alone does not resolve the acceptance limitation. No product repair is made by this reviewer.

R2 — **Medium, evidence accuracy** — `docs/release/0.1.0.md:44–48` and `docs/knowledge/gotchas.md:101` overstate what the retained browser results establish.

The report correctly records candidate failures and the mobile-docs waiver, but “The toolchain bump is therefore not the cause” does not follow from baseline reproduction of two navigation failures. The baseline logs show 65/skip1, 63/skip1 with desktop popup timeout and mobile focus failure, then 65/skip1. They do not reproduce the candidate context failure, or prove equal contention across runs. The knowledge entry instead says “The same tests fail” at baseline, generalizing to context/mobile component-docs without that evidence. Likewise “Each failing test passed in isolation” names only desktop navigation and mobile component-docs; retained full-suite serial success is a different observation.

Repair the report and durable knowledge to say precisely which failures occurred at baseline, which were separately isolated, and which passed only in the serial full suite. Remove the categorical causal exclusion and retain unresolved regression uncertainty. Describe the distinct popup/focus/click-interception/screenshot-timeout observations instead of asserting a single cause from their timeout class. This is a bounded documentation correction; no waived mobile-docs fix, new tarball, changed source test or endless full-suite repetition is requested. A report-only repair does not change the release-input SHA or artifact bytes.

## Independent checks completed

- `npm ci --prefer-offline --no-audit --no-fund`: 542 packages, Node 22.23.2/npm 10.9.8.
- `make sdk-check`: exit 0, typecheck/lint pass (the two documented Fast Refresh warnings); 206 unit/hooks, 34 property, 5 frozen API, 108 release tests pass.
- `npm run sdk:build`: pass. All 15 unpacked candidate files match independent generated output or source documents byte for byte, including both runtime/declaration formats, CSS/worker, README, MIT/notices and manifest. No repack or replacement of the authoritative candidate.
- SHA256 of retained tarball is `6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084`. Every file hash/size matches the retained evidence; evidence SHA256 matches `51257785e65c37b29c7212ecc7f35a895c36f762ed7f2b99cbec6e7685caa18d` in the successful retained verify report. Both bind to `fb74a91`, clean before/after. Later report/checkpoint commits change no release inputs.
- Manifest and lock retain TS 6.0.3/Vite 8.3.4 and exactly pin rolldown 1.2.14/plugin-dts 0.28.8. Public source entries, tests, SDK build wiring, README, license and notices are unchanged from the reviewed baseline. No hidden ts-db migration; report explicitly disclaims removed C4-09 copy-consumer support and identifies unshipped remnants.
- Independently regenerated bundle inventory is byte-identical to committed input. All 76 package rows and complete whitespace-normalized license texts reconcile with shipped notices. MIT text is complete; holder remains the previously documented repository-identity inference, not a new legal attestation.
- First `release-verify` from report HEAD correctly failed closed after successful package matrix: “package report was produced from a different source commit.” Repeated from a clean scratch clone at exact `fb74a91`, using a byte-identical scratch copy of the retained tarball/evidence: **exit 0**, package matrix passes (runtime export parity/import safety/mixed context, React-free core, strict NodeNext MTS/CTS and bundler TSX, Vite ESM/CJS), packaged browsers **10/10**, README browsers **6/6** and all eight synchronized snippets. Browser assertions cover all seven kinds, CSS isolation, non-root asset paths, focus/navigation and worker lifecycle/fallback. Scratch final verify report binds the original tarball/evidence hashes and source SHA. Only scratch sidecars were replaced. No provenance guard bypass.

## Browser evidence assessment

Read all retained failed/default source logs and three baseline logs. Candidate results are five failed nonserial runs (the third explicitly uses two workers), then 65 passed/1 intended skip serially. Original desktop failure includes a popup with an empty URL; later failures time out waiting for the page event. Mobile navigation includes focus assertion failure or offscreen/intercepted clicks; context includes intercepted clicks and a test-budget timeout at screenshot. These observations are not interchangeable root-cause proofs.

Nick’s binding ruling in `/root/c4-lead-mobile-nonblocking.md` and `/tmp/c4-p06-human-ruling.md` applies directly despite stale builder ancestry: mobile component-docs is nonblocking for P-06/six-area/readiness, and publication remains separately gated. The report explicitly records recurrence across C4-07/C4-10/P-06 and passing isolated reruns. No repair of the waived test is demanded. Other failures remain outside that waiver.

The shared live inbox also contains a completed independent scratch mobile investigation; its report is copied as `external-mobile-investigation.md` in review evidence. It reproduces a mobile canvas native-scroll/input race under renderer slowdown, separates the historical focus failure, and only hypothesizes relevance to context/navigation. This reviewer did not rerun that investigation or treat its mobile waiver as covering other specs.

Inspected five retained screenshots (plus both independent failure screenshots and navigation trace): README desktop quick-start context and mobile composition; source mobile deployment and invalid-replacement preservation; desktop Cursor publication. Text and controls are readable and focus is visible where captured; graph content extends beyond the canvas viewport as documented. These are samples, not an assertion that all 67 images were inspected. The mobile composition capture does not show all below-fold composition content; behavioral assertions cover that separately.

## Evidence, limits and handoff

Evidence root: `/tmp/p06-review-evidence/`, outside the assigned worktree. Authoritative candidate/evidence remains `/tmp/c4-sdk-release-0.1.0/`, untouched. One-off binding checker is `check-binding.mjs`; it compares unpacked files to the review checkout, so restore that checkout/dependencies to rerun after cleanup. Source-input clone is retained for exact-source verification. Full source suite was not repeated: retained serial 65/skip1 plus focused independent checks are the bounded strategy requested. A rerun pass never proves regression absence.

Knowledge assessment: R2 corrects an overbroad new durable entry. No new VM finding or indexed reusable helper is needed; existing release/source fixtures encode the procedure. Reviewer owns no shared knowledge/index path. Event helper failed creating a pending directory in the read-only common git inbox; authorized event skip applied. KB search 400 was judged explicitly after an elevated database-write retry.

## Six requested areas

| Area | Independent assessment |
| --- | --- |
| MIT/identity/notices | PASS: exact installed files, metadata and 76-package reconciliation |
| Release scaffolding | PASS: retained clean release-check exit 0; independent sdk-check/build and exact-source release-verify exit 0; provenance mismatch rejects |
| Frozen public API | PASS: unchanged facades, 5 source API tests, packed runtime parity and structural consumers |
| ESM/CJS | PASS: both entries/import modes, shared context, React-free core and browser rendering |
| Bundled types | PASS: both declaration formats and strict NodeNext/bundler compilation |
| README | PASS: exact shipped bytes, eight synchronized executable snippets, 6 browser tests |

These six distribution results do not waive the separate required source regression gate (R1), nor grant landing/publication approval. Report/knowledge accuracy requires R2 as well. Existing narrowed support and warnings remain appropriate: Linux x64/Node22.23.2/React19.3.0/TS6.0.3/Vite8.3.4/Chromium only, no new SSR/browser/version claims, large bundles, canvas scrolling, and two lint advisories.

## Reproduction and disposition

From exact reviewed checkout with locked dependencies:

```sh
make sdk-check
npm run sdk:build
node /tmp/p06-review-evidence/check-binding.mjs
npx playwright test tests/browser/navigation/navigation.spec.ts tests/browser/context/context.spec.ts tests/browser/showcase/showcase.spec.ts --grep "native detail|drill, explicit|invalid replacement|guided source reading" --workers=1 --output=/tmp/p06-review-evidence/source-browser
npx playwright test tests/browser/navigation/navigation.spec.ts:92 --project=desktop-chromium --workers=1 --output=/tmp/p06-review-evidence/source-navigation-isolated
```

Exact-source artifact command, from scratch clone `/tmp/p06-review-evidence/source` at `fb74a91`:

```sh
make release-verify TARBALL=/tmp/p06-review-evidence/candidate/c4-sdk-0.1.0.tgz
```

The first focused command is historical reproduction evidence: copy/rename its retained output before rerunning so it is not overwritten. All original failed builder/default/baseline logs remain retained, and reviewer failures remain in `source-browser/` with traces, screenshots and error contexts. No source failure is removed by the isolated pass. Fresh-agent correction/re-review is coordinator-owned; this reviewer stops after durable review/checkpoint commits and cleanup. No publication.
