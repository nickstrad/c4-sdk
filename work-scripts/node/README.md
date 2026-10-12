# Node work scripts

JavaScript helpers use `.mjs` and run with `node work-scripts/node/<name>.mjs`. TypeScript helpers use only syntax Node can erase and run with `node --experimental-strip-types work-scripts/node/<name>.ts` (verified with Node v22.23.2).

Example:

```sh
node --experimental-strip-types work-scripts/node/runtime-info.ts
```

`runtime-info.ts` prints Node, platform, and architecture information for environment reports. Avoid enums, namespaces, and parameter properties, which require TypeScript transformation rather than type stripping. Check the runtime version before relying on this command elsewhere.
