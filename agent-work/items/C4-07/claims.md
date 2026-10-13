# C4-07 ownership

Fresh builder: Claude Sonnet 5.5 (single fresh context, no subagents). Branch `item/c4-07-seven-types`; base `11913f0`.

Owns:
- agent-work/items/C4-07/{brief,claims,review,STATE}.md
- src/lib/c4/domain/{model,architecture,scene,codeview}.ts (codeview.ts is new: code containment, member and rendering identity rules)
- src/lib/c4/schema/decode.ts
- src/lib/c4/react/containers/{ArchitectureViewer,DiagramCanvas}.tsx (provider, parts, slots, routed-kind check)
- src/lib/c4/react/containers/NamedDiagrams.tsx (new: seven named wrappers); ComponentDiagram/DeploymentDiagram/DynamicDiagram.tsx removed
- src/lib/c4/react/hooks/useViewerController.ts (new: shared controller context and read-only hook)
- src/lib/c4/react/contracts/views.ts (NavigationSlot, LegendSlot)
- src/lib/c4/react/views/CanvasEdge.tsx (relationship kind in label)
- src/lib/c4/react/views/{CanvasNode,DiagramFallback}.tsx, src/lib/c4/react/views/CodeMembers.tsx (new)
- src/lib/c4/react/hooks/useContext.ts (unused useDiagramKind removed)
- src/lib/c4/styles/canvas.css (code compartment rules only)
- src/lib/c4/index.ts (public exports)
- fixtures/seven-types.json (new generic fixture)
- public/catalog.json, public/diagrams/seven-types.json (generic catalog entry, appended after the default sample)
- README.md (delivered types, wrappers, composition example)
- tests/unit/seven-types.test.ts, tests/property/seven-types.test.ts, tests/hooks/composition.test.tsx, tests/browser/seven-types/seven-types.spec.ts
- tests/hooks/composition-example.tsx (README example source)
- tests/unit/architecture.test.ts (the 'later types' assertion used `code`, now a supported kind; changed to an unsupported kind)

Reads layout adapters, session/documentation hooks, plan and prior items. No layout adapter/config/manifest/lockfile edits; the demo showcase JSON is not changed (Cursor has no code view). Knowledge index/gotchas are reserved for the separate post-work commit: docs/knowledge/{gotchas,decisions,index}.md and work-scripts/ if justified.
