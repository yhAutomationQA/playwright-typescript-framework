import { Page, Locator } from '@playwright/test';

export async function waitForPageStable(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

export async function waitAndClick(locator: Locator, timeout = 10000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.click();
}

export async function waitAndFill(locator: Locator, text: string, timeout = 10000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.fill(text);
}

export async function waitForUrl(page: Page, url: string, timeout = 10000): Promise<void> {
  await page.waitForURL(url, { timeout });
}

export async function waitForResponse(page: Page, urlPattern: string | RegExp, timeout = 10000) {
  return page.waitForResponse(urlPattern, { timeout });
}
