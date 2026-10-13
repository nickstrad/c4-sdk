# C4-06 ownership

Fresh builder: c4_06_astra_fresh. Branch item/c4-06-deployment; base 14ac790.

Owns:
- agent-work/items/C4-06/{brief,claims,review,STATE}.md
- src/lib/c4/domain/{model,architecture,scene,deployment}.ts
- src/lib/c4/schema/decode.ts
- src/lib/c4/react/hooks/{useContext,useDeployment,useViewerSession,useDiagramRenderer}.ts
- src/lib/c4/react/containers/{ArchitectureViewer,DeploymentDiagram}.tsx
- src/lib/c4/react/views/DeploymentTreeView.tsx
- src/lib/c4/styles/deployment.css
- src/lib/c4/index.ts
- fixtures/deployment.json
- demos/git-at-any-scale/public/diagrams/continuity.json
- tests/unit/deployment.test.ts
- tests/property/deployment.test.ts
- tests/hooks/deployment.test.tsx
- tests/browser/deployment/deployment.spec.ts

Reads existing layout, route/navigation, session, documentation, tests and plan contracts. No layout adapter/config/manifest edits. Knowledge index/gotchas scope reported to coordinator and reserved for the mandatory separate post-work commit: docs/knowledge/gotchas.md and docs/knowledge/index.md.

Scope addition coordinated with root: useViewerSession.ts needs route-arrival vs completed-restoration distinction for Back before an asynchronous logical view is ready (deployment browser regression).

Scope addition coordinated with root: useDiagramRenderer.ts reconciles restored focus after asynchronous initial viewport application, preventing focus on an offscreen replica. Existing geometry math reused.
