import process from "node:process";

console.log(
  JSON.stringify(
    {
      node: process.version,
      platform: process.platform,
      architecture: process.arch,
    },
    null,
    2,
  ),
);
