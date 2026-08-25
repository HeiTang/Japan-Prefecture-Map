/** SVG geometry adapted from ukyouz/JapanEx under the MIT License. */
import { mapGeometry } from './geometry.js';
import {
  getJapanStats,
  isLocale,
  isTheme,
  levelLabels,
  prefectureByCode,
  uiCopy,
  validateLevels,
  type JapanMapLocale,
  type JapanMapTheme,
  type PrefectureLevels,
} from './model.js';

export interface RenderMapOptions {
  idPrefix?: string;
  interactive?: boolean;
}

export interface RenderLegendOptions {
  open?: boolean;
}

export interface RenderWidgetOptions {
  idPrefix?: string;
  legendOpen?: boolean;
  theme?: JapanMapTheme;
}

const idPrefixPattern = /^[A-Za-z][A-Za-z0-9_.:-]*$/;

function requireLocale(locale: unknown): JapanMapLocale {
  if (!isLocale(locale)) throw new TypeError(`[japan-prefecture-map] unsupported locale: ${String(locale)}`);
  return locale;
}

function requireTheme(theme: unknown): JapanMapTheme {
  if (!isTheme(theme)) throw new TypeError(`[japan-prefecture-map] unsupported theme: ${String(theme)}`);
  return theme;
}

function requireIdPrefix(idPrefix: unknown) {
  if (typeof idPrefix !== 'string' || !idPrefixPattern.test(idPrefix)) {
    throw new TypeError('[japan-prefecture-map] idPrefix must start with a letter and contain only letters, numbers, _, ., :, or -');
  }
  return idPrefix;
}

function mapOptionsFor(options: boolean | RenderMapOptions | undefined) {
  if (typeof options === 'boolean') return { idPrefix: 'jpm', interactive: options };

  const idPrefix = requireIdPrefix(options?.idPrefix ?? 'jpm');
  const interactive = options?.interactive ?? false;
  if (typeof interactive !== 'boolean') throw new TypeError('[japan-prefecture-map] interactive must be a boolean');

  return { idPrefix, interactive };
}

function widgetOptionsFor(options: RenderWidgetOptions | undefined) {
  const idPrefix = requireIdPrefix(options?.idPrefix ?? 'jpm-widget');
  const legendOpen = options?.legendOpen ?? false;
  if (typeof legendOpen !== 'boolean') throw new TypeError('[japan-prefecture-map] legendOpen must be a boolean');

  return {
    idPrefix,
    legendOpen,
    theme: requireTheme(options?.theme ?? 'auto'),
  };
}

function mapIdsFor(idPrefix: string) {
  return {
    description: `${idPrefix}-map-description`,
    pattern: `${idPrefix}-unvisited-pattern`,
    title: `${idPrefix}-map-title`,
  };
}

function scoreDigitsFor(score: number) {
  return String(score).split('').map(digit => `<span class="jpm-score-digit" data-score-digit="${digit}">${digit}</span>`).join('');
}

function legendItemsFor(locale: JapanMapLocale) {
  return levelLabels[locale].map((item, level) => `<li class="jpm-legend-item"><span class="jpm-swatch" data-level="${level}" aria-hidden="true"></span><span><strong>Level ${level} · ${item.label}</strong><small>${item.description}</small></span></li>`).join('');
}

/** 地圖 SVG 的樣式，伺服器端輸出時要自行放進頁面。 */
export const mapStyles = String.raw`
  .japan-map {
    display: block;
    width: 100%;
    height: auto;
  }

  .japan-map .jpm-level-zero { fill: var(--jpm-level-0, #252b35); }
  .japan-map .jpm-level-zero-stripe { fill: var(--jpm-level-0-stripe, #39404c); }

  .japan-map .jpm-prefecture {
    pointer-events: none;
  }

  .japan-map[data-interactive='true'] .jpm-prefecture {
    cursor: pointer;
    pointer-events: auto;
  }

  .japan-map[data-interactive='true'] .jpm-prefecture:hover,
  .japan-map[data-interactive='true'] .jpm-prefecture:focus-visible {
    filter: brightness(1.16);
  }

  .japan-map[data-interactive='true'] .jpm-prefecture:focus-visible {
    outline: 2px solid var(--jpm-focus-ring, #fff);
    outline-offset: 2px;
  }

  .japan-map .jpm-prefecture[data-level='1'] { fill: var(--jpm-level-1, #ffe3d6); }
  .japan-map .jpm-prefecture[data-level='2'] { fill: var(--jpm-level-2, #ffc1a5); }
  .japan-map .jpm-prefecture[data-level='3'] { fill: var(--jpm-level-3, #ff9a6f); }
  .japan-map .jpm-prefecture[data-level='4'] { fill: var(--jpm-level-4, #f66f41); }
  .japan-map .jpm-prefecture[data-level='5'] { fill: var(--jpm-level-5, #c9461f); }

  .japan-map .jpm-prefecture > polygon,
  .japan-map .jpm-prefecture > rect {
    fill: inherit;
    stroke: #202832;
    stroke-width: 2;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .japan-map .jpm-map-label {
    fill: #fff;
    stroke: #202832;
    stroke-width: 2px;
    paint-order: stroke;
    text-anchor: middle;
    dominant-baseline: middle;
    font-family: var(--jpm-map-font, ui-sans-serif, system-ui, sans-serif);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.02em;
    pointer-events: none;
  }

  .japan-map[data-locale='en'] .jpm-map-label { font-size: 11px; }
  .japan-map .jpm-small-label { font-size: 14px; }
  .japan-map[data-locale='en'] .jpm-small-label { font-size: 9px; }
  .japan-map .jpm-vertical-label { writing-mode: vertical-rl; }
`;

/** 可單獨搭配 renderLegend() 使用的圖例樣式。 */
export const legendStyles = String.raw`
  .jpm-legend {
    color: var(--jpm-text, inherit);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .jpm-legend summary {
    width: fit-content;
    min-height: 44px;
    padding: 0.75rem 1rem;
    border: 1px solid var(--jpm-border, currentColor);
    border-radius: 999px;
    background: var(--jpm-surface-raised, transparent);
    cursor: pointer;
    color: inherit;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .jpm-legend summary:focus-visible {
    outline: 2px solid var(--jpm-focus-ring, currentColor);
    outline-offset: 3px;
  }

  .jpm-legend-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.85rem;
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
  }

  .jpm-legend-item {
    display: grid;
    grid-template-columns: 1.4rem 1fr;
    gap: 0.6rem;
    align-items: center;
  }

  .jpm-swatch {
    width: 1.4rem;
    aspect-ratio: 1;
    border: 1px solid var(--jpm-border, currentColor);
    border-radius: 0.35rem;
  }

  .jpm-swatch[data-level='0'] { background: repeating-linear-gradient(45deg, var(--jpm-level-0, #252b35) 0 6px, var(--jpm-level-0-stripe, #39404c) 6px 12px); }
  .jpm-swatch[data-level='1'] { background: var(--jpm-level-1, #ffe3d6); }
  .jpm-swatch[data-level='2'] { background: var(--jpm-level-2, #ffc1a5); }
  .jpm-swatch[data-level='3'] { background: var(--jpm-level-3, #ff9a6f); }
  .jpm-swatch[data-level='4'] { background: var(--jpm-level-4, #f66f41); }
  .jpm-swatch[data-level='5'] { background: var(--jpm-level-5, #c9461f); }

  .jpm-legend-item strong,
  .jpm-legend-item small {
    display: block;
  }

  .jpm-legend-item strong { font-size: 0.78rem; }
  .jpm-legend-item small,
  .jpm-method,
  .jpm-credit { color: var(--jpm-muted, currentColor); font-size: 0.72rem; line-height: 1.5; }

  .jpm-legend-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.75rem;
    align-items: baseline;
    margin: 1rem 0 0;
  }

  .jpm-method,
  .jpm-credit { margin: 0; }
  .jpm-credit { margin-inline-start: auto; text-align: end; white-space: nowrap; }
  .jpm-credit a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .jpm-credit a:hover,
  .jpm-credit a:focus-visible { color: var(--jpm-accent, currentColor); }

  @media (max-width: 560px) {
    .jpm-legend-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .jpm-credit { margin-inline-start: 0; text-align: start; white-space: normal; }
  }
`;

/** 完整靜態 widget 的樣式，已包含 mapStyles 與 legendStyles。 */
export const widgetStyles = String.raw`
  ${mapStyles}
  ${legendStyles}

  .jpm-widget,
  .jpm-widget *,
  .jpm-widget *::before,
  .jpm-widget *::after {
    box-sizing: border-box;
  }

  .jpm-widget {
    --jpm-widget-surface: var(--jpm-surface, var(--jpm-theme-surface));
    --jpm-widget-surface-raised: var(--jpm-surface-raised, var(--jpm-theme-surface-raised));
    --jpm-widget-text: var(--jpm-text, var(--jpm-theme-text));
    --jpm-widget-muted: var(--jpm-muted, var(--jpm-theme-muted));
    --jpm-widget-border: var(--jpm-border, var(--jpm-theme-border));
    --jpm-widget-accent: var(--jpm-accent, #ff8c61);
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--jpm-widget-border);
    border-radius: 1.5rem;
    background: var(--jpm-widget-surface);
    color: var(--jpm-widget-text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .jpm-widget[data-theme='dark'],
  .jpm-widget[data-theme='auto'] {
    --jpm-theme-surface: #11151c;
    --jpm-theme-surface-raised: #1b212b;
    --jpm-theme-text: #f7f8fa;
    --jpm-theme-muted: #9aa5b4;
    --jpm-theme-border: rgba(255, 255, 255, 0.1);
    color-scheme: dark;
  }

  .jpm-widget[data-theme='light'] {
    --jpm-theme-surface: #f7f4ef;
    --jpm-theme-surface-raised: #fff;
    --jpm-theme-text: #20252d;
    --jpm-theme-muted: #626c79;
    --jpm-theme-border: rgba(32, 37, 45, 0.14);
    color-scheme: light;
  }

  @media (prefers-color-scheme: light) {
    .jpm-widget[data-theme='auto'] {
      --jpm-theme-surface: #f7f4ef;
      --jpm-theme-surface-raised: #fff;
      --jpm-theme-text: #20252d;
      --jpm-theme-muted: #626c79;
      --jpm-theme-border: rgba(32, 37, 45, 0.14);
      color-scheme: light;
    }
  }

  .jpm-widget .jpm-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem 2rem;
    align-items: end;
    justify-content: space-between;
    padding: clamp(1.25rem, 4vw, 2.5rem);
  }

  .jpm-widget .jpm-score-label {
    display: block;
    margin-bottom: 0.45rem;
    color: var(--jpm-widget-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .jpm-widget .jpm-score {
    display: inline-flex;
    gap: 0.08em;
    perspective: 6em;
    color: var(--jpm-widget-accent);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: clamp(2.5rem, 8vw, 4.75rem);
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    line-height: 1;
  }

  .jpm-widget .jpm-score-digit {
    position: relative;
    display: inline-grid;
    width: 0.72em;
    height: 0.96em;
    overflow: hidden;
    border: 1px solid var(--jpm-widget-border);
    border-radius: 0.1em;
    place-items: center;
    background: linear-gradient(to bottom, var(--jpm-widget-surface-raised) 0 49%, var(--jpm-widget-surface) 50% 100%);
    box-shadow: 0 0.08em 0.2em rgba(0, 0, 0, 0.24);
    transform-origin: center;
    backface-visibility: hidden;
  }

  .jpm-widget .jpm-score-digit::after {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.36);
    content: '';
  }

  .jpm-widget .jpm-score-digit.is-flipping {
    animation: jpm-score-flip 56ms linear;
  }

  @keyframes jpm-score-flip {
    0% { filter: brightness(1); transform: rotateX(0); }
    49% { filter: brightness(0.72); transform: rotateX(-88deg); }
    50% { filter: brightness(0.72); transform: rotateX(88deg); }
    100% { filter: brightness(1); transform: rotateX(0); }
  }

  .jpm-widget .jpm-stats {
    display: flex;
    gap: clamp(1rem, 4vw, 2rem);
    margin: 0;
  }

  .jpm-widget .jpm-stat { min-width: 3.5rem; }
  .jpm-widget .jpm-stat dt {
    margin-bottom: 0.4rem;
    color: var(--jpm-widget-muted);
    font-size: 0.72rem;
  }

  .jpm-widget .jpm-stat dd {
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1.35rem;
    font-variant-numeric: tabular-nums;
  }

  .jpm-widget .jpm-map-stage {
    padding: 0 clamp(0.25rem, 2vw, 1.5rem);
    background: var(--jpm-map-glow, radial-gradient(ellipse at center, color-mix(in srgb, var(--jpm-widget-accent) 9%, transparent), transparent 64%));
  }

  .jpm-widget .jpm-legend {
    margin: 0;
    padding: 0 clamp(1.25rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2rem);
    --jpm-surface-raised: var(--jpm-widget-surface-raised);
    --jpm-text: var(--jpm-widget-text);
    --jpm-muted: var(--jpm-widget-muted);
    --jpm-border: var(--jpm-widget-border);
    --jpm-accent: var(--jpm-widget-accent);
  }

  @media (max-width: 560px) {
    .jpm-widget .jpm-summary { align-items: start; flex-direction: column; }
    .jpm-widget .jpm-stats { width: 100%; justify-content: space-between; }
  }

  @media (prefers-reduced-motion: reduce) {
    .jpm-widget .jpm-score-digit { animation: none !important; }
  }
`;

/** 在 Node、SSR 或 SSG 環境輸出單一可存取 SVG。 */
export function renderMap(levels: PrefectureLevels, locale: JapanMapLocale, options?: boolean | RenderMapOptions) {
  const safeLevels = validateLevels(levels);
  const safeLocale = requireLocale(locale);
  const { idPrefix, interactive } = mapOptionsFor(options);
  const ids = mapIdsFor(idPrefix);
  const copy = uiCopy[safeLocale];
  const groups = mapGeometry.map(geometry => {
    const prefecture = prefectureByCode.get(geometry.code);

    if (!prefecture) {
      throw new Error(`[japan-prefecture-map] missing prefecture metadata: ${geometry.code}`);
    }

    const level = safeLevels[geometry.code] ?? 0;
    const name = prefecture.names[safeLocale];
    const levelLabel = levelLabels[safeLocale][level].label;
    const labelClasses = [
      'jpm-map-label',
      geometry.small ? 'jpm-small-label' : '',
      geometry.vertical ? 'jpm-vertical-label' : '',
    ].filter(Boolean).join(' ');
    const fill = level === 0 ? ` fill="url(#${ids.pattern})"` : '';

    return `<g class="jpm-prefecture" data-code="${geometry.code}" data-level="${level}" role="${interactive ? 'button' : 'group'}"${interactive ? ' tabindex="0"' : ''}${fill} aria-label="${name}: Level ${level} ${levelLabel}"><title>${name}: Level ${level} ${levelLabel}</title>${geometry.shapes}<text class="${labelClasses}" x="${geometry.x}" y="${geometry.y}">${name}</text></g>`;
  }).join('');

  return `<svg class="japan-map" data-interactive="${interactive}" data-locale="${safeLocale}" lang="${safeLocale}" viewBox="318 -317.5 1147.5 1147.5" role="${interactive ? 'group' : 'img'}" aria-labelledby="${ids.title} ${ids.description}"><title id="${ids.title}">${copy.title}</title><desc id="${ids.description}">${copy.description}</desc><defs><pattern id="${ids.pattern}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" class="jpm-level-zero"/><rect width="5" height="16" class="jpm-level-zero-stripe"/></pattern></defs>${groups}</svg>`;
}

/** 輸出 0–5 分級、方法說明與 JapanEx 歸屬的靜態圖例。 */
export function renderLegend(locale: JapanMapLocale, options: RenderLegendOptions = {}) {
  const safeLocale = requireLocale(locale);
  const open = options.open ?? false;
  if (typeof open !== 'boolean') throw new TypeError('[japan-prefecture-map] open must be a boolean');

  const copy = uiCopy[safeLocale];
  return `<details class="jpm-legend" lang="${safeLocale}"${open ? ' open' : ''}><summary>${copy.legend}</summary><ol class="jpm-legend-list">${legendItemsFor(safeLocale)}</ol><div class="jpm-legend-meta"><p class="jpm-method">${copy.method}</p><p class="jpm-credit"><strong>Made by <a href="https://github.com/HeiTang" rel="external noopener">HeiTang</a></strong> · Map geometry based on <a href="https://github.com/ukyouz/JapanEx" rel="external noopener">JapanEx</a> (MIT)</p></div></details>`;
}

/** 輸出完整的零 JavaScript 靜態旅遊卡片，已包含統計、SVG、圖例與歸屬。 */
export function renderWidget(levels: PrefectureLevels, locale: JapanMapLocale, options: RenderWidgetOptions = {}) {
  const safeLevels = validateLevels(levels);
  const safeLocale = requireLocale(locale);
  const { idPrefix, legendOpen, theme } = widgetOptionsFor(options);
  const copy = uiCopy[safeLocale];
  const stats = getJapanStats(safeLevels);

  return `<section class="jpm-widget" part="widget" data-theme="${theme}" lang="${safeLocale}" aria-label="${copy.title}"><header class="jpm-summary" part="summary"><div><span class="jpm-score-label">${copy.score}</span><div class="jpm-score" part="score" data-score="${stats.score}" aria-label="${copy.score} ${stats.score}">${scoreDigitsFor(stats.score)}</div></div><dl class="jpm-stats" part="stats"><div class="jpm-stat"><dt>${copy.visited}</dt><dd>${stats.visited}<small> / ${stats.total}</small></dd></div><div class="jpm-stat"><dt>${copy.stayed}</dt><dd>${stats.stayed}</dd></div><div class="jpm-stat"><dt>${copy.lived}</dt><dd>${stats.lived}</dd></div></dl></header><div class="jpm-map-stage" part="map">${renderMap(safeLevels, safeLocale, { idPrefix })}</div><div class="jpm-widget-legend" part="legend">${renderLegend(safeLocale, { open: legendOpen })}</div></section>`;
}
