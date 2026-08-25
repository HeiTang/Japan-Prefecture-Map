import { expect, test } from '@playwright/test';

test('keeps the product header height and content width consistent across routes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const headerHeights: number[] = [];
  const contentWidths: number[] = [];
  for (const route of ['/', '/component.html', '/ssr.html']) {
    await page.goto(route);
    headerHeights.push(await page.locator('.site-header').evaluate(element => Math.round(element.getBoundingClientRect().height)));
    contentWidths.push(await page.locator('.shell').evaluate(element => Math.round(element.getBoundingClientRect().width)));
  }

  expect(new Set(headerHeights).size).toBe(1);
  expect(new Set(contentWidths).size).toBe(1);
});
