# Playwright Test Automation Framework

## Overview

This repository contains end-to-end automated tests, designed to accelerate release cycles and improve quality assurance process. The suite leverages Playwright for browser automation and TypeScript for robust, maintainable code.

## 🚀 Features

- **Multi-browser Testing**: Run tests on Chrome, Safari, and their mobile equivalents
- **Environment Support**: Configure and run tests across different environments (local, stage, prod)
- **CLI & Interactive Mode**: Run tests via command line arguments or interactive prompts
- **Test Filtering**: Filter tests by tags to run specific test suites
- **Comprehensive Reporting**: HTML reports, Allure reports, and custom text reports
- **Docker Support**: Run tests in containerized environments
- **TypeScript**: Fully typed codebase for better maintainability and developer experience
- **Page Object Model**: Structured approach to organizing test code
- **API Testing**: Built-in HTTP client for API testing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Docker (optional, for containerized execution)

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Marc-AC-93/playwright-template.git
   cd playwright-template
   ```

2. Install dependencies:

   ```bash
   npm run update
   ```

## 🏗️ Project Structure

```
playwright-template/
├── src/
│   ├── api/                  # API testing utilities
│   ├── cli/                  # CLI implementation
│   ├── common/               # Common fixtures and pages
│   ├── config/               # Environment configuration
│   │   └── env/              # Environment-specific .env files
│   ├── core/                 # Core test framework
│   ├── data/                 # Test data and enums
│   ├── features/             # Test features organized by domain
│   │   ├── login/            # Login feature tests
│   │   └── quiz/             # Quiz feature tests
│   └── reporters/            # Custom test reporters
├── allure-results/           # Allure report output
├── dist/                     # Compiled TypeScript output
├── playwright-report/        # Playwright HTML report output
├── test-results/             # Test artifacts (screenshots, videos, etc.)
├── docker-compose.yml        # Docker Compose configuration
├── dockerfile                # Docker configuration
├── package.json              # Project dependencies and scripts
├── playwright.config.ts      # Playwright configuration
└── tsconfig.json             # TypeScript configuration
```

## 🧪 Running Tests

### Interactive Mode

Run tests with an interactive CLI that prompts for options:

```bash
npm test
```

### Command Line Mode

Run tests with specific parameters:

```bash
npm test -- --cli --env=local --projects=chrome --tags=smoke,regression
```

### Available Options

- `--cli`: Run in CLI mode (requires env parameter)
- `--env <env>`: Environment to run tests against (local, stage, prod)
- `--projects <projects>`: Comma-separated list of projects to run tests on (chrome, safari, mobile_chrome, mobile_safari)
- `--tags <tags>`: Comma-separated list of test tags to filter tests by

## 📊 Reporting

### HTML Report

View the Playwright HTML report:

```bash
npm run report
```

### Allure Report

Generate and open the Allure report:

```bash
npm run allure
```

### Custom Text Report

A custom text report is automatically generated in the `custom-report` directory.

## 🧰 Development Tools

### Code Formatting

Format code with Prettier:

```bash
npm run format
```

Check code formatting:

```bash
npm run format:check
```

### Linting

Lint code with ESLint:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

### Updating Dependencies

Update all dependencies:

```bash
npm run update
```

## 🔧 Configuration

### Environment Variables

Environment-specific variables are stored in `.env` files in the `src/config/env` directory.

### Playwright Configuration

Modify `playwright.config.ts` to adjust timeouts, browser settings, and other Playwright options.

## 📝 Creating Tests

1. Create a new directory in `src/features` for your feature
2. Create fixture files for your feature-specific fixtures
3. Write your tests using the Page Object Model pattern
4. Add appropriate tags to filter your tests

## 🤝 Contributing

- Follow Clean Code principles:
  - SOLID (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion): Follow the SOLID principles to make the code more maintainable and extensible.
  - DRY (Don’t Repeat Yourself): Avoid duplicating logic.
  - KISS (Keep It Simple, Stupid): Avoid overcomplicating the code.
  - Meaningful Names: Use clear, descriptive names for variables, functions, classes...
  - Small Functions: Functions should do one thing only, and do it well.
  - Avoid Magic Numbers and Strings: Use constants or enums to give meaning value.
  - Use Descriptive Function Signatures: Let the function tell its story through its name and parameters.
  - Minimize Side Effects: Functions should be predictable and not unexpectedly modify external state.
  - Comment Only When Necessary: Write code so clear that comments are only needed for context, not explanation.
