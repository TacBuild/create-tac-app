import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import gitClone from "git-clone/promise.js";
import { validateProjectPath } from "./validators.js";
import { generateProjectFiles } from "./templates.js";
import { installDependencies } from "./installer.js";

const REPOSITORIES = {
  frontend: "https://github.com/tacbuild/starter-frontend.git",
  contracts: "https://github.com/tacbuild/starter-hardhat.git",
};

export async function createTacApp(projectName, options, logger) {
  const projectPath = path.resolve(process.cwd(), projectName);

  logger.debug(`Creating TAC app at: ${projectPath}`);

  const pathValidation = validateProjectPath(projectPath);
  if (!pathValidation.valid) {
    throw new Error(pathValidation.error);
  }

  await createProjectStructure(projectPath, logger);

  await cloneTemplates(projectPath, logger);

  await generateProjectFiles(projectName, projectPath, logger);

  if (!options.skipInstall) {
    await installDependencies(projectPath, logger);
  }

  await initializeGit(projectPath, logger);

  showSuccessMessage(projectName, logger);
}

async function createProjectStructure(projectPath, logger) {
  logger.startSpinner("Setting up project structure...");

  try {
    await fs.ensureDir(projectPath);
    logger.debug(`Created directory: ${projectPath}`);

    logger.stopSpinner("Project structure created", true);
  } catch (error) {
    logger.stopSpinner("Failed to create project structure", false);
    throw new Error(`Failed to create project directory: ${error.message}`);
  }
}

async function cloneTemplates(projectPath, logger) {
  logger.startSpinner("Cloning frontend template...");

  try {
    await gitClone(REPOSITORIES.frontend, projectPath);
    await fs.remove(path.join(projectPath, ".git"));
    logger.stopSpinner("Frontend template cloned", true);
  } catch (error) {
    logger.stopSpinner("Failed to clone frontend template", false);
    throw new Error(`Failed to clone frontend template: ${error.message}`);
  }

  const contractsPath = path.join(projectPath, "contracts");
  logger.startSpinner("Cloning contracts template...");

  try {
    await gitClone(REPOSITORIES.contracts, contractsPath);
    await fs.remove(path.join(contractsPath, ".git"));
    logger.stopSpinner("Contracts template cloned", true);
  } catch (error) {
    logger.stopSpinner("Failed to clone contracts template", false);
    throw new Error(`Failed to clone contracts template: ${error.message}`);
  }
}

async function initializeGit(projectPath, logger) {
  logger.startSpinner("Initializing git repository...");

  try {
    execSync("git init", {
      cwd: projectPath,
      stdio: "pipe",
    });

    execSync("git add .", {
      cwd: projectPath,
      stdio: "pipe",
    });

    execSync('git commit -m "Initial commit from create-tac-app"', {
      cwd: projectPath,
      stdio: "pipe",
    });

    logger.stopSpinner("Git repository initialized", true);
  } catch (error) {
    logger.stopSpinner("Failed to initialize git repository", false);
    logger.warn(
      "Git initialization failed, but project was created successfully"
    );
    logger.debug(`Git error: ${error.message}`);
  }
}

function showSuccessMessage(projectName, logger) {
  console.log();
  logger.success(`Created TAC application: ${projectName}`);
  console.log();

  logger.info("Next steps:");
  console.log(`  cd ${projectName}`);
  console.log("  npm run dev");
  console.log();

  logger.info("To deploy contracts:");
  console.log("  cd contracts");
  console.log("  npx hardhat run scripts/deploy.js --network tacTestnet");
  console.log();

  logger.info("Learn more at https://docs.tac.build");
}
