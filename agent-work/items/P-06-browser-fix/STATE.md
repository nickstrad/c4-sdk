# P-06-browser-fix checkpoint

Status: builder complete 2026-10-15; awaiting fresh cross-family review. Nothing published, tagged, pushed or merged. Original tarball
`fb74a91` SHA256 `6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084` untouched; no repack.
Branch `fix/p-06-browser-evidence`, worktree `/tmp/c4-sdk-p06-fix`, base `3acf790`. Tests commit `fcc7f88`, docs commit `7e3f80a`; final handoff SHA is this branch HEAD (`git log -1`).
Source under test = base source (src/manifests unchanged since `fb74a91`).

## Evidence (/tmp/c4-p06-fix-evidence, never overwritten)
- `before-cpu1.log`: unchanged specs, no slowdown, 26 pass; 2 fail only because the scratch config does not serve port 4174 ("generic production viewer").
- `before-cpu4.log`: unchanged specs, CDP CPU rate 4, 1 worker: failures nav desktop Control-click (waitForEvent), nav mobile drill (click timeout),
  context invalid-replacement desktop+mobile (click timeout, pane/other-node interception), showcase mobile (60 s click timeout). Traces/screenshots under `before-cpu4/`.
- `after-cpu4.log` 26 pass (same 2 port-4174 scratch failures); `after-cpu4-repeat3.log` 36 pass; `after-cpu6-repeat2.log` 16 pass.
- `full-source-serial.log`/`.exit`: real config, `--workers=1`, 65 passed 1 skipped, exit 0 (after fix, at tests commit `fcc7f88`).
- `scratch-harness/`: throttle fixture + config + spec copies (specs import the throttled `test`; otherwise identical to repo specs).
- Reproduce: copy harness into `tests/browser/_scratch` (untracked), `PROBE_CPU=4 npx playwright test --config=tests/browser/_scratch/playwright.config.ts` after `npm run build:demo -- --base=/c4-preview/`.

## Limits
- CPU throttling models renderer timing, not VM contention; rates are small-sample. Focus-return failures (`navigation:36` at baseline, component-docs) did not reproduce and are unresolved; waived component-docs untouched.
- Default-parallel full suite not repeated (bounded; stress probes above instead). Event helper skipped (read-only inbox, permitted).
- No distribution matrix rerun: test/docs-only change.

## Knowledge/scripts assessment
Lesson recorded in `docs/knowledge/gotchas.md` (focus-then-click, throttling probe). No reusable script added: harness is a one-off, retained in evidence.

## Next
Fresh cross-family review of final HEAD; coordinator lands.
