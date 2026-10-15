import { defineConfig } from 'vitest/config'
// Dedicated config: the root runner is read-only for the release item. Pure logic only; no publish or browser work.
export default defineConfig({ test: { name: 'release', environment: 'node', include: ['tests/release/**/*.test.mjs'], cache: false } })
