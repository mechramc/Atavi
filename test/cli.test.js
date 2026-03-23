import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { runCli } from "../src/cli.js";

function createIo(cwd) {
  let stdout = "";
  let stderr = "";
  return {
    cwd,
    stdout: {
      write(chunk) {
        stdout += chunk;
      }
    },
    stderr: {
      write(chunk) {
        stderr += chunk;
      }
    },
    getStdout() {
      return stdout;
    },
    getStderr() {
      return stderr;
    }
  };
}

test("atavi --path prints a protocol path", async () => {
  const io = createIo(process.cwd());
  await runCli(["--path"], io);
  assert.match(io.getStdout(), /Atavi/i);
});

test("atavi init scaffolds a workspace", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
  } finally {
    process.chdir(originalCwd);
  }

  const config = await readFile(path.join(tmp, ".atavi", "config.json"), "utf8");
  const status = await readFile(path.join(tmp, ".atavi", "status.md"), "utf8");
  const memoryReadme = await readFile(
    path.join(tmp, ".atavi", "memory", "strategy-insights", "README.md"),
    "utf8"
  );
  const passReadme = await readFile(path.join(tmp, ".atavi", "pass-1", "README.md"), "utf8");
  const synthesis = await readFile(path.join(tmp, ".atavi", "pass-1", "synthesis.md"), "utf8");
  const decision = await readFile(path.join(tmp, ".atavi", "pass-1", "decision.md"), "utf8");
  const crossPollinationReadme = await readFile(
    path.join(tmp, ".atavi", "pass-1", "cross-pollination", "README.md"),
    "utf8"
  );
  const runLog = await readFile(path.join(tmp, ".atavi", "run-log.md"), "utf8");
  assert.match(config, /"mode": "full"/);
  assert.match(status, /run_status: initialized/);
  assert.match(memoryReadme, /Strategy Insights/);
  assert.match(passReadme, /ATAVI Pass 1/);
  assert.match(synthesis, /Pass 1 Synthesis/);
  assert.match(decision, /Pass 1 Decision/);
  assert.match(crossPollinationReadme, /ATAVI Cross-Pollination/);
  assert.match(runLog, /ATAVI Run Log/);
});

test("atavi doctor passes when packaged files exist", async () => {
  const io = createIo(process.cwd());
  await runCli(["doctor"], io);
  assert.match(io.getStdout(), /ATAVI doctor: OK/);
});

test("atavi validate passes for scaffolded config", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await runCli(["validate", "."], io);
  } finally {
    process.chdir(originalCwd);
  }

  assert.match(io.getStdout(), /ATAVI validate: OK/);
  assert.match(io.getStdout(), /mode: full/);
});

test("atavi validate fails for invalid config", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await writeFile(
      path.join(tmp, ".atavi", "config.json"),
      JSON.stringify(
        {
          mode: "full",
          maxPasses: 0,
          maxExperiments: 5,
          convergenceThreshold: 2,
          agents: ["theorist"],
          memory: {
            enabled: "yes",
            scope: "global"
          }
        },
        null,
        2
      ),
      "utf8"
    );

    await assert.rejects(() => runCli(["validate", "."], io), /failed validation/);
  } finally {
    process.chdir(originalCwd);
  }

  assert.match(io.getStdout(), /ATAVI validate: FAIL/);
  assert.match(io.getStdout(), /maxPasses must be a positive integer/);
  assert.match(io.getStdout(), /convergenceThreshold must be a number greater than 0 and less than or equal to 1/);
  assert.match(io.getStdout(), /full mode must include agent: experimentalist/);
  assert.match(io.getStdout(), /full mode must include agent: scout/);
  assert.match(io.getStdout(), /memory.enabled must be a boolean/);
  assert.match(io.getStdout(), /memory.scope must be one of: project/);
});

test("atavi init does not overwrite existing workspace files", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await writeFile(path.join(tmp, ".atavi", "brief.md"), "# User Edited Brief\n", "utf8");
    await runCli(["init", "."], io);
  } finally {
    process.chdir(originalCwd);
  }

  const brief = await readFile(path.join(tmp, ".atavi", "brief.md"), "utf8");
  assert.equal(brief, "# User Edited Brief\n");
  assert.match(io.getStdout(), /Created 0 new file\(s\)\. Workspace status: ready\./);
});

test("atavi migrate upgrades an older workspace without overwriting user files", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);
  const workspace = path.join(tmp, ".atavi");

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await mkdir(workspace, { recursive: true });
    await writeFile(path.join(tmp, ".atavi", "brief.md"), "# Older Brief\n", "utf8");
    await writeFile(
      path.join(tmp, ".atavi", "config.json"),
      `${JSON.stringify(
        {
          mode: "full",
          maxPasses: 4,
          maxExperiments: 5,
          convergenceThreshold: 0.7,
          agents: ["theorist", "experimentalist", "scout"],
          memory: {
            enabled: true,
            scope: "project"
          }
        },
        null,
        2
      )}\n`,
      "utf8"
    );
    await writeFile(path.join(tmp, ".atavi", "status.md"), "# ATAVI Status\n\nrun_status: initialized\ncurrent_pass: 0\ncurrent_phase: not_started\nconvergence_score: n/a\nblocking_concerns: none\ntoken_estimate: unknown\nlast_updated: pending\n", "utf8");

    await runCli(["migrate", "."], io);
  } finally {
    process.chdir(originalCwd);
  }

  const brief = await readFile(path.join(workspace, "brief.md"), "utf8");
  const config = await readFile(path.join(workspace, "config.json"), "utf8");
  const runLog = await readFile(path.join(workspace, "run-log.md"), "utf8");
  assert.equal(brief, "# Older Brief\n");
  assert.match(config, /"schemaVersion": 1/);
  assert.match(runLog, /ATAVI Run Log/);
  assert.match(io.getStdout(), /ATAVI migrate: OK/);
});

test("atavi migrate fails for invalid existing config", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await mkdir(path.join(tmp, ".atavi"), { recursive: true });
    await writeFile(path.join(tmp, ".atavi", "config.json"), "{not-json", "utf8");
    await assert.rejects(() => runCli(["migrate", "."], io), /not valid JSON/);
  } finally {
    process.chdir(originalCwd);
  }

  assert.match(io.getStdout(), /ATAVI migrate: FAIL/);
});

test("atavi memory-export copies the workspace memory tree", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);
  const exportDir = path.join(tmp, "memory-export");

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await writeFile(
      path.join(tmp, ".atavi", "memory", "strategy-insights", "insight.md"),
      "# Insight\n",
      "utf8"
    );
    await runCli(["memory-export", ".", exportDir], io);
  } finally {
    process.chdir(originalCwd);
  }

  const exportedInsight = await readFile(path.join(exportDir, "strategy-insights", "insight.md"), "utf8");
  assert.equal(exportedInsight, "# Insight\n");
  assert.match(io.getStdout(), /ATAVI memory-export: OK/);
});

test("atavi memory-import copies missing memory files without overwriting existing ones", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);
  const sourceDir = path.join(tmp, "source-memory");

  await mkdir(path.join(sourceDir, "strategy-insights"), { recursive: true });
  await writeFile(path.join(sourceDir, "strategy-insights", "imported.md"), "# Imported\n", "utf8");

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await writeFile(
      path.join(tmp, ".atavi", "memory", "strategy-insights", "README.md"),
      "# Existing README\n",
      "utf8"
    );
    await runCli(["memory-import", sourceDir, "."], io);
  } finally {
    process.chdir(originalCwd);
  }

  const imported = await readFile(
    path.join(tmp, ".atavi", "memory", "strategy-insights", "imported.md"),
    "utf8"
  );
  const existingReadme = await readFile(
    path.join(tmp, ".atavi", "memory", "strategy-insights", "README.md"),
    "utf8"
  );
  assert.equal(imported, "# Imported\n");
  assert.equal(existingReadme, "# Existing README\n");
  assert.match(io.getStdout(), /ATAVI memory-import: OK/);
});

test("atavi resume-check passes for scaffolded workspace", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await runCli(["resume-check", "."], io);
  } finally {
    process.chdir(originalCwd);
  }

  assert.match(io.getStdout(), /ATAVI resume-check: OK/);
  assert.match(io.getStdout(), /current_pass: 0/);
  assert.match(io.getStdout(), /current_phase: not_started/);
});

test("atavi resume-check fails for invalid status", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await writeFile(
      path.join(tmp, ".atavi", "status.md"),
      `# ATAVI Status

run_status: initialized
current_pass: later
current_phase: drifted
convergence_score: 2
blocking_concerns: none
token_estimate: unknown
`,
      "utf8"
    );

    await assert.rejects(() => runCli(["resume-check", "."], io), /resume-state validation/);
  } finally {
    process.chdir(originalCwd);
  }

  assert.match(io.getStdout(), /ATAVI resume-check: FAIL/);
  assert.match(io.getStdout(), /status: current_pass must be a non-negative integer/);
  assert.match(io.getStdout(), /status: current_phase must be one of:/);
  assert.match(io.getStdout(), /status: convergence_score must be n\/a or a number between 0 and 1/);
  assert.match(io.getStdout(), /status: last_updated is required/);
});

test("atavi resume-check fails for inconsistent completed state", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "atavi-"));
  const io = createIo(tmp);

  const originalCwd = process.cwd();
  process.chdir(tmp);
  try {
    await runCli(["init", "."], io);
    await writeFile(
      path.join(tmp, ".atavi", "status.md"),
      `# ATAVI Status

run_status: completed
current_pass: 1
current_phase: decision_gate
convergence_score: 0.9
blocking_concerns: none
token_estimate: unknown
last_updated: pending
`,
      "utf8"
    );

    await assert.rejects(() => runCli(["resume-check", "."], io), /resume-state validation/);
  } finally {
    process.chdir(originalCwd);
  }

  assert.match(io.getStdout(), /status: run_status completed requires current_phase completed/);
});
