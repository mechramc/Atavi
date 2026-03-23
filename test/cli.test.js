import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile } from "node:fs/promises";
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
  assert.match(config, /"mode": "full"/);
  assert.match(status, /run_status: initialized/);
  assert.match(memoryReadme, /Strategy Insights/);
});

test("atavi doctor passes when packaged files exist", async () => {
  const io = createIo(process.cwd());
  await runCli(["doctor"], io);
  assert.match(io.getStdout(), /ATAVI doctor: OK/);
});
