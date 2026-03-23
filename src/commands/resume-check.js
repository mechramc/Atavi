import path from "node:path";
import { readFile } from "node:fs/promises";
import { parseConfigFile, validateConfig } from "../lib/config.js";
import { parseStatusFile, validateStatus } from "../lib/status.js";

async function readRequiredFile(filePath, label, io) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    io.stdout.write("ATAVI resume-check: FAIL\n");
    io.stdout.write(`missing ${label} ${filePath}\n`);
    throw new Error(`ATAVI workspace ${label} was not found.`, { cause: error });
  }
}

export async function commandResumeCheck(args, io) {
  const targetArg = args.find((arg) => !arg.startsWith("-")) ?? ".";
  const targetDir = path.resolve(process.cwd(), targetArg);
  const configPath = path.join(targetDir, ".atavi", "config.json");
  const statusPath = path.join(targetDir, ".atavi", "status.md");

  const [configContents, statusContents] = await Promise.all([
    readRequiredFile(configPath, "config", io),
    readRequiredFile(statusPath, "status", io)
  ]);

  let config;
  try {
    config = parseConfigFile(configContents);
  } catch (error) {
    io.stdout.write("ATAVI resume-check: FAIL\n");
    io.stdout.write(`invalid JSON ${configPath}\n`);
    throw new Error("ATAVI workspace config is not valid JSON.", { cause: error });
  }

  const configErrors = validateConfig(config);
  const statusFields = parseStatusFile(statusContents);
  const statusErrors = validateStatus(statusFields);
  const errors = [
    ...configErrors.map((error) => `config: ${error}`),
    ...statusErrors.map((error) => `status: ${error}`)
  ];

  if (errors.length > 0) {
    io.stdout.write("ATAVI resume-check: FAIL\n");
    for (const error of errors) {
      io.stdout.write(`${error}\n`);
    }
    throw new Error("ATAVI workspace failed resume-state validation.");
  }

  io.stdout.write("ATAVI resume-check: OK\n");
  io.stdout.write(`config path: ${configPath}\n`);
  io.stdout.write(`status path: ${statusPath}\n`);
  io.stdout.write(`current_pass: ${statusFields.current_pass}\n`);
  io.stdout.write(`current_phase: ${statusFields.current_phase}\n`);
}
