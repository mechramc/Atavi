import { commandDoctor } from "./commands/doctor.js";
import { commandInit } from "./commands/init.js";
import { commandPath } from "./commands/path.js";

const VERSION = "0.1.0";

function helpText() {
  return `atavi

Host-agnostic multi-agent iterative research refinement protocol.

Usage:
  atavi --help
  atavi --version
  atavi --path
  atavi init [target]
  atavi doctor

Commands:
  --path      Print the absolute path to the packaged protocol directory.
  init        Scaffold a .atavi workspace in the target directory.
  doctor      Verify packaged protocol files and basic host prerequisites.

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

  throw new Error(`Unknown command: ${command}`);
}

