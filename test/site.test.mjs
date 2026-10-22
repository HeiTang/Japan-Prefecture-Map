import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('built pages declare one static canonical without editor query parameters', async () => {
  for (const [file, path] of [['index.html', '/'], ['component.html', '/component.html'], ['ssr.html', '/ssr.html']]) {
    const html = await readFile(new URL(`../site/${file}`, import.meta.url), 'utf8');
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';
    assert.deepEqual(
      [...head.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)].map(([tag]) => tag.match(/href="([^"]+)"/)?.[1]),
      [`https://japanmap.purr.tw${path}`],
      file,
    );
  }
});
