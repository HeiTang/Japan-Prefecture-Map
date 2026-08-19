/** SVG geometry adapted from ukyouz/JapanEx under the MIT License. */
import { mapGeometry } from './geometry.js';
import {
  levelLabels,
  prefectureByCode,
  uiCopy,
  type JapanMapLocale,
  type PrefectureLevels,
} from './model.js';

/** 地圖 SVG 的樣式，伺服器端輸出時要自行放進頁面。 */
export const mapStyles = String.raw`
  .japan-map {
    display: block;
    width: 100%;
    height: auto;
  }

  .level-zero { fill: var(--jpm-level-0, #252b35); }
  .level-zero-stripe { fill: var(--jpm-level-0-stripe, #39404c); }

  .prefecture {
    fill: url('#jpm-unvisited-pattern');
    pointer-events: none;
  }

  .japan-map[data-interactive='true'] .prefecture {
    cursor: pointer;
    pointer-events: auto;
  }

  .japan-map[data-interactive='true'] .prefecture:hover,
  .japan-map[data-interactive='true'] .prefecture:focus-visible {
    filter: brightness(1.16);
    outline: none;
  }

  .prefecture[data-level='1'] { fill: var(--jpm-level-1, #ffe3d6); }
  .prefecture[data-level='2'] { fill: var(--jpm-level-2, #ffc1a5); }
  .prefecture[data-level='3'] { fill: var(--jpm-level-3, #ff9a6f); }
  .prefecture[data-level='4'] { fill: var(--jpm-level-4, #f66f41); }
  .prefecture[data-level='5'] { fill: var(--jpm-level-5, #c9461f); }

  .prefecture > polygon,
  .prefecture > rect {
    fill: inherit;
    stroke: #202832;
    stroke-width: 2;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .map-label {
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

  .japan-map[data-locale='en'] .map-label { font-size: 11px; }
  .small-label { font-size: 14px; }
  .japan-map[data-locale='en'] .small-label { font-size: 9px; }
  .vertical-label { writing-mode: vertical-rl; }
`;

export function renderMap(levels: PrefectureLevels, locale: JapanMapLocale, interactive = false) {
  const copy = uiCopy[locale];
  const groups = mapGeometry.map(geometry => {
    const prefecture = prefectureByCode.get(geometry.code);

    if (!prefecture) {
      throw new Error(`[japan-prefecture-map] missing prefecture metadata: ${geometry.code}`);
    }

    const level = levels[geometry.code] ?? 0;
    const name = prefecture.names[locale];
    const levelLabel = levelLabels[locale][level].label;
    const labelClasses = [
      'map-label',
      geometry.small ? 'small-label' : '',
      geometry.vertical ? 'vertical-label' : '',
    ].filter(Boolean).join(' ');

    return `<g class="prefecture" data-code="${geometry.code}" data-level="${level}" role="${interactive ? 'button' : 'group'}"${interactive ? ' tabindex="0"' : ''} aria-label="${name}: Level ${level} ${levelLabel}"><title>${name}: Level ${level} ${levelLabel}</title>${geometry.shapes}<text class="${labelClasses}" x="${geometry.x}" y="${geometry.y}">${name}</text></g>`;
  }).join('');

  return `<svg class="japan-map" data-interactive="${interactive}" data-locale="${locale}" viewBox="318 -317.5 1147.5 1147.5" role="img" aria-labelledby="jpm-map-title jpm-map-description"><title id="jpm-map-title">${copy.title}</title><desc id="jpm-map-description">${copy.description}</desc><defs><pattern id="jpm-unvisited-pattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" class="level-zero"/><rect width="5" height="16" class="level-zero-stripe"/></pattern></defs>${groups}</svg>`;
}
