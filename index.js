#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import shell from 'shelljs';
import gitClone from 'git-clone/promise.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { pastel, rainbow } from 'gradient-string';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the directory of the CLI for debugging
if (process.env.DEBUG) {
  console.log(`CLI directory: ${__dirname}`);
}

const tacLogo = `
  ⚡ ████████╗ █████╗  ██████╗
    ╚══██╔══╝██╔══██╗██╔════╝
       ██║   ███████║██║     
       ██║   ██╔══██║██║     
       ██║   ██║  ██║╚██████╗
       ╚═╝   ╚═╝  ╚═╝ ╚═════╝                                
`;


console.log(pastel.multiline(tacLogo));
console.log(chalk.bold('Welcome to TAC - Build hybrid dApps in seconds!\n'));

const REPOS = {
  frontend: 'https://github.com/tacbuild/starter-frontend.git',
  hardhat: 'https://github.com/tacbuild/starter-hardhat.git',
  foundry: 'https://github.com/tacbuild/starter-foundry.git'
};

const { projectName, contractFramework } = await inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: 'What would you like to name your TAC project?',
    default: 'my-tac-app',
    validate: (input) => {
      if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
      return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  },
  {
    type: 'list',
    name: 'contractFramework',
    message: 'Select a smart contract framework:',
    choices: [
      { name: 'Hardhat (JavaScript/TypeScript)', value: 'hardhat' },
      { name: 'Foundry (Solidity)', value: 'foundry' }
    ],
    default: 'hardhat'
  }
]);

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

const frontendPath = path.join(projectPath, 'frontend');
const contractsPath = path.join(projectPath, 'contracts');

fs.ensureDirSync(frontendPath);
fs.ensureDirSync(contractsPath);

let spinner = ora('Cloning frontend template...').start();
try {
  await gitClone(REPOS.frontend, frontendPath);
  fs.removeSync(path.join(frontendPath, '.git'));
  spinner.succeed('Frontend template cloned successfully!');
} catch (error) {
  spinner.fail('Failed to clone frontend template.');
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
}

spinner = ora(`Cloning ${contractFramework} template...`).start();
try {
  await gitClone(REPOS[contractFramework], contractsPath);
  fs.removeSync(path.join(contractsPath, '.git'));
  spinner.succeed(`${contractFramework} template cloned successfully!`);
} catch (error) {
  spinner.fail(`Failed to clone ${contractFramework} template.`);
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
}

const rootPackageJson = {
  name: projectName,
  version: '0.1.0',
  private: true,
  scripts: {
    'frontend': 'cd frontend && npm run dev',
    'contracts:build': `cd contracts && ${contractFramework === 'hardhat' ? 'npx hardhat compile' : 'forge build'}`
  }
};
fs.writeFileSync(
  path.join(projectPath, 'package.json'),
  JSON.stringify(rootPackageJson, null, 2)
);

spinner = ora('Installing frontend dependencies...').start();
shell.cd(frontendPath);
let result = shell.exec('npm install', { silent: true });
if (result.code !== 0) {
  spinner.fail('Failed to install frontend dependencies.');
  console.error(chalk.red(`Error: ${result.stderr}`));
} else {
  spinner.succeed('Frontend dependencies installed successfully!');
}

spinner = ora(`Installing ${contractFramework} dependencies...`).start();
shell.cd(contractsPath);
if (contractFramework === 'hardhat') {
  result = shell.exec('npm install', { silent: true });
  if (result.code !== 0) {
    spinner.fail('Failed to install contract dependencies.');
    console.error(chalk.red(`Error: ${result.stderr}`));
  } else {
    spinner.succeed('Contract dependencies installed successfully!');
  }
} else if (contractFramework === 'foundry') {
  result = shell.exec('forge install', { silent: true });
  if (result.code !== 0) {
    spinner.fail('Failed to install Foundry dependencies.');
    console.error(chalk.red(`Error: ${result.stderr}`));
  } else {
    spinner.succeed('Foundry dependencies installed successfully!');
  }
}

const readme = `# ${projectName}

A hybrid TAC dApp with Next.js frontend and ${contractFramework} smart contracts - powered by TAC

## Project Structure

- \`/frontend\` - Next.js frontend with TAC SDK integration
- \`/contracts\` - ${contractFramework} smart contracts for TAC

## Getting Started

### Frontend

\`\`\`bash
cd frontend
npm run dev
\`\`\`

### Contracts

${contractFramework === 'hardhat'
    ? '```bash\ncd contracts\nnpx hardhat compile\nnpx hardhat run scripts/deploy.js --network tacTestnet\n```'
    : '```bash\ncd contracts\nforge build\nforge script script/DeployMessage.s.sol --rpc-url tac_testnet --broadcast\n```'}

## Learn More

- [TAC Documentation](https://docs.tac.build)
`;

fs.writeFileSync(path.join(projectPath, 'README.md'), readme);

const gitignore = `# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
build
dist

# misc
.DS_Store
*.pem
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# contracts
${contractFramework === 'hardhat'
    ? 'artifacts\ncache\ntypechain-types'
    : 'out\ncache'}
`;

fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);

spinner = ora('Initializing git repository...').start();
shell.cd(projectPath);
result = shell.exec('git init', { silent: true });
if (result.code !== 0) {
  spinner.fail('Failed to initialize git repository.');
} else {
  spinner.succeed('Git repository initialized successfully!');
}

console.log('\n' + rainbow('Your TAC project is ready!') + '\n');
console.log(chalk.bold('Next steps:'));

console.log(`  ${chalk.cyan('1.')} ${chalk.green('Start the frontend:')}`);
console.log(`     ${chalk.cyan('cd')} ${chalk.green(projectName)}`);
console.log(`     ${chalk.cyan('cd')} ${chalk.green('frontend')}`);
console.log(`     ${chalk.cyan('npm run dev')}`);

console.log(`\n  ${chalk.cyan('2.')} ${chalk.green('Deploy contracts:')}`);
console.log(`     ${chalk.cyan('cd')} ${chalk.green(projectName)}`);
console.log(`     ${chalk.cyan('cd')} ${chalk.green('contracts')}`);

if (contractFramework === 'hardhat') {
  console.log(`     ${chalk.cyan('npx hardhat run scripts/deploy.js --network tacTestnet')}`);
} else {
  console.log(`     ${chalk.cyan('forge script script/DeployMessage.s.sol --rpc-url tac_testnet --broadcast')}`);
}

console.log(`\n  ${chalk.cyan('3.')} ${chalk.green('Update contract addresses:')}`);
console.log(`     Edit ${chalk.green('frontend/lib/constants.ts')} with your deployed contract addresses`);

console.log(chalk.bold('\nTo learn more about TAC, visit:'));
console.log(`  ${chalk.cyan('https://docs.tac.build')}\n`);