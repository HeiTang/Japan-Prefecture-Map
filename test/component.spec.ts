import { expect, test } from '@playwright/test';

test('updates the Web Component at runtime without rebuilding the page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/component.html');

  const preview = page.locator('#component-preview');
  await expect(page.locator('script[type="module"][src="./dist/component-demo.js"]')).toHaveCount(1);
  await expect(page.locator('#route-editor')).toHaveAttribute('href', './');
  await expect(page.locator('#route-component')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#route-static')).toHaveAttribute('href', './ssr.html');
  await expect(page.locator('#github-link')).toHaveAttribute('href', 'https://github.com/HeiTang/Japan-Prefecture-Map');
  const staticHeroLink = page.locator('.hero-actions a[href="./ssr.html"]');
  const staticConversionLink = page.locator('.conversion-actions a[href="./ssr.html"]');
  await expect(staticHeroLink).toHaveCSS('color', 'rgb(247, 248, 250)');
  await expect(staticConversionLink).toHaveCSS('color', 'rgb(247, 248, 250)');
  await staticHeroLink.hover();
  await expect(staticHeroLink).toHaveCSS('color', 'rgb(141, 224, 189)');
  await staticConversionLink.hover();
  await expect(staticConversionLink).toHaveCSS('color', 'rgb(141, 224, 189)');
  const routeTops = await page.locator('.route-switcher a').evaluateAll(links => links.map(link => Math.round(link.getBoundingClientRect().top)));
  expect(new Set(routeTops).size).toBe(1);
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelectorAll('.jpm-prefecture').length)).toBe(47);
  await expect(page.locator('#preset-weekend')).toHaveAttribute('aria-pressed', 'true');

  await page.click('#preset-all');
  const allLevels = { '01': 1, '13': 3, '27': 4, '34': 4, '47': 5 };
  await expect.poll(async () => JSON.parse((await preview.getAttribute('levels')) ?? '{}')).toEqual(allLevels);
  await expect.poll(() => page.locator('#runtime-state').evaluate(element => JSON.parse((element as HTMLOutputElement).value))).toEqual(allLevels);
  await expect(page.locator('.preset-fieldset legend')).toHaveText('旅行資料 preset');
  await expect(page.locator('#runtime-status')).toHaveText('已套用「混合等級」。');
  await expect(page.locator('#preset-all')).toHaveAttribute('aria-pressed', 'true');

  await page.click('#level-tokyo');
  await expect.poll(async () => JSON.parse((await preview.getAttribute('levels')) ?? '{}')).toEqual({ ...allLevels, '13': 4 });
  await expect(page.locator('#preset-all')).toHaveAttribute('aria-pressed', 'false');

  await page.selectOption('#component-locale', 'en');
  await expect(page.locator('label[for="component-locale"]')).toHaveText('地圖語言');
  await expect(preview).toHaveAttribute('locale', 'en');
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.jpm-widget')?.getAttribute('lang'))).toBe('en');
  await expect(page.locator('#runtime-status')).toHaveText('地圖語言已切換為 English。');

  await page.selectOption('#component-theme', 'light');
  await expect(preview).toHaveAttribute('theme', 'light');
  await expect(page.locator('#component-style-guide')).toHaveAttribute('open', '');
  await expect(page.locator('#component-style-guide pre')).toContainText('--jpm-accent');
  await expect(page.locator('#component-style-guide pre')).toContainText('::part(summary)');
  await expect(page.locator('#component-style-guide a[href="https://github.com/HeiTang/Japan-Prefecture-Map/blob/main/docs/styling.md"]')).toHaveAttribute('href', 'https://github.com/HeiTang/Japan-Prefecture-Map/blob/main/docs/styling.md');
  await expect(page.locator('#editor-component-cta')).toHaveAttribute('href', './?path=component');
  await expect(page.locator('.site-footer')).toHaveText('Copyright © 2026 HeiTang · Based on JapanEx · MIT License');
  await expect(page.locator('#footer-source')).toHaveAttribute('href', 'https://github.com/ukyouz/JapanEx');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});
