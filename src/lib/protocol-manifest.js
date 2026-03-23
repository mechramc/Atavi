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
      relativePath: "conflicts.md",
      contents: `# ATAVI Conflict List

The host AI records active conflicts, unresolved disagreements, and blocking
tradeoffs here during synthesis.
`
    },
    {
      relativePath: "kill-log.md",
      contents: `# ATAVI Kill Log

Record rejected claims and experiments here with explicit reasons, evidence, and
novelty verdicts when applicable.
`
    },
    {
      relativePath: "run-log.md",
      contents: `# ATAVI Run Log

Use this file for the pass-by-pass process log, including POD completion, CPR
exchange, synthesis updates, convergence scores, and decision gates.
`
    },
    {
      relativePath: "ATAVI-REPORT.md",
      contents: `# ATAVI Report

This file is populated by the host AI after a run completes.
`
    },
    {
      relativePath: "pass-1/README.md",
      contents: `# ATAVI Pass 1

Place independent agent outputs in this directory as:

- theorist-pod.md
- experimentalist-pod.md
- scout-pod.md
- critic-pod.md
- synthesist-pod.md

The host AI also writes:

- synthesis.md
- decision.md
`
    },
    {
      relativePath: "pass-1/synthesis.md",
      contents: `# ATAVI Pass 1 Synthesis

Summarize accepted registry updates, active conflicts, novelty findings, and
convergence movement for this pass.
`
    },
    {
      relativePath: "pass-1/decision.md",
      contents: `# ATAVI Pass 1 Decision

Record the decision gate outcome for this pass: terminate, continue, or
escalate, with the rationale and any blocking concerns.
`
    },
    {
      relativePath: "pass-1/cross-pollination/README.md",
      contents: `# ATAVI Cross-Pollination

Place CPR outputs in this directory as:

- theorist-cpr.md
- experimentalist-cpr.md
- scout-cpr.md
- critic-cpr.md
- synthesist-cpr.md
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

Each memory entry should be written as a markdown file in the relevant bucket.
Use these governance fields consistently:

- Domain:
- Keywords:
- Confidence:
- Expires:
- Contradicts:

The host AI writes reusable memory exports into these buckets after a run
finishes. When new evidence contradicts an older memory, create the new entry
and link the contradiction explicitly rather than mutating history silently.
`
    },
    {
      relativePath: "memory/prior-art-cache/README.md",
      contents: `# Prior Art Cache

Store reusable novelty-search findings, source summaries, and scoped retrieval
metadata here for future ATAVI runs.

Suggested entry format: one file per source or source cluster.

- Source:
- Retrieved:
- Domain:
- Keywords:
- Confidence:
- Expires:
- Contradicts:
- Summary:
- Relevance:
- Reuse Notes:
`
    },
    {
      relativePath: "memory/kill-archive/README.md",
      contents: `# Kill Archive

Record rejected claims and experiments here, including the evidence or novelty
verdict that killed them.

Suggested entry format: one file per rejected claim or experiment.

- Killed Item:
- Item Type:
- Date:
- Domain:
- Keywords:
- Confidence:
- Contradicts:
- Kill Reason:
- Evidence:
- Reversal Condition:
`
    },
    {
      relativePath: "memory/claim-patterns/README.md",
      contents: `# Claim Patterns

Capture recurring claim structures, failure modes, and useful formalization
patterns that can accelerate future theorist passes.

Suggested entry format: one file per reusable pattern.

- Pattern Name:
- Domain:
- Keywords:
- Confidence:
- Expires:
- Contradicts:
- Pattern Description:
- Common Failure Mode:
- Reuse Guidance:
`
    },
    {
      relativePath: "memory/convergence-history/README.md",
      contents: `# Convergence History

Track prior run outcomes, convergence scores, and pass-level decision patterns
so future runs can detect repetition and premature agreement.

Suggested entry format: one file per completed run.

- Run ID:
- Domain:
- Keywords:
- Confidence:
- Started:
- Finished:
- Final Convergence Score:
- Contradicts:
- Outcome Summary:
- Repeated Failure Signals:
`
    },
    {
      relativePath: "memory/strategy-insights/README.md",
      contents: `# Strategy Insights

Store durable heuristics about search strategy, evaluation design, and
cross-domain synthesis that proved useful across runs.

Suggested entry format: one file per durable heuristic.

- Insight Name:
- Domain:
- Keywords:
- Confidence:
- Expires:
- Contradicts:
- Insight:
- Evidence:
- Applicability:
`
    }
  ];
}
