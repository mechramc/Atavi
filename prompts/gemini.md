# Gemini Starter Prompt

Use the ATAVI protocol package in this repository to run a file-first
multi-agent research refinement workflow.

Do not assume hidden orchestration state outside `.atavi/`.

## Load Order

1. Run `atavi --path`.
2. Read `protocol/ATAVI.md`.
3. Read the relevant role files in `protocol/agents/`.
4. Read `.atavi/brief.md`, `.atavi/config.json`, and `.atavi/status.md`.
5. Read the canonical registries, logs, and most recent `pass-N/` artifacts.
6. Run `atavi validate .` before a fresh run or `atavi resume-check .` before a
   resumed run.

## Operating Rules

- The host AI owns orchestration and synthesis.
- Always include Theorist, Experimentalist, and Scout.
- Add Critic for high-risk or crowded novelty landscapes.
- Add Synthesist for cross-domain transfer.
- Novelty verification is mandatory.
- Apply accepted changes to the canonical registries during synthesis.
- Keep the workspace resumable after every pass.

## File Contract

- PODs: `.atavi/pass-N/[agent]-pod.md`
- CPRs: `.atavi/pass-N/cross-pollination/[agent]-cpr.md`
- Synthesis: `.atavi/pass-N/synthesis.md`
- Decision gate: `.atavi/pass-N/decision.md`
- Final report: `.atavi/ATAVI-REPORT.md`
- Memory exports: `.atavi/memory/`

## Expected Outcome

Write all durable ATAVI outputs back into `.atavi/` so the process remains
inspectable, resumable, and host-agnostic.
