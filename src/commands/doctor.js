import { access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { protocolFiles, protocolRoot, templateFiles } from "../lib/protocol-manifest.js";

async function canRead(filePath) {
  try {
    await access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function commandDoctor(io) {
  const root = protocolRoot();
  const required = [...protocolFiles(), ...templateFiles()].map((relativePath) => path.join(root, relativePath));
  const missing = [];

  for (const filePath of required) {
    if (!(await canRead(filePath))) {
      missing.push(filePath);
    }
  }

  if (missing.length > 0) {
    io.stdout.write("ATAVI doctor: FAIL\n");
    for (const filePath of missing) {
      io.stdout.write(`missing ${filePath}\n`);
    }
    throw new Error("Packaged protocol is incomplete.");
  }

  io.stdout.write("ATAVI doctor: OK\n");
  io.stdout.write(`protocol root: ${root}\n`);
  io.stdout.write("required files: present\n");
  io.stdout.write("host requirement: your AI environment must support file I/O and web search for Scout runs\n");
}

