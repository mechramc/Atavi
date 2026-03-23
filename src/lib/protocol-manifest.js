import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..", "..");

const PROTOCOL_FILES = [
  "protocol/ATAVI.md",
  "protocol/agents/theorist.md",
  "protocol/agents/experimentalist.md",
  "protocol/agents/scout.md",
  "protocol/agents/critic.md",
  "protocol/agents/synthesist.md"
];

const TEMPLATE_FILES = [
  "templates/research-brief.md",
  "templates/pod.md",
  "templates/cpr.md",
  "templates/output-report.md"
];

export function protocolRoot() {
  return ROOT;
}

export function protocolFiles() {
  return [...PROTOCOL_FILES];
}

export function templateFiles() {
  return [...TEMPLATE_FILES];
}

export function scaffoldFiles() {
  return [
    {
      relativePath: "brief.md",
      contents: `# ATAVI Research Brief

Status: draft
Mode: FULL
Source spec:
Thesis:
Domain:
Constraints:
- 
Novelty sources:
- 
Selected agents:
- Theorist
- Experimentalist
- Scout
`
    },
    {
      relativePath: "config.json",
      contents: `${JSON.stringify(
        {
          mode: "full",
          maxPasses: 4,
          maxExperiments: 5,
          convergenceThreshold: 0.7,
          agents: ["theorist", "experimentalist", "scout"],
          memory: {
            enabled: true,
            scope: "project"
          }
        },
        null,
        2
      )}\n`
    },
    {
      relativePath: "status.md",
      contents: `# ATAVI Status

run_status: initialized
current_pass: 0
current_phase: not_started
convergence_score: n/a
blocking_concerns: none
token_estimate: unknown
last_updated: pending
`
    },
    {
      relativePath: "ATAVI-REPORT.md",
      contents: `# ATAVI Report

This file is populated by the host AI after a run completes.
`
    },
    {
      relativePath: "registries/claims.md",
      contents: `# Claim Registry

| Claim ID | Status | Metric | Evidence For | Evidence Against |
| --- | --- | --- | --- | --- |
`
    },
    {
      relativePath: "registries/experiments.md",
      contents: `# Experiment Ledger

| Experiment ID | Status | Claims Tested | Novelty Verdict | Information Gain |
| --- | --- | --- | --- | --- |
`
    },
    {
      relativePath: "registries/prior-art.md",
      contents: `# Prior Art Registry

| Source | Type | Relevance Tags | Conceptual Overlap | Methodological Overlap | Empirical Overlap |
| --- | --- | --- | --- | --- | --- |
`
    },
    {
      relativePath: "memory/README.md",
      contents: `# ATAVI Memory

This directory stores persistent prior art cache entries, kill archive records,
claim patterns, convergence history, and strategy insights for related runs.
`
    },
    {
      relativePath: "memory/prior-art-cache/README.md",
      contents: `# Prior Art Cache

Store reusable novelty-search findings, source summaries, and scoped retrieval
metadata here for future ATAVI runs.
`
    },
    {
      relativePath: "memory/kill-archive/README.md",
      contents: `# Kill Archive

Record rejected claims and experiments here, including the evidence or novelty
verdict that killed them.
`
    },
    {
      relativePath: "memory/claim-patterns/README.md",
      contents: `# Claim Patterns

Capture recurring claim structures, failure modes, and useful formalization
patterns that can accelerate future theorist passes.
`
    },
    {
      relativePath: "memory/convergence-history/README.md",
      contents: `# Convergence History

Track prior run outcomes, convergence scores, and pass-level decision patterns
so future runs can detect repetition and premature agreement.
`
    },
    {
      relativePath: "memory/strategy-insights/README.md",
      contents: `# Strategy Insights

Store durable heuristics about search strategy, evaluation design, and
cross-domain synthesis that proved useful across runs.
`
    }
  ];
}
