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

## Interactive Startup Contract

Before deep repo scanning or pass execution, the host should visibly engage the
researcher in the terminal or chat surface.

Hosts should:

- announce that ATAVI was detected and that workspace bootstrap is starting
- state the immediate next step before reading large parts of the repo
- ask clarifying questions when the brief, objective, or success criteria are
  ambiguous
- present explicit option sets when multiple viable scopes, modes, or agent
  mixes are plausible
- wait for the researcher when those choices materially change the run
- emit short progress updates while scanning, validating, and writing artifacts
- summarize what was learned from the scan before entering pass execution

Hosts should not silently disappear into repository analysis for a long period
with no visible output.

## Research Brief Confirmation

Before pass execution begins, confirm `.atavi/brief.md` contains:

- source spec or source artifact
- thesis or central question
- domain
- constraints
- novelty sources
- selected agents

If these are incomplete or contradictory, stop and ask the researcher.

Recommended clarifying topics:

- the concrete research question or product decision to optimize for
- hard constraints such as time, budget, infra, safety, or launch deadlines
- whether the run should optimize for novelty search, implementation speed,
  evidence quality, or risk reduction
- whether Critic and Synthesist should be enabled for this run

If there are multiple reasonable interpretations, present them as numbered
options and let the researcher pick instead of choosing silently.

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

Hosts should keep the user-facing surface alive during execution with short
status updates such as:

- scanning and summarizing repository context
- validating `.atavi/` state
- selecting the active pass and agents
- finishing POD drafting
- finishing cross-pollination
- entering synthesis or decision gating

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

Codex should also provide concise commentary updates before major scans,
artifact writes, and pass transitions so the user sees visible progress.

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

Claude should ask targeted clarifying questions up front and provide explicit
choice sets when scope, mode, or agent selection is ambiguous.

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

Gemini should keep the session visibly interactive with startup confirmation,
clarifying questions, and brief progress updates during long scans.

Starter prompt:

- `prompts/gemini.md`

## Failure Modes And Escalation

Hosts should stop and ask the researcher when:

- config validation fails
- resume-state validation fails
- Scout-valid web search is unavailable
- the brief is contradictory or under-specified
- early convergence appears suspicious and requires an adversarial pass
