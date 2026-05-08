import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly addToCartButtons: Locator;
  private readonly removeButtons: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
    this.removeButtons = page.locator('button[data-test^="remove"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  async getItemCount(): Promise<number> {
    return this.getCount(this.inventoryItems);
  }

  async getItemNames(): Promise<string[]> {
    return this.getTexts(this.itemNames);
  }

  async addItemToCart(itemName: string): Promise<void> {
    const container = this.inventoryItems.filter({ hasText: itemName });
    await this.click(container.locator('button[data-test^="add-to-cart"]'));
  }

  async removeItem(itemName: string): Promise<void> {
    const container = this.inventoryItems.filter({ hasText: itemName });
    await this.click(container.locator('button[data-test^="remove"]'));
  }

  async getCartCount(): Promise<number> {
    const count = await this.cartBadge.count();
    return count === 0 ? 0 : parseInt(await this.getText(this.cartBadge), 10);
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }

  async sortBy(option: string): Promise<void> {
    await this.selectOption(this.sortDropdown, option);
  }
}
