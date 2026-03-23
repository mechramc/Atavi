import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { ensureDirectory, pathExists, writeFileIfMissing } from "../lib/filesystem.js";
import { parseConfigFile } from "../lib/config.js";
import { CURRENT_WORKSPACE_SCHEMA_VERSION, scaffoldFiles } from "../lib/protocol-manifest.js";

async function readOptionalConfig(configPath) {
  if (!(await pathExists(configPath))) {
    return null;
  }

  return readFile(configPath, "utf8");
}

export async function commandMigrate(args, io) {
  const targetArg = args.find((arg) => !arg.startsWith("-")) ?? ".";
  const targetDir = path.resolve(process.cwd(), targetArg);
  const workspaceDir = path.join(targetDir, ".atavi");
  const configPath = path.join(workspaceDir, "config.json");

  if (!(await pathExists(workspaceDir))) {
    io.stdout.write("ATAVI migrate: FAIL\n");
    io.stdout.write(`missing workspace ${workspaceDir}\n`);
    throw new Error("ATAVI workspace was not found.");
  }

  await ensureDirectory(workspaceDir);

  const existingConfigContents = await readOptionalConfig(configPath);
  let existingConfig = null;

  if (existingConfigContents !== null) {
    try {
      existingConfig = parseConfigFile(existingConfigContents);
    } catch (error) {
      io.stdout.write("ATAVI migrate: FAIL\n");
      io.stdout.write(`invalid JSON ${configPath}\n`);
      throw new Error("ATAVI workspace config is not valid JSON.", { cause: error });
    }
  }

  let created = 0;
  for (const file of scaffoldFiles()) {
    const destination = path.join(workspaceDir, file.relativePath);
    const didCreate = await writeFileIfMissing(destination, file.contents);
    if (didCreate) {
      created += 1;
    }
  }

  let migratedConfig = false;
  if (existingConfig !== null && typeof existingConfig === "object" && existingConfig !== null) {
    if (existingConfig.schemaVersion !== CURRENT_WORKSPACE_SCHEMA_VERSION) {
      const updatedConfig = {
        ...existingConfig,
        schemaVersion: CURRENT_WORKSPACE_SCHEMA_VERSION
      };
      await writeFile(configPath, `${JSON.stringify(updatedConfig, null, 2)}\n`, "utf8");
      migratedConfig = true;
    }
  }

  io.stdout.write("ATAVI migrate: OK\n");
  io.stdout.write(`workspace: ${workspaceDir}\n`);
  io.stdout.write(`created ${created} missing file(s)\n`);
  io.stdout.write(`schema version: ${CURRENT_WORKSPACE_SCHEMA_VERSION}\n`);
  io.stdout.write(`config updated: ${migratedConfig ? "yes" : "no"}\n`);
}
