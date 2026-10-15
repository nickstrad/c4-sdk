# P-06 browser correction independent re-review

Date: 2026-10-15. Fresh Codex Sol reviewing fresh Sonnet correction; no delegation.
Exact reviewed final SHA: `d7ee5ef76ae636d612d534931755bf0aa758b15b`.
Tests: `fcc7f88`; documentation: `7e3f80a`. Branch `review/p-06-browser-sol`, worktree `/tmp/c4-sdk-p06-rereview`.
Scope: original `2938f95` R1/R2, correction brief/claims, retained browser evidence and artifact identity.
Only this record and `review-STATE.md` are owned. No runtime/docs repair or external action.

**Verdict: PASS.** No blocking finding or actionable nit. R1 is resolved by the evidence-based interaction correction and bounded independent repetitions; R2 is resolved by the corrected, qualified report. This supersedes original R1/R2 FAIL for the exact corrected commit, while preserving historical failures and stated limits.

## R1: interaction correction

The three-spec diff adds only Locator types, a focus/viewport helper, and helper calls before seven canvas-pointer interactions.
The helper invokes the existing viewer focus-reveal, asserts viewport intersection, then retains Playwright's real actionable click.
`useCanvasViewport` already pans focused offscreen cards; React Flow's `wrapperOnScroll` resets native scroll to zero.
Retained CPU4 failure trace records native scrolling followed by pane/other-node interception; the sampled desktop screenshot
shows Continuity mostly outside the canvas. This supports the bounded interaction correction, without proving every historical
failure has this cause. No force, dispatched event, sleep, retry, timeout/config change, assertion removal or runtime modification.

Desktop native Control-click still waits for a real new page, verifies its route/heading and unchanged opener URL, then closes it.
Independent passing trace records focus followed by `click` with `modifiers: [Control]`. Keyboard Enter/Up, native href/status,
actual Back/Forward, focus-return, rejected-resource diagnostic path, complete-data preservation, route/history depth and explanation
content (`warm cache`, exact headings, draft STE) checks remain intact. The newly added focus does not itself activate the target.
All changed tests are included on desktop and Pixel 7, including cross-link reload and delayed replacement paths.

Retained builder evidence assessed directly (logs preserved unedited):

| Run | Result and interpretation |
| --- | --- |
| Before CPU1 | 26 pass, 2 missing-port generic-viewer failures |
| Before CPU4 | 21 pass, 7 fail: desktop new-tab, mobile drill, invalid-replacement on both projects, mobile showcase, plus the same two missing-port failures |
| After CPU4 | 26 pass, 2 missing-port generic-viewer failures; this scratch set is not an all-green full suite |
| After CPU4, repeat3 | 36 pass, all six affected tests on both projects |
| After CPU6, repeat2 | 16 pass, four affected tests on both projects |
| Corrected real-config full source suite | 65 pass, 1 intended skip, exit0 |

The retained harness is an import-only transformation of the committed specs plus CDP CPU throttling; independent reconstruction
matches all three retained copies byte for byte (`harness-integrity.txt`). The scratch config serves only demo port4195, explaining
the two generic-viewer failures at port4174. They are two project instances of one test, not additional interaction failures.
The unchanged generic-viewer test passed in the real-config full builder run. CPU throttling is a renderer timing probe, not a
controlled simulation of shared VM/package load. No claim is made that rates4/6 exhaust timing risks.

Independent validation, serial, no simultaneous source/browser/package suites:

- `npm ci --prefer-offline --no-audit --no-fund`: exit0,542 packages.
- Initial sandbox focused attempt: exit1 at webServer startup before any tests. Diagnostic demo build exit0.
- Authorized run outside sandbox, standard config, six changed tests × two projects × repeat2: **24 passed**, exit0.
- Independent CPU4 import-only probe, same six changed tests × two projects × repeat2: **24 passed**, exit0 (4.7m). Standard run: 3.4m. Total independent focused cases:48 passed, no retries.

Standard command:

```sh
npx playwright test tests/browser/navigation/navigation.spec.ts tests/browser/context/context.spec.ts tests/browser/showcase/showcase.spec.ts --grep 'drill, explicit|Back after reload|native detail|delayed catalog|invalid replacement|guided source reading' --workers=1 --repeat-each=2 --retries=0 --trace=on --output=/tmp/c4-p06-rereview-evidence/focused-standard-rerun
```

CPU4 command (after standard process exited):

```sh
PROBE_CPU=4 npx playwright test --config=/tmp/c4-p06-rereview-evidence/harness/playwright.config.ts --grep 'drill, explicit|Back after reload|native detail|delayed catalog|invalid replacement|guided source reading' --workers=1 --repeat-each=2 --retries=0 --output=/tmp/c4-p06-rereview-evidence/focused-cpu4
```

No unchanged full artifact matrix or full source suite repeated. Passing repetitions are bounded evidence, not a guarantee of no
future failure. Baseline mobile navigation focus-return after Up did not reproduce in the builder slowdown probe; it remains
unexplained, and its original focus assertion is retained in the independent repetitions.

## R2: report accuracy

The corrected release report and gotchas remove categorical exclusion of the toolchain bump and the claim that all failures
share a cause. Baseline logs directly show only desktop new-tab timeout and mobile navigation focus-return failure in one run
(63pass/skip1); two other baseline runs passed65/skip1. They do not reproduce candidate context or component-docs failures.
Candidate logs show five failing nonserial runs, then earlier full serial65/skip1. Original builder isolated passes apply only to
desktop navigation and mobile component-docs. The report separately records independent reviewer serial focused failures while
packaged checks ran concurrently (desktop navigation and mobile showcase), and the later isolated desktop pass. New controlled
results are separately dated and tied to the test correction, with screenshot sampling described honestly.

The report acknowledges that focus-return and component-docs focus failures remain unexplained, separates popup/focus/click/
test-budget observations, and explicitly limits the slowdown mechanism to reproduced canvas clicks. It does not imply all
historical failures share that mechanism or that the toolchain is categorically excluded. The five-run table agrees with retained
logs; its desktop count includes the first empty-popup-URL assertion failure, distinguished in the parenthetical from later page-event
timeouts. The initial distribution table and source SHA remain historical exact-artifact results, not results built at correction HEAD.

Nick's `/root/c4-lead-mobile-nonblocking.md` explicitly makes **mobile COMPONENT-DOCS NONBLOCKING**. The report notes historical
recurrence across **C4-07/C4-10/P06** and isolated passes. That test is byte-unchanged; no repair is requested. Other paths receive
independent checks and no implied waiver. Publication/tagging remain explicitly unperformed and separately authorized.

## Artifact binding and scope

Artifact source remains `fb74a91c539614542769e97e3ebbfe0677dcc356`, not the reviewed correction HEAD.
Independently rehashed retained tarball SHA256:
`6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084`.
Evidence sidecar SHA256:
`51257785e65c37b29c7212ecc7f35a895c36f762ed7f2b99cbec6e7685caa18d`.
`git diff --name-status fb74a91 d7ee5ef` contains only item records, release report/gotchas and the three specs.
Explicit runtime/source/public/demo/fixtures/examples, manifest/lock, SDK build/config, Makefile, release tooling/tests,
package/README validation, shipped README/license/notices and workflow comparisons are empty. No scratch harness/probes tracked.
Retain independent distribution PASS evidence in `2938f95`:206unit/34property/5API/108release, package matrix,10 packaged browsers,
6 README browsers and independent byte-identical build. No artifact was replaced or repacked by this review.

## Visual samples, evidence and handoff

Opened two builder CPU4 failure screenshots (desktop native-navigation target off canvas; mobile showcase at containers with target
below the visible area), inspected the desktop failure trace, and opened two new passing standard screenshots (desktop Up-focus,
mobile invalid-replacement preservation). Text/controls are readable in those samples, desktop target is revealed with focus visible,
and graph edges continue beyond the canvas. The mobile preservation sample has the explanation sheet closed; behavioral assertions
check its content separately. No claim to inspect all retained images or every new screenshot. The release report's five-image sample
is explicitly attributed to the original reviewer, not new viewing by this reviewer.

Evidence retained outside the assigned worktree at `/tmp/c4-p06-rereview-evidence/`: install/build/startup logs, standard and CPU4
logs/exit markers, screenshots/traces, import-only harness/integrity record, artifact hashes, changed-path/release-input checks,
builder log summary and native Control-click action extract. Builder `/tmp/c4-p06-fix-evidence` and original candidate evidence remain
untouched. No event written under the explicit event-skip exception; relevant live-header scan found no P06 events.

Knowledge/scripts assessment: existing corrected gotchas records the useful bounded lesson. This review adds independent evidence
and its limits here; no additional shared knowledge/index edit or reusable helper is warranted. The harness/action extract are one-off
evidence, not product scripts. No durable VM finding. No usage limit encountered; no billing/API switch.

Final disposition: PASS on exact `d7ee5ef76ae636d612d534931755bf0aa758b15b`. No repair required. The dispatch rule would send a further FAIL to third-family Muse arbitration; no autonomous repair was attempted.
Coordinator owns landing/integration; this review never authorizes publication. Commit owned review/checkpoint, retain external evidence,
then clean only the assigned reviewer worktree while retaining its branch.
