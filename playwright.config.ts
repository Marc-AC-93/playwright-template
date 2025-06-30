import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { Language } from './src/data/Languages';

process.env.DOTENV_KEY = '';
process.env.DOTENV_CONFIG_SILENT = 'true';

const env = process.env.ENV || 'local';
const envPath = path.resolve(__dirname, 'src/config/env', `${env.toLowerCase()}.env`);
require('dotenv').config({ path: envPath });

export default defineConfig({
  testDir: 'src/features',
  timeout: Number(process.env.TEST_TIMEOUT),
  expect: {
    timeout: 20000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: undefined,
  reporter: [
    ['html', { open: 'on-failure' }],
    ['list', { printSteps: false }],
    [
      'allure-playwright',
      {
        environmentInfo: {
          ENV: process.env.ENV,
        },
        resultsDir: 'allure-results',
      },
    ],
    ['./src/reporters/custom-reporter.ts'],
  ],
  globalSetup: require.resolve('./src/core/globalSetup'),
  use: {
    locale: Language.EN,
    trace: 'on',
    video: 'off',
    baseURL: process.env.PORTAL_URL,
  },

  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-site-isolation-trials',
            '--disable-features=IsolateOrigins,site-per-process',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-hang-monitor',
            '--disable-renderer-backgrounding',
            '--disable-web-security',
            '--disable-gpu',
          ],
          ignoreDefaultArgs: ['--enable-automation'],
        },
        acceptDownloads: true,
      },
    },
    {
      name: 'safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile_chrome',
      use: {
        ...devices['Pixel 5'],
        launchOptions: {
          args: [
            '--disable-site-isolation-trials',
            '--disable-features=IsolateOrigins,site-per-process',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-hang-monitor',
            '--disable-renderer-backgrounding',
            '--disable-web-security',
            '--disable-gpu',
          ],
          ignoreDefaultArgs: ['--enable-automation'],
        },
        acceptDownloads: true,
      },
    },
    {
      name: 'mobile_safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
