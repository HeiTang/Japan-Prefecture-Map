import { expect, test } from '@playwright/test';

test('renders the complete SSR demo without client-side JavaScript', async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ssr.html');

  await expect(page.locator('script')).toHaveCount(0);
  await expect(page.locator('japan-prefecture-map')).toHaveCount(0);
  await expect(page.locator('.renderer-choice')).toHaveCount(3);
  await expect(page.locator('#route-editor')).toHaveAttribute('href', './');
  await expect(page.locator('#route-component')).toHaveAttribute('href', './component.html');
  await expect(page.locator('#route-static')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#github-link')).toHaveAttribute('href', 'https://github.com/HeiTang/Japan-Prefecture-Map');
  await expect(page.locator('#editor-static-cta')).toHaveAttribute('href', './?path=static');
  await expect(page.locator('.hero-actions a[href="#recipes"]')).toHaveCSS('color', 'rgb(141, 224, 189)');
  const componentConversionLink = page.locator('.conversion-actions a[href="./component.html"]');
  await expect(componentConversionLink).toHaveCSS('color', 'rgb(241, 246, 252)');
  await componentConversionLink.hover();
  await expect(componentConversionLink).toHaveCSS('color', 'rgb(255, 154, 111)');
  await expect(page.locator('.site-footer')).toHaveText('Copyright © 2026 HeiTang · Based on JapanEx · MIT License');
  await expect(page.locator('#footer-source')).toHaveAttribute('href', 'https://github.com/ukyouz/JapanEx');
  const routeTops = await page.locator('.route-switcher a').evaluateAll(links => links.map(link => Math.round(link.getBoundingClientRect().top)));
  expect(new Set(routeTops).size).toBe(1);
  await expect(page.locator('#ssr-widget-styles')).toHaveCount(1);
  await expect(page.locator('#ssr-widget-output .jpm-widget')).toBeVisible();
  await expect(page.locator('#ssr-widget-output .japan-map')).toHaveCount(1);
  await expect(page.locator('#ssr-map-output .japan-map')).toHaveCount(1);
  await expect(page.locator('#ssr-widget-output [data-code="34"]')).toHaveAttribute('data-level', '4');
  await expect(page.locator('#ssr-map-output [data-code="47"]')).toHaveAttribute('data-level', '5');
  await expect(page.locator('.jpm-legend-item')).toHaveCount(12);
  await expect(page.locator('#ssr-widget-output .jpm-credit')).toContainText('Made by HeiTang');

  const ids = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id));
  expect(new Set(ids).size).toBe(ids.length);

  const unresolvedLabels = await page.locator('svg[aria-labelledby]').evaluateAll(maps => maps
    .filter(map => map.getAttribute('aria-labelledby')?.split(' ').some(id => !document.getElementById(id)))
    .map(map => map.getAttribute('aria-labelledby')),
  );
  expect(unresolvedLabels).toEqual([]);

  await expect(page.locator('#ssr-legend-output details')).toHaveAttribute('open', '');
  await page.locator('#ssr-legend-output summary').press('Enter');
  await expect(page.locator('#ssr-legend-output details')).not.toHaveAttribute('open', '');

  await expect(page.locator('#widget-recipe')).toHaveAttribute('open', '');
  await expect(page.locator('#map-recipe')).not.toHaveAttribute('open', '');
  await page.locator('#map-recipe summary').press('Enter');
  await expect(page.locator('#map-recipe')).toHaveAttribute('open', '');
  await expect(page.locator('#map-recipe pre')).toContainText('renderMap(levels');
  await expect(page.locator('#style-guide pre')).toContainText('--jpm-level-4');
  await page.locator('#id-prefix-guide summary').press('Enter');
  await expect(page.locator('#id-prefix-guide')).toHaveAttribute('open', '');
  await expect(page.locator('#id-prefix-guide pre')).toContainText("idPrefix: 'home-map'");
  await page.locator('#light-dom-guide summary').press('Enter');
  await expect(page.locator('#light-dom-guide')).toHaveAttribute('open', '');
  await expect(page.locator('#light-dom-guide pre')).toContainText(':global(.jpm-widget)');
  await expect(page.locator('#light-dom-guide pre')).toContainText(':global(.jpm-map-stage)');

  const levelFourFill = await page.locator('#ssr-widget-output [data-code="34"]').evaluate(element => getComputedStyle(element).fill);
  expect(levelFourFill).toBe('rgb(246, 111, 65)');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const staticPage = await staticContext.newPage();
    const response = await staticPage.goto('http://127.0.0.1:4173/ssr.html');
    expect(response).not.toBeNull();
    const html = await response!.text();
    expect(html).not.toMatch(/<script\b|\son[a-z]+\s*=/i);
    await expect(staticPage.locator('#ssr-widget-output .jpm-widget')).toBeVisible();
    await expect(staticPage.locator('#ssr-legend-output details')).toHaveAttribute('open', '');
  } finally {
    await staticContext.close();
  }
});
