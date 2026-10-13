# Review C4-01

Reviewed commit: `08054079d91f74d0d6f71bd6b4900c8f86460d06`.
Reviewer: independent Sol; verdict and finding delivered by coordinator on 2026-10-13.
Verdict: **NITS**.

Finding: accepted finite manual coordinates such as `x: 1e308` produced a successful projected scene with an infinite relationship label midpoint because `(sx + tx) / 2` overflowed. Node-only finite checks did not check every edge/canvas coordinate.

Required follow-up: overflow-safe arithmetic, complete scene finite-geometry validation with actionable diagnostics for unrepresentable geometry, concrete regression and generated finite manual-coordinate/size property. Unit/property/typecheck validation is required; reviewer allows no browser rerun because ordinary geometry and UI are unchanged.

Builder implemented follow-up. Review of the updated exact commit remains pending; this record does not grant approval or landing permission.
