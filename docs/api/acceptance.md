# C4-10 current-consumer acceptance

Date: 2026-10-14. Builder: fresh Codex Sol in `/tmp/c4-sdk-c4-10-build`, branch `item/c4-10-hardening`. Exact starting main revision: `59156023e3d1b888d87ccbc6e0173b3a2ea63de6`. This is builder evidence; independent fresh Claude Sonnet review of the final branch HEAD is pending. Implementation/knowledge/checkpoint SHAs are recorded in the [item checkpoint](../../agent-work/items/C4-10/STATE.md). No merge, push, manual deployment, npm publication or ts-db work is performed by this item.

## Scope and delivered behavior

The current SDK and Cursor consumer are tested at `/` and `/c4-preview/`. All seven kinds use the shared source pipeline. Initial framing includes the complete scene when readable; wide views center the first declared card. Code member compartments intersect the actual canvas and remain readable after focus. Fit includes edge routes and labels, permits overview zoom down to 0.02, and keyboard focus recovers a readable card from an overview. Saved viewports survive returns; session focus/viewport maps each retain 256 views. Mobile explanation entry appears before the canvas visually. Heading controls wrap at 200% CSS zoom.

The [source API guide](README.md) documents named wrappers, provider/parts/hooks/slots, ports, editor/runtime schema distinction, configurable host ceilings, and lifecycle behavior. No Cursor source content was changed. Nick signed off the C4-08 human STE review gate on 2026-10-14; this accepts the delivered draft content and does not claim formal ASD-STE100 certification.

## Validation and reproducibility

Final non-browser checks: **204 unit/hooks PASS** (24 files), **34 properties PASS** (10 files), typecheck PASS, lint exit0 with the pre-existing button fast-refresh warning. Logs are `/tmp/c4-10-{unit,property,lint}-final-source.log` and `/tmp/c4-10-typecheck-final.log`. Both production builds pass in the current browser matrix. **Full final production browser matrix: 65 PASS / 1 existing skip** (6.1 minutes), `/tmp/c4-10-browser-verified`, log `/tmp/c4-10-browser-verified.log`. The skipped case is the desktop-only reference stress measurement on the mobile project; mobile visual/keyboard/worker journeys execute. Both production builds/typechecks pass, with the known large-chunk warning. Commands are:

```bash
npm ci --prefer-offline
npm run test:unit -- --reporter=dot
npm run test:prop
npm run typecheck
npm run lint
npm run test:browser -- --workers=1 --output=/tmp/c4-10-browser-verified
npm run test:browser -- tests/browser/component-docs tests/browser/layout --grep "records a production|components, Markdown" --repeat-each=3 --workers=1 --output=/tmp/c4-10-repeats
```

The targeted repeat runner passes **9 tests / 3 intended mobile stress skips** (2.1 minutes): 6 component-docs journeys plus 3 desktop stress measurements. `/tmp/c4-10-repeats.log` preserves the exact run. The unchanged mobile component-docs test passed in all 3 broad runs and all 3 fresh isolated repeats; the historical intermittent root cause remains unestablished.

Vitest processes are sequential per checkout. Playwright builds the generic viewer and Cursor demo from production source (including TypeScript checking), then serves only local ports 4174 and 4173 respectively. Desktop Chromium uses 1440×1000; Pixel7 mobile uses 393×851 CSS pixels, DPR2.75 and touch. Tests cover all kinds, code/list semantics, focused/Fit viewport bounds, landscape/code drill, deep reloads, Back/Up, component Markdown/safe links, Plain/STE sheets, dynamic partial order, physical/logical deployment, source reading, invalid resources/routes/steps, reduced motion, keyboard and axe. CSS `documentElement.style.zoom=2` exercises200% layout; it is not an OS/browser UI zoom setting. Serious/critical axe findings are asserted empty in the new journeys; several inherited journeys require no axe violations at any impact. Automated semantics checks do not constitute a human screen-reader audit.

Verified desktop and mobile lifecycle counts before/after 8 cycles are identical: 4 connected ResizeObservers, 1 MutationObserver, 4 window resize/hashchange/popstate listeners, 0 live workers. JSON is preserved under each hardening journey in `/tmp/c4-10-browser-verified`. Lifecycle checks count distinct active window resize/hashchange/popstate listeners by identity/capture, ResizeObserver connected target sets via weak references (including `unobserve`; detached panes may be garbage-collected), MutationObservers and zero live workers across 8 view/viewport changes. Hook/unit tests verify loader replacement cancellation, stale generations/measurement revisions, worker error/unreadable-message/timeout/abort cleanup, cache eviction and rejected geometry; errors cannot publish a partial scene. These checks establish bounded resources for exercised journeys, not proof against every host adapter.

## Resource envelope

| Guard | Default ceiling | Host configuration/evidence |
| --- | --- | --- |
| Bundle/catalog streamed bytes | 5MiB /256KiB | `createFetchLoader` options lower both; advertised oversized bodies are cancelled, actual bytes bounded without a length header |
| Elements/relationships/diagrams | 5,000/10,000/200 | `DecodeLimits` lowers counts before schema work; precise resource-limit paths |
| Raw JSON depth | 32;96 inside dynamic scenario | Lowerable independently; root object/array layers count, cycles rejected |
| Semantic nesting | 32 group/code/scenario levels | Existing domain guards independent of JSON depth; scenario total 1,000 steps |
| Native layout nodes/edges | 5,000/10,000 | Lowerable before manual/worker execution; these are guardrails, not a throughput claim |
| Published coordinates/extents | 10,000,000 logical units each | `GeometryLimits` lowers maxima; finite but excessive geometry rejected before canvas/cache publication |
| Routes | Per-edge sections/bends `max(16,2×member-count+8)`;100,000 total routed points | Native output and generic publication validation enforce budgets |
| Layout worker timeout/cache | 10 seconds / 24 geometry entries | Node/edge/cache/geometry ceilings only lower defaults; default timeout is a configurable positive integer and request timeout override is finite positive, both ≤2,147,483,647ms; worker terminated on error/timeout/cancel, cache stores no model objects |
| Session memory | 256 focus entries +256 viewport entries | Old saved views evicted; WeakMap host lifetime isolates viewer slots |

New property seed 4102026 uses 200 runs per property for finite centered framing, count-limit monotonicity/input preservation, and extent-limit monotonicity. Existing seeds remain in committed tests; no new shrunk counterexample was found. Existing recursive tests retain accepted 32/rejected 33 semantic fixtures.

## Failure/rerun history

- Sandbox npm audit failed DNS; `/tmp/c4-10-audit.json` is not clean-audit evidence. Online rerun is `/tmp/c4-10-audit-online.json`.
- Initial demo source-map build found implicit-any reducer parameters after route-budget code; corrected before successful rerun. Build logs: `/tmp/c4-10-build-demo.log` and `/tmp/c4-10-build-demo-rerun.log`.
- First sandbox browser attempt stopped in webServer gzip reporting, exit1 before tests, cause unestablished: `/tmp/c4-10-browser-initial.log`. Escalated production runners start correctly.
- First broad production run: **62pass/3fail/1existing skip**, `/tmp/c4-10-browser-full`, log beside it. Two new lifecycle checks overcounted observers after native `unobserve` and retained detached panes in a strong Map. A second full run retained the two instrumentation failures. React Flow system source intentionally leaves its pane extent observer for garbage collection on unmount; the check now uses weak references and connected targets, without retaining old panes. This proves bounded connected observations, not a heap-retention audit. The mobile source-reading journey tried a pointer click on the offscreen Publication role after readable-first-card framing; changed to the intended keyboard reveal/activation path. No claim that all offscreen cards become directly clickable without pan/Fit/focus. The old mobile200% S3 click test likewise now focuses and activates the offscreen card through the tested recovery path.
- Historical C4-07 mobile component-docs failure did not recur in the first broad run. The final broad run also passes mobile component-docs; three isolated repetitions per desktop/mobile project also pass; absence of reproduction cannot establish its old root cause.

## Performance and framing limits

The fixture in `tests/browser/layout/layout.spec.ts` has 200 nodes and 400 directed labelled edges, no groups, deterministic LR ELK input and bounded short card labels. It records worker creation-to-termination lifetime, with completion recognized only from the matching layout response containing root geometry (registration messages do not count). The provisional pass can be cancelled when measured dimensions arrive. A separate fresh-page navigation records Node monotonic wall time through destruction and zero live workers; it includes browser navigation, not just AbortSignal dispatch.

Host: Linux x64, kernel6.8.0-139-generic,4 shared DigitalOcean vCPUs,8,131,772KiB RAM (~7.75GiB); Node22.23.2, ELK0.12.0, Vite8.3.4, Playwright1.64.0/Chromium156.0.8078.4. Device user-agent strings do not describe the host OS.

Prior evidence was 4109.2 ms layout and 254.2 ms provisional cancelled-worker lifetime. First C4-10 run under concurrent unit load was 9664.3 ms completed-worker lifetime and 759.2 ms provisional lifetime. The former 2-second target is **not met** by that observation; no timing promise follows from the 5,000/10,000 schema ceilings. The second broad run, without concurrent unit/property work, completed in 4647.0 ms, with 322.1 ms provisional-worker lifetime and 213.5 ms navigation-to-zero-worker wall time. Artifacts: `/tmp/c4-10-browser-final/layout-layout-records-a-pr-41c33-g-without-claiming-a-budget-desktop-chromium/{production-layout-timing,production-cancellation}.json`. The former 2-second target remains unmet. The third fresh full run recorded 5224.9 ms completed-worker lifetime, 328.6 ms provisional lifetime, 7799.1 ms navigation-to-canvas wall time and 339.1 ms navigation-to-zero-worker time. All values retain their different measurement definitions; Three fresh sequential repeats then passed: completed-worker lifetime 4820.2–5241.6 ms (median 5010.3 ms), navigation-to-canvas 6593.1–7557.8 ms, provisional-worker lifetime 281.8–328.5 ms and navigation-to-zero-worker 170.1–242.2 ms. The former 2s target is unmet throughout. `/tmp/c4-10-repeats` holds per-repeat JSON, including `-repeat1` and `-repeat2` directories.

Mobile entry deliberately shows one readable card with routes leaving the viewport. Fit provides a complete overview for these fixtures, where text can be tiny; keyboard focus/Actual size/pan and the complete relationship/member/scenario alternatives are the reading path. Huge scenes can exceed minimum Fit zoom 0.02. Initial framing is not an all-nodes-at-readable-scale promise. Viewport intersection and rendered member font size ≥8 CSS pixels are checked before overview Fit; fits at smaller text scale are not called readable compartments.

## Security and README verification

Authoritative online [GitHub advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), checked2026-10-14, lists braces≤3.0.3 vulnerable to recursive-pattern stack exhaustion and no patched version. Installed braces is 3.0.3, micromatch 4.0.8, shadcn 4.21.4. Online `npm audit --json` reports 7 high dependency entries from that chain (including registry/ts-morph/fast-glob). npm suggests a breaking shadcn 1.0 downgrade; no supported full fix was established and no manifest/lockfile change or force downgrade was made.

Both production source-map inspection builds enumerate 432 generic / 431 demo source entries, including worker modules, with no braces/micromatch/fast-glob/ts-morph/shadcn/registry JavaScript modules. Inventories are `/tmp/c4-10-dist-modules.json` and `/tmp/c4-10-dist-demo-modules.json`; dependency tree is `/tmp/c4-10-dependency-tree.txt`. Product sources reference shadcn only through `src/index.css` importing its Tailwind CSS. This supports no observed browser-runtime inclusion of the affected code; the installed toolchain remains exposed when processing adversarial glob patterns. It is not a clean dependency audit or an all-vulnerabilities proof. Inspection builds enable source maps only for evidence; standard production/browser builds are rebuilt without them.

C4-08 reconciliation verified: README names all seven kinds, ELK compound worker/groups, Markdown documentation and advisory STE diagnostics; the old “No ELK” statement is gone. The documentation fix following independent review also corrects the pending-layout description: initial async loading shows a link-enabled text alternative; only a prior same-input scene can remain during measurement replacement. README now labels the defaults as enforced guardrails and distinguishes raw JSON depth 32 from the dynamic-scenario budget of 96. The [API guide](README.md) gives the full defaults/options. These corrections do not change the implementation or the measured failure to meet the 2-second layout goal.

Production footprint in the second full build: main JS ~759.3 kB (gzip ~235.1 kB), ELK worker ~1,423.6 kB, demo CSS 28.4 kB and generic CSS 52.8 kB. The large-chunk warning remains. No bundle-size/first-load budget pass is claimed.

## Remaining scope and human gate

C4-09 was removed per Nick on 2026-10-14. C4-10 continues independently and has no second-consumer acceptance gate tied to that removed task. No `/ts-db/` consumer acceptance is claimed. SDK productionization and npm publication, followed by ts-db ingesting the package as a loaded module, belong to the active productionization track; any interim isolated React copy/build folder is ts-db-owned. Nick signed off the human STE review gate for C4-08 and C4-10 on 2026-10-14. This sign-off is acceptance of the delivered STE content, not a claim of formal ASD-STE100 certification.

Screenshot inspection on the final source: desktop/mobile `code-initial-viewport.png`, mobile `code-compartments.png`, code Fit overview, desktop/mobile `publication-heading-zoom.png`, mobile `publication-entry.png`/`publication-fit.png`, and mobile `component-docs-sheet-viewport.png`. Final artifacts are under `/tmp/c4-10-browser-verified`; earlier captures under `/tmp/c4-10-browser-full` and `/tmp/c4-10-browser-final` remain. Entry compartments are readable and bounded; Fit overview text is small, and edges intentionally leave the initial reading viewport. Heading and explanation text wrap without horizontal document overflow.
