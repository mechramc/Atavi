# Testing

ATAVI needs a package-level test strategy, not just command smoke tests.

## Test layers

### Layer 1: Manifest integrity

Goal: fail fast if the shipped package stops containing required protocol or
template files.

Current coverage:

- `scripts/check-manifest.js`
- `doctor` command tests

### Layer 2: CLI contract

Goal: verify the user-facing package commands keep working.

Current coverage:

- `--path`
- `init`
- `doctor`
- `validate`
- `resume-check`

### Layer 3: Scaffold contract

Goal: verify `.atavi/` contains the exact files a host AI expects.

Current coverage:

- scaffold file existence
- idempotent init behavior
- registry and report placeholders
- explicit memory bucket scaffolding
- pass and log placeholder scaffolding
- snapshot coverage for scaffolded markdown
- deeper memory layout coverage
- host compatibility coverage for Codex, Claude, and Gemini guidance

## Planned deepening inside this repo

The product is all-or-nothing in terms of quality bar, so the test plan should
grow toward:

- config schema validation tests
- snapshot tests for scaffolded markdown files
- deeper resume-state tests around `status.md` and `config.json`
- memory layout tests
- host compatibility tests for Codex / Claude / Gemini loading patterns

## Run commands

```bash
node scripts/check-manifest.js
node --test --experimental-test-isolation=none
```

## CI expectation

CI must stop merges that:

- remove a packaged asset
- break a top-level command
- change scaffold output unintentionally
