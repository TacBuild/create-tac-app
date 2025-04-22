# create-tac-app

A CLI tool to bootstrap TAC hybrid dApp development.

## What is TAC?

TAC (TON Application Chain) is a Layer 1 blockchain with a novel TON Adapter technology that enables Ethereum developers to deploy their existing applications and reach TON and Telegram's 1 billion user base.

## Usage

```bash
# Using npx (recommended)
npx create-tac-app my-tac-app

# Or install globally
npm install -g create-tac-app
create-tac-app my-tac-app
```

## Development

### Installation

```bash
git clone https://github.com/TacBuild/create-tac-app.git
cd create-tac-app
npm install
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

### Publishing

This package uses semantic versioning. To publish a new version:

```bash
# For a patch release (bug fixes)
npm version patch

# For a minor release (new features, backwards compatible)
npm version minor

# For a major release (breaking changes)
npm version major
```

The `npm version` command will:
1. Run tests
2. Update version in package.json
3. Create a git tag
4. Push changes and tags to GitHub
5. Publish to npm

You can also use the GitHub release workflow by creating a new release on GitHub.
