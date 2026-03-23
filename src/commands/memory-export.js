import path from "node:path";
import { exportMemory, resolveMemoryDirectory } from "../lib/memory.js";

export async function commandMemoryExport(args, io) {
  const targetArg = args.find((arg) => !arg.startsWith("-")) ?? ".";
  const outputArg = args.filter((arg) => !arg.startsWith("-"))[1] ?? path.join(targetArg, ".atavi", "exports", "memory");
  const sourceMemoryDir = await resolveMemoryDirectory(targetArg);

  if (!sourceMemoryDir) {
    io.stdout.write("ATAVI memory-export: FAIL\n");
    io.stdout.write(`missing memory ${path.resolve(targetArg)}\n`);
    throw new Error("ATAVI memory directory was not found.");
  }

  const outputDir = path.resolve(outputArg);
  const result = await exportMemory(sourceMemoryDir, outputDir);

  io.stdout.write("ATAVI memory-export: OK\n");
  io.stdout.write(`source: ${sourceMemoryDir}\n`);
  io.stdout.write(`output: ${outputDir}\n`);
  io.stdout.write(`exported files: ${result.exportedFiles}\n`);
}
