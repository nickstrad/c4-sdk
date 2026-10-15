# P-02 independent review — fresh Claude Sonnet 5.5

**Verdict: PASS**

Reviewed exact `c4722a61925c194cad449cf5a65b83c07cbde721` (docs checkpoint over implementation `dc20b45848736ec1e1a8ef04047114b9bb5a7044`; diff base `00bf66a`, main `f59dc8d` differs only by root STATE/COORDINATION). Own worktree `/tmp/c4-sdk-p-02-review-restart`, branch `review/p-02-sonnet-restart`. Ports 4185/4186 verified free before use. No product edits, push, publish, tag or credentials. Registry was not queried by this review; builder's E404 availability record (2026-10-14T20:20:38Z) stands.

## Independent evidence

- `npm ci` (543 packages), `npm run sdk:build` succeeded; regenerated `tests/package/evidence/bundle-inventory.json` is byte-identical to committed (git clean except untracked `dist-sdk/`).
- Independent `npm pack --json` from the commit: 15 files, 859203B packed / 3739725B unpacked; file/size list identical to committed `tests/package/evidence/pack.json`. Tarball SHA256 `d7980de2c97d008e41c5ce6592eadfffea7eed36d3d8c4f6c214d0595edd33f8` — reproduces the builder's hash exactly (reproducible build). Contents: LICENSE, README.md, THIRD_PARTY_NOTICES.md, package.json, dist-sdk/{index,core}.{cjs,mjs,d.mts,d.cts}, shared chunk, styles.css, layout-worker.js; no source, maps, tests, demo, tooling.
- `npm run test:package -- <tarball>` in a fresh external consumer `/tmp/c4-sdk-consumer-dNn294`: exit 0. Node 22.23.2 / npm 10.9.8 / React+ReactDOM 19.3.0 / TypeScript 6.0.3 / Vite 8.3.4. Covers ESM/CJS import with Node globals absent, runtime name parity with the API snapshot, function identity ESM vs CJS (mixed context render reads CJS provider via ESM hook), core import with React resolution trapped, worker start/cancel/terminate/failure, strict `.mts`/`.cts`/bundler TSX incl. structural fixture, Vite production ESM and CJS builds.
- `CONSUMER_DIR=… npm run test:package:browser`: 10/10 pass (desktop Chromium + Pixel 7; ESM and CJS; seven kinds each; non-root static default worker; lifecycle/cancel/failure fallback; worker count returns to 0). Zero page/console errors asserted.
- Source gates: typecheck pass; lint pass (only inherited button.tsx fast-refresh warning); unit/hooks 204/204; properties 34/34; API snapshot 5/5.
- Screenshots inspected (desktop ESM components, mobile CJS code): host styling isolated from SDK tokens, canvas/legend/relationships/key render, explanation panel styled, focus ring visible on mobile; nothing broken.

## Assessment of requested areas

- **Dependency graph:** neutral platform with explicit mainFields; unresolved imports fail the build; core.cjs has no React; index.cjs requires only react, react-dom, react/jsx-runtime and the shared chunk; bundle inventory 76 packages reconciled with shipped notices per builder (inventory regenerated identically here).
- **Peers:** react/react-dom external including JSX runtime; declared as peers. See note 1.
- **Context identity:** ESM files are thin wrappers over one canonical CJS implementation, so ESM+CJS share one React context; verified by identity and mixed-render tests.
- **CSS / portal wiring:** all five first-party sheets + React Flow CSS scoped under `.c4-sdk`; portal sheet/backdrop rules scoped on the element itself (`.c4-sdk.c4-docs-sheet`), backdrop gets the class via build transform; browser test asserts `position: fixed` and an actual Close click.
- **Worker:** default URL resolved against `document.baseURI` lazily (no start on import); host factory override, cancellation, failure fallback, cleanup tested.
- **Declarations:** `.d.mts`/`.d.cts` per facade are bundled single files, identical content; only `react` and `zod` externals; strict skipLibCheck:false consumers pass in NodeNext both dialects and bundler TSX.
- **Notices:** package carries P-03 LICENSE/THIRD_PARTY_NOTICES; vfile minpath MIT notices present per builder audit.

## Real defects

None.

## Non-blocking notes

1. Exact peer pins (`react`/`react-dom` `19.3.0`) and `engines.node` `22.23.2` are very narrow: any consumer on another 19.x gets an unmet-peer conflict. Consistent with "no support promise beyond exercised targets", but the owner should decide on ranges before the final candidate (P-06 serialization).
2. Pending, authorized, not defects: version `0.1.0-beta.1` → `0.1.0`, rolldown 1.2.14 / plugin-dts 0.28.8, to be serialized in P-06 before final rebuild/full matrix; this tarball hash is therefore preliminary.
3. `mobile` canvas initially frames a code node partially clipped (pre-existing C4-07/C4-10 follow-up); not a packaging issue.
4. Consumer builds emit `use client` directive and browser-externalized node:* warnings from bundled ELK; ~2 MB worker and ~2 MB main chunk. `npm ci` reports seven high-severity audit findings in dev dependencies (not shipped).
5. The bundler-selection gotcha (browser platform selected DOM-constructing decoder; neutral + mainFields fixed) is not yet in `docs/knowledge/gotchas.md` because P-02 claims made it read-only; the coordinator should record it.
6. `package.json` carries all runtime-bundled libs as devDependencies; correct for a bundled library, but the lockfile/audit surface is dev-only.
7. Review did not rerun the full source Playwright suite or app/demo production builds (no app source changed; builder reported them passing); not required for the package surface.

## Knowledge / scripts assessment

No new helper script: `npm run test:package` and `test:package:browser` already encode the reusable procedure. Knowledge candidate is note 5 (coordinator action). Event publication skipped under Nick's existing exception.
