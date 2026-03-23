# Host Guidance

ATAVI is a protocol package, not an orchestration runtime. This document covers
how a host should load the package, manage the `.atavi/` workspace, and resume
interrupted runs without inventing hidden state.

## Purpose And Non-Goals

- ATAVI defines the file contract and protocol shape.
- The host AI performs orchestration.
- This guide explains load order, workspace usage, and artifact ownership.
- This guide does not turn ATAVI into a daemon, API service, or hidden runtime.

## Shared Host Contract

Hosts should support:

- file I/O
- isolated agent contexts
- web search for valid Scout runs

Hosts should load:

- `protocol/ATAVI.md`
- relevant files under `protocol/agents/`
- templates under `templates/`
- `.atavi/brief.md`
- `.atavi/config.json`
- `.atavi/status.md`
- canonical registries and logs

## Invocation Detection

Treat the run as ATAVI when the user explicitly asks for:

- `ATAVI`
- multi-agent research refinement
- novelty-gated experiment selection
- inspectable multi-pass research artifacts

Do not silently infer ATAVI for ordinary coding or review tasks.

## Workspace Bootstrap

Recommended order:

1. Run `atavi --path`.
2. If `.atavi/` does not exist, run `atavi init .`.
3. Run `atavi validate .` before starting a fresh loop.
4. Run `atavi resume-check .` before resuming an interrupted loop.

Use the existing workspace when `.atavi/` already exists and passes validation.

## Research Brief Confirmation

Before pass execution begins, confirm `.atavi/brief.md` contains:

- source spec or source artifact
- thesis or central question
- domain
- constraints
- novelty sources
- selected agents

If these are incomplete or contradictory, stop and ask the researcher.

## Agent Selection Rules

Always include:

- Theorist
- Experimentalist
- Scout

Add Critic when:

- the cost of failure is high
- the work is irreversible
- the novelty landscape is crowded

Add Synthesist when:

- the problem spans multiple domains
- adjacent disciplines may contain useful methods

## Pass Execution Contract

Hosts should write:

- PODs to `.atavi/pass-N/[agent]-pod.md`
- CPRs to `.atavi/pass-N/cross-pollination/[agent]-cpr.md`
- synthesis output to `.atavi/pass-N/synthesis.md`
- decision output to `.atavi/pass-N/decision.md`

Hosts should also maintain:

- `.atavi/registries/claims.md`
- `.atavi/registries/experiments.md`
- `.atavi/registries/prior-art.md`
- `.atavi/conflicts.md`
- `.atavi/kill-log.md`
- `.atavi/run-log.md`

## Registry Ownership And Synthesis

Agents propose changes in PODs and CPRs. The host applies accepted changes to
the canonical registries and logs during synthesis. Registry state should not
exist only in chat output.

## Novelty And Memory Recording

- Claim-level novelty evidence belongs in `.atavi/registries/prior-art.md`.
- Experiment-level novelty verdicts belong in `.atavi/registries/experiments.md`.
- Reusable memory exports belong in `.atavi/memory/` after the run.
- Hosts may use `atavi memory-export` and `atavi memory-import` to move durable
  memory artifacts between workspaces without changing their contents.

## Resume Workflow

When resuming:

1. Run `atavi validate .`.
2. Run `atavi resume-check .`.
3. Read `.atavi/status.md`.
4. Read `.atavi/run-log.md`.
5. Inspect the latest `pass-N/` directory.
6. Continue from the recorded phase instead of regenerating prior artifacts.

`resume-check` guarantees structural resume safety for the current package
contract. It does not decide the next research action for the host.

## Codex

Recommended load order:

1. `atavi --path`
2. `protocol/ATAVI.md`
3. required role files under `protocol/agents/`
4. `.atavi/brief.md`, `.atavi/config.json`, `.atavi/status.md`
5. registries, logs, and latest `pass-N/` artifacts

Codex should keep orchestration file-first and write durable artifacts into
`.atavi/` rather than relying on hidden memory.

Starter prompt:

- `prompts/codex.md`

## Claude

Recommended load order:

1. `atavi --path`
2. `protocol/ATAVI.md`
3. relevant role files and templates
4. `.atavi/brief.md`, `.atavi/config.json`, `.atavi/status.md`
5. registries, logs, and existing pass artifacts

Claude should treat `.atavi/` as the source of truth for resumability and audit.

Starter prompt:

- `prompts/claude.md`

## Gemini

Recommended load order:

1. `atavi --path`
2. `protocol/ATAVI.md`
3. relevant role files and templates
4. `.atavi/brief.md`, `.atavi/config.json`, `.atavi/status.md`
5. registries, logs, and existing pass artifacts

Gemini should preserve the same file contract as every other host.

Starter prompt:

- `prompts/gemini.md`

## Failure Modes And Escalation

Hosts should stop and ask the researcher when:

- config validation fails
- resume-state validation fails
- Scout-valid web search is unavailable
- the brief is contradictory or under-specified
- early convergence appears suspicious and requires an adversarial pass
