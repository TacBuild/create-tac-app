# Create TAC App

The easiest way to get started with TAC is by using `create-tac-app`. This CLI tool enables you to quickly start building a new TAC hybrid dApp, with everything set up for you. You can create a new app using the default TAC template, which includes a Next.js frontend with integrated Hardhat smart contracts. To get started, use the following command:

## Interactive

You can create a new project interactively by running:

```bash
npx create-tac-app@latest
# or
yarn create tac-app
# or
pnpm create tac-app
# or
bunx create-tac-app
```

You will be asked for the name of your project:

```
✔ What is your project name? … my-tac-app
```

## Non-interactive

You can also pass the project name as a command line argument to set up a new project non-interactively. See `create-tac-app --help`:

```
Usage: create-tac-app [project-name] [options]

Arguments:
  project-name                         name of the project

Options:
  -V, --version                        display version number
  -v, --verbose                        enable verbose logging
  --skip-install                       skip dependency installation
  -h, --help                           display help for command
```

### Examples

```bash
# Create a project named "my-dapp"
npx create-tac-app@latest my-dapp

# Create with verbose logging
npx create-tac-app@latest my-dapp --verbose

# Create without installing dependencies
npx create-tac-app@latest my-dapp --skip-install
```

## What You Get

Your new TAC project includes:

- **Next.js Frontend** - Modern React framework with App Router
- **Hardhat Integration** - Smart contract development environment
- **TAC SDK** - Pre-configured blockchain integration
- **TypeScript Support** - Full type safety across the stack

## What is TAC?

TAC is a Layer 1 blockchain with novel TON Adapter technology that enables Ethereum developers to deploy their existing applications and reach TON and Telegram's 1 billion user base.

## Learn More

- [TAC Documentation](https://docs.tac.build)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.
