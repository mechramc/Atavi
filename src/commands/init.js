import path from "node:path";
import { ensureDirectory, pathExists, writeFileIfMissing } from "../lib/filesystem.js";
import { scaffoldFiles } from "../lib/protocol-manifest.js";

export async function commandInit(args, io) {
  const targetArg = args.find((arg) => !arg.startsWith("-")) ?? ".";
  const targetDir = path.resolve(process.cwd(), targetArg);
  const workspaceDir = path.join(targetDir, ".atavi");

  await ensureDirectory(workspaceDir);

  let created = 0;

  for (const file of scaffoldFiles()) {
    const destination = path.join(workspaceDir, file.relativePath);
    const didCreate = await writeFileIfMissing(destination, file.contents);
    if (didCreate) {
      created += 1;
    }
  }

  const status = (await pathExists(path.join(workspaceDir, "status.md"))) ? "ready" : "incomplete";
  io.stdout.write(`Scaffolded ${workspaceDir}\n`);
  io.stdout.write(`Created ${created} new file(s). Workspace status: ${status}.\n`);
}

