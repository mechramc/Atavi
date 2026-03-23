import path from "node:path";
import { mkdir } from "node:fs/promises";
import { importMemory, resolveMemoryDirectory } from "../lib/memory.js";

export async function commandMemoryImport(args, io) {
  const positionalArgs = args.filter((arg) => !arg.startsWith("-"));
  const sourceArg = positionalArgs[0];
  const targetArg = positionalArgs[1] ?? ".";

  if (!sourceArg) {
    throw new Error("memory-import requires a source path");
  }

  const sourceMemoryDir = await resolveMemoryDirectory(sourceArg);
  if (!sourceMemoryDir) {
    io.stdout.write("ATAVI memory-import: FAIL\n");
    io.stdout.write(`missing memory ${path.resolve(sourceArg)}\n`);
    throw new Error("ATAVI source memory directory was not found.");
  }

  const targetMemoryDir = path.join(path.resolve(targetArg), ".atavi", "memory");
  await mkdir(targetMemoryDir, { recursive: true });

  const result = await importMemory(sourceMemoryDir, targetMemoryDir);

  io.stdout.write("ATAVI memory-import: OK\n");
  io.stdout.write(`source: ${sourceMemoryDir}\n`);
  io.stdout.write(`target: ${targetMemoryDir}\n`);
  io.stdout.write(`imported files: ${result.importedFiles}\n`);
  io.stdout.write(`skipped files: ${result.skippedFiles}\n`);
}
