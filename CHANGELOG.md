# Changelog

## 0.1.0

- initialize ATAVI as a real package repository
- add thin CLI with `--path`, `init`, and `doctor`
- add protocol markdown, agent role files, and report templates
- add architecture, contribution, and testing docs
- add package-manifest verification and node test scaffolding
- add CI to enforce package and scaffold integrity
- expand `.atavi` scaffolding with explicit memory bucket directories
- add `validate` command for `.atavi/config.json` contract checks
- add pass and log placeholders to the `.atavi` scaffold contract
- add `resume-check` command for `.atavi/status.md` and resume validation
- add explicit per-pass synthesis and decision placeholders
- define canonical memory entry formats and governance fields
- add host loading and resume guidance for Codex, Claude, and Gemini
- add `migrate` command for safe workspace schema upgrades
- add memory import/export helpers for `.atavi/memory`
- add release-surface verification and npm-based CI coverage
- add starter prompt files for Codex, Claude, and Gemini

## 0.1.1

- strengthened host guidance and starter prompts so Codex, Claude, and Gemini
  are expected to ask clarifying questions, present explicit options when the
  run shape is ambiguous, and keep visible progress updates flowing during ATAVI
  startup and execution
- document the reliable global upgrade command as `npm install -g atavi@latest`
