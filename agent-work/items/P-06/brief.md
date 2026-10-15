# P-06 — Final 0.1.0 candidate

Status: prepared; runs alone only after P-04 and P-05 PASS/landing.
Branch `item/p-06-final-candidate`, worktree `/tmp/c4-sdk-p-06`; exact base at dispatch.

## Goal and acceptance

Complete productionization through tested prepublication readiness. Read full plan and all prior item reviews. Final first version is **0.1.0**, not beta. Before final rebuild/repack set rolldown **1.2.14** and rolldown-plugin-dts **0.28.8**, updating lock. Keep TypeScript6.0.3/Vite8.3.4 and frozen API/support boundaries. Update P-01 identity/support docs and P-01/P-02 checkpoints with explicit superseding notes; preserve historical evidence. npm login was verified by Twin as nickstrad; no login work needed, and no publication authorized.

Run clean-checkout rehearsal of the landed release command. Candidate tarball must include final README, MIT and complete notices; regenerate dependency inventory for actual bumped build and reconcile notice rows. Bind exact source SHA, tarball SHA256, version, inventory and reports. Run all supported Node/ESM/CJS/mixed-context/React-free core/types/Vite browser checks against this exact tarball, plus executable README validation. Run source API/unit/properties/typecheck/lint/generic+demo build and full source browser regression including Cursor showcase. Inspect desktop/mobile screenshots. Do not claim a removed copy-consumer workflow exists; explain C4-09 removal and separately owned future ts-db module ingestion. Test all six requested areas and record explicit pass/evidence or blocking gap. Explain actual warnings/limitations without unsupported promises. Add changelog and final release report. No real publish/tag/registry write; stop and report readiness to lead.

## Owns (serial reservation, effective only at dispatch)

- `package.json`, `package-lock.json`
- `.gitignore` (ignore `/artifacts/`, `/dist-sdk/`, `/.sdk-types/` generated outputs)
- `docs/api/public-api.md`, `docs/api/support-matrix.md`
- `agent-work/items/P-01/STATE.md`, `agent-work/items/P-02/STATE.md` (append superseding final-version/toolchain notes)
- `tests/package/evidence/**`
- `THIRD_PARTY_NOTICES.md`, `docs/release/licenses.md` only if actual bumped inventory requires reconciliation
- `CHANGELOG.md`, `docs/release/0.1.0.md`
- `agent-work/items/P-06/STATE.md`, `agent-work/items/P-06/claims.md`

Any implementation fix beyond those paths requires coordinator reservation and independent review before final exact-candidate validation. No shared root STATE/COORDINATION/index edits. All other inputs read-only.

## Lifecycle

Fresh Sol/Sonnet builder, fresh cross-family review. Read instructions/checkpoints/knowledge/events. Commit implementation and evidence, then separate durable-knowledge/script assessment and final checkpoint. No useful reusable helper is required if existing release driver suffices. Record hashes, exact commands/results, artifact locations, limitations and concrete next action. Clean own worktree after commits are durable. Existing event skip exception applies. Coordinator lands/pushes on PASS; final publication still requires separate explicit instruction.


## Nick's mobile-docs ruling (2026-10-15)

Nick: "Don't block on mobile docs test but note it." Per /root/c4-lead-mobile-nonblocking.md, the intermittent mobile component-docs Playwright failure is non-blocking for this item, six-area signoff, and release readiness. The final report must note its recurrence across C4-07/C4-10/P-06 and passing isolated reruns. Other failures are not waived. Publication still needs separate explicit authorization.
