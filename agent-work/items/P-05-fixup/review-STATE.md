# P-05 fixup re-review checkpoint

Fresh independent Codex Sol; 2026-10-15. Branch `review/p-05-fixup-sol`, worktree `/tmp/c4-sdk-p-05-fixup-review`. Exact review target `5203fb3e2978a3173dfd7d279f903dfce2219752`, repair `3e8af96`, original FAIL `20cbece`.

Owns only `review.md` and this checkpoint in this directory. Product read-only; no delegation, publish/push/tag/merge/auth. Publication tests use injected IO only. Ports 4185/4186 leased; final version/toolchain P-06; event skip applies.

In progress: independent sdk-check. Original real-filesystem outside-symlink reproduction now refuses cleanup and preserves precious data. Original clean-before/dirty-after ALLOW_DIRTY reproduction now records dirty:true, passes mocked verification, then rejects mocked publication without invoking publish.

Confirmed blocking integration regression: actual `/tmp/p04-review-evidence/report.json` has passed:true, matching identity, eight screenshot paths and numeric evidence.output.esm[0].nodes=4. checkReadmeReport rejects its evidence. Removing only evidence.output makes the report accepted. Main P-04 verifier at commit e4d9500 emits this mixed evidence shape. Evidence `/tmp/p05-rereview-p04.json`. No product repair permitted: second FAIL requires fresh Muse arbitration, to be dispatched by coordinator (this reviewer has no delegation authority).

Next: finish checks, record exact verdict/evidence, commit both owned files, clean own worktree after durability. Knowledge assessment to be recorded in review; no knowledge/index ownership.

Environment KB search 388 was not useful. Attempted required feedback command, but kb feedback failed to open `/root/Raw/knowledge/.kb/kb.sqlite`; no store changes or escalation attempted.

## Final checkpoint

Verdict **FAIL** (second FAIL). Authoritative findings, tests and reproduction commands are in [review.md](review.md). F1 actual P-04 report rejected; F2 post-build symlink permits outside directory creation before rejection. R2 and declaration/digest repairs verified; original R1 destructive repro fixed. Exact target checkpoint also contains generated files outside claims; coordinator disposition required.

Validation complete: source gates 204 unit/hooks, 34 properties, 5 API plus typecheck/lint passed; sandbox make failed only the known node -e adapter case (release88/89), unchanged elevated release suite89/89 passed. Existing committed real tarball independently inspected/hash/evidence checked (15 files,859203 bytes,d7980de2…edd33f8); no fresh pack/full browser rerun. Product tracked tree unchanged. Logs/repros are outside checkout under /tmp/p05-rereview-* and survive cleanup.

Commit both owned files on review/p-05-fixup-sol, preserve branch, then remove this review worktree after confirming commit durability. The review commit is the tip of that branch; no self-referential SHA recorded. Coordinator next: fresh Muse arbitration with original review20cbece and exact target5203fb3; no repair or landing authorized by this checkpoint. Ports4185/4186 unused and released by reviewer. Knowledge/script assessment recorded in review; no out-of-scope additions.
