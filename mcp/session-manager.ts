import { chromium, firefox, webkit, Browser, BrowserContext, BrowserType } from 'playwright-core';
import { logger } from '../utils/logger';
import type { McpSettings } from './config';

const browsers: Record<string, BrowserType> = { chromium, firefox, webkit };

export class McpSessionManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private settings: McpSettings;

  constructor(settings: McpSettings) {
    this.settings = settings;
  }

  async launch(): Promise<BrowserContext> {
    const browserType = browsers[this.settings.browser];
    if (!browserType) {
      throw new Error(`Unsupported browser: ${this.settings.browser}`);
    }

    logger.info({ browser: this.settings.browser, headless: this.settings.headless }, 'launching MCP browser');

    this.browser = await browserType.launch({
      headless: this.settings.headless,
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    return this.context;
  }

  async getOrCreateContext(): Promise<BrowserContext> {
    if (this.context) return this.context;
    return this.launch();
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close().catch(() => {});
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
    logger.info('MCP browser session closed');
  }
}
