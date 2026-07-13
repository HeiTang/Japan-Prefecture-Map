import './index.js';
import {
  sparseLevels,
  type JapanMapLocale,
  type JapanMapTheme,
  type PrefectureCode,
  type PrefectureLevels,
} from './model.js';
import type { JapanPrefectureMapElement } from './index.js';

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`[japan-prefecture-map] missing editor element: ${selector}`);
  return element;
}

const preview = required<JapanPrefectureMapElement>('#preview');
const localeSelect = required<HTMLSelectElement>('#locale');
const themeSelect = required<HTMLSelectElement>('#theme');
const markup = required<HTMLElement>('#markup');
const copyButton = required<HTMLButtonElement>('#copy');
const resetButton = required<HTMLButtonElement>('#reset');
const copyStatus = required<HTMLElement>('#copy-status');

let levels: PrefectureLevels = {};

function decorateMap() {
  const map = preview.shadowRoot?.querySelector<SVGElement>('.japan-map');
  if (!map) return;

  map.dataset.interactive = 'true';
  map.querySelectorAll<SVGGElement>('.prefecture').forEach(prefecture => {
    prefecture.setAttribute('role', 'button');
    prefecture.setAttribute('tabindex', '0');
  });
}

function update() {
  preview.levels = levels;
  preview.locale = localeSelect.value as JapanMapLocale;
  preview.theme = themeSelect.value as JapanMapTheme;
  decorateMap();

  const value = JSON.stringify(sparseLevels(levels));
  markup.textContent = `<japan-prefecture-map\n  locale="${preview.locale}"\n  theme="${preview.theme}"\n  levels='${value}'\n></japan-prefecture-map>`;
}

function selectPrefecture(target: EventTarget | null) {
  const element = target instanceof Element ? target.closest<SVGGElement>('.prefecture') : null;
  const code = element?.dataset.code as PrefectureCode | undefined;
  if (!code) return;

  levels = { ...levels, [code]: (((levels[code] ?? 0) + 1) % 6) as 0 | 1 | 2 | 3 | 4 | 5 };
  update();
}

preview.shadowRoot?.addEventListener('click', event => selectPrefecture(event.target));
preview.shadowRoot?.addEventListener('keydown', event => {
  if (!(event instanceof KeyboardEvent)) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  selectPrefecture(event.target);
});

localeSelect.addEventListener('change', update);
themeSelect.addEventListener('change', update);
resetButton.addEventListener('click', () => {
  levels = {};
  copyStatus.textContent = '';
  update();
});
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(markup.textContent ?? '');
    copyStatus.textContent = '已複製';
  } catch {
    copyStatus.textContent = '複製失敗，請手動選取程式碼';
  }
});

update();
