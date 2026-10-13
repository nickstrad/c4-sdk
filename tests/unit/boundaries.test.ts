import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { expect, it } from 'vitest'
function files(path: string): string[] { return readdirSync(path, { withFileTypes: true }).flatMap(item => item.isDirectory() ? files(join(path, item.name)) : [join(path, item.name)]) }
it('keeps domain free of frameworks, browser, I/O and schema dependencies', () => {
  for (const path of files('src/lib/c4/domain')) {
    const source = readFileSync(path, 'utf8')
    expect(source, path).not.toMatch(/(?:from|import)\s*['"](?:react|zod|effect|node:|.*(?:adapters|react\/|schema|demos))|\b(?:fetch|window|document|localStorage|Date\.now)\s*[.(]/)
  }
})
it('keeps presentation views free of hooks, controllers and application imports', () => {
  for (const path of files('src/lib/c4/react/views')) {
    const source = readFileSync(path, 'utf8')
    expect(source, path).not.toMatch(/(?:from|import)\s*['"].*(?:hooks|containers|adapters|domain\/navigation|demos)|\b(?:useState|useEffect|useContext|useId|fetch|window|history)\b/)
  }
})

it('keeps viewer containers focused on hook and view composition', () => {
  for (const path of ['src/lib/c4/react/containers/ArchitectureViewer.tsx', 'src/lib/c4/react/containers/CatalogViewer.tsx']) {
    const source = readFileSync(path, 'utf8')
    expect(source, path).not.toMatch(/\b(?:useEffect|useLayoutEffect|useRef|useState|useMemo|parseRoute|transition|fetch|window|history|querySelectorAll|querySelector)\b/)
    expect(source, path).not.toMatch(/from ['"].*(?:adapters|domain\/navigation)['"]/)
  }
})
