import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(url: string): Promise<void> {
    logger.info({ url }, 'navigating');
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async click(locator: Locator): Promise<void> {
    logger.debug({ selector: locator.toString() }, 'clicking element');
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    logger.debug({ selector: locator.toString(), textLength: text.length }, 'filling element');
    await locator.fill(text);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  async getText(locator: Locator): Promise<string> {
    return locator.innerText();
  }

  async getTexts(locator: Locator): Promise<string[]> {
    return locator.allInnerTexts();
  }

  async getAttribute(locator: Locator, name: string): Promise<string | null> {
    return locator.getAttribute(name);
  }

  async getCount(locator: Locator): Promise<number> {
    return locator.count();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isHidden(locator: Locator): Promise<boolean> {
    return locator.isHidden();
  }

  async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForUrl(url: string | RegExp, timeout = 10000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }
}
