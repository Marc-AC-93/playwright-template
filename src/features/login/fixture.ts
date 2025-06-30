import { mergeTests } from '@playwright/test';
import { test as testBaseFixture } from '../../common/fixtures/baseFixtures';

export const test = mergeTests(testBaseFixture);

//example
/*
type MyFixtures = {
  testBase: TestBase;
  portal: Portal;
};

export const test = mergeTests(
  testBaseFixture,
  testBaseFixture.extend<MyFixtures>({
    portal: async ({ testBase }, use) => {
      const portal = new Portal(testBase);
      await use(portal);
    },
  })
);
*/
