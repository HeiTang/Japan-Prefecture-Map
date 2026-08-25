import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { renderLegend, renderMap, renderWidget, widgetStyles } from '../dist/render.js';

const site = new URL('../site/', import.meta.url);
await rm(site, { force: true, recursive: true });
await mkdir(site, { recursive: true });
await cp(new URL('../demo/index.html', import.meta.url), new URL('index.html', site));
await cp(new URL('../demo/component.html', import.meta.url), new URL('component.html', site));
await cp(new URL('../dist/', import.meta.url), new URL('dist/', site), { recursive: true });

const levels = { '01': 1, '13': 2, '27': 3, '34': 4, '47': 5 };
const ssrTemplate = await readFile(new URL('../demo/ssr.html', import.meta.url), 'utf8');
const ssrDemo = ssrTemplate
  .replace('<!-- ssr-widget-styles -->', `<style id="ssr-widget-styles">${widgetStyles}</style>`)
  .replace('<!-- ssr-widget -->', renderWidget(levels, 'zh-TW', { idPrefix: 'ssr-widget', legendOpen: true, theme: 'dark' }))
  .replace('<!-- ssr-map -->', renderMap(levels, 'zh-TW', { idPrefix: 'ssr-map' }))
  .replace('<!-- ssr-legend -->', renderLegend('zh-TW', { open: true }));
await writeFile(new URL('ssr.html', site), ssrDemo);
