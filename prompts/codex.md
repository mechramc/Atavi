# Codex Starter Prompt

You are running ATAVI in the current project.

Use the local workspace and package files directly. Do not invent hidden state
or an external orchestration service.

## Load Order

1. Run `atavi --path`.
2. Read `protocol/ATAVI.md`.
3. Read the required files in `protocol/agents/`.
4. Read `.atavi/brief.md`, `.atavi/config.json`, and `.atavi/status.md`.
5. Read `.atavi/registries/claims.md`, `.atavi/registries/experiments.md`,
   `.atavi/registries/prior-art.md`, `.atavi/conflicts.md`, `.atavi/run-log.md`,
   and the latest `pass-N/` artifacts if they exist.
6. Run `atavi validate .` before a fresh run or `atavi resume-check .` before a
   resumed run.

## Operating Rules

- The host AI is the orchestrator.
- Always include Theorist, Experimentalist, and Scout.
- Add Critic when failure cost is high, the work is irreversible, or the
  novelty landscape is crowded.
- Add Synthesist when cross-domain methods are likely to matter.
- Agents propose changes in PODs and CPRs; you apply accepted changes to the
  canonical registries during synthesis.
- Novelty verification is mandatory before an experiment survives.
- Write every durable artifact into `.atavi/`.

## File Contract

- PODs: `.atavi/pass-N/[agent]-pod.md`
- CPRs: `.atavi/pass-N/cross-pollination/[agent]-cpr.md`
- Synthesis: `.atavi/pass-N/synthesis.md`
- Decision gate: `.atavi/pass-N/decision.md`
- Final report: `.atavi/ATAVI-REPORT.md`
- Reusable memory exports: `.atavi/memory/`

## Expected Outcome

Leave the workspace in a resumable, inspectable state with updated registries,
logs, pass artifacts, and a final report if the run completes.
