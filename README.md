# ATAVI

ATAVI is a host-agnostic multi-agent research refinement protocol. It gives a
host AI a strict file-first workflow for:

- formalizing claims
- designing experiments
- checking novelty
- forcing cross-pollination between roles
- converging on the smallest high-signal experiment slate
- leaving an inspectable paper trail in `.atavi/`

ATAVI is intentionally thin. The package does not run the research loop for
you. It ships the protocol, role files, templates, and CLI helpers that a host
AI can load and execute.

ATAVI is published on npm as [`atavi`](https://www.npmjs.com/package/atavi).

## What You Get

The package ships:

- `protocol/ATAVI.md` as the canonical protocol
- `protocol/agents/*` for Theorist, Experimentalist, Scout, Critic, and Synthesist
- `prompts/*` for Codex, Claude, and Gemini starter prompts
- `templates/*` for briefs, PODs, CPRs, and final reports
- `bin/atavi.js` as the CLI entrypoint
- `HOSTS.md` for Codex, Claude, and Gemini loading guidance
- scaffold, validation, migration, and memory-transfer helpers

## Requirements

- Node.js `>=20`
- a host AI that can read and write files
- web search capability for valid Scout runs

Without web search, Scout mode and full novelty gating are not valid.

## Install

### Global install

```bash
npm install -g atavi
```

### Verify the install

```bash
atavi --version
atavi --help
```

### Run with `npx`

```bash
npx atavi --help
```

### Run from a local checkout

```bash
git clone https://github.com/mechramc/Atavi.git
cd Atavi
npm install
node bin/atavi.js --help
```

## Quick Start

### 1. Create a workspace

From the project you want to analyze:

```bash
atavi init .
atavi validate .
```

This creates a `.atavi/` workspace with the brief, registries, pass folders,
logs, report file, and memory buckets the host will use.

### 2. Point your host at the protocol

```bash
atavi --path
```

The returned path contains:

- `protocol/ATAVI.md`
- `protocol/agents/*`
- `prompts/*`
- `templates/*`

Your host should load those files plus `.atavi/brief.md`, `.atavi/config.json`,
and `.atavi/status.md`.

### 3. Run the protocol

Typical flow:

1. Put a spec, proposal, design doc, or codebase in front of your host AI.
2. Run `atavi init .` in the project root.
3. Tell the host AI to run ATAVI on the workspace.
4. The host writes PODs, CPRs, synthesis records, decision records, registry updates, and memory artifacts into `.atavi/`.
5. Review `.atavi/ATAVI-REPORT.md` when the run finishes.

### 4. Resume or repair later

```bash
atavi resume-check .
atavi migrate .
```

Use `resume-check` before resuming an interrupted run. Use `migrate` to add any
missing scaffold files or schema metadata without overwriting user edits.

## Command Reference

### `atavi --help`

Print CLI help.

### `atavi --version`

Print the package version.

### `atavi --path`

Print the absolute path to the packaged protocol root so a host can load the
protocol, role files, and templates.

### `atavi init [target]`

Create a `.atavi/` workspace in `target` without overwriting existing files.

The scaffold includes:

- `brief.md`
- `config.json`
- `status.md`
- `conflicts.md`
- `kill-log.md`
- `run-log.md`
- `ATAVI-REPORT.md`
- `pass-1/README.md`
- `pass-1/synthesis.md`
- `pass-1/decision.md`
- `pass-1/cross-pollination/README.md`
- `registries/claims.md`
- `registries/experiments.md`
- `registries/prior-art.md`
- `memory/README.md`
- `memory/prior-art-cache/README.md`
- `memory/kill-archive/README.md`
- `memory/claim-patterns/README.md`
- `memory/convergence-history/README.md`
- `memory/strategy-insights/README.md`

### `atavi doctor`

Verify that the packaged protocol and template assets exist.

### `atavi validate [target]`

Validate `.atavi/config.json` against the current package contract.

### `atavi resume-check [target]`

Validate `.atavi/config.json` and `.atavi/status.md` before a host resumes an
interrupted run.

### `atavi migrate [target]`

Upgrade an existing `.atavi/` workspace to the current schema by adding missing
files and schema metadata without overwriting user-edited files.

### `atavi memory-export [target] [output]`

Copy `.atavi/memory` to an export directory for reuse in another workspace.

Example:

```bash
atavi memory-export . .atavi/exports/memory
```

### `atavi memory-import <source> [target]`

Copy memory files into `.atavi/memory` without overwriting existing entries.

Example:

```bash
atavi memory-import .atavi/exports/memory .
```

## Recommended Host Workflow

Use this order:

```bash
atavi --path
atavi init .
atavi validate .
atavi resume-check .
```

Then have the host:

1. confirm or refine `.atavi/brief.md`
2. load `protocol/ATAVI.md` and the relevant role files
3. write pass artifacts into `.atavi/pass-N/`
4. update registries and logs during synthesis
5. export reusable memory into `.atavi/memory/`

See [HOSTS.md](./HOSTS.md) for Codex, Claude, and Gemini-specific loading guidance.

Starter prompts are also shipped under:

- `prompts/codex.md`
- `prompts/claude.md`
- `prompts/gemini.md`

## Development

From a repo checkout:

```bash
npm install
npm test
npm run ci
```

Equivalent raw Node commands:

```bash
node scripts/check-manifest.js
node scripts/check-release-surface.js
node test/run-all.js
```

## npm Package

Registry page:

- `https://www.npmjs.com/package/atavi`

Install:

```bash
npm install -g atavi
```

Run:

```bash
atavi --help
atavi init .
```

## Related Docs

- [HOSTS.md](./HOSTS.md)
- `prompts/codex.md`
- `prompts/claude.md`
- `prompts/gemini.md`
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [TESTING.md](./TESTING.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
