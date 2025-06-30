import { BrowserContext, Download, Locator, Page, TestInfo, expect } from '@playwright/test';
import { ConfigManager } from '../../config/ConfigManager';

/**
 * Abstract base class providing common page interaction methods for Playwright tests.
 * Extend this class to create page objects following the Page Object Model (POM) pattern.
 */
export abstract class BasePage {
  private readonly redirectTimeOut: number;

  /**
   * Creates a new BasePage instance
   * @param page - Playwright Page instance for the current test
   * @param context - Playwright BrowserContext for managing browser sessions
   */
  constructor(
    public readonly page: Page,
    public readonly context: BrowserContext,
    public readonly testInfo: TestInfo
  ) {
    this.redirectTimeOut = ConfigManager.getInstance().config.REDIRECT_TIMEOUT;
  }

  /**
   * Initiates a file download by clicking an element and returns the download object
   * @param element - Playwright Locator of the element that triggers the download
   * @returns Promise that resolves with the Download object
   * @throws Will throw if the element is not visible or download doesn't start
   */
  public async downloadFile(element: Locator): Promise<Download> {
    await element.waitFor({ state: 'visible' });
    const downloadPromise = this.page.waitForEvent('download');
    await element.click();
    const download = await downloadPromise;
    return download;
  }

  /**
   * Waits for an element's attribute to match the expected value
   * @param element - Playwright Locator of the element to check
   * @param attribute - Name of the attribute to validate
   * @param newValue - Expected value of the attribute
   * @returns Promise that resolves when the attribute matches the expected value
   * @throws Will throw if the assertion fails or times out
   */
  async waitForAttributeToChange(
    element: Locator,
    attribute: string,
    newValue: string
  ): Promise<void> {
    await expect(element).toHaveAttribute(attribute, newValue);
  }

  /**
   * Waits for an element to be enabled (not disabled)
   * @param element The locator of the element to wait for
   * @param timeout Time to wait in milliseconds (default: 20 seconds)
   */
  async waitUntilElementIsEnabled(element: Locator, timeout: number = 20000): Promise<void> {
    await element.waitFor({ state: 'visible', timeout });

    const checkInterval = 100;

    while (timeout > 0) {
      const isDisabled = await element.getAttribute('disabled');
      const isAriaDisabled = await element.getAttribute('aria-disabled');
      const hasDisabledClass = await element.evaluate(el => el.classList.contains('disabled'));

      if (!isDisabled && isAriaDisabled !== 'true' && !hasDisabledClass) {
        return;
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));
      timeout -= checkInterval;
    }

    throw new Error(`Element was not enabled after ${timeout} ms`);
  }
}
