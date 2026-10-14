import type { ComponentProps } from 'react'
import {
  ArchitectureViewer, ArchitectureProvider, CatalogViewer, SystemLandscape, SystemContext,
  ContainerDiagram, ComponentDiagram, CodeDiagram, DynamicDiagram, DeploymentDiagram,
  DiagramNavigation, DiagramView, DiagramLegend, DiagramDocumentation, Legend, useViewerController,
} from '../../src/index'
import type { ArchitectureViewerProps, NamedDiagramProps, NavigationSlot, LegendSlot, DocumentationSlot, CatalogViewerProps } from '../../src/index'
import type { ArchitectureBundle, ValidatedArchitecture, Route, RoutePort, LayoutPort, ArchitectureLoader, Result, Diagnostic, NavigationAction, SceneInput } from '../../src/core/index'
import { decodeArchitecture, buildScene } from '../../src/core/index'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
export type Contracts = [
  Assert<Equal<ReturnType<typeof decodeArchitecture>, Result<ValidatedArchitecture>>>,
  Assert<Equal<Parameters<typeof decodeArchitecture>[0], unknown>>,
  Assert<Equal<ReturnType<typeof buildScene>, Result<SceneInput>>>,
  Assert<Equal<ComponentProps<typeof ArchitectureViewer>, ArchitectureViewerProps>>,
  Assert<Equal<ComponentProps<typeof CatalogViewer>, CatalogViewerProps>>,
  Assert<Equal<ComponentProps<typeof SystemLandscape>, NamedDiagramProps>>,
  Assert<Equal<ComponentProps<typeof SystemContext>, NamedDiagramProps>>,
  Assert<Equal<ComponentProps<typeof ContainerDiagram>, NamedDiagramProps>>,
  Assert<Equal<ComponentProps<typeof ComponentDiagram>, NamedDiagramProps>>,
  Assert<Equal<ComponentProps<typeof CodeDiagram>, NamedDiagramProps>>,
  Assert<Equal<ComponentProps<typeof DynamicDiagram>, NamedDiagramProps>>,
  Assert<Equal<ComponentProps<typeof DeploymentDiagram>, NamedDiagramProps>>,
  Assert<Equal<Parameters<ReturnType<typeof useViewerController>['navigate']>[0], NavigationAction>>,
]

// Ordinary objects implement the host ports; no SDK class identity or private hooks are required.
export function composeHost(validatedBundle: ValidatedArchitecture, initial: Route, layoutPort: LayoutPort, loader: ArchitectureLoader) {
  let snapshot = { hash: '', canGoBack: false }
  const routePort: RoutePort = {
    getSnapshot: () => snapshot, subscribe: () => () => {},
    push: () => { snapshot = { ...snapshot, canGoBack: true } }, replace: () => {}, back: () => {},
  }
  const navigation: NavigationSlot = props => <button onClick={props.onBack}>{props.breadcrumbs[0]?.title}</button>
  const legend: LegendSlot = props => <Legend {...props} compact />
  const documentation: DocumentationSlot = props => <button onClick={props.onSte}>{props.document?.ste.text}</button>
  const props: ArchitectureViewerProps = { validatedBundle, diagramId: initial.diagramId, routePort, layoutPort, navigationSlot: navigation, legendSlot: legend, documentationSlot: documentation }
  const full = <ArchitectureViewer {...props} />
  const parts = <ArchitectureProvider {...props}><DiagramNavigation slot={navigation} /><DiagramView legendSlot={() => null} /><DiagramLegend slot={legend} /><DiagramDocumentation slot={documentation} /></ArchitectureProvider>
  const catalog = <CatalogViewer catalogUrl="catalog.json" loader={loader} routePort={routePort} />
  return [full, parts, catalog]
}

export function rejectInvalidContracts(bundle: ArchitectureBundle, result: Result<ValidatedArchitecture>, diagnostic: Diagnostic, named: NamedDiagramProps) {
  // @ts-expect-error Raw normalized data is still missing the validated index and diagnostics.
  const rawViewer = <ArchitectureViewer validatedBundle={bundle} />
  // @ts-expect-error Named wrappers reserve the actual routed kind.
  const wrongWrapper = <SystemContext {...named} expectedKind="code" />
  // @ts-expect-error Result must be narrowed before accessing a successful value.
  const unchecked = result.value
  // @ts-expect-error Public data is read-only.
  bundle.model.elements.push(bundle.model.elements[0])
  // @ts-expect-error Diagnostics have a finite severity union.
  const severity: Diagnostic['severity'] = 'fatal'
  // @ts-expect-error Diagnostic location is immutable.
  diagnostic.path = '$'
  return [rawViewer, wrongWrapper, unchecked, severity]
}
