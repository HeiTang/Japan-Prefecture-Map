import { expect, test } from '@playwright/test';

test('renders, edits, resets, and reports invalid input', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('#locale', 'zh-TW');

  const preview = page.locator('japan-prefecture-map');
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelectorAll('.jpm-prefecture').length)).toBe(47);
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.japan-map')?.getAttribute('role'))).toBe('group');
  await expect(page.locator('#controls #component-panel')).toHaveCount(0);
  await expect(page.locator('main > .embed-guide')).toHaveCount(1);
  await expect(page.locator('#route-editor')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#route-component')).toHaveAttribute('href', './component.html');
  await expect(page.locator('#route-static')).toHaveAttribute('href', './ssr.html');
  await page.locator('#route-static').hover();
  await expect(page.locator('#route-static')).toHaveCSS('color', 'rgb(141, 224, 189)');
  await expect(page.locator('#controls #locale')).toBeVisible();
  await expect(page.locator('.page-header #locale')).toHaveCount(0);
  await expect(page.locator('#locale-label')).toHaveText('地圖語言');
  await expect(page.locator('#map-settings-title')).toHaveText('地圖設定');
  await expect(page.locator('#controls > .map-settings')).toHaveCount(1);
  await expect(page.locator('#controls > #desktop-precision')).toHaveCount(1);
  await expect(page.locator('#level-list .level-item')).toHaveCount(6);
  await expect(page.locator('#level-list')).toContainText('未踏');
  await expect(page.locator('#reset')).toHaveAttribute('aria-label', '重設地圖等級');
  await expect(page.locator('#map-action-status')).toBeHidden();

  await preview.evaluate(element => {
    const prefecture = element.shadowRoot?.querySelector<SVGGElement>('[data-code="01"]');
    prefecture?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  });
  await expect(preview).toHaveAttribute('levels', '{"01":1}');
  await expect(page.locator('#markup')).toContainText('"01":1');

  const methods = [
    ['zh-TW', '同一都道府縣只記最高等級。'],
    ['ja', '各都道府県は最高レベルのみ記録します。'],
    ['en', 'Only the highest level is recorded for each prefecture.'],
  ] as const;
  for (const [locale, method] of methods) {
    await page.selectOption('#locale', locale);
    await expect(page.locator('.site-footer')).toHaveText('Copyright © 2026 HeiTang · Based on JapanEx · MIT License');
    await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.jpm-method')?.textContent)).toBe(method);
    await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.jpm-credit')?.textContent)).toBe('Made by HeiTang · Map geometry based on JapanEx (MIT)');
    await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.jpm-credit a[href="https://github.com/HeiTang"]')?.getAttribute('href'))).toBe('https://github.com/HeiTang');
    await expect(page.locator('#component-path-label')).toHaveText('互動式 Web Component');
    await expect(page.locator('#static-path-label')).toHaveText('Static HTML renderer');
    await expect(page.locator('#static-markup')).toContainText(`renderWidget(levels, '${locale}'`);
  }
  await page.selectOption('#theme', 'light');
  await expect(preview).toHaveAttribute('locale', 'en');
  await expect(preview).toHaveAttribute('theme', 'light');
  await expect(page.locator('#page-title')).toHaveText('Japan Prefecture Map');
  await expect(page.locator('#page-subtitle')).toHaveText('基於 JapanEx 延伸的可嵌入都道府縣地圖');
  await expect(page.locator('#locale-label')).toHaveText('地圖語言');
  await expect(page.locator('#theme-label')).toHaveText('地圖主題');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');
  await expect(page.locator('#level-list')).toContainText('Never visited');
  await expect(page.locator('#copy-static')).toHaveText('複製 Static HTML 程式碼');
  await expect(page.locator('#reset')).toHaveText('重設');
  await expect(page.locator('#export-image')).toHaveText('下載 PNG');
  await expect(page.locator('#github-link')).toHaveAttribute('href', 'https://github.com/HeiTang/Japan-Prefecture-Map');
  await expect(page.locator('.site-footer')).toHaveText('Copyright © 2026 HeiTang · Based on JapanEx · MIT License');
  await expect(page.locator('#footer-source')).toHaveAttribute('href', 'https://github.com/ukyouz/JapanEx');

  page.once('dialog', dialog => dialog.dismiss());
  await page.click('#reset');
  await expect(preview).toHaveAttribute('levels', '{"01":1}');

  page.once('dialog', dialog => dialog.accept());
  await page.click('#reset');
  await expect(preview).toHaveAttribute('levels', '{}');

  await preview.evaluate(element => element.setAttribute('levels', '{"01":9}'));
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('[role="alert"]')?.textContent)).toContain('Invalid levels');
});

test('applies appearance CSS to the current map and generates path-specific code', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('#preview');

  await expect(page.locator('#appearance-title')).toHaveText('外觀 CSS');
  await expect(page.locator('#appearance-controls')).not.toHaveAttribute('open', '');
  await page.locator('#appearance-controls summary').click();
  await expect(page.locator('#appearance-controls')).toHaveAttribute('open', '');
  await page.locator('#style-accent').evaluate((element, value) => {
    const input = element as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, '#58c9a2');
  await page.locator('#style-level-one').evaluate((element, value) => {
    const input = element as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, '#ead3cc');
  await page.locator('#style-level-two').evaluate((element, value) => {
    const input = element as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, '#d9a58f');
  await page.locator('#style-level-three').evaluate((element, value) => {
    const input = element as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, '#bd765e');
  await page.locator('#style-level-four').evaluate((element, value) => {
    const input = element as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, '#2a8f70');
  await page.locator('#style-level-five').evaluate((element, value) => {
    const input = element as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, '#17684e');
  await page.uncheck('#style-glow');
  await page.selectOption('#style-density', 'compact');
  await page.click('#static-path');
  await page.locator('#static-id-prefix').fill('travel-map-2');

  await expect.poll(() => preview.evaluate(element => getComputedStyle(element).getPropertyValue('--jpm-accent').trim())).toBe('#58c9a2');
  await expect.poll(() => preview.evaluate(element => getComputedStyle(element.shadowRoot?.querySelector('.jpm-summary') as Element).paddingTop)).toBe('16px');
  await expect(page.locator('#markup')).toContainText('--jpm-accent: #58c9a2;');
  await expect(page.locator('#markup')).toContainText('--jpm-level-1: #ead3cc;');
  await expect(page.locator('#markup')).toContainText('--jpm-level-2: #d9a58f;');
  await expect(page.locator('#markup')).toContainText('--jpm-level-3: #bd765e;');
  await expect(page.locator('#markup')).toContainText('--jpm-level-4: #2a8f70;');
  await expect(page.locator('#markup')).toContainText('--jpm-map-glow: none;');
  await expect(page.locator('#markup')).toContainText('.japan-travel-map::part(summary)');
  await expect(page.locator('#markup')).toContainText('class="japan-travel-map"');
  await expect(page.locator('#static-markup')).toContainText('--jpm-level-5: #17684e;');
  await expect(page.locator('#static-markup')).toContainText('.japan-travel-map :global(.jpm-summary)');
  await expect(page.locator('#static-markup')).toContainText('<div class="japan-travel-map"');
  await expect(page.locator('#static-markup')).toContainText("idPrefix: 'travel-map-2'");
});

test('keeps desktop precision controls and keyboard map editing usable', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('#preview');

  await expect(page.locator('#desktop-precision')).toBeVisible();
  await page.selectOption('#desktop-prefecture', '13');
  await page.selectOption('#desktop-level', '4');
  await expect(preview).toHaveAttribute('levels', '{"13":4}');

  const tokyo = preview.locator('[data-code="13"]');
  await tokyo.focus();
  await tokyo.press('Space');
  await expect(preview).toHaveAttribute('levels', '{"13":5}');
  await expect.poll(() => preview.evaluate(element => (element.shadowRoot?.activeElement as Element | null)?.getAttribute('data-code'))).toBe('13');
  await expect(page.locator('#map-action-status')).toContainText('東京 已設為 Level 5');
});

test('tracks successful copy and PNG downloads', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.selectOption('#locale', 'zh-TW');

  await page.evaluate(() => {
    const state = window as typeof window & {
      analyticsEvents?: unknown[][];
      clipboardWrites?: string[];
      exportedSvg?: string;
      gtag?: (...args: unknown[]) => void;
    };
    state.analyticsEvents = [];
    state.clipboardWrites = [];
    state.gtag = (...args) => state.analyticsEvents?.push(args);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => state.clipboardWrites?.push(text) } });
    const createObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = blob => {
      if (blob.type.startsWith('image/svg+xml')) void blob.text().then(text => { state.exportedSvg = text; });
      return createObjectURL(blob);
    };
  });

  await page.click('#copy');
  await expect(page.locator('#copy-status')).toHaveText('Web Component 程式碼已複製');
  await expect(page.locator('#embed-guide')).toHaveAttribute('data-integration-path', 'component');
  await expect(page.locator('#copy')).toHaveCSS('background-color', 'rgb(246, 111, 65)');
  await page.locator('#component-path').hover();
  await expect(page.locator('#component-path')).toHaveCSS('border-top-color', 'rgb(255, 154, 111)');
  await page.locator('#static-path').hover();
  await expect(page.locator('#static-path')).toHaveCSS('border-top-color', 'rgb(141, 224, 189)');

  await page.selectOption('#prefecture', '13');
  await page.selectOption('#mobile-level', '1');
  await page.selectOption('#prefecture', '27');
  await page.selectOption('#mobile-level', '1');

  await expect(page.locator('#component-panel')).toBeVisible();
  await expect(page.locator('#static-panel')).toBeHidden();
  await expect(page.locator('#component-demo-link')).toHaveAttribute('href', './component.html');
  await page.click('#static-path');
  await expect(page).toHaveURL(/\?path=static$/);
  await expect(page.locator('#component-path')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#static-path')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#embed-guide')).toHaveAttribute('data-integration-path', 'static');
  await expect(page.locator('#component-panel')).toBeHidden();
  await expect(page.locator('#static-panel')).toBeVisible();
  await expect(page.locator('#copy-static')).toHaveCSS('background-color', 'rgb(141, 224, 189)');
  await expect(page.locator('#static-demo-link')).toHaveCSS('color', 'rgb(141, 224, 189)');
  await expect(page.locator('#static-demo-link')).toHaveAttribute('href', './ssr.html');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  await page.click('#copy-static');
  await expect(page.locator('#static-copy-status')).toHaveText('Static HTML 程式碼已複製');
  const staticCode = await page.evaluate(() => (window as typeof window & { clipboardWrites?: string[] }).clipboardWrites?.at(-1) ?? '');
  expect(staticCode).toContain("import type { PrefectureLevels } from 'japan-prefecture-map/data';");
  expect(staticCode).toContain('const levels = {"13":1,"27":1} satisfies PrefectureLevels;');
  expect(staticCode).toContain("renderWidget(levels, 'zh-TW'");
  expect(staticCode).toContain('widgetStyles');
  expect(staticCode).toContain("theme: 'dark'");
  expect(staticCode).not.toContain('Made by <a href="https://github.com/HeiTang">HeiTang</a>');

  const downloadPromise = page.waitForEvent('download');
  await page.click('#export-image');
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('japan-prefecture-map.png');
  await expect(page.locator('#map-action-status')).toHaveText('圖片已下載');
  await expect.poll(() => page.evaluate(() => (window as typeof window & { exportedSvg?: string }).exportedSvg ?? '')).toContain('制縣等級');
  const exportedSvg = await page.evaluate(() => (window as typeof window & { exportedSvg?: string }).exportedSvg ?? '');
  expect(exportedSvg).toContain('已踏足');
  expect(exportedSvg).toContain('2 / 47');
  expect(exportedSvg).toContain('住宿以上');
  expect(exportedSvg).toContain('居住');
  expect(exportedSvg).toContain('Japan Prefecture Map');
  expect(exportedSvg).toContain('日本 47 都道府縣制縣圖');
  expect(exportedSvg).toContain('Level 0 · 未踏');
  expect(exportedSvg).toContain('github.com/HeiTang/Japan-Prefecture-Map');
  expect(exportedSvg).toContain('Based on JapanEx');
  expect(exportedSvg).not.toContain('© 2026 HeiTang');
  expect(exportedSvg).not.toContain('<line');

  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const png = Buffer.concat(chunks);
  expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  expect(png.length).toBeGreaterThan(50_000);
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(1500);

  const analyticsEvents = await page.evaluate(() => (window as typeof window & { analyticsEvents?: unknown[][] }).analyticsEvents);
  expect(analyticsEvents).toContainEqual(['event', 'copy_embed_code']);
  expect(analyticsEvents).toContainEqual(['event', 'select_static_path']);
  expect(analyticsEvents).toContainEqual(['event', 'copy_static_code']);
  expect(analyticsEvents).toContainEqual(['event', 'download_png']);
});

test('opens an integration path from the URL', async ({ page }) => {
  await page.goto('/?path=static');
  await expect(page.locator('#static-path')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#static-panel')).toBeVisible();
  await expect(page.locator('#embed-guide')).toHaveAttribute('data-integration-path', 'static');

  await page.click('#component-path');
  await expect(page).toHaveURL(/\?path=component$/);
  await expect(page.locator('#component-panel')).toBeVisible();
});

test('offers precise prefecture and level controls on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.selectOption('#locale', 'zh-TW');

  const preview = page.locator('japan-prefecture-map');
  const routeTops = await page.locator('.route-switcher a').evaluateAll(links => links.map(link => Math.round(link.getBoundingClientRect().top)));
  expect(new Set(routeTops).size).toBe(1);
  await expect(page.locator('#mobile-editor')).toBeVisible();
  await expect(page.locator('#desktop-precision')).toBeHidden();
  await page.selectOption('#prefecture', '13');
  await page.selectOption('#mobile-level', '4');

  await expect(preview).toHaveAttribute('levels', '{"13":4}');
  await expect(page.locator('#markup')).toContainText('"13":4');

  const clippedPrefectures = await preview.evaluate(element => {
    const widget = element.shadowRoot?.querySelector('.jpm-widget')?.getBoundingClientRect();
    if (!widget) return ['missing-widget'];

    return [...(element.shadowRoot?.querySelectorAll('.jpm-prefecture') ?? [])]
      .filter(prefecture => {
        const bounds = prefecture.getBoundingClientRect();
        return bounds.left < widget.left || bounds.right > widget.right;
      })
      .map(prefecture => prefecture.getAttribute('data-code'));
  });
  expect(clippedPrefectures).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('supports public properties and safe locale/theme fallbacks', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('japan-prefecture-map');

  await preview.evaluate(element => {
    const map = element as import('../src/index.js').JapanPrefectureMapElement;
    map.levels = { '01': 4, '13': 0 };
    map.locale = 'not-a-locale' as never;
    map.theme = 'not-a-theme' as never;
  });

  await expect(preview).toHaveAttribute('levels', '{"01":4}');
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.jpm-widget')?.getAttribute('lang'))).toBe('zh-TW');
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.jpm-widget')?.getAttribute('data-theme'))).toBe('auto');
  await expect(preview.locator('svg .jpm-prefecture[data-code="01"]')).toHaveAttribute('data-level', '4');
  await expect.poll(() => preview.evaluate(element => getComputedStyle(element.shadowRoot?.querySelector('.jpm-map-stage') ?? element).backgroundImage)).toContain('radial-gradient');

  await preview.evaluate(element => element.style.setProperty('--jpm-map-glow', 'none'));
  await expect.poll(() => preview.evaluate(element => getComputedStyle(element.shadowRoot?.querySelector('.jpm-map-stage') ?? element).backgroundImage)).toBe('none');
});

test('exposes every block through ::part for outside styling', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('japan-prefecture-map');

  const parts = await preview.evaluate(element =>
    [...(element.shadowRoot?.querySelectorAll('[part]') ?? [])].map(node => node.getAttribute('part')),
  );

  expect(parts).toEqual(['widget', 'summary', 'score', 'stats', 'map', 'legend']);

  await page.addStyleTag({ content: 'japan-prefecture-map::part(summary) { display: none }' });
  await expect.poll(() =>
    preview.evaluate(element => getComputedStyle(element.shadowRoot?.querySelector('.jpm-summary') as Element).display),
  ).toBe('none');
});
