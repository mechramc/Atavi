# Contributing

## Working rules

- Keep ATAVI host-agnostic.
- Do not turn the package into a proprietary orchestration runtime.
- Prefer committed protocol assets over generated hidden state.
- Preserve the file contract in `.atavi/`.
- Treat novelty gating and inspectability as non-negotiable.

## Repo workflow

1. Update docs first when the product contract changes.
2. Update protocol files and templates when agent behavior changes.
3. Update CLI code when scaffold or package behavior changes.
4. Add or update tests for every contract-level change.
5. Run `node scripts/check-manifest.js`.
6. Run `node test/run-all.js`.

## What changes require extra care

- renaming protocol or template files
- changing `.atavi/` scaffold output
- changing registry field names
- changing CLI output consumed by hosts

These are package contracts, not incidental implementation details.

## Style

- Use plain Node APIs unless there is a strong reason not to.
- Keep commands small and composable.
- Prefer explicit file paths over hidden conventions.
- Document product-level reasoning in `ARCHITECTURE.md`, not scattered comments.

## Pull request checklist

- README still matches the shipped commands.
- ARCHITECTURE still matches the product shape.
- protocol assets exist and are referenced correctly.
- tests cover the changed behavior.
- CI can run without hidden local dependencies.
