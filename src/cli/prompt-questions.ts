import inquirer from 'inquirer';
import { Env } from '../data/Envs';
import { TestTags } from '../data/TestTags';
import { Mode, PlaywrightOptions, Projects } from './command-builder';

/**
 * Class responsible for handling interactive prompts
 */
export class PromptQuestions {
  /**
   * Prompt for all test configuration options
   */
  static async promptAllOptions(): Promise<PlaywrightOptions> {
    const env = await this.promptEnv();
    const mode = await this.promptMode();
    const projects = await this.promptProjects();
    const tags = await this.promptTags();

    return { env, mode, projects, tags };
  }

  /**
   * Prompt for environment selection
   */
  static async promptEnv(): Promise<Env> {
    const question = {
      type: 'list' as const,
      name: 'env',
      message: 'Select an environment:',
      choices: Object.values(Env),
    };
    const answer = await inquirer.prompt(question);
    return answer.env;
  }

  /**
   * Prompt for execution mode selection
   */
  static async promptMode(): Promise<Mode> {
    const question = {
      type: 'list' as const,
      name: 'mode',
      message: 'Select execution mode:',
      choices: Object.values(Mode),
    };
    const answer = await inquirer.prompt(question);
    return answer.mode as Mode;
  }

  /**
   * Prompt for projects selection
   */
  static async promptProjects(): Promise<string[]> {
    const question = {
      type: 'checkbox' as const,
      name: 'projects',
      message: 'Select projects:',
      choices: Object.values(Projects),
    };
    const answer = await inquirer.prompt(question);
    return answer.projects || [];
  }

  /**
   * Prompt for test tags selection
   */
  static async promptTags(): Promise<TestTags[]> {
    const question = {
      type: 'checkbox' as const,
      name: 'tags',
      message: 'Select tags:',
      choices: Object.values(TestTags),
    };
    const answer = await inquirer.prompt(question);
    return answer.tags || [];
  }
}
