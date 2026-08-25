import assert from 'node:assert/strict';
import test from 'node:test';

import {
  legendStyles,
  mapStyles,
  renderLegend,
  renderMap,
  renderWidget,
  widgetStyles,
} from '../dist/render.js';

const levels = { '01': 1, '13': 2, '27': 3, '34': 4, '47': 5 };

test('renders accessible static SVG maps with deterministic unique IDs', () => {
  const first = renderMap(levels, 'zh-TW', { idPrefix: 'first-map' });
  const second = renderMap(levels, 'en', { idPrefix: 'second-map' });
  const markup = `${first}${second}`;
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);

  assert.equal((first.match(/class="jpm-prefecture"/g) ?? []).length, 47);
  assert.equal((first.match(/<title>/g) ?? []).length, 47);
  assert.match(first, /lang="zh-TW"/);
  assert.match(first, /aria-labelledby="first-map-map-title first-map-map-description"/);
  assert.match(first, /fill="url\(#first-map-unvisited-pattern\)"/);
  assert.match(second, /aria-labelledby="second-map-map-title second-map-map-description"/);
  assert.equal(new Set(ids).size, ids.length);
  assert.doesNotMatch(first, /Made by HeiTang/);
});

test('keeps the legacy interactive boolean while accepting map options', () => {
  const map = renderMap({ '13': 4 }, 'zh-TW', true);

  assert.match(map, /data-interactive="true"/);
  assert.match(map, /role="group" aria-labelledby="jpm-map-title jpm-map-description"/);
  assert.match(map, /role="button" tabindex="0"/);
  assert.match(map, /id="jpm-map-title"/);
});

test('renders a complete static widget and a composable legend', () => {
  const legend = renderLegend('en', { open: true });
  const widget = renderWidget(levels, 'zh-TW', {
    idPrefix: 'travel-card',
    legendOpen: true,
    theme: 'light',
  });

  assert.match(legend, /<details class="jpm-legend" lang="en" open>/);
  assert.equal((legend.match(/class="jpm-legend-item"/g) ?? []).length, 6);
  assert.match(legend, /Made by <a href="https:\/\/github.com\/HeiTang"/);
  assert.match(widget, /<section class="jpm-widget" part="widget" data-theme="light"/);
  assert.match(widget, /data-score="15"/);
  assert.match(widget, /已踏足<\/dt><dd>5<small> \/ 47<\/small>/);
  assert.match(widget, /id="travel-card-map-title"/);
  assert.match(widget, /<details class="jpm-legend" lang="zh-TW" open>/);
  assert.ok([...widget.matchAll(/class="([^"]+)"/g)].every(([, classes]) =>
    classes.split(' ').every(className => className === 'japan-map' || className.startsWith('jpm-')),
  ));
});

test('keeps style exports scoped and self-contained for SSR output', () => {
  assert.match(mapStyles, /\.japan-map \.jpm-prefecture/);
  assert.match(legendStyles, /\.jpm-legend-list/);
  assert.match(widgetStyles, /\.jpm-widget/);
  assert.match(widgetStyles, /\.japan-map \.jpm-prefecture/);
  assert.match(widgetStyles, /\.jpm-legend-list/);
});

test('rejects invalid renderer inputs at the SSR boundary', () => {
  assert.throws(() => renderMap({ '48': 1 }, 'zh-TW'), TypeError);
  assert.throws(() => renderMap({}, 'ko'), TypeError);
  assert.throws(() => renderMap({}, 'zh-TW', { idPrefix: 'not valid' }), TypeError);
  assert.throws(() => renderLegend('ko'), TypeError);
  assert.throws(() => renderWidget({}, 'zh-TW', { theme: 'neon' }), TypeError);
  assert.throws(() => renderWidget({}, 'zh-TW', { legendOpen: 'yes' }), TypeError);
});
