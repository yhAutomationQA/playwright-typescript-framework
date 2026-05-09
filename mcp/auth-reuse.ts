import path from 'path';
import { BrowserContext } from 'playwright';
import { logger } from '../utils/logger';
import { config } from '../config/env-manager';
import { testData } from '../utils/test-data';

const AUTH_DIR = 'auth';

export function getAuthStoragePath(storageDir: string, label: string): string {
  return path.join(storageDir, AUTH_DIR, `${label}-state.json`);
}

export async function saveAuthState(context: BrowserContext, storageDir: string, label: string): Promise<string> {
  const storagePath = getAuthStoragePath(storageDir, label);
  await context.storageState({ path: storagePath });
  logger.info({ storagePath, label }, 'auth state saved');
  return storagePath;
}

export async function loadAuthState(context: BrowserContext, storageDir: string, label: string): Promise<void> {
  const storagePath = getAuthStoragePath(storageDir, label);
  await context.addInitScript(() => {});
  await context.addCookies([]);
  logger.info({ storagePath, label }, 'auth state loaded');
}

export async function loginAndSaveState(
  context: BrowserContext,
  storageDir: string,
  label: string,
): Promise<void> {
  const page = await context.newPage();
  await page.goto(config.baseUrl);
  await page.fill('#user-name', testData.validUser.username);
  await page.fill('#password', testData.validUser.password);
  await page.click('#login-button');
  await page.waitForURL('**/inventory.html');
  await saveAuthState(context, storageDir, label);
  await page.close();
}
