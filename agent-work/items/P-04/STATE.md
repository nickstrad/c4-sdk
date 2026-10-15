# P-04 checkpoint

Goal/ownership/acceptance: [brief.md](brief.md), [claims.md](claims.md). Branch `item/p-04-documented-consumer`, worktree `/tmp/c4-sdk-p-04`, base `a1929e4`. Builder: fresh Claude Sonnet 5.5. No publish, tag, push or merge.

## Status: implemented, awaiting independent (Sol) review

- Implementation/evidence commit: `e4d9500cdde4020c3f0863f6ccaaa9103a85a5d9`.
- Knowledge/script assessment: this checkpoint commit (no `docs/knowledge` or `work-scripts` edits; lessons reported to the coordinator below).

## Delivered

- `README.md`: seven kinds, install/peers, exercised version table, complete quick start, composition (legend, navigation, STE documentation), ESM/CJS, worker recipes (Vite asset URL, static sub-path), strict misuse, API/demo/test links, limitations, schema evolution, contribution, MIT. Says nothing is published.
- `examples/readme/`: `bundle.json`, `index.html`, `main.tsx`, `compose.tsx`/`compose.html`, `node-esm.mts`, `node-cjs.cts`, `static.tsx`/`static.html`, `misuse.tsx`. Public package imports only.
- `tests/readme/verify.mjs` (shared P-05 interface), `playwright.config.ts` (ports 4187/4188), `browser.spec.ts`.

## Validation (preliminary beta artifact, not a release candidate)

Command: `README_REPORT=/tmp/p04-art2/report.json node tests/readme/verify.mjs /tmp/p04-art2/c4-sdk-0.1.0-beta.1.tgz`, exit 0.
- Tarball sha256 `bfdfaf8c3404e139360d08df07972f33f9e42361d6bc04c034071f98ed704263` (`npm pack` of this README over the P-02 `dist-sdk`; version 0.1.0-beta.1). Installed README equals repo README.
- 8 README snippets equal their example files; no ellipsis placeholders.
- Clean consumer: React/DOM 19.3.0, TypeScript 6.0.3 (strict, skipLibCheck false): NodeNext `.mts`/`.cts` and bundler TSX, including `@ts-expect-error` misuse, compile. ESM and CJS Node runs print identical output (4 nodes, `missing-reference` at `$.diagrams[0].nodes[0].elementId`).
- Vite 8.3.4 builds at `/consumer/subpath/` and static `/consumer/static/`; Playwright 6/6 (desktop and Pixel 7): quick start render, accent token, detail navigation and Back, worker URL under assets and zero workers after, composition STE toggle and controller Up, static `layout-worker.js` at base; no console errors.
- Screenshots inspected (desktop quick start context, static; mobile composition): render correctly. Evidence: `/tmp/p04-art2/readme-evidence-bfdfaf8c3404/` (8 PNGs; outside git).
- `npm run typecheck` clean; `npm run lint` has one new `only-export-components` warning for `examples/readme/compose.tsx` plus the inherited button warning.
- All README links are absolute GitHub URLs to files that exist in this tree; remote resolution was not checked (no network claim).

## Reported for the lead (durable lessons, not committed)

1. `vite preview` takes `base` from the config for the given `--mode`; a second preview of a different base needs `--mode`, and a page not named `index.html` needs its full path as the Playwright `webServer.url`.
2. Capture screenshots only after the node count and "Arranging diagram" fallback disappear; the first mobile capture showed the list fallback.
3. The verifier asserts that the installed tarball README equals the repository README, so any README edit requires a repack: P-05/P-06 must repack after the final README.
4. `sourceSha` in the report is HEAD of the repo under test; P-05 should run from the committed final tree.

## Next

Independent cross-family review of `e4d9500` plus this checkpoint. Final 0.1.0 repack and rerun belong to P-06.
