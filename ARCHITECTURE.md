# Architecture

This document explains why ATAVI is shaped as a thin package plus a strict file
contract rather than a heavy orchestration runtime.

## The core idea

ATAVI is not the orchestrator. The host AI is.

That decision is deliberate:

- it keeps ATAVI host-agnostic
- it avoids duplicating auth, model routing, and search capabilities
- it lets the protocol evolve without shipping a long-running service

ATAVI therefore has two responsibilities:

1. package the protocol surface cleanly
2. make host execution inspectable and resumable through a local workspace

## System model

```text
Researcher / Product Builder
            |
            v
      Host AI Environment
  (Codex / Claude / Gemini)
            |
            | reads packaged protocol + templates
            v
           ATAVI
  ----------------------------------
  protocol/ATAVI.md
  protocol/agents/*
  templates/*
  bin/atavi
  src/scaffold + doctor helpers
  ----------------------------------
            |
            | writes state
            v
        Project .atavi/
  ----------------------------------
  brief.md
  config.json
  status.md
  pass-N/
  registries/
  memory/
  ATAVI-REPORT.md
  ----------------------------------
```

## Why the CLI stays thin

The spec explicitly says ATAVI is a protocol, not an application runtime.
The CLI should help the host find and scaffold the protocol, but should not
attempt to run multi-agent orchestration itself.

That means:

- `--path` exists so the host can load the packaged assets
- `init` exists so the host has a known workspace layout
- `doctor` exists so failures are obvious before a run starts

What the CLI should not do:

- call model APIs directly
- maintain its own orchestration daemon
- embed search credentials
- silently mutate the host environment

## File-first state

ATAVI uses files as the contract between the host AI, the user, and future runs.
That is why `.atavi/` matters so much.

The benefits:

- every pass is inspectable
- interrupted runs are resumable
- memory can persist across runs
- humans can audit why an experiment survived or died

## Canonical registries

The host AI owns three canonical registries inside `.atavi/registries/`:

- Claim Registry
- Experiment Ledger
- Prior Art Registry

Agents do not edit them directly. Agents propose changes in PODs and CPRs.
The host AI applies accepted changes during synthesis.

This is the key guardrail against drift and hidden state.

## Memory architecture

ATAVI needs cross-run memory because the same researcher will often run related
projects over time. The architecture is intentionally explicit:

- prior art cache
- kill archive
- claim patterns
- convergence history
- strategy insights

Memory needs governance or it turns into an echo chamber. The package docs
therefore treat expiration, contradiction handling, weighting, and scoping as
first-class design constraints, not implementation polish.

## Why committed assets matter

ATAVI should clone cleanly. A user should not need an invisible generator to
understand what the product is shipping. That is why the protocol markdown,
agent role files, and templates are committed as real files in git.

This mirrors one of the strongest repo patterns in `gstack`: serious artifacts
live in the repo, not behind a hidden build step.

## Testing philosophy

There are three categories of failure this repo must catch:

1. package drift
2. scaffold drift
3. behavioral drift

Package drift means a required protocol file disappeared or stopped shipping.
Scaffold drift means `init` no longer creates what the host expects.
Behavioral drift means commands like `--path` or `doctor` stop honoring the
contract.

The current test suite is designed around those three risks.

## Future extension points

The current source tree leaves room for:

- richer config validation
- host-specific setup commands
- report rendering helpers
- memory import/export
- migration tooling for `.atavi/` schema changes

Those can be added without changing the core product model above.

