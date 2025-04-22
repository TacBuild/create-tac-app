# Contributing to create-tac-app

Thank you for your interest in contributing to `create-tac-app`! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/create-tac-app.git
   cd create-tac-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up Git hooks:
   ```bash
   npm run prepare
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests to ensure everything works:
   ```bash
   npm test
   ```

4. Run linting to ensure code style is consistent:
   ```bash
   npm run lint
   ```

5. Commit your changes with a descriptive commit message:
   ```bash
   git commit -m "Add your descriptive message here"
   ```

6. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request from your fork to the main repository

## Testing

We use Jest for testing. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Releasing

This project follows semantic versioning. New releases are published to npm automatically when a new GitHub release is created.

To create a new version:

```bash
# For a patch release (bug fixes)
npm version patch

# For a minor release (new features, backwards compatible)
npm version minor

# For a major release (breaking changes)
npm version major
```

## Code Style

We use ESLint to maintain code quality and consistency. Please ensure your code passes linting before submitting a PR:

```bash
npm run lint
```

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License. 