import fs from "fs-extra";
import path from "path";

export async function generateProjectFiles(projectName, projectPath, logger) {
  logger.startSpinner("Generating project configuration...");

  try {
    await generateReadme(projectName, projectPath);

    await generateGitignore(projectPath);

    logger.stopSpinner("Project configuration generated", true);
  } catch (error) {
    logger.stopSpinner("Failed to generate project configuration", false);
    throw new Error(`Failed to generate project files: ${error.message}`);
  }
}

async function generateReadme(projectName, projectPath) {
  const readme = `# ${projectName}

A TAC hybrid dApp built with Next.js and Hardhat.

## Getting Started

### Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Learn More

- [TAC Documentation](https://docs.tac.build)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
`;

  await fs.writeFile(path.join(projectPath, "README.md"), readme);
}

async function generateGitignore(projectPath) {
  const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Hardhat
contracts/artifacts/
contracts/cache/
contracts/typechain-types/
`;

  await fs.writeFile(path.join(projectPath, ".gitignore"), gitignore);
}
