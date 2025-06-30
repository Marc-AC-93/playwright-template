import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

const REPORT_DIR = 'custom-report';
const DEFAULT_ENV_VALUE = 'unknown';

interface TestInfo {
  title: string;
  status: string;
  timestamp: string;
  browser: string;
  testPath: string;
  describeTitle: string;
}

interface EnvironmentInfo {
  env: string;
}

/** Custom reporter for Playwright that generates a formatted text report */
class CustomTextReporter implements Reporter {
  private static isHeaderWritten = false;
  private envInfo = '';
  private outputFile: string;

  /**
   * Initializes the reporter with the output file name
   */
  constructor() {
    this.outputFile = this.getOutputFileName();
  }

  /**
   * Handles the test end event and logs the result
   * @param test The test case that finished
   * @param result The result of the test execution
   */
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'skipped') {
      return;
    }

    this.ensureHeaderWritten();

    const testInfo = {
      title: test.title,
      status: result.status,
      timestamp: new Date().toISOString(),
      browser: this.getBrowser(test),
      testPath: this.getTestPath(test),
      describeTitle: this.getDescribeTitle(test),
    };

    this.writeResultToFile(testInfo);
  }

  /**
   * Extracts the browser name from the test title path
   * @param test The test case to extract browser from
   * @returns The browser name or empty string if not found
   */
  private getBrowser(test: TestCase): string {
    const titlePath = test.titlePath();
    return titlePath[0] || '';
  }

  /**
   * Extracts the test file path from the test title path
   * @param test The test case to extract path from
   * @returns The test file path or empty string if not found
   */
  private getTestPath(test: TestCase): string {
    const titlePath = test.titlePath();
    return titlePath.length > 1 ? titlePath[1] : '';
  }

  /**
   * Extracts the describe block title from the test title path
   * @param test The test case to extract describe title from
   * @returns The describe title or empty string if not found
   */
  private getDescribeTitle(test: TestCase): string {
    const titlePath = test.titlePath();
    return titlePath.length > 1 ? titlePath[titlePath.length - 2] : '';
  }

  /**
   * Writes the test result to the output file in the specified format
   * @param testResult The test result information to write
   */
  private writeResultToFile(testResult: TestInfo): void {
    try {
      const outputFile = this.getOutputFilePath();

      const pathParts = [testResult.browser, testResult.testPath, testResult.describeTitle]
        .filter(Boolean)
        .join('] [');

      const content = [
        `${testResult.timestamp}`,
        `[${testResult.status.toUpperCase()}]`,
        `[${pathParts}]`,
        testResult.title,
      ].join(' ');

      fs.appendFileSync(outputFile, content + '\n', 'utf-8');
    } catch (error) {
      console.error('Error writing test result to file:', error);
    }
  }

  /**
   * Ensures the report header is written to the output file
   */
  private ensureHeaderWritten(): void {
    if (CustomTextReporter.isHeaderWritten) return;

    const outputFile = this.getOutputFilePath();
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    this.initializeEnvironmentInfo();

    const contentWidth = Math.max(
      'PLAYWRIGHT TEST EXECUTION REPORT'.length,
      `Environment: ${this.envInfo}`.length,
      `Timestamp:   ${timestamp}`.length
    );

    const horizontalLine = '═'.repeat(contentWidth + 6);
    const header = `================================================================================

╔${horizontalLine}╗
║   ${'PLAYWRIGHT TEST EXECUTION REPORT'.padEnd(contentWidth)}   ║
╠${horizontalLine}╣
║   Environment: ${this.envInfo.padEnd(contentWidth - 'Environment: '.length)}   ║
║   Timestamp:   ${timestamp.padEnd(contentWidth - 'Timestamp:   '.length)}   ║
╚${horizontalLine}╝\n
`;

    if (fs.existsSync(outputFile)) {
      fs.appendFileSync(outputFile, `${header}`, 'utf-8');
    } else {
      fs.writeFileSync(outputFile, header, 'utf-8');
    }

    CustomTextReporter.isHeaderWritten = true;
  }

  /**
   * Gets the full output file path
   * @returns The absolute path to the output file
   */
  private getOutputFilePath(): string {
    return path.join(process.cwd(), this.outputFile);
  }

  /**
   * Generates the output file name based on environment variables
   * @returns The output file name with path
   */
  private getOutputFileName(): string {
    const { env } = this.getEnvironmentInfo();
    this.envInfo = `[${env.toUpperCase()}]`;

    const dir = path.join(process.cwd(), REPORT_DIR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return path.join(REPORT_DIR, `${env}-report.txt`);
  }

  /**
   * Gets environment information from process environment variables
   * @returns Environment information object
   */
  private getEnvironmentInfo(): EnvironmentInfo {
    const env = process.env.ENV || DEFAULT_ENV_VALUE;
    return { env };
  }

  /**
   * Initializes the environment information string
   */
  private initializeEnvironmentInfo(): void {
    const { env } = this.getEnvironmentInfo();
    this.envInfo = `${env.toUpperCase()}`;
  }
}

export default CustomTextReporter;
