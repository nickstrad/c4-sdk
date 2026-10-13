import { ArchitectureProvider, DiagramDocumentation, DiagramLegend, DiagramNavigation, DiagramView, useViewerController } from '../../src/lib/c4'
import type { ValidatedArchitecture } from '../../src/lib/c4'

function CurrentKind() {
  const { diagram } = useViewerController()
  return <p>Showing a {diagram?.kind} diagram</p>
}

export function ShopWorkspace({ validatedBundle }: { validatedBundle: ValidatedArchitecture }) {
  return <ArchitectureProvider validatedBundle={validatedBundle}>
    <aside><DiagramNavigation /><DiagramLegend /></aside>
    <main><CurrentKind /><DiagramView legendSlot={() => null} /></main>
    <DiagramDocumentation slot={props => <section aria-label="Explanation">{props.document?.plain}</section>} />
  </ArchitectureProvider>
}
