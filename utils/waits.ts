import { Page, Locator } from '@playwright/test';

export async function waitForPageStable(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

export async function waitForUrl(page: Page, url: string | RegExp, timeout = 10000): Promise<void> {
  await page.waitForURL(url, { timeout });
}

export async function waitForResponse(page: Page, urlPattern: string | RegExp, timeout = 10000) {
  return page.waitForResponse(urlPattern, { timeout });
}

export async function waitForNavigation(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

export async function waitForElementState(
  locator: Locator,
  state: 'attached' | 'detached' | 'visible' | 'hidden',
  timeout = 10000,
): Promise<void> {
  await locator.waitFor({ state, timeout });
}
