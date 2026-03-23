import path from "node:path";
import { readFile } from "node:fs/promises";
import { parseConfigFile, validateConfig } from "../lib/config.js";

export async function commandValidate(args, io) {
  const targetArg = args.find((arg) => !arg.startsWith("-")) ?? ".";
  const targetDir = path.resolve(process.cwd(), targetArg);
  const configPath = path.join(targetDir, ".atavi", "config.json");

  let contents;
  try {
    contents = await readFile(configPath, "utf8");
  } catch (error) {
    io.stdout.write("ATAVI validate: FAIL\n");
    io.stdout.write(`missing ${configPath}\n`);
    throw new Error("ATAVI workspace config was not found.", { cause: error });
  }

  let config;
  try {
    config = parseConfigFile(contents);
  } catch (error) {
    io.stdout.write("ATAVI validate: FAIL\n");
    io.stdout.write(`invalid JSON ${configPath}\n`);
    throw new Error("ATAVI workspace config is not valid JSON.", { cause: error });
  }

  const errors = validateConfig(config);
  if (errors.length > 0) {
    io.stdout.write("ATAVI validate: FAIL\n");
    for (const error of errors) {
      io.stdout.write(`${error}\n`);
    }
    throw new Error("ATAVI workspace config failed validation.");
  }

  io.stdout.write("ATAVI validate: OK\n");
  io.stdout.write(`config path: ${configPath}\n`);
  io.stdout.write(`mode: ${config.mode}\n`);
}
