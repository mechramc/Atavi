# Claude Starter Prompt

Run the ATAVI protocol for the current project using the local file workspace.

Treat ATAVI as a protocol package, not an application runtime.

## Load Order

1. Run `atavi --path`.
2. Load `protocol/ATAVI.md`.
3. Load the relevant role files from `protocol/agents/`.
4. Load `.atavi/brief.md`, `.atavi/config.json`, and `.atavi/status.md`.
5. Load `.atavi/registries/claims.md`, `.atavi/registries/experiments.md`,
   `.atavi/registries/prior-art.md`, `.atavi/conflicts.md`, `.atavi/run-log.md`,
   and the latest `pass-N/` artifacts if present.
6. Run `atavi validate .` before a fresh run or `atavi resume-check .` before a
   resumed run.

## Operating Rules

- Always include Theorist, Experimentalist, and Scout.
- Add Critic only when risk or irreversibility is high.
- Add Synthesist only when adjacent domains are likely to help.
- Keep `.atavi/` as the source of truth for resumability and audit.
- Do not store canonical registry state only in chat.
- Do not skip Scout novelty checks for surviving experiments.

## File Contract

- PODs: `.atavi/pass-N/[agent]-pod.md`
- CPRs: `.atavi/pass-N/cross-pollination/[agent]-cpr.md`
- Synthesis: `.atavi/pass-N/synthesis.md`
- Decision gate: `.atavi/pass-N/decision.md`
- Registries and logs: `.atavi/registries/`, `.atavi/conflicts.md`,
  `.atavi/kill-log.md`, `.atavi/run-log.md`
- Memory exports: `.atavi/memory/`

## Expected Outcome

Produce a complete `.atavi/` paper trail that a later host can resume or audit
without reconstructing hidden context.
