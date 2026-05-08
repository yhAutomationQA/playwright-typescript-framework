import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly removeButtons: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.removeButtons = page.locator('button[data-test^="remove"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.getCount(this.cartItems);
  }

  async getItemNames(): Promise<string[]> {
    return this.getTexts(this.itemNames);
  }

  async removeItem(itemName: string): Promise<void> {
    const container = this.cartItems.filter({ hasText: itemName });
    await this.click(container.locator('button[data-test^="remove"]'));
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }
}
