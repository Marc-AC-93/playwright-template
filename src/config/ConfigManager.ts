import { Env } from '../data/Envs';

export interface TestConfig {
  ENV: Env;
  PORTAL_URL: string;
  API_URL: string;
  REDIRECT_TIMEOUT: number;
}

export class ConfigManager {
  private static instance: ConfigManager;
  public config: TestConfig;

  private constructor() {
    this.config = this.loadAndValidateConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadAndValidateConfig(): TestConfig {
    const env = process.env.ENV;
    const portalUrl = process.env.PORTAL_URL;
    const apiUrl = process.env.API_URL;
    const redirectTimeout = process.env.REDIRECT_TIMEOUT;

    const config = {
      ENV: env as Env,
      PORTAL_URL: portalUrl as string,
      API_URL: apiUrl as string,
      REDIRECT_TIMEOUT: Number(redirectTimeout),
    };

    this.validateConfig(config);
    return config;
  }

  private validateConfig(config: TestConfig): void {
    if (!config.PORTAL_URL || !config.API_URL || !config.ENV) {
      throw new Error(`Required configuration missing:
                · BASE_URL: ${config.PORTAL_URL}
                · BACKEND_URL: ${config.API_URL}
                · ENV: ${config.ENV}`);
    }

    const emptyFields = Object.entries(config)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      const missingFields = emptyFields
        .map(field => `    · ${field}: ${process.env[field.toUpperCase()] ?? 'null'}`)
        .join('\n');
      throw new Error(`Required configuration missing:\n${missingFields}`);
    }
  }
}
