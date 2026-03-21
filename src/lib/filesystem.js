import { mkdir, access, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

export async function ensureDirectory(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
}

export async function pathExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function writeFileIfMissing(filePath, contents) {
  if (await pathExists(filePath)) {
    return false;
  }

  await ensureDirectory(path.dirname(filePath));
  await writeFile(filePath, contents, "utf8");
  return true;
}

