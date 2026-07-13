/** SVG geometry adapted from ukyouz/JapanEx under the MIT License. */
import { mapGeometry } from './geometry.js';
import {
  levelLabels,
  prefectureByCode,
  uiCopy,
  type JapanMapLocale,
  type PrefectureLevels,
} from './model.js';

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
