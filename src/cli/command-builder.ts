import { Command } from 'commander';
import { Env } from '../data/Envs';
import { TestTags } from '../data/TestTags';
import { executeCommand } from './command-runner';
import { PromptQuestions } from './prompt-questions';

/**
 * Execution mode for tests
 */
export enum Mode {
  HEADLESS = 'headless',
  UI = 'ui',
}

/**
 * Projects available for testing
 */
export enum Projects {
  CHROME = 'chrome',
  SAFARI = 'safari',
  MOBILE_SAFARI = 'mobile_safari',
  MOBILE_CHROME = 'mobile_chrome',
}

/**
 * Configuration interface for test execution
 */
export interface PlaywrightOptions {
  env: Env;
  mode: Mode;
  projects: string[];
  tags: TestTags[];
}

/**
 * Utility class for building and executing Playwright test commands
 * Handles both CLI arguments and interactive prompts
 */
export class CommandBuilder {
  /**
   * Parse command line arguments or prompt for input interactively
   * and execute the test command
   */
  static async parseAndRun(): Promise<void> {
    try {
      const config = await this.parseArguments();
      await this.buildAndExecuteCommand(config);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`\n❌ Error: ${errorMessage}\n`);
      process.exit(1);
    }
  }

  /**
   * Parse command line arguments or prompt for input interactively
   * @returns PlaywrightOptions
   */
  private static async parseArguments(): Promise<PlaywrightOptions> {
    const program = new Command();

    program
      .option('-c, --cli', 'Run in CLI mode (only requires env parameter)')
      .option('-e, --env <env>', 'Environment to run tests against (local, stage, prod)')
      .option('-p, --projects <projects>', 'Comma-separated list of projects to run tests on')
      .option('-t, --tags <tags>', 'Comma-separated list of test tags to filter tests by')
      .parse(process.argv);

    const options = program.opts();
    const isCli = options.cli;

    let env: Env;
    let mode: Mode;
    let projects: string[];
    let tags: TestTags[];

    if (isCli) {
      env = options.env as Env;
      mode = Mode.HEADLESS;
      projects = options.projects ? options.projects.split(',') : [];
      tags = options.tags ? options.tags.split(',').map((tag: string) => tag as TestTags) : [];

      if (!env || !Object.values(Env).includes(env)) {
        throw new Error(
          `Invalid environment: ${env}. Valid options: ${Object.values(Env).join(', ')}`
        );
      }
    } else {
      const config = await PromptQuestions.promptAllOptions();
      env = config.env;
      mode = config.mode;
      projects = config.projects;
      tags = config.tags;
    }

    return { env, mode, projects, tags };
  }

  /**
   * Build and execute a test command with the given configuration
   * @param config PlaywrightOptions
   */
  static async buildCommand(config: PlaywrightOptions): Promise<string> {
    return this.buildAndExecuteCommand(config);
  }

  private static async buildAndExecuteCommand(config: PlaywrightOptions): Promise<string> {
    const { env, mode, projects, tags } = config;

    let command = `ENV=${env} npx playwright test --config=playwright.config.ts`;

    if (mode === Mode.UI) {
      command += ' --ui';
    }

    if (projects && projects.length > 0) {
      projects.forEach(project => {
        command += ` --project=${project}`;
      });
    }

    if (tags && tags.length > 0) {
      const tagExpression = tags.map(tag => `${tag}`).join('|');
      command += ` --grep="${tagExpression}"`;
    }

    console.log(`\n🚀 Launching tests:\n🔧 ${command}\n`);
    await executeCommand(command);
    return command;
  }
}
