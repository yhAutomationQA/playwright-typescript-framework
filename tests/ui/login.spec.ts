import { test, expect } from '../../fixtures';
import { testData } from '../../utils/test-data';

test.describe('SauceDemo Login', () => {
  test('should login successfully with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    await expect(page).toHaveURL(testData.inventoryUrl);
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.login(testData.lockedOutUser.username, testData.lockedOutUser.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(
      testData.invalidCredentials.username,
      testData.invalidCredentials.password,
    );
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });
});
