import { TestConfig } from '../../config/ConfigManager';
import { LoadState } from '../../core/extensions/playwright-options';
import { Page, step, TestBase } from '../../core/TestBase';
import { Language } from '../../data/Languages';

export class Portal {
  constructor(
    private testBase: TestBase,
    private page: Page = testBase.page,
    private config: TestConfig = testBase.config,
    private locale: Language = testBase.locale,
    private languageManager = testBase.languageManager
  ) {}

  @step('Open portal')
  async openPortal(): Promise<void> {
    await this.page.goto(this.config.PORTAL_URL);
    await this.page.waitForLoadState(LoadState.LOAD);
  }
}
