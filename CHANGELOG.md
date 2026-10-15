# Changelog

All notable changes to `c4-sdk`. The package follows SemVer; `0.x` releases are not a 1.0 stability guarantee (see [`docs/api/public-api.md`](docs/api/public-api.md)).

## 0.1.0

First release. No earlier version was published; the `0.1.0-beta.1` identity used by preliminary packs was never released.

- Accessible React viewers and browser-free data tools for all seven C4 diagram types.
- Entry points: `c4-sdk` (UI + core, ESM/CJS with `.d.mts`/`.d.cts`), `c4-sdk/core` (React-free), `c4-sdk/styles.css`, `c4-sdk/layout-worker.js`.
- Peers: React and React DOM `19.3.0`. Verified on Node `22.23.2`, TypeScript `6.0.3`, Vite `8.3.4`.
- Packed artifact allowlist: 15 files including `LICENSE`, `README.md` and `THIRD_PARTY_NOTICES.md`; no source maps.
- Built with rolldown `1.2.14` and rolldown-plugin-dts `0.28.8`.
- Release verification (`make release-check`) installs and tests the exact tarball: ESM/CJS/NodeNext/bundler consumers, packaged browser tests and executable README snippets.

Known limitations: see [`docs/release/0.1.0.md`](docs/release/0.1.0.md).
