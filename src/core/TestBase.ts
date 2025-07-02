import { BrowserContext, Page, TestInfo, test } from '@playwright/test';
import { ConfigManager, TestConfig } from '../config/ConfigManager';
import { Language } from '../data/Languages';
import { BasePage } from './extensions/BasePage';
import { LanguageManager } from './extensions/language-manager';

export class TestBase extends BasePage {
  readonly config: Readonly<TestConfig>;

  constructor(
    page: Page,
    context: BrowserContext,
    worker: TestInfo,
    public readonly isMobile: boolean = worker.project.name.toLocaleLowerCase().includes('mobile'),
    public readonly browser: string = worker.project.name.toLocaleLowerCase(),
    public readonly browserLanguage: Language = worker.project.use.locale as Language,
    public readonly locale: Language = worker.project.use.locale as Language,
    public languageManager: LanguageManager = LanguageManager.getInstance()
  ) {
    super(page, context, worker);
    this.config = ConfigManager.getInstance().config;
    const language = this.locale || Language.EN;
    this.languageManager.setLanguage(language);
  }
}

export function step(name: string) {
  return function decorator(target: Function) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function replacementMethod(this: any, ...methodArgs: any) {
      const paramMatch = target.toString().match(/\(([^)]*)\)/);
      const paramNames = paramMatch ? paramMatch[1].split(',').map(param => param.trim()) : [];
      let stepName = name;
      paramNames.forEach((paramName, index) => {
        stepName = stepName.replace(`{${paramName}}`, methodArgs[index]);
      });
      return test.step(stepName, async () => {
        return await target.call(this, ...methodArgs);
      });
    };
  };
}

export { BrowserContext, Locator, Page, expect } from '@playwright/test';
