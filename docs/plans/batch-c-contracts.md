# Batch C contracts

This preflight establishes seams; it implements neither an engine nor grouped rendering. See [the brief](../../agent-work/items/C4-preflight/brief.md). Dependency setup `11f6b698b45072e4f007ef7df2808fee25db96f6` independently passed review: exact React Flow 12.12.0, ELK 0.12.0 and react-markdown 10.1.0 pins support locked React 19.3.0 and preserve existing lock resolutions.

## Data and geometry

Diagram groups are optional source data, normalized to an empty array. Groups declare id, label, memberIds, status and optional parentGroupId. Group IDs form a separate namespace from element IDs and may overlap: engine/renderer adapters must namespace internal IDs. A visible element has at most one direct group. Parents must exist, ancestry must be acyclic and root-inclusive depth cannot exceed 32. Declaration order has no ancestry meaning. Group boundaries and planned/mixed dashed notation participate in legend warnings.

buildScene produces immutable inputs with architecture ID, revision, diagram, groups, direct membership/ancestry and relationships. It supplies pure kind/status labels, node tone/stroke and edge number/stroke. Layout changes geometry rather than these decisions. Geometry types live in geometry.ts, re-exported from scene.ts for existing imports. New output/measurement fields are optional, preserving existing ports. Direct SceneInput constructors must supply normalized fields; callers normally use buildScene.

All bounds, labels and routed points are absolute scene coordinates, including nested groups. Dimensions and far corners must be finite, dimensions positive. Nodes/groups retain direct parent IDs. Ordered edge sections retain start/end/bend points; outer endpoints match the required legacy scalar anchors. Adapters preserve declared node/edge/group order, original validated object references, exact endpoint node references and presentation attributes. Internal sorting must be reversed before publication. The renderer converts children to parent-relative coordinates once. C4-04 owns additional containment checks for rendered compounds.

Workers return geometry-only data. The client reattaches original validated diagram/element/relationship/group objects and SceneInput presentation attributes before validateLayout. A structured-cloned whole Scene fails reference identity checks. Fixed layout returns unsupported-groups for nonempty groups; it never drops boundaries.

## Measurements and lifecycle

Optional measurement snapshots include revision, node sizes by element ID, edge-label sizes by relationship ID and group-label sizes by group ID. Use own-key lookup (lookupMeasuredSize), including for valid constructor/toString IDs; never resolve Object.prototype. Finite positive measures replace explicit provisional sizes. Measured responses echo measurementRevision; C4-04 verifies it alongside generation.

Cache identity includes architecture ID, bundle revision, diagram ID, pinned engine/version, normalized settings, membership/ancestry, presentation labels, sorted actual measured/provisional sizes and measurement revision. Revision alone is insufficient. A generation permits provisional layout and at most one relayout after node/edge/group labels settle. Genuine new input/resize starts a new generation; feedback cannot create an unbounded loop.

Callers own generation and AbortSignal cancellation on navigation, replacement, unmount and new measurement snapshots. C4-04 owns worker cleanup, finite positive timeout configuration, failures and restart. On failure retain the last usable scene or accessible relationship list and diagnostics. Do not report success with discarded groups. Timeout budgets/performance claims require measurement. Existing unmeasured ports remain valid.

## Parallel ownership and integration

03/04 require reviewed preflight and use separate worktrees plus independent injected fixture catalogs through production CatalogViewer, without shared showcase JSON edits.

| Item | Owns after preflight | Prerequisite |
| --- | --- | --- |
| C4-03 | model/schema/architecture/scene projection/groups; documentation selectors, useContext/documentation hooks, DocumentationView/contracts; a new separate ComponentDiagram container/public barrel; dedicated documentation styles | Reviewed preflight |
| C4-04 | geometry/layout/LayoutPort; ArchitectureViewer RenderDiagram composition/error fallback and DiagramCanvas; useDiagramLayout/useDiagramRenderer/useViewerSession; dedicated canvas styles; worker/engine adapters | Reviewed preflight |
| C4-09a | Pure copy-policy helper and scratch filesystem tests | Reviewed preflight; concurrent with 03/04 |
| Coordinator | Shared manifest/lock/config/entry gates, root status and c4.css | Serialized changes |

Integrate approved 03, then 04, then 09a. C4-09 consumer integration follows 07; rerun affected combined checks. Exact item claims refine paths before dispatch. Stop overlapping edits until claims are revised. ArchitectureViewer.tsx belongs to 04 for async rendering, accessible relationship-list error fallback and viewport composition. 03 adds ComponentDiagram in a new separate container file; responsive document state flows through existing documentationProps via useContext, so 03 does not edit ArchitectureViewer. Dedicated styles import through their owned modules. 03 uses existing Base UI primitives for its responsive Sheet with SDK-local styles/imports and no app alias. Generic kind labels already support component labels without changing04 canvas.

04 must verify Vite-emitted literal worker URLs under production /c4-preview/; C4-09 repeats the consumer gate under /ts-db/. Resource URLs/native hashes retain host base. Installed dependencies do not imply engine or consumer acceptance.
