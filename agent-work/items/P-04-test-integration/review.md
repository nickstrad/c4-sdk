# P-04 test integration independent Sol review

Date: 2026-10-15. Verdict: **PASS**. No blocking findings.

Exact reviewed commit: `27c909ad7c4eaf5f4e663bacd1287ff4d53c5458`.
Implementation: `23fe559a1494a4fa14430faf4f5765e6618c93c7`.
Base: `927740f78ea9b6186b3d2cdffd53a19eab8fabc9`.
Reviewer branch/worktree: `review/p-04-doc-tests-sol`,
`/tmp/c4-sdk-doc-tests-review`. Independent of the Sonnet builder; no delegation.
Scope: [brief](brief.md), [claims](claims.md), [builder evidence](STATE.md).

## Inspection

- The previous ShopWorkspace route-to-code behavior and exact documentation
  assertion remain intact. Only the obsolete README marker/file association was
  replaced; the marked current composition snippet is compared to its example.
- The runtime test executes that current example with public facades substituted
  for package imports. A fixed layout port replaces ELK; this is a composition
  test, not a worker, CSS, package-resolution or browser validation claim.
  The existing README consumer verifier remains responsible for those checks.
- Initial heading/document agreement, STE pressed state, drill-down and Go up are
  exercised. The React root is captured and unmounted in finally; module mocking,
  module cache, body and hash are reset. Existing afterEach restores globals and
  mocks. No real worker, network, random layout or browser dependency is added.
- Showcase checks retain the seven-kind assertion and all four retired-claim
  exclusions. Current module-worker/safe-Markdown prose and public manifest
  entries replace obsolete exact prose. These are meaningful contract checks.
- Exact base-to-target diff contains only the two assigned tests and three builder
  item records. Source, README, examples, tests/readme, manifests and release
  implementation/tests are unchanged. P-05 Opus guard PASS is unaffected.

## Non-blocking coverage observation

At composition.test.tsx:140-151, nonempty documentation after STE/drill-down and
negative heading comparisons are weaker than exact expected text/title checks.
The new test would be stronger if it compared landscape/context titles and their
plain/STE fixture text after each action. This does not weaken the preserved
ShopWorkspace assertion or snippet check; existing tests/readme/browser.spec.ts
also checks exact context STE text and the Go up destination. No repair is
required for this bounded reconciliation.

## Validation

Local `npm ci --no-audit --no-fund` succeeded. Evidence logs are under
`/tmp/c4-doc-tests-review-*` outside the tracked tree.

- Targeted: `npx vitest run --project hooks tests/hooks/composition.test.tsx
  --project unit tests/unit/showcase.test.ts`: 62/62 pass (`targeted.log`).
- The executable example alone passed two subsequent fresh Vitest invocations
  with `-t 'executable README'` (`repeat1.log`, `repeat2.log`).
- First `make sdk-check` (`sdk-check.log`) passed typecheck, lint, unit/hooks
  206/206, properties 34/34, API 5/5; release tests were 107/108 because the
  unchanged process adapter child-Node stdout assertion received an empty string.
  An independent createIo().run Node probe also returned status 0 with empty
  stdout inside the sandbox. No product repair was made.
- An unsandboxed full retry (`sdk-check-unsandboxed.log`) passed typecheck, lint,
  unit/hooks and properties, but the unchanged API import-side-effects test timed
  out (API 4/5, 126.52 seconds overall). Its first run passed.
- Separate unsandboxed release suite: 108/108 pass
  (`release-unsandboxed.log`).
- Final unsandboxed `make sdk-check`: **exit 0**, typecheck/lint pass,
  unit/hooks 206/206, properties 34/34, API 5/5, release 108/108
  (`sdk-check-final.log`). Both lint warnings are on unchanged files:
  button.tsx and examples/readme/compose.tsx (Fast Refresh export rules).
- `git diff --check 927740f 27c909a`: pass.

## Assessment and boundaries

No new durable project/environment lesson or reusable script warranted by this
bounded review; no knowledge/index or helper edits. No browser rerun per the
test-only scope. No combined release-pack/consumer run or publication claimed.
Only these two reviewer records are writable; event skip applies. Review approval
does not authorize landing, publishing, pushing or tagging.
