import { test as base } from '@playwright/test';
import { TestBase } from '../../core/TestBase';
import { Portal } from '../pages/PortalPage';

export interface BaseFixtures {
  testBase: TestBase;
  portal: Portal;
}

export const test = base.extend<BaseFixtures>({
  testBase: async ({ page, context }, use, testInfo) => {
    const testBase = new TestBase(page, context, testInfo);
    test.info().annotations.push({ type: 'ENV', description: testBase.config.ENV });
    await use(testBase);
  },
  portal: async ({ testBase }, use) => {
    const portal = new Portal(testBase);
    await use(portal);
  },
});
