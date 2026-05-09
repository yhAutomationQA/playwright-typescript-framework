import { Page } from 'playwright-core';

export interface LocatorDebugResult {
  selector: string;
  exists: boolean;
  visible: boolean;
  count: number;
  text: string | null;
  tagName: string | null;
  attributes: Record<string, string>;
  boundingBox: { x: number; y: number; width: number; height: number } | null;
}

export async function debugLocator(page: Page, selector: string): Promise<LocatorDebugResult> {
  const locator = page.locator(selector);
  const count = await locator.count();

  if (count === 0) {
    return {
      selector,
      exists: false,
      visible: false,
      count: 0,
      text: null,
      tagName: null,
      attributes: {},
      boundingBox: null,
    };
  }

  const first = locator.first();
  const [visible, text, tagName, attrs, boundingBox] = await Promise.all([
    first.isVisible().catch(() => false),
    first.textContent().catch(() => null),
    first.evaluate((el: Element) => el.tagName.toLowerCase()).catch(() => null),
    first.evaluate((el: Element) => {
      const result: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        result[attr.name] = attr.value;
      }
      return result;
    }).catch(() => ({})),
    first.boundingBox().catch(() => null),
  ]);

  return {
    selector,
    exists: true,
    visible,
    count,
    text: text ? text.slice(0, 500) : null,
    tagName,
    attributes: attrs,
    boundingBox,
  };
}
