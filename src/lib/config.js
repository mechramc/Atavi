const ALLOWED_MODES = new Set(["full", "scout", "theorist", "vision", "audit"]);
const REQUIRED_FULL_MODE_AGENTS = ["theorist", "experimentalist", "scout"];
const SUPPORTED_MEMORY_SCOPES = new Set(["project"]);

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validatePositiveInteger(value, fieldName, errors) {
  if (!Number.isInteger(value) || value <= 0) {
    errors.push(`${fieldName} must be a positive integer`);
  }
}

export function parseConfigFile(contents) {
  return JSON.parse(contents);
}

export function validateConfig(config) {
  const errors = [];

  if (!isPlainObject(config)) {
    return ["config must be a JSON object"];
  }

  if (!ALLOWED_MODES.has(config.mode)) {
    errors.push(`mode must be one of: ${Array.from(ALLOWED_MODES).join(", ")}`);
  }

  validatePositiveInteger(config.maxPasses, "maxPasses", errors);
  validatePositiveInteger(config.maxExperiments, "maxExperiments", errors);

  if (typeof config.convergenceThreshold !== "number" || config.convergenceThreshold <= 0 || config.convergenceThreshold > 1) {
    errors.push("convergenceThreshold must be a number greater than 0 and less than or equal to 1");
  }

  if (!Array.isArray(config.agents) || config.agents.length === 0 || config.agents.some((agent) => typeof agent !== "string" || agent.length === 0)) {
    errors.push("agents must be a non-empty array of strings");
  }

  if (config.mode === "full" && Array.isArray(config.agents)) {
    for (const agent of REQUIRED_FULL_MODE_AGENTS) {
      if (!config.agents.includes(agent)) {
        errors.push(`full mode must include agent: ${agent}`);
      }
    }
  }

  if (!isPlainObject(config.memory)) {
    errors.push("memory must be an object");
  } else {
    if (typeof config.memory.enabled !== "boolean") {
      errors.push("memory.enabled must be a boolean");
    }

    if (!SUPPORTED_MEMORY_SCOPES.has(config.memory.scope)) {
      errors.push(`memory.scope must be one of: ${Array.from(SUPPORTED_MEMORY_SCOPES).join(", ")}`);
    }
  }

  return errors;
}
