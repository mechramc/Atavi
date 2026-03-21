import test from "node:test";
import assert from "node:assert/strict";
import { scaffoldFiles } from "../src/lib/protocol-manifest.js";

test("scaffold manifest includes required top-level files", () => {
  const files = scaffoldFiles().map((file) => file.relativePath);
  assert.deepEqual(
    files,
    [
      "brief.md",
      "config.json",
      "status.md",
      "ATAVI-REPORT.md",
      "registries/claims.md",
      "registries/experiments.md",
      "registries/prior-art.md",
      "memory/README.md"
    ]
  );
});

