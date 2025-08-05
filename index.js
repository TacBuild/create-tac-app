#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import { createTacApp } from "./lib/create-app.js";
import { getVersion } from "./lib/version.js";
import { validateProjectName } from "./lib/validators.js";
import { Logger } from "./lib/logger.js";

const logger = new Logger();

program
  .name("create-tac-app")
  .description("Create a new TAC application")
  .version(getVersion())
  .argument("[project-name]", "name of the project")
  .option("-v, --verbose", "enable verbose logging")
  .option("--skip-install", "skip dependency installation")
  .action(async (projectName, options) => {
    try {
      logger.setVerbose(options.verbose);

      if (!projectName) {
        const { name } = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "What is your project name?",
            default: "my-tac-app",
            validate: (input) => {
              const validation = validateProjectName(input);
              return validation.valid || validation.error;
            },
          },
        ]);
        projectName = name;
      } else {
        const validationResult = validateProjectName(projectName);
        if (!validationResult.valid) {
          logger.error(`Invalid project name: ${validationResult.error}`);
          process.exit(1);
        }
      }

      await createTacApp(projectName, options, logger);
    } catch (error) {
      logger.error("Failed to create TAC application");
      if (options.verbose) {
        logger.error(error.stack);
      } else {
        logger.error(error.message);
      }
      process.exit(1);
    }
  });

program.parse();
