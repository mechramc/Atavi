import { commandDoctor } from "./commands/doctor.js";
import { commandInit } from "./commands/init.js";
import { commandMemoryExport } from "./commands/memory-export.js";
import { commandMemoryImport } from "./commands/memory-import.js";
import { commandMigrate } from "./commands/migrate.js";
import { commandPath } from "./commands/path.js";
import { commandResumeCheck } from "./commands/resume-check.js";
import { commandValidate } from "./commands/validate.js";

const VERSION = "0.1.1";

function helpText() {
  return `atavi

Host-agnostic multi-agent iterative research refinement protocol.

Usage:
  atavi --help
  atavi --version
  atavi --path
  atavi init [target]
  atavi migrate [target]
  atavi memory-export [target] [output]
  atavi memory-import <source> [target]
  atavi doctor
  atavi validate [target]
  atavi resume-check [target]

Commands:
  --path      Print the absolute path to the packaged protocol directory.
  init        Scaffold a .atavi workspace in the target directory.
  migrate     Add missing scaffold files and schema metadata to an existing workspace.
  memory-export Copy `.atavi/memory` to an export directory.
  memory-import Copy memory files into `.atavi/memory` without overwriting existing entries.
  doctor      Verify packaged protocol files and basic host prerequisites.
  validate    Validate the scaffolded .atavi/config.json contract.
  resume-check Validate `.atavi/config.json` and `.atavi/status.md` for resume safety.

Notes:
  atavi is intentionally thin. The host AI runs the protocol.
  This package ships the protocol, agent role files, templates, and scaffold helpers.`;
}

export async function runCli(argv, io = process) {
  const [command, ...rest] = argv;

  if (!command || command === "--help" || command === "-h" || command === "help") {
    io.stdout.write(`${helpText()}\n`);
    return;
  }

  if (command === "--version" || command === "-v" || command === "version") {
    io.stdout.write(`${VERSION}\n`);
    return;
  }

  if (command === "--path" || command === "path") {
    await commandPath(io);
    return;
  }

  if (command === "init") {
    await commandInit(rest, io);
    return;
  }

  if (command === "doctor") {
    await commandDoctor(io);
    return;
  }

  if (command === "memory-export") {
    await commandMemoryExport(rest, io);
    return;
  }

  if (command === "memory-import") {
    await commandMemoryImport(rest, io);
    return;
  }

  if (command === "migrate") {
    await commandMigrate(rest, io);
    return;
  }

  if (command === "validate") {
    await commandValidate(rest, io);
    return;
  }

  if (command === "resume-check") {
    await commandResumeCheck(rest, io);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}
