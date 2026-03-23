# ATAVI

ATAVI is a multi-agent research refinement protocol for serious technical work.
It does not pretend a single prompt can replace disciplined research. It gives
your host AI a structure: isolate roles, force cross-pollination, verify
novelty, converge on the smallest high-signal experiment slate, and leave an
inspectable paper trail behind.

The package is intentionally thin. The host AI does the orchestration. ATAVI
ships the protocol, agent role files, templates, and a CLI that scaffolds a
real `.atavi/` workspace in your project.

## Why this exists

Most agentic research workflows fail in one of two ways:

- they generate lots of ideas and do not eliminate bad ones
- they converge too early and mistake agreement for rigor

ATAVI forces a different shape:

- Theorist formalizes claims
- Experimentalist designs tests
- Scout gates on novelty
- Critic breaks weak reasoning when risk is high
- Synthesist imports useful methods across domains

Every pass leaves files behind. Every kill is logged. Every final experiment
can be traced back through the argument that kept it alive.

## What you install

This repo ships:

- `protocol/ATAVI.md` as the canonical markdown protocol
- `protocol/agents/*` for role definitions
- `templates/*` for brief, POD, CPR, and report formats
- `bin/atavi.js` as the CLI entrypoint
- `src/*` for scaffold helpers, doctor checks, and protocol manifests
- project docs covering architecture, contribution workflow, and testing

## Quick start

### Install globally

```bash
npm install -g atavi
```

### Or run from a checkout

```bash
node bin/atavi.js --help
node bin/atavi.js --path
node bin/atavi.js init .
node bin/atavi.js doctor
```

### Typical flow

1. Put a spec, design doc, proposal, or codebase in front of your host AI.
2. Run `atavi init .` in the project root.
3. Tell the host AI to run ATAVI on the project.
4. The host AI reads the packaged protocol and writes into `.atavi/`.
5. Review `.atavi/ATAVI-REPORT.md` when the run finishes.

## Commands

### `atavi --path`

Print the absolute path to the packaged protocol root. Host AIs can use this to
load `protocol/ATAVI.md`, agent role files, and templates.

### `atavi init [target]`

Scaffold `.atavi/` with:

- `brief.md`
- `config.json`
- `status.md`
- `ATAVI-REPORT.md`
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

Verify the package contains the full protocol and template surface.

## Product shape

ATAVI should feel more like a disciplined research operating system than a toy
CLI. The repo is therefore structured the same way the product is structured:

- clear top-level README
- explicit architecture document
- explicit testing strategy
- committed protocol assets
- tests for the package contract
- CI to stop the protocol package from drifting

That product shape is informed in part by `gstack`: serious docs, committed
assets, a visible architecture, and a repo that can be cloned and understood
without hidden setup magic.

## Host requirements

ATAVI assumes the host AI can:

- read and write files
- maintain multiple isolated agent contexts
- browse the web for Scout runs

Without web search, Scout mode and full novelty gating are not valid.

## Current status

This repository now contains the real package skeleton, protocol markdown,
agent role files, templates, docs, tests, and CI scaffolding. The next layer of
work is to deepen the host integration and memory machinery without changing
the package shape.
