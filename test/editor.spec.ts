import { expect, test } from '@playwright/test';

test('renders, edits, resets, and reports invalid input', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('#locale', 'zh-TW');

  const preview = page.locator('japan-prefecture-map');
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelectorAll('.prefecture').length)).toBe(47);
  await expect(page.locator('#level-list .level-item')).toHaveCount(6);
  await expect(page.locator('#level-list')).toContainText('未踏');

  await preview.evaluate(element => {
    const prefecture = element.shadowRoot?.querySelector<SVGGElement>('[data-code="01"]');
    prefecture?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  });
  await expect(preview).toHaveAttribute('levels', '{"01":1}');
  await expect(page.locator('#markup')).toContainText('"01":1');

  for (const locale of ['zh-TW', 'ja', 'en']) {
    await page.selectOption('#locale', locale);
    await expect(page.locator('.site-footer')).toHaveText('Copyright © 2026 HeiTang · Based on JapanEx · MIT License');
  }
  await page.selectOption('#theme', 'light');
  await expect(preview).toHaveAttribute('locale', 'en');
  await expect(preview).toHaveAttribute('theme', 'light');
  await expect(page.locator('#page-title')).toHaveText('Japan Prefecture Map');
  await expect(page.locator('#page-subtitle')).toHaveText('A Web Component adaptation of JapanEx');
  await expect(page.locator('#locale-label')).toHaveText('Language');
  await expect(page.locator('#theme-label')).toHaveText('Map theme');
  await expect(page.locator('#level-list')).toContainText('Never visited');
  await expect(page.locator('#reset')).toHaveText('Reset');
  await expect(page.locator('#export-image')).toHaveText('Download PNG');
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

test('tracks successful copy and PNG downloads', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.selectOption('#locale', 'zh-TW');

  await page.evaluate(() => {
    const state = window as typeof window & {
      analyticsEvents?: unknown[][];
      exportedSvg?: string;
      gtag?: (...args: unknown[]) => void;
    };
    state.analyticsEvents = [];
    state.gtag = (...args) => state.analyticsEvents?.push(args);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } });
    const createObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = blob => {
      if (blob.type.startsWith('image/svg+xml')) void blob.text().then(text => { state.exportedSvg = text; });
      return createObjectURL(blob);
    };
  });

  await page.click('#copy');
  await expect(page.locator('#copy-status')).toHaveText('嵌入碼已複製');

  await page.selectOption('#prefecture', '13');
  await page.selectOption('#mobile-level', '1');
  await page.selectOption('#prefecture', '27');
  await page.selectOption('#mobile-level', '1');

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
  expect(analyticsEvents).toContainEqual(['event', 'download_png']);
});

test('offers precise prefecture and level controls on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.selectOption('#locale', 'zh-TW');

  const preview = page.locator('japan-prefecture-map');
  await expect(page.locator('#mobile-editor')).toBeVisible();
  await page.selectOption('#prefecture', '13');
  await page.selectOption('#mobile-level', '4');

  await expect(preview).toHaveAttribute('levels', '{"13":4}');
  await expect(page.locator('#markup')).toContainText('"13":4');

  const clippedPrefectures = await preview.evaluate(element => {
    const widget = element.shadowRoot?.querySelector('.widget')?.getBoundingClientRect();
    if (!widget) return ['missing-widget'];

    return [...(element.shadowRoot?.querySelectorAll('.prefecture') ?? [])]
      .filter(prefecture => {
        const bounds = prefecture.getBoundingClientRect();
        return bounds.left < widget.left || bounds.right > widget.right;
      })
      .map(prefecture => prefecture.getAttribute('data-code'));
  });
  expect(clippedPrefectures).toEqual([]);
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
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.widget')?.getAttribute('lang'))).toBe('zh-TW');
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('.widget')?.getAttribute('data-theme'))).toBe('auto');
  await expect(preview.locator('svg .prefecture[data-code="01"]')).toHaveAttribute('data-level', '4');
  await expect.poll(() => preview.evaluate(element => getComputedStyle(element.shadowRoot?.querySelector('.map-stage') ?? element).backgroundImage)).toContain('radial-gradient');

  await preview.evaluate(element => element.style.setProperty('--jpm-map-glow', 'none'));
  await expect.poll(() => preview.evaluate(element => getComputedStyle(element.shadowRoot?.querySelector('.map-stage') ?? element).backgroundImage)).toBe('none');
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
    preview.evaluate(element => getComputedStyle(element.shadowRoot?.querySelector('.summary') as Element).display),
  ).toBe('none');
});
