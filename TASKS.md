# ATAVI Task List

Atomic implementation backlog derived from:

- `protocol/ATAVI.md`
- `ARCHITECTURE.md`
- `TESTING.md`
- `README.md`

Status keys:

- `[x]` completed in the current repo state
- `[ ]` not yet completed

## 1. Package Surface

- [x] Ship canonical protocol markdown at `protocol/ATAVI.md`.
- [x] Ship agent role files for Theorist, Experimentalist, Scout, Critic, and Synthesist.
- [x] Ship templates for research brief, POD, CPR, and output report.
- [x] Expose a CLI entrypoint at `bin/atavi.js`.
- [x] Expose a library CLI dispatcher at `src/cli.js`.
- [x] Publish package metadata in `package.json`.
- [x] Restrict shipped package files via the `files` field in `package.json`.
- [x] Document the package purpose and command surface in `README.md`.
- [x] Document system shape and non-goals in `ARCHITECTURE.md`.
- [x] Document contribution workflow in `CONTRIBUTING.md`.
- [x] Document testing expectations in `TESTING.md`.
- [x] Maintain a top-level changelog in `CHANGELOG.md`.
- [x] Include a license file.

## 2. Thin CLI Contract

- [x] Implement `atavi --help`.
- [x] Implement `atavi --version`.
- [x] Implement `atavi --path`.
- [x] Implement `atavi init [target]`.
- [x] Implement `atavi doctor`.
- [x] Make `--path` print the packaged protocol root.
- [x] Make `init` scaffold a `.atavi/` workspace without requiring hidden setup.
- [x] Make `init` avoid overwriting existing scaffold files.
- [x] Make `doctor` verify packaged protocol and template assets exist.
- [x] Make `doctor` print host prerequisites for valid runs.
- [ ] Add a thin config validation command that checks `.atavi/config.json`.
- [ ] Add a thin resume-state validation command that checks whether a run can be resumed safely.

## 3. Workspace Scaffold Contract

- [x] Scaffold `.atavi/brief.md`.
- [x] Scaffold `.atavi/config.json`.
- [x] Scaffold `.atavi/status.md`.
- [x] Scaffold `.atavi/ATAVI-REPORT.md`.
- [x] Scaffold `.atavi/registries/claims.md`.
- [x] Scaffold `.atavi/registries/experiments.md`.
- [x] Scaffold `.atavi/registries/prior-art.md`.
- [x] Scaffold `.atavi/memory/README.md`.
- [x] Scaffold explicit memory buckets for prior art cache, kill archive, claim patterns, convergence history, and strategy insights.
- [ ] Scaffold a canonical `pass-1/` directory placeholder.
- [ ] Scaffold a canonical `pass-1/cross-pollination/` directory placeholder.
- [ ] Scaffold a canonical conflict log placeholder referenced by synthesis.
- [ ] Scaffold a canonical kill log placeholder referenced by the final report.
- [ ] Scaffold a canonical run log placeholder for process traceability.

## 4. Config And State Semantics

- [x] Seed `config.json` with default mode, pass limits, experiment limits, convergence threshold, agent list, and memory settings.
- [x] Seed `status.md` with initial run status fields.
- [ ] Define and enforce the allowed `mode` values from the spec: `full`, `scout`, `theorist`, `vision`, `audit`.
- [ ] Define and enforce minimum agent requirements for `full` mode.
- [ ] Validate `maxPasses` as a positive integer.
- [ ] Validate `maxExperiments` as a positive integer.
- [ ] Validate `convergenceThreshold` as a bounded numeric value.
- [ ] Validate memory settings and supported scopes.
- [ ] Define which `status.md` fields are mandatory for host resume logic.
- [ ] Define how `current_phase` maps to the four refinement phases.
- [ ] Define how convergence state is represented across passes.
- [ ] Add migration handling for future `.atavi/` schema changes.

## 5. Protocol-Driven Workspace Coverage

- [ ] Document the exact file contract for `.atavi/pass-N/[agent]-pod.md`.
- [ ] Document the exact file contract for `.atavi/pass-N/cross-pollination/[agent]-cpr.md`.
- [ ] Document where the host records conflict lists during synthesis.
- [ ] Document where the host records decision-gate outcomes per pass.
- [ ] Document where the host records novelty verdicts for active claims and experiments.
- [ ] Document where the host records adversarial-pass escalation when early agreement is suspicious.
- [ ] Document where the host records reusable memory exports after a run.

## 6. Output Contract

- [x] Ship a final report template.
- [x] Scaffold `ATAVI-REPORT.md` as the final report destination.
- [x] Make the report template explicitly cover completion summary.
- [x] Make the report template explicitly cover executive summary.
- [x] Make the report template explicitly cover ranked recommended experiments.
- [x] Make the report template explicitly cover rejected experiments / kill log.
- [x] Make the report template explicitly cover final claim registry.
- [x] Make the report template explicitly cover final prior art registry.
- [x] Make the report template explicitly cover full process log.

## 7. Memory Machinery

- [x] Reserve explicit directories for persistent memory buckets.
- [ ] Define the file format for prior art cache entries.
- [ ] Define the file format for kill archive entries.
- [ ] Define the file format for claim pattern entries.
- [ ] Define the file format for convergence history entries.
- [ ] Define the file format for strategy insight entries.
- [ ] Define memory weighting fields such as confidence.
- [ ] Define memory scoping fields such as domain and keywords.
- [ ] Define memory expiration fields and stale-entry handling.
- [ ] Define contradiction handling for superseded memory.
- [ ] Add import/export helpers for memory artifacts without embedding orchestration logic.

## 8. Host Integration Guidance

- [x] State clearly that the host AI is the orchestrator.
- [x] State clearly that ATAVI must remain host-agnostic.
- [x] State clearly that web search is required for valid Scout runs.
- [ ] Document a host loading sequence for Codex.
- [ ] Document a host loading sequence for Claude.
- [ ] Document a host loading sequence for Gemini.
- [ ] Document how a host discovers ATAVI invocation inside a user session.
- [ ] Document how a host confirms or writes the research brief before the loop starts.
- [ ] Document how a host selects optional Critic and Synthesist roles.
- [ ] Document how a host applies accepted registry changes during synthesis.
- [ ] Document how a host resumes from an interrupted `.atavi/` run.

## 9. Test Backlog

- [x] Verify packaged protocol files exist.
- [x] Verify CLI behavior for `--path`.
- [x] Verify CLI behavior for `init`.
- [x] Verify CLI behavior for `doctor`.
- [x] Verify scaffold manifest contents.
- [x] Verify memory bucket scaffolding exists.
- [ ] Add idempotent `init` coverage that asserts existing user edits are preserved.
- [ ] Add config schema validation tests.
- [ ] Add snapshot tests for scaffolded markdown files.
- [ ] Add resume-state tests around `status.md` and `config.json`.
- [ ] Add deeper memory layout tests.
- [ ] Add host compatibility tests for Codex loading patterns.
- [ ] Add host compatibility tests for Claude loading patterns.
- [ ] Add host compatibility tests for Gemini loading patterns.
- [ ] Add tests for any future `validate` command.
- [ ] Add tests for any future resume-check command.

## 10. CI And Release Hygiene

- [x] Provide a manifest verification script.
- [x] Provide a test command runnable via raw Node.
- [x] Provide a CI-oriented aggregate command.
- [ ] Ensure the documented npm-based test path works in a clean release environment.
- [ ] Add release-time verification that packaged files match the CLI doctor contract.

## 11. Non-Goals To Preserve

- [x] Do not call model APIs directly from the CLI.
- [x] Do not maintain an orchestration daemon inside the package.
- [x] Do not embed search credentials in the package.
- [x] Do not silently mutate the host environment beyond explicit scaffold creation.
