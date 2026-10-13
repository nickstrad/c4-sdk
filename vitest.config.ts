import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { projects: [
  { test: { name: 'unit', environment: 'node', include: ['tests/unit/**/*.test.ts', 'tests/copy-consumer/policy/**/*.test.ts'] } },
  { test: { name: 'property', environment: 'node', include: ['tests/property/**/*.test.ts'] } },
  { test: { name: 'hooks', environment: 'jsdom', include: ['tests/hooks/**/*.test.ts', 'tests/hooks/**/*.test.tsx'] } },
] } })
