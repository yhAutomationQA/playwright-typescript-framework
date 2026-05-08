import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { ApiHelper } from '../helpers/api-helper';
import { ApiClient } from '../helpers/api-client';
import { config } from '../config/env-manager';
import { testData } from '../utils/test-data';

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  apiHelper: ApiHelper;
  apiClient: ApiClient;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
    await page.evaluate('localStorage.clear()');
    await page.context().clearCookies();
  },

  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    await page.goto('/cart.html', { waitUntil: 'networkidle' });
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  apiHelper: async ({ request }, use) => {
    const api = new ApiHelper(request);
    await use(api);
  },

  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request, config.apiBaseUrl);
    await use(client);
  },
});

export { expect };
