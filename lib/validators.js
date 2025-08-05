import fs from "fs";

export function validateProjectName(name) {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Project name is required" };
  }

  if (name.length === 0) {
    return { valid: false, error: "Project name cannot be empty" };
  }

  if (name.length > 214) {
    return { valid: false, error: "Project name cannot exceed 214 characters" };
  }

  if (name.toLowerCase() !== name) {
    return { valid: false, error: "Project name must be lowercase" };
  }

  if (name.startsWith(".")) {
    return { valid: false, error: "Project name cannot start with a dot" };
  }

  if (name.startsWith("_")) {
    return {
      valid: false,
      error: "Project name cannot start with an underscore",
    };
  }

  const invalidChars = /[~)('!*]/;
  if (invalidChars.test(name)) {
    return { valid: false, error: "Project name contains invalid characters" };
  }

  const validPattern = /^[a-z0-9\-_.]+$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error:
        "Project name can only contain lowercase letters, numbers, hyphens, underscores, and dots",
    };
  }

  const reservedNames = [
    "node_modules",
    "favicon.ico",
    "package.json",
    "package-lock.json",
    "npm",
    "node",
    "con",
    "prn",
    "aux",
    "nul",
    "com1",
    "com2",
    "com3",
    "com4",
    "com5",
    "com6",
    "com7",
    "com8",
    "com9",
    "lpt1",
    "lpt2",
    "lpt3",
    "lpt4",
    "lpt5",
    "lpt6",
    "lpt7",
    "lpt8",
    "lpt9",
  ];

  if (reservedNames.includes(name.toLowerCase())) {
    return { valid: false, error: `"${name}" is a reserved name` };
  }

  return { valid: true };
}

export function validateProjectPath(projectPath) {
  try {
    const stats = fs.statSync(projectPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(projectPath);
      if (files.length > 0) {
        return {
          valid: false,
          error: "Directory already exists and is not empty",
        };
      }
    }
    return { valid: true };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { valid: true };
    }
    return { valid: false, error: error.message };
  }
}
