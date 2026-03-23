import { readFile } from "node:fs/promises";
import { protocolFiles, templateFiles } from "../src/lib/protocol-manifest.js";

function isCoveredByPackageFiles(relativePath, packageFiles) {
  return packageFiles.some((entry) => {
    if (entry.endsWith("/")) {
      return relativePath.startsWith(entry);
    }

    return relativePath === entry;
  });
}

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const packageFiles = packageJson.files ?? [];
const requiredFiles = [...protocolFiles(), ...templateFiles()];
const missing = requiredFiles.filter((relativePath) => !isCoveredByPackageFiles(relativePath, packageFiles));

if (missing.length > 0) {
  throw new Error(`Package files field does not cover doctor contract files:\n${missing.join("\n")}`);
}

process.stdout.write(`Verified release surface for ${requiredFiles.length} doctor-contract files.\n`);
