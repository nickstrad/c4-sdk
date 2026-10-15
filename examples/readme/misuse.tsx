import { ArchitectureViewer, SystemContext } from 'c4-sdk'
import type { ValidatedArchitecture } from 'c4-sdk/core'

declare const validated: ValidatedArchitecture

export const ok = <ArchitectureViewer validatedBundle={validated} />
export const kindChecked = <SystemContext validatedBundle={validated} />

// @ts-expect-error validatedBundle is required.
export const missing = <ArchitectureViewer />
// @ts-expect-error Raw JSON is not validated data.
export const raw = <ArchitectureViewer validatedBundle={{ schemaVersion: 1 }} />
// @ts-expect-error Named wrappers fix the expected kind.
export const kind = <SystemContext validatedBundle={validated} expectedKind="container" />
