const ALLOWED_PHASES = new Set([
  "not_started",
  "independent_work",
  "cross_pollination",
  "synthesis",
  "decision_gate",
  "completed"
]);

const ALLOWED_RUN_STATUSES = new Set([
  "initialized",
  "in_progress",
  "blocked",
  "completed"
]);

function parseLine(line) {
  const separatorIndex = line.indexOf(":");
  if (separatorIndex === -1) {
    return null;
  }

  const key = line.slice(0, separatorIndex).trim();
  const value = line.slice(separatorIndex + 1).trim();
  if (!key) {
    return null;
  }

  return [key, value];
}

export function parseStatusFile(contents) {
  const fields = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const parsed = parseLine(line);
    if (!parsed) {
      continue;
    }

    const [key, value] = parsed;
    fields[key] = value;
  }

  return fields;
}

export function validateStatus(fields) {
  const errors = [];

  const requiredFields = [
    "run_status",
    "current_pass",
    "current_phase",
    "convergence_score",
    "blocking_concerns",
    "token_estimate",
    "last_updated"
  ];

  for (const field of requiredFields) {
    if (!(field in fields) || fields[field].length === 0) {
      errors.push(`${field} is required`);
    }
  }

  if ("run_status" in fields && !ALLOWED_RUN_STATUSES.has(fields.run_status)) {
    errors.push(`run_status must be one of: ${Array.from(ALLOWED_RUN_STATUSES).join(", ")}`);
  }

  if ("current_pass" in fields && !/^\d+$/.test(fields.current_pass)) {
    errors.push("current_pass must be a non-negative integer");
  }

  if ("current_phase" in fields && !ALLOWED_PHASES.has(fields.current_phase)) {
    errors.push(`current_phase must be one of: ${Array.from(ALLOWED_PHASES).join(", ")}`);
  }

  if ("convergence_score" in fields) {
    const value = fields.convergence_score;
    if (value !== "n/a") {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
        errors.push("convergence_score must be n/a or a number between 0 and 1");
      }
    }
  }

  if (fields.run_status === "completed" && fields.current_phase !== "completed") {
    errors.push("run_status completed requires current_phase completed");
  }

  if (fields.current_phase === "completed" && fields.run_status !== "completed") {
    errors.push("current_phase completed requires run_status completed");
  }

  if (fields.run_status === "initialized" && fields.current_pass !== "0") {
    errors.push("run_status initialized requires current_pass 0");
  }

  if (fields.current_phase === "not_started" && fields.current_pass !== "0") {
    errors.push("current_phase not_started requires current_pass 0");
  }

  return errors;
}
