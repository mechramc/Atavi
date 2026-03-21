import { protocolRoot } from "../lib/protocol-manifest.js";

export async function commandPath(io) {
  io.stdout.write(`${protocolRoot()}\n`);
}

