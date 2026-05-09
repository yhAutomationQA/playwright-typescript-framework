import { chromium } from 'playwright';
import { config } from '../../config/env-manager';
import { testData } from '../../utils/test-data';
import { takeScreenshot } from '../screenshot-capture';
import { saveAuthState } from '../auth-reuse';
import { extractSnapshot } from '../page-snapshot';

async function loginWithSnapshot() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: config.baseUrl });
  const page = await context.newPage();

  await page.goto('/');
  const preLoginSnapshot = await extractSnapshot(page);
  console.log('Pre-login snapshot:', preLoginSnapshot.title);

  await page.fill('#user-name', testData.validUser.username);
  await page.fill('#password', testData.validUser.password);
  await page.click('#login-button');
  await page.waitForURL('**/inventory.html');

  await takeScreenshot(page, './mcp-output', 'login-success');
  await saveAuthState(context, './mcp-output', 'saucedemo');
  console.log('Login successful, state saved');

  await browser.close();
}

loginWithSnapshot().catch(console.error);
