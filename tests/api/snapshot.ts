import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'

/** Compiler-resolved names, signatures and structural fields; no handwritten declaration copies. */
export function publicSnapshot(root = process.cwd()) {
  const entrypoints = ['src/index.ts', 'src/core/index.ts']
  const program = ts.createProgram(entrypoints.map(path => resolve(root, path)), {
    target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
    strict: true, skipLibCheck: true, noEmit: true,
  })
  const checker = program.getTypeChecker()
  const flags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias
  return Object.fromEntries(entrypoints.map(path => {
    const source = program.getSourceFile(resolve(root, path))!
    const module = checker.getSymbolAtLocation(source)!
    const exports = checker.getExportsOfModule(module).sort((a, b) => a.name.localeCompare(b.name))
    return [path, Object.fromEntries(exports.map(exported => {
      const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
      const runtime = Boolean(symbol.flags & ts.SymbolFlags.Value)
      const type = runtime ? checker.getTypeOfSymbolAtLocation(symbol, source) : checker.getDeclaredTypeOfSymbol(symbol)
      const primitiveFlags = ts.TypeFlags.StringLike | ts.TypeFlags.NumberLike | ts.TypeFlags.BooleanLike | ts.TypeFlags.BigIntLike | ts.TypeFlags.ESSymbolLike
      const primitive = type.isUnion() ? type.types.every(part => Boolean(part.flags & primitiveFlags)) : Boolean(type.flags & primitiveFlags)
      // Union fields include shared private-base fields, e.g. ElementBase's name/description.
      const properties = primitive ? [] : checker.getPropertiesOfType(type)
      return [exported.name, {
        runtime,
        signature: checker.typeToString(type, source, flags),
        fields: Object.fromEntries(properties.map(property => {
          const declarations = property.declarations ?? []
          const readonly = declarations.some(declaration => ts.canHaveModifiers(declaration) && ts.getModifiers(declaration)?.some(modifier => modifier.kind === ts.SyntaxKind.ReadonlyKeyword))
          return [property.name, {
            optional: Boolean(property.flags & ts.SymbolFlags.Optional), readonly,
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, source), source, flags),
          }]
        }).sort(([a], [b]) => String(a).localeCompare(String(b)))),
      }]
    }))]
  }))
}

export function frozenSnapshot() {
  return JSON.parse(readFileSync(new URL('./public-api.snapshot.json', import.meta.url), 'utf8'))
}
