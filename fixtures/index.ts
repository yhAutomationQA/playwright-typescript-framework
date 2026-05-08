import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ApiHelper } from '../helpers/api-helper';

type MyFixtures = {
  loginPage: LoginPage;
  apiHelper: ApiHelper;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
    await page.evaluate('localStorage.clear()');
    await page.context().clearCookies();
  },

  apiHelper: async ({ request }, use) => {
    const api = new ApiHelper(request);
    await use(api);
  },
});

export { expect } from '@playwright/test';
