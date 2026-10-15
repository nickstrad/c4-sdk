# P-04 independent review

**Verdict: PASS** — 2026-10-15. Fresh Codex Sol reviewer, independent of the Claude Sonnet builder; no delegation.

- Exact reviewed HEAD: `b2b2a90e63135c1c8852fda846e84741b7ad0993`.
- Implementation: `e4d9500cdde4020c3f0863f6ccaaa9103a85a5d9`.
- Base: `a1929e4`; branch `review/p-04-sol`, isolated worktree `/tmp/c4-sdk-p-04-review`.
- Reviewed against [brief](brief.md), [claims](claims.md) and productionization section 5. Product files remained read-only. Only this record and `review-STATE.md` changed.

## Findings

**Blocking defects: none. Required repairs: none.** The README covers all seven kinds, peers/support versions, complete synchronized JSON/HTML/TSX quick start, decoding/error handling, composition/legend/navigation/STE, ESM/CJS, worker recipes, strict misuse, reference/demo/test guidance, limitations/schema evolution/contribution and licensing. Package publication is explicitly pending. Fixture SDK imports use public package exports; the static copy recipe intentionally names the installed worker asset file.

Non-blocking notes:

1. Lint exits zero with the documented new Fast Refresh warning at `examples/readme/compose.tsx:31` and inherited `src/components/ui/button.tsx:57` warning. Neither affects production examples.
2. Screenshots show readable first-card framing with remaining graph content below/outside the canvas viewport, consistent with the existing C4-10 framing policy and the diagram scrolling guidance. They are viewport captures, so the composition legend/explanation below the fold are not all visible in those images; browser assertions independently verify the single legend and STE content switch.
3. The sentence introducing kind checking ends with a dangling colon (`README.md`, “Choosing a diagram and navigating”). Cosmetic only; the seven wrappers are already listed above.
4. This is preliminary beta-artifact evidence. The authorized P-06 changes to `0.1.0`, rolldown and declaration tooling and subsequent final matrix remain pending, and are not P-04 defects or release approval.

## Independent artifact and reproducible checks

From the exact target checkout, with Node **22.23.2**, npm **10.9.8**:

```sh
npm ci --prefer-offline --no-audit --no-fund
npm run sdk:build
mkdir -p /tmp/p04-review-evidence
npm pack --json --cache /tmp/p04-review-evidence/npm-cache \
  --pack-destination /tmp/p04-review-evidence \
  > /tmp/p04-review-evidence/pack.json
README_REPORT=/tmp/p04-review-evidence/report.json \
  node tests/readme/verify.mjs \
  /tmp/p04-review-evidence/c4-sdk-0.1.0-beta.1.tgz
npm run typecheck
npm run lint
git diff --check a1929e4 b2b2a90
```

All completed successfully. The verifier ran with the execution permissions needed for npm cache writes and Chromium/local listeners; ports **4187/4188** only. Initial sandbox attempts failed at npm pack cache writes (`EROFS`) and Chromium startup (`Operation not permitted`); an install stalled and was stopped before the successful retry. These were environment constraints, not acceptance failures. The first scratch Markdown renderer lacked GFM support; the final inspection used an isolated `marked` renderer without repository dependency changes.

Independently rebuilt tarball:

- Version: **0.1.0-beta.1**.
- SHA-256: **`bfdfaf8c3404e139360d08df07972f33f9e42361d6bc04c034071f98ed704263`** — exactly matches builder evidence.
- Pack inventory: **15 files**, including README, manifest, MIT/notices, both runtime/declaration formats, CSS, shared chunk and self-contained worker; no examples/tests/source checkout required by the installed consumer.
- Installed README equals the reviewed repository README; report `sourceSha` equals the exact reviewed HEAD.
- Eight snippet/file pairs match exactly. Clean external consumer uses React/DOM **19.3.0**, TypeScript **6.0.3** and Vite **8.3.4**. Both NodeNext module modes and bundler TSX compile with `strict: true`, `skipLibCheck: false`, including three enforced `@ts-expect-error` cases.
- ESM and CJS run identically: `Shop architecture`, four nodes, `Context key`, STE text, then `missing-reference` at `$.diagrams[0].nodes[0].elementId` for deliberate invalid data.
- Production Vite builds pass at `/consumer/subpath/` and `/consumer/static/`. Expected advisory `use client`/large-chunk warnings remain.
- Playwright **6/6**: desktop (1440×1000) and Pixel 7 quick start, keyboard detail activation and Back, scoped accent token, worker asset URL and termination, composed single legend, STE switch/controller Up, and static worker beside the page. Browser error arrays empty.
- Negative check: copied verifier/README/examples under `/tmp/p04-review-evidence/negative`, appended `// deliberate review mismatch` to the scratch `main.tsx`, reran against the same tarball. Exit **1**, `README snippet differs from examples/readme/main.tsx`, before installation. Product tree untouched.

## Rendered README, links and retained evidence

Read the rendered README locally using GFM (`marked`) and Chromium; inspected tables, code blocks, composition/navigation guidance, module/worker recipes, commands, limitations and policy/license sections. The JSON `<details>` block remains a native disclosure. All eight Markdown links were inspected; six GitHub file destinations exist in the reviewed tree. Independent unauthenticated HTTP HEAD checks returned **200 for all eight** (C4 model, API/support/acceptance/license docs, issues, LICENSE and notices).

Evidence remains outside Git at `/tmp/p04-review-evidence/`:

- `build.log`, `pack.json`, exact `.tgz`, `verify.log`, `report.json` (successful verifier report).
- `readme-evidence-bfdfaf8c3404/`: all **8 desktop/mobile PNGs**, individually opened and visually inspected.
- `readme.html`, `readme-{top,composition,tests,support,esm,worker,ending}.png`, `render.json`, `links.json`, `remote-links.json`: local rendered README and link evidence. These are a local GFM rendering, not a claim of testing GitHub’s exact stylesheet.
- `negative-sync.log` / `negative-sync.exit`: intentional snippet mismatch rejection.
- Clean consumer named by report: `/tmp/c4-sdk-readme-POGZyz`.

No broad domain regression suite was rerun: P-04 changes documentation, fixtures and their dedicated verifier; typecheck/lint and the exact-artifact journeys are the relevant independent checks. Full final release verification remains P-06-owned.

## Handoff and assessment

No new durable project lesson or reusable script beyond the builder’s already recorded assessment and existing knowledge pages; no knowledge/index/script edits requested or made. The existing verifier is the reusable P-05 integration interface. No subscription cap encountered and no paid API used. Event publication skipped as authorized. This PASS permits coordinator integration under its own authorization; it does not authorize publication, tag, push or merge by this reviewer.
