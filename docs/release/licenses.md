# License and attribution record

Reviewed: 2026-10-14.

## Project license and copyright holder

The project is licensed under the MIT License. [`LICENSE`](../../LICENSE) contains the complete standard MIT text and identifies `Nick Strad` as the copyright holder for 2026. The holder is supported by the repository identity `github.com/nickstrad/c4-sdk` and the project commit authorship `nickstrad <nickstrad.dev@gmail.com>`; P-03 recorded the confirmation from the project owner on 2026-10-14. P-02 sets the package metadata license to `MIT` and includes the root `LICENSE` in its package allowlist.

The project license applies to first-party SDK work. Bundled third-party code keeps its own license and attribution terms, reproduced in [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md). The notice inventory is derived from P-02's built JavaScript and worker module graphs, with package versions and license-file names read from each installed package. The machine-readable module inventory is [`tests/package/evidence/bundle-inventory.json`](../../tests/package/evidence/bundle-inventory.json); P-02's final package checkpoint records the exact `npm pack` inventory used to reconcile the release candidate.

## Bundled code and external peers

P-02's SDK build bundles implementation from Base UI, React Flow, React Markdown, Zod, ELKJS and their transitive runtime dependencies. Its module inventory contains 76 third-party packages: 65 MIT, 9 ISC, 1 BSD-3-Clause and ELKJS under the selected EPL-2.0 option. `THIRD_PARTY_NOTICES.md` includes each bundled package's exact installed version, license expression, and copied upstream license file.

React and React DOM are external peer dependencies, not bundled code. Their upstream licenses remain with those dependencies and are not represented as project-owned material. Development and application-demo dependencies are not treated as package contents merely because they appear in the repository lockfile.

## Assets and source content

The P-02 package inventory contains generated JavaScript, declarations, SDK CSS, the self-contained ELK worker, package metadata, the README, `LICENSE`, and `THIRD_PARTY_NOTICES.md`. It contains no font files, favicon, static image, external artwork, or demo content. The repository favicon and demo assets are therefore outside the package notice inventory.

The repository's showcase documentation cites Vicent Martí's Cursor article, “Git at any scale,” published by Cursor. That article and its claims remain attributed to their source and are not relicensed by this repository or included in the SDK package. No external artwork is represented as first-party or relicensed.

## Evidence boundary

The package inventory and bundled-module report are P-02 build evidence, not a claim that every repository dependency is shipped. Keep the notice list synchronized with the exact packed candidate whenever the bundle graph or package allowlist changes. P-02 must rerun `npm pack --json` after these notice files are present and record that exact inventory in its checkpoint before candidate acceptance.
