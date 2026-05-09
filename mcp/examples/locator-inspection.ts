import { chromium } from 'playwright';
import { debugLocator } from '../locator-debugger';

async function inspectLocators() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com');

  const results = await Promise.all([
    debugLocator(page, '#user-name'),
    debugLocator(page, '#password'),
    debugLocator(page, '#login-button'),
    debugLocator(page, '.login_logo'),
    debugLocator(page, '[data-test="error"]'),
  ]);

  for (const result of results) {
    console.log(`\nSelector: ${result.selector}`);
    console.log(`  Exists: ${result.exists}, Visible: ${result.visible}, Count: ${result.count}`);
    console.log(`  Tag: ${result.tagName}, Text: ${result.text?.slice(0, 60)}`);
    if (result.boundingBox) {
      console.log(`  Box: x=${result.boundingBox.x}, y=${result.boundingBox.y}`);
    }
  }

  await browser.close();
}

inspectLocators().catch(console.error);
