import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const hostsDoc = await readFile(new URL("../HOSTS.md", import.meta.url), "utf8");

test("host guide defines the shared bootstrap and resume workflow", () => {
  assert.match(hostsDoc, /## Workspace Bootstrap/);
  assert.match(hostsDoc, /atavi --path/);
  assert.match(hostsDoc, /atavi init \./);
  assert.match(hostsDoc, /atavi validate \./);
  assert.match(hostsDoc, /atavi resume-check \./);
  assert.match(hostsDoc, /## Resume Workflow/);
  assert.match(hostsDoc, /\.atavi\/status\.md/);
  assert.match(hostsDoc, /\.atavi\/run-log\.md/);
});

test("host guide defines Codex loading patterns", () => {
  assert.match(hostsDoc, /## Codex/);
  assert.match(hostsDoc, /Codex should keep orchestration file-first/);
  assert.match(hostsDoc, /protocol\/ATAVI\.md/);
  assert.match(hostsDoc, /\.atavi\/brief\.md/);
  assert.match(hostsDoc, /\.atavi\/config\.json/);
  assert.match(hostsDoc, /\.atavi\/status\.md/);
});

test("host guide defines Claude loading patterns", () => {
  assert.match(hostsDoc, /## Claude/);
  assert.match(hostsDoc, /Claude should treat `?\.atavi\/`? as the source of truth/);
  assert.match(hostsDoc, /relevant role files and templates/);
  assert.match(hostsDoc, /registries, logs, and existing pass artifacts/);
});

test("host guide defines Gemini loading patterns", () => {
  assert.match(hostsDoc, /## Gemini/);
  assert.match(hostsDoc, /Gemini should preserve the same file contract as every other host/);
  assert.match(hostsDoc, /registries, logs, and existing pass artifacts/);
});
