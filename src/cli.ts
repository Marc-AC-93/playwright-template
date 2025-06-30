import { CommandBuilder } from './cli/command-builder';

/**
 * CLI class for handling command line arguments and interactive questions
 * for running Playwright tests
 */
export class CLI {
  private constructor() {}

  private static instance: CLI;

  /**
   * Get the singleton instance of the CLI class
   */
  static getInstance(): CLI {
    if (!CLI.instance) {
      CLI.instance = new CLI();
    }
    return CLI.instance;
  }

  /**
   * Run the CLI application
   */
  async run(): Promise<void> {
    await CommandBuilder.parseAndRun();
  }
}

const cli = CLI.getInstance();

if (require.main === module) {
  cli.run().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Unexpected error: ${errorMessage}\n`);
    process.exit(1);
  });
}
