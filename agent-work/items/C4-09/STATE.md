# C4-09 checkpoint

Status: unpaused; generic c4-sdk copy-tool unit prepared for fresh builder dispatch. ts-db consumer integration remains a separate fresh-agent unit.

## Gate and scope

- Nick/Twin confirms ts-db FFI-01 through FFI-08 plus FFI-04b are on `origin/main`; verified FFI-08 HEAD is `0b82504290d7eaeac3751f519dd85fdd221ebe63`.
- Required shape: ts-db owns current and clearly distinguished proposed C4 diagrams side by side under `pages/diagrams/` or a link; use diagrams more during feature design. This supplements, not replaces, Pages content/copy/provenance.
- C4-09a is on c4-sdk main; its policy/filesystem APIs support external `pages/c4-sdk-source.json` provenance. The new generic command uses those APIs without editing their files.
- First unit is limited to c4-sdk generic copy command, isolated consumer tests, and a guide. The separate ts-db unit follows after review/landing and uses a reviewed c4-sdk source commit. Do not claim the second consumer hardened before its production checks pass.

## Dispatch

Pool check at 2026-10-14 12:31 UTC: Claude 80% weekly remaining; Codex 63%. Twin verified Muse subscription active, Wonder Full runs, no limit hit, and that Muse has no readable numeric percentage. Pools are healthy.

Next: coordinator commits this claim pack and records the exact base; a fresh Codex Sol builder works in `/tmp/c4-sdk-c4-09` and commits. A new Claude Sonnet reviewer checks the exact builder head. The coordinator alone lands it, then prepares a separate ts-db claim/worktree.
