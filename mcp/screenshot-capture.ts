import path from 'path';
import { Page } from 'playwright';
import { logger } from '../utils/logger';

export async function takeScreenshot(page: Page, outputDir: string, name: string): Promise<string> {
  const screenshotDir = path.join(outputDir, 'screenshots');
  const screenshotPath = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  logger.info({ screenshotPath }, 'screenshot saved');
  return screenshotPath;
}

export async function takeElementScreenshot(
  page: Page,
  selector: string,
  outputDir: string,
  name: string,
): Promise<string> {
  const screenshotDir = path.join(outputDir, 'screenshots');
  const screenshotPath = path.join(screenshotDir, `${name}.png`);
  const element = page.locator(selector);
  await element.screenshot({ path: screenshotPath });
  logger.info({ screenshotPath, selector }, 'element screenshot saved');
  return screenshotPath;
}
