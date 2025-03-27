#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import shell from 'shelljs';
import gitClone from 'git-clone/promise.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import gradient from 'gradient-string';
import figlet from 'figlet';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tacLogo = `
  ⚡ ████████╗ █████╗  ██████╗
    ╚══██╔══╝██╔══██╗██╔════╝
       ██║   ███████║██║     
       ██║   ██╔══██║██║     
       ██║   ██║  ██║╚██████╗
       ╚═╝   ╚═╝  ╚═╝ ╚═════╝                                
`;

const REPO_URL = 'https://github.com/tacbuild/starter-app.git';

console.log(gradient.pastel.multiline(tacLogo));
console.log(chalk.bold('Welcome to TAC - Build hybrid dApps in seconds!\n'));

const program = new Command('create-tac-app')
  .version('0.1.0')
  .argument('[project-name]', 'Name of your new TAC project')
  .action(async (projectName) => {
    if (!projectName) {
      const response = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What would you like to name your TAC project?',
          default: 'my-tac-app',
          validate: (input) => {
            if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
            return 'Project name may only include letters, numbers, underscores and hashes.';
          }
        }
      ]);
      projectName = response.projectName;
    }

    const projectPath = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${projectName} already exists. Do you want to overwrite it?`,
          default: false
        }
      ]);

      if (!overwrite) {
        console.log(chalk.red('Operation cancelled.'));
        process.exit(1);
      }

      fs.removeSync(projectPath);
    }

    fs.ensureDirSync(projectPath);

    const spinner = ora('Cloning starter template...').start();

    try {
      await gitClone(REPO_URL, projectPath);

      fs.removeSync(path.join(projectPath, '.git'));

      spinner.succeed('Template cloned successfully!');

      const installSpinner = ora('Installing dependencies...').start();

      shell.cd(projectPath);
      const result = shell.exec('npm install', { silent: true });

      if (result.code !== 0) {
        installSpinner.fail('Failed to install dependencies.');
        console.error(chalk.red(`Error: ${result.stderr}`));
        process.exit(1);
      }

      installSpinner.succeed('Dependencies installed successfully!');

      console.log('\n' + gradient.rainbow('Your TAC project is ready!') + '\n');

      console.log(chalk.bold('Next steps:'));
      console.log(`  ${chalk.cyan('1.')} ${chalk.green('Deploy your contracts:')}`);
      console.log(`     ${chalk.cyan('cd')} ${chalk.green(projectName + '/contracts')}`);
      console.log(`     ${chalk.cyan('npm install')}`);
      console.log(`     ${chalk.cyan('npx hardhat run scripts/deploy.js --network tacTestnet')}`);
      console.log(`\n  ${chalk.cyan('2.')} ${chalk.green('Update contract addresses:')}`);
      console.log(`     Edit ${chalk.green(projectName + '/lib/contract_address.ts')} with your deployed contract addresses`);
      console.log(`\n  ${chalk.cyan('3.')} ${chalk.green('Start your app:')}`);
      console.log(`     ${chalk.cyan('cd')} ${chalk.green(projectName)}`);
      console.log(`     ${chalk.cyan('npm run dev')}\n`);

      console.log(chalk.bold('To learn more about TAC, visit:'));
      console.log(`  ${chalk.cyan('https://docs.tac.build')}\n`);

    } catch (error) {
      spinner.fail('Failed to clone starter template.');
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
