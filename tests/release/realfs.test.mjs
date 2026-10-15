// Real-filesystem containment regressions: symlinked ancestors must never redirect cleanup.
import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ReleaseError, context, releasePack } from '../../work-scripts/node/release/cli.mjs'
import { MARKER, createIo, physicalContainmentErrors } from '../../work-scripts/node/release/process.mjs'
import { manifest } from './fake-io.mjs'

const SHA = 'a'.repeat(40)
let base
let repo
let outside

// Real filesystem adapter; only git state and process execution are replaced.
function realIo(repoDir, onRun) {
  const io = createIo({ cwd: repoDir, log: () => {} })
  return {
    ...io,
    gitState: () => ({ sha: SHA, dirty: false, status: '' }),
    run(command, args) {
      onRun(command, args)
      // The build succeeds so cleanup is reached; npm pack (and anything else) stops the run.
      return command === 'node' && args[0] === 'sdk-build.mjs' ? { status: 0, stdout: '', stderr: '' } : { status: 1, stdout: '', stderr: 'mock stop' }
    },
  }
}
const attempt = fn => { try { fn(); return null } catch (error) { if (error instanceof ReleaseError) return error.message; throw error } }
const candidate = root => join(root, `c4-sdk-0.1.0-${SHA.slice(0, 12)}`)

beforeEach(() => {
  base = realpathSync(mkdtempSync(join(tmpdir(), 'c4-release-realfs-')))
  repo = join(base, 'repo')
  outside = join(base, 'outside')
  mkdirSync(repo)
  mkdirSync(outside)
  writeFileSync(join(repo, 'package.json'), JSON.stringify({ ...manifest(), engines: undefined }))
})
afterEach(() => rmSync(base, { recursive: true, force: true }))

const seed = dir => {
  mkdirSync(join(dir, 'precious'), { recursive: true })
  writeFileSync(join(dir, MARKER), 'marker')
  writeFileSync(join(dir, 'precious', 'data'), 'keep')
}

describe('real filesystem cleanup containment', () => {
  it('does not delete an outside candidate reached through a symlinked artifacts root', () => {
    seed(candidate(outside))
    symlinkSync(outside, join(repo, 'artifacts'))
    const calls = []
    const message = attempt(() => releasePack(realIo(repo, (c, a) => { calls.push(`${c} ${a[0]}`) }), context({ ARTIFACTS: 'artifacts' }, repo)))
    expect(message).toMatch(/symbolic link/)
    expect(existsSync(join(candidate(outside), 'precious', 'data'))).toBe(true)
    expect(calls).toEqual([]) // nothing was built or packed
  })

  it('does not delete a protected source directory reached through a symlinked ancestor', () => {
    mkdirSync(join(repo, 'src'))
    seed(candidate(join(repo, 'src')))
    mkdirSync(join(repo, 'out'))
    symlinkSync(join(repo, 'src'), join(repo, 'out', 'link'))
    const message = attempt(() => releasePack(realIo(repo, () => {}), context({ ARTIFACTS: 'out/link' }, repo)))
    expect(message).toMatch(/symbolic link/)
    expect(existsSync(join(candidate(join(repo, 'src')), 'precious', 'data'))).toBe(true)
  })

  it('does not delete through a symlinked candidate directory or marker inside a real artifacts root', () => {
    const root = join(repo, 'artifacts')
    mkdirSync(root)
    seed(join(outside, 'target'))
    symlinkSync(join(outside, 'target'), candidate(root))
    expect(attempt(() => releasePack(realIo(repo, () => {}), context({ ARTIFACTS: 'artifacts' }, repo)))).toMatch(/symbolic link|refusing/)
    expect(existsSync(join(outside, 'target', 'precious', 'data'))).toBe(true)

    rmSync(candidate(root))
    mkdirSync(candidate(root), { recursive: true })
    mkdirSync(join(candidate(root), 'precious'))
    writeFileSync(join(outside, 'marker'), 'x')
    symlinkSync(join(outside, 'marker'), join(candidate(root), MARKER))
    expect(attempt(() => releasePack(realIo(repo, () => {}), context({ ARTIFACTS: 'artifacts' }, repo)))).toMatch(/marker/)
    expect(existsSync(join(candidate(root), 'precious'))).toBe(true)
  })

  it('still replaces a genuinely marked candidate inside a real artifacts root', () => {
    const root = join(repo, 'artifacts')
    seed(candidate(root))
    const message = attempt(() => releasePack(realIo(repo, () => {}), context({ ARTIFACTS: 'artifacts' }, repo)))
    expect(message).toMatch(/npm pack failed/) // mocked pack stops the run after cleanup
    expect(existsSync(join(candidate(root), 'precious'))).toBe(false)
  })

  it('physicalContainmentErrors accepts plain nested and missing paths, rejects links and files', () => {
    mkdirSync(join(repo, 'a', 'b'), { recursive: true })
    expect(physicalContainmentErrors(repo, join(repo, 'a', 'b'))).toEqual([])
    expect(physicalContainmentErrors(repo, join(repo, 'a', 'new', 'deeper'))).toEqual([])
    writeFileSync(join(repo, 'file'), 'x')
    expect(physicalContainmentErrors(repo, join(repo, 'file', 'x')).join()).toMatch(/not a directory/)
    symlinkSync(outside, join(repo, 'link'))
    expect(physicalContainmentErrors(repo, join(repo, 'link', 'deep')).join()).toMatch(/symbolic link/)
    expect(physicalContainmentErrors(repo, outside).join()).toMatch(/not inside/)
  })
})
