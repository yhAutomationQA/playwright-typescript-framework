import { Page } from 'playwright-core';

export interface PageSnapshot {
  url: string;
  title: string;
  textContent: string;
  visibleElements: string;
  viewport: { width: number; height: number };
}

export async function extractSnapshot(page: Page): Promise<PageSnapshot> {
  const visibleElements = await page.evaluate(() => {
    const elements: string[] = [];
    const allElements = document.querySelectorAll('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as unknown as Record<string, unknown>;
      const tagName = el.tagName as string;
      if (el.offsetParent !== null || tagName === 'INPUT' || tagName === 'BUTTON') {
        const text = ((el.textContent as string) || '').trim().slice(0, 100);
        const id = el.id ? `#${el.id}` : '';
        const className = el.className && typeof el.className === 'string' ? (el.className as string) : '';
        const classes = className ? `.${className.split(' ').filter(Boolean).join('.')}` : '';
        elements.push(`${tagName.toLowerCase()}${id}${classes} "${text}"`);
      }
    }
    return elements.slice(0, 200).join('\n');
  });

  const textContent = await page.locator('body').innerText();

  return {
    url: page.url(),
    title: await page.title(),
    textContent: textContent.slice(0, 10000),
    visibleElements,
    viewport: page.viewportSize() || { width: 1280, height: 720 },
  };
}
