# License and attribution record

Reviewed: 2026-10-14.

## Project license and copyright holder

The project is licensed under the MIT License. [`LICENSE`](../../LICENSE) contains the complete standard MIT text and identifies `Nick Strad` as the copyright holder for 2026. This holder is inferred from repository ownership (`github.com/nickstrad/c4-sdk`) and project authorship (`nickstrad <nickstrad.dev@gmail.com>`); no separate legal-holder attestation was recorded. P-02 sets the package metadata license to `MIT` and includes the root `LICENSE` in its package allowlist.

The project license applies to first-party SDK work. Bundled third-party code keeps its own license and attribution terms, reproduced in [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md). The notice inventory is derived from P-02's current built JavaScript and worker module graphs, with package versions and license-file names read from each installed package. P-02 will commit the exact artifact inventory at [`tests/package/evidence/bundle-inventory.json`](../../tests/package/evidence/bundle-inventory.json) and record its SHA-256 in the [P-02 checkpoint](../../agent-work/items/P-02/STATE.md). P-02's exact `npm pack` inventory must be checked against this list before candidate acceptance.

## Bundled code and external peers

P-02's SDK build bundles implementation from Base UI, React Flow, React Markdown, Zod, ELKJS and their transitive runtime dependencies. Its current machine-readable module inventory contains 76 third-party package rows: 65 MIT, 9 ISC, 1 BSD-3-Clause and 1 EPL-2.0 OR GPL-3.0-or-later. `THIRD_PARTY_NOTICES.md` includes each package recorded by that graph with its installed version, license expression, and copied upstream license file, including restored `character-entities@2.0.2`.

The browser bundle also includes `vfile@6.0.3`'s `lib/minpath.browser.js`. That source file contains notices for a `browserify/path-browserify` derivative by James Halliday and portions extracted from Node.js's internal `path` module by Joyent and other Node contributors. Because the bundler strips these comments, the notice file reproduces both complete MIT notices alongside vfile's package license. They are supplemental attributions for code within `vfile`, not additional package rows.

React and React DOM are external peer dependencies, not bundled code. Their upstream licenses remain with those dependencies and are not represented as project-owned material. Development and application-demo dependencies are not treated as package contents merely because they appear in the repository lockfile.

## Assets and source content

P-02's current package allowlist/build report lists generated JavaScript, declarations, SDK CSS, the self-contained ELK worker, package metadata, the README, `LICENSE`, and `THIRD_PARTY_NOTICES.md`. It reports no font files, favicon, static image, external artwork, or demo content. The exact `npm pack --json` listing still has to confirm those exclusions; the repository favicon and demo assets are not in the current package notice inventory.

The repository's showcase documentation cites Vicent Martí's Cursor article, “Git at any scale,” published by Cursor. That article and its claims remain attributed to their source and are not relicensed by this repository or included in the SDK package. No external artwork is represented as first-party or relicensed.

## Evidence boundary

The current 76-package inventory and bundled-module report are P-02 build evidence, not a claim about final tarball contents or that every repository dependency is shipped. Keep the notice list synchronized with the exact packed candidate whenever the bundle graph or package allowlist changes. P-02 must rerun `npm pack --json` after these notice files are present and record that exact inventory in its checkpoint before candidate acceptance. That final package-content gate remains pending.
