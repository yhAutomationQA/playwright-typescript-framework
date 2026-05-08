import { test, expect } from '../../fixtures';
import { testData } from '../../utils/test-data';

test.describe('SauceDemo Inventory', () => {
  test('should display inventory items after login', async ({ inventoryPage }) => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBeGreaterThan(0);

    const names = await inventoryPage.getItemNames();
    expect(names).toContain(testData.inventoryItem.name);
  });

  test('should add item to cart and update badge', async ({ inventoryPage }) => {
    expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addItemToCart(testData.inventoryItem.name);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('should remove item from cart and update badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(testData.inventoryItem.name);
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeItem(testData.inventoryItem.name);
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('should navigate to cart page from inventory', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart(testData.inventoryItem.name);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart\.html/);
  });
});
