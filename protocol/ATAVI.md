# ATAVI

ATAVI is a host-agnostic multi-agent iterative research refinement protocol.
The package does not run the research loop itself. It ships the protocol, agent
contracts, templates, and scaffold helpers that a host AI can execute.

## Core Position

- ATAVI is a protocol, not a daemon-backed application.
- The host AI is the orchestrator.
- Novelty verification is mandatory before any experiment survives.
- Cross-pollination is mandatory on every pass.
- Every decision must be inspectable through persistent artifacts.

## Modes

### Full

Run the complete refinement loop with adaptive agent selection, convergence
tracking, final report generation, and persistent memory updates.

### Scout

Run novelty search only. Produce a Prior Art Registry and verdicts for claims
or experiments without generating new experimental design work.

### Theorist

Formalize a thesis into falsifiable claims, metrics, assumptions, and limits.

### Vision

Challenge the framing before the loop starts. Produce a Reimagination Brief
that argues for the original direction, a stronger direction, or a hybrid.

### Audit

Review a product or system and produce a completion summary that covers
architecture gaps, security issues, edge cases, tests, observability, and
deployment risk.

## Adaptive Agent Selection

ATAVI always includes:

- Theorist
- Experimentalist
- Scout

ATAVI conditionally adds:

- Critic when cost of failure is high, work is irreversible, or the novelty
  landscape is crowded
- Synthesist when the problem spans multiple domains or adjacent disciplines

## Run Lifecycle

1. Detect an ATAVI invocation inside the host environment.
2. Discover the input spec, codebase, or product documents.
3. Extract and confirm a research brief.
4. Create a local `.atavi/` workspace.
5. Execute the multi-pass refinement loop.
6. Compile `ATAVI-REPORT.md`.
7. Persist reusable memory artifacts for future runs.

## Refinement Loop

Each pass runs in four ordered phases.

### Phase 1: Independent Work

Each agent writes a POD to `.atavi/pass-N/[agent]-pod.md`.

### Phase 2: Cross-Pollination

Each agent reads the other PODs and writes a CPR to
`.atavi/pass-N/cross-pollination/[agent]-cpr.md`.

### Phase 3: Synthesis

The host AI updates the Claim Registry, Experiment Ledger, Prior Art Registry,
conflict list, and convergence score. The host also writes a pass summary to
`.atavi/pass-N/synthesis.md`.

### Phase 4: Decision Gate

The host AI either terminates, continues, or escalates to the researcher based
on convergence, blocking concerns, and surviving experiments. The pass outcome
is written to `.atavi/pass-N/decision.md`, and cross-pass state remains visible
in `.atavi/status.md` and `.atavi/run-log.md`.

## Novelty Gate

The Scout performs structured novelty search on every active claim and active
experiment. Verdicts are:

- `NOVEL`
- `PARTIAL`
- `DUPLICATE`
- `SUPERSEDED`

Duplicate or superseded experiments are killed unless the Experimentalist
supplies a concrete methodological delta and the Scout re-verifies it.

Claim-level novelty evidence is recorded in `.atavi/registries/prior-art.md`.
Experiment-level novelty verdicts are recorded in
`.atavi/registries/experiments.md` and summarized in `.atavi/pass-N/synthesis.md`.

## Convergence

Agents vote on surviving experiments using:

- `STRONG_YES`
- `YES`
- `WEAK_YES`
- `NO`

ATAVI converges when the convergence threshold is met for two consecutive
passes. If perfect agreement happens too early, the host must force an
adversarial pass to avoid a coherence trap.

## Persistent Memory

ATAVI stores:

- prior art cache
- kill archive
- claim patterns
- convergence history
- strategy insights

Memories are scoped by domain and keywords, weighted by confidence, expired
when stale, and corrected when contradicted by new evidence.

Reusable memory exports are written into `.atavi/memory/` after a run, using
the bucketed directories for prior art cache, kill archive, claim patterns,
convergence history, and strategy insights.

## Output Contract

The final report must include:

- completion summary
- executive summary
- ranked recommended experiments
- rejected experiments / kill log
- final claim registry
- final prior art registry
- full process log
