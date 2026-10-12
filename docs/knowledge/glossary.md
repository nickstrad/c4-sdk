# Glossary

| Term | Meaning |
| --- | --- |
| Work item | A coordinated task with a brief, path claims, and a review record under `agent-work/items/`. |
| Side quest | A bounded investigation tracked on `docs/haiku-experiments.md` with a unique `sq-*` finding. |
| Live event inbox | Immutable event files in the Git common directory, shared by linked worktrees on one VM. |
| Event archive | Tracked event copies under `agent-work/events/`. |

## SDK terms — 2026-10-12

| Term | Meaning |
| --- | --- |
| Architecture bundle | Versioned JSON containing a model, diagrams, documents and source references. |
| Domain logic | Pure rules for architecture validity, projection, navigation, selection and ordering, independent of frameworks. |
| Framework logic | React lifecycle and effects such as fetching, history, focus, measurement and worker integration. |
| Thin hook | A React integration layer that delegates domain decisions to pure functions and interprets effects through ports. |
| Dumb view | A props-only presentation component with supplied callbacks and no domain decisions or state/effect hooks. |
| Vertical slice | A usable reader capability implemented through the necessary data, logic, UI and tests together. |
| Crude copy | A reviewed source-project snapshot copied into a consumer, with SHA/inventory provenance; no npm distribution. |
| Source status | Whether a demo statement is documented by its source, inferred as a decomposition, or explicitly illustrative. |

Definitions follow the [implementation plan](../plans/implementation.md).
