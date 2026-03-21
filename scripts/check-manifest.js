import path from "node:path";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { protocolFiles, protocolRoot, templateFiles } from "../src/lib/protocol-manifest.js";

async function verify(filePath) {
  await access(filePath, constants.R_OK);
}

const root = protocolRoot();
const files = [...protocolFiles(), ...templateFiles()].map((relativePath) => path.join(root, relativePath));

for (const filePath of files) {
  await verify(filePath);
}

process.stdout.write(`Verified ${files.length} packaged protocol files.\n`);

