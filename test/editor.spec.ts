import { expect, test } from '@playwright/test';

test('renders, edits, resets, and reports invalid input', async ({ page }) => {
  await page.goto('/');

  const preview = page.locator('japan-prefecture-map');
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelectorAll('.prefecture').length)).toBe(47);

  await preview.evaluate(element => {
    const prefecture = element.shadowRoot?.querySelector<SVGGElement>('[data-code="01"]');
    prefecture?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  });
  await expect(preview).toHaveAttribute('levels', '{"01":1}');
  await expect(page.locator('#markup')).toContainText('"01":1');

  await page.selectOption('#locale', 'en');
  await page.selectOption('#theme', 'light');
  await expect(preview).toHaveAttribute('locale', 'en');
  await expect(preview).toHaveAttribute('theme', 'light');

  await page.click('#reset');
  await expect(preview).toHaveAttribute('levels', '{}');

  await preview.evaluate(element => element.setAttribute('levels', '{"01":9}'));
  await expect.poll(() => preview.evaluate(element => element.shadowRoot?.querySelector('[role="alert"]')?.textContent)).toContain('Invalid levels');
});
