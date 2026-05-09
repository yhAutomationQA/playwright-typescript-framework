import { chromium } from 'playwright';
import { startTracing, stopTracing } from '../trace-collector';

async function debugWithTrace() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await startTracing(context, './mcp-output', 'login-flow');

  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL('**/inventory.html');

  const tracePath = await stopTracing(context, './mcp-output', 'login-flow');
  console.log(`Trace saved: ${tracePath}`);
  console.log(`View with: npx playwright show-trace ${tracePath}`);

  await browser.close();
}

debugWithTrace().catch(console.error);
