import path from "node:path";
import { cp, mkdir, readdir } from "node:fs/promises";
import { pathExists } from "./filesystem.js";

async function walkFiles(rootDir, relativeDir = "") {
  const currentDir = path.join(rootDir, relativeDir);
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryRelativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(rootDir, entryRelativePath)));
      continue;
    }

    files.push(entryRelativePath);
  }

  return files;
}

export async function resolveMemoryDirectory(inputPath) {
  const directMemoryDir = path.resolve(inputPath);
  if (await pathExists(directMemoryDir)) {
    const maybeWorkspaceMemory = path.join(directMemoryDir, ".atavi", "memory");
    if (await pathExists(maybeWorkspaceMemory)) {
      return maybeWorkspaceMemory;
    }
  }

  const workspaceMemoryDir = path.join(path.resolve(inputPath), ".atavi", "memory");
  if (await pathExists(workspaceMemoryDir)) {
    return workspaceMemoryDir;
  }

  if (await pathExists(directMemoryDir)) {
    return directMemoryDir;
  }

  return null;
}

export async function exportMemory(sourceDir, outputDir) {
  await mkdir(outputDir, { recursive: true });
  await cp(sourceDir, outputDir, { recursive: true, force: true });
  const files = await walkFiles(outputDir);
  return {
    exportedFiles: files.length
  };
}

export async function importMemory(sourceDir, targetDir) {
  const files = await walkFiles(sourceDir);
  let importedFiles = 0;
  let skippedFiles = 0;

  for (const relativePath of files) {
    const sourcePath = path.join(sourceDir, relativePath);
    const destinationPath = path.join(targetDir, relativePath);
    if (await pathExists(destinationPath)) {
      skippedFiles += 1;
      continue;
    }

    await mkdir(path.dirname(destinationPath), { recursive: true });
    await cp(sourcePath, destinationPath, { force: false });
    importedFiles += 1;
  }

  return {
    importedFiles,
    skippedFiles
  };
}
