import test from "node:test";
import assert from "node:assert/strict";
import { scaffoldFiles } from "../src/lib/protocol-manifest.js";

function scaffoldMap() {
  return new Map(scaffoldFiles().map((file) => [file.relativePath, file.contents]));
}

test("scaffold manifest includes required top-level files", () => {
  const files = scaffoldFiles().map((file) => file.relativePath);
  assert.deepEqual(
    files,
    [
      "brief.md",
      "config.json",
      "status.md",
      "conflicts.md",
      "kill-log.md",
      "run-log.md",
      "ATAVI-REPORT.md",
      "pass-1/README.md",
      "pass-1/synthesis.md",
      "pass-1/decision.md",
      "pass-1/cross-pollination/README.md",
      "registries/claims.md",
      "registries/experiments.md",
      "registries/prior-art.md",
      "memory/README.md",
      "memory/prior-art-cache/README.md",
      "memory/kill-archive/README.md",
      "memory/claim-patterns/README.md",
      "memory/convergence-history/README.md",
      "memory/strategy-insights/README.md"
    ]
  );
});

test("scaffolded markdown snapshots stay stable for pass and report files", () => {
  const files = scaffoldMap();

  assert.equal(
    files.get("ATAVI-REPORT.md"),
    `# ATAVI Report

This file is populated by the host AI after a run completes.
`
  );

  assert.equal(
    files.get("pass-1/README.md"),
    `# ATAVI Pass 1

Place independent agent outputs in this directory as:

- theorist-pod.md
- experimentalist-pod.md
- scout-pod.md
- critic-pod.md
- synthesist-pod.md

The host AI also writes:

- synthesis.md
- decision.md
`
  );

  assert.equal(
    files.get("pass-1/cross-pollination/README.md"),
    `# ATAVI Cross-Pollination

Place CPR outputs in this directory as:

- theorist-cpr.md
- experimentalist-cpr.md
- scout-cpr.md
- critic-cpr.md
- synthesist-cpr.md
`
  );

  assert.equal(
    files.get("run-log.md"),
    `# ATAVI Run Log

Use this file for the pass-by-pass process log, including POD completion, CPR
exchange, synthesis updates, convergence scores, and decision gates.
`
  );
});

test("memory bucket scaffolds include governance fields and entry formats", () => {
  const files = scaffoldMap();

  assert.match(files.get("memory/README.md"), /- Domain:/);
  assert.match(files.get("memory/README.md"), /- Keywords:/);
  assert.match(files.get("memory/README.md"), /- Confidence:/);
  assert.match(files.get("memory/README.md"), /- Expires:/);
  assert.match(files.get("memory/README.md"), /- Contradicts:/);
  assert.match(files.get("memory/prior-art-cache/README.md"), /- Source:/);
  assert.match(files.get("memory/kill-archive/README.md"), /- Kill Reason:/);
  assert.match(files.get("memory/claim-patterns/README.md"), /- Pattern Name:/);
  assert.match(files.get("memory/convergence-history/README.md"), /- Run ID:/);
  assert.match(files.get("memory/strategy-insights/README.md"), /- Insight Name:/);
});
