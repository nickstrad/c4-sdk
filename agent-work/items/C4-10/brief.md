# C4-10 — harden the landed reader and report acceptance

Status: ready for assignment after this claims commit.

Builder: fresh Codex Sol. Reviewer: fresh Claude Sonnet, cross-company. Post-reset paired mapping is active. Root owns shared state, claims and integration. The C4-09 pause does not block current c4-sdk and Cursor hardening.

## Goal and boundary

Harden the c4-sdk reader and landed Cursor consumer against accessibility, resource limits, failure/lifecycle cases and measured performance issues. Publish an exact, evidence-backed acceptance report. Work against current `main` only. C4-09 is paused until FFI-06, FFI-07 and FFI-08 all land on ts-db `main`; this item cannot claim that the future `/ts-db/` consumer is hardened. Preserve that second-consumer validation as a later gate after C4-09 resumes.

## Inputs and known evidence

- Read root `STATE.md`, `agent-work/COORDINATION.md`, this folder, AGENTS.md, plan §10, C4-07 and C4-08 reviews/checkpoints, `docs/knowledge/index.md`, the event log and existing tests before editing.
- C4-07 PASS found the mobile initial code view may show empty/partial canvas; existing tests used visibility and card bounds without asserting viewport intersection. Add viewport-based focused/Fit checks and preserve accessibility/recovery.
- C4-07 reported one unexplained mobile component-docs failure in the broad browser suite. Isolated reruns passed. Run it and the full supported browser suite; diagnose if reproducible and accurately record if not.
- C4-08 PASS reports a mobile publication capture with one node and a clipped edge, a 200%-zoom heading wrap, and the broad suite not rerun. Inspect and include in framing checks/report.
- C4-07's stale root README claims about ELK, groups, Markdown docs and seven kinds were reconciled in C4-08. Verify this fix; do not duplicate it unless a concrete contradiction remains and the coordinator adds a claim.
- Existing 200-node/400-edge worker measurement: 4109.2ms on 4 vCPU/7.8 GiB; provisional cancellation 254.2ms. This exceeds the former 2s target. Measure reproducibly, tune if within scope, otherwise document the supported envelope; do not claim the old target passes.
- Recheck the known braces advisory and production bundles using current primary sources. Do not force-downgrade dependencies; report toolchain exposure if no supported fix applies.

## Required hardening and acceptance

- Full unit, hook, property, lint, typecheck and production build checks. Run the full current browser suite on supported Chromium desktop and Pixel 7 mobile; include all seven kinds, component docs, dynamic, deployment, showcase, deep links, context/navigation and zoom. Preserve failing/rerun history.
- Viewport-based mobile and desktop code-compartment checks: focused member must intersect the actual canvas viewport and be readable; Fit behavior, edge bounds, landscape/code drill, Back/Up and keyboard path must be tested. Check the C4-08 publication view and 200% zoom too. No claim that all nodes are initially framed unless evidence proves it.
- Accessibility: keyboard/focus, screen-reader semantics, axe serious/critical findings, reduced motion, responsive explanation sheet and recovery after navigation.
- Failure/lifecycle: invalid catalog/bundle/route/step, loader replacement races, worker error/timeout/cancel/teardown, repeated dataset/view/viewport changes, and bounded listeners/observers/cache. Errors must not partially publish scene state.
- Resource limits: exercise configurable byte/node/depth/relationship and layout geometry bounds; distinguish raw JSON depth from semantic nesting. Verify host-configurable ceilings and useful errors. Preserve property seeds and minimized fixtures.
- Performance: bounded, reproducible stress fixture (including 200 nodes/400 edges), measured wall time and cancellation; identify hardware/runtime and compare to the former 2s target without inventing a pass. Tune only when evidence identifies a scoped defect.
- Inspect editor schema and source API docs, seven named wrappers and lower-level composition/hooks/props. Verify C4-08 README reconciliation. Preserve draft STE status and source fidelity claims.
- Recheck the current braces advisory with authoritative online sources and inspect generated production bundles to separate runtime exposure from build-tool exposure. If no supported dependency fix exists, document the residual risk and evidence; do not use `npm audit fix --force`.
- Final report includes exact reviewed main revision, commands and counts, browser/viewport details, screenshots/evidence paths, measured resource limits and performance, failures/reruns, security exposure, README result, inherited framing limits, and the explicit pending `/ts-db/` C4-09 gate. No manual deployment or npm publication.

## Deferred cross-repo gate

After FFI-06/07/08 reach ts-db main and C4-09 resumes, refresh the copied consumer from the reviewed SDK revision using the copy workflow and rerun affected production checks at `/ts-db/`. Record its actual copied commit/provenance. Do not report two-consumer completion until this gate passes.
