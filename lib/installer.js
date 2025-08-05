import { execSync } from "child_process";
import path from "path";

export async function installDependencies(projectPath, logger) {
  await installFrontendDependencies(projectPath, logger);

  await installContractDependencies(projectPath, logger);
}

async function installFrontendDependencies(projectPath, logger) {
  logger.startSpinner("Installing frontend dependencies...");

  try {
    execSync("npm install", {
      cwd: projectPath,
      stdio: "pipe",
    });

    logger.stopSpinner("Frontend dependencies installed", true);
  } catch (error) {
    logger.stopSpinner("Failed to install frontend dependencies", false);
    throw new Error(
      `Frontend dependency installation failed: ${error.message}`
    );
  }
}

async function installContractDependencies(projectPath, logger) {
  const contractsPath = path.join(projectPath, "contracts");
  logger.startSpinner("Installing contract dependencies...");

  try {
    execSync("npm install", {
      cwd: contractsPath,
      stdio: "pipe",
    });

    logger.stopSpinner("Contract dependencies installed", true);
  } catch (error) {
    logger.stopSpinner("Failed to install contract dependencies", false);
    throw new Error(
      `Contract dependency installation failed: ${error.message}`
    );
  }
}
