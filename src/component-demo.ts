import './index.js';
import {
  sparseLevels,
  type JapanMapLocale,
  type JapanMapTheme,
  type PrefectureLevel,
  type PrefectureLevels,
} from './model.js';
import type { JapanPrefectureMapElement } from './index.js';

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`[japan-prefecture-map] missing component demo element: ${selector}`);
  return element;
}

const preview = required<JapanPrefectureMapElement>('#component-preview');
const localeSelect = required<HTMLSelectElement>('#component-locale');
const themeSelect = required<HTMLSelectElement>('#component-theme');
const stateOutput = required<HTMLOutputElement>('#runtime-state');
const status = required<HTMLElement>('#runtime-status');
const presetButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-preset]')];
const tokyoButton = required<HTMLButtonElement>('#level-tokyo');

const presets = {
  weekend: { '13': 3, '27': 3, '34': 4 },
  west: { '26': 2, '27': 4, '34': 4, '40': 3, '47': 3 },
  all: { '01': 1, '13': 3, '27': 4, '34': 4, '47': 5 },
  reset: {},
} satisfies Record<string, PrefectureLevels>;

type Preset = keyof typeof presets;

let levels: PrefectureLevels = { ...presets.weekend };
let activePreset: Preset | null = 'weekend';

function isPreset(value: string | undefined): value is Preset {
  return value !== undefined && value in presets;
}

function update(message: string) {
  preview.levels = levels;
  preview.locale = localeSelect.value as JapanMapLocale;
  preview.theme = themeSelect.value as JapanMapTheme;
  stateOutput.value = JSON.stringify(sparseLevels(levels));
  status.textContent = message;
  presetButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.preset === activePreset)));
}

presetButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!isPreset(button.dataset.preset)) return;
    activePreset = button.dataset.preset;
    levels = { ...presets[activePreset] };
    update(`已套用「${button.querySelector('strong')?.textContent?.trim() ?? activePreset}」。`);
  });
});

tokyoButton.addEventListener('click', () => {
  const next = { ...levels };
  const current = next['13'] ?? 0;
  if (current === 5) delete next['13'];
  else next['13'] = (current + 1) as PrefectureLevel;
  levels = next;
  activePreset = null;
  update(`東京都已更新為 Level ${levels['13'] ?? 0}。`);
});

localeSelect.addEventListener('change', () => update(`地圖語言已切換為 ${localeSelect.selectedOptions[0]?.textContent ?? localeSelect.value}。`));
themeSelect.addEventListener('change', () => update(`主題已切換為 ${themeSelect.selectedOptions[0]?.textContent ?? themeSelect.value}。`));

update('已載入初始旅行資料。');
