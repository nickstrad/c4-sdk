import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync, linkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { createIo, parseTarListing } from '../../work-scripts/node/release/process.mjs'
import { checkInventory, sha256Hex } from '../../work-scripts/node/release/policy.mjs'

const scratch = mkdtempSync(join(tmpdir(), 'c4-release-process-test-'))
afterAll(() => rmSync(scratch, { recursive: true, force: true }))
const tar = (cwd, out, args) => { const r = spawnSync('tar', ['-czf', out, ...args], { cwd }); if (r.status !== 0) throw new Error(String(r.stderr)) }
const io = createIo({ cwd: scratch })

function fixture(name, build) {
  const dir = join(scratch, name)
  mkdirSync(join(dir, 'package/dist-sdk'), { recursive: true })
  build(join(dir, 'package'))
  const out = join(dir, `${name}.tgz`)
  tar(dir, out, ['package'])
  return { dir, out }
}

describe('tar listing parser', () => {
  it('parses regular files, modes, sizes and link types', () => {
    const entries = parseTarListing([
      '-rw-r--r-- 0/0              1067 1985-10-26 08:15 package/LICENSE',
      '-rwxr-xr-x 0/0                12 1985-10-26 08:15 package/bin/x',
      'lrwxrwxrwx 0/0                 0 1985-10-26 08:15 package/link -> /etc/passwd',
      'hrwxr-xr-x 0/0                 0 1985-10-26 08:15 package/hard link to package/LICENSE',
      'drwxr-xr-x 0/0                 0 1985-10-26 08:15 package/dist-sdk/',
    ].join('\n'))
    expect(entries[0]).toEqual({ path: 'package/LICENSE', type: 'file', mode: 0o644, size: 1067 })
    expect(entries[1].mode).toBe(0o755)
    expect(entries[2]).toMatchObject({ path: 'package/link', type: 'symlink' })
    expect(entries[3]).toMatchObject({ path: 'package/hard', type: 'hardlink' })
    expect(entries[4].type).toBe('directory')
  })
})

describe('inspectTarball against real archives', () => {
  it('lists real files with content hashes and text for metadata only', () => {
    const { out } = fixture('good', pkg => {
      writeFileSync(join(pkg, 'package.json'), '{"name":"c4-sdk"}')
      writeFileSync(join(pkg, 'LICENSE'), 'MIT')
      writeFileSync(join(pkg, 'dist-sdk/index.d.mts'), 'export {}')
      writeFileSync(join(pkg, 'dist-sdk/index.cjs'), 'module.exports={}')
    })
    const result = io.inspectTarball(out)
    expect(result.ok).toBe(true)
    const byPath = Object.fromEntries(result.files.map(f => [f.path, f]))
    expect(Object.keys(byPath).sort()).toEqual(['LICENSE', 'dist-sdk/index.cjs', 'dist-sdk/index.d.mts', 'package.json'])
    expect(byPath.LICENSE.sha256).toBe(sha256Hex('MIT'))
    expect(byPath['package.json'].text).toBe('{"name":"c4-sdk"}')
    expect(byPath['dist-sdk/index.cjs'].text).toBeUndefined()
    expect(byPath.LICENSE.type).toBe('file')
  })

  it('reports symlinks and hardlinks without extracting them', () => {
    const { out } = fixture('links', pkg => {
      writeFileSync(join(pkg, 'package.json'), '{}')
      symlinkSync('/etc/passwd', join(pkg, 'dist-sdk/index.cjs'))
      linkSync(join(pkg, 'package.json'), join(pkg, 'LICENSE'))
    })
    const result = io.inspectTarball(out)
    expect(result.files.some(f => f.type === 'symlink')).toBe(true)
    expect(checkInventory(result.files).join()).toMatch(/non-regular/)
    expect(result.files.every(f => f.sha256 === undefined)).toBe(true)
  })

  it('rejects entries outside package/ and path traversal', () => {
    const dir = join(scratch, 'evil')
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'evil'), 'x')
    const outside = join(dir, 'outside.tgz')
    tar(dir, outside, ['evil'])
    expect(io.inspectTarball(outside)).toMatchObject({ ok: false })
    const traversal = join(dir, 'traversal.tgz')
    tar(dir, traversal, ['--transform', 's,^evil,package/../evil,', 'evil'])
    const result = io.inspectTarball(traversal)
    expect(result.ok).toBe(false)
    expect(result.errors.join()).toMatch(/unsafe path/)
  })

  it('fails cleanly for a corrupt archive', () => {
    const bad = join(scratch, 'bad.tgz')
    writeFileSync(bad, 'not a tarball')
    expect(io.inspectTarball(bad).ok).toBe(false)
  })
})

describe('adapter helpers', () => {
  it('writes atomically, hashes bytes, and recognises regular files only', () => {
    const path = join(scratch, 'out/report.json')
    io.writeAtomic(path, '{"a":1}\n')
    expect(io.readJson(path)).toEqual({ a: 1 })
    expect(io.hashFile(path).sha256).toBe(sha256Hex('{"a":1}\n'))
    expect(io.isRegularFile(path)).toBe(true)
    const link = join(scratch, 'out/link.json')
    symlinkSync(path, link)
    expect(io.isRegularFile(link)).toBe(false)
    expect(io.isRegularFile(join(scratch, 'out'))).toBe(false)
  })

  it('runs commands without a shell', () => {
    const result = io.run('node', ['-e', 'console.log(process.argv[1])', 'a;b $(x)'], { capture: true })
    expect(result.stdout.trim()).toBe('a;b $(x)')
    expect(io.run('definitely-not-a-command-c4', [], { capture: true }).status).not.toBe(0)
  })
})
