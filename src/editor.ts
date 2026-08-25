import './index.js';
import {
  getJapanStats,
  levelLabels,
  prefectures,
  sparseLevels,
  uiCopy,
  type JapanMapLocale,
  type JapanMapTheme,
  type PrefectureCode,
  type PrefectureLevels,
} from './model.js';
import type { JapanPrefectureMapElement } from './index.js';

const editorCopy = {
  'zh-TW': {
    subtitle: '基於 JapanEx 延伸的可嵌入都道府縣地圖',
    description: '點擊地圖設定 Level 0–5，完成後選擇整合方式並複製程式碼。',
    github: '在 GitHub 查看原始碼',
    preview: '地圖預覽',
    controls: '編輯設定',
    locale: '地圖語言',
    theme: '地圖主題',
    dark: '深色',
    light: '淺色',
    auto: '跟隨系統',
    guide: '等級說明',
    mobileEditor: '精準設定',
    prefecture: '都道府縣',
    level: '等級',
    embedGuide: '在網站中使用',
    reset: '重設',
    resetConfirm: '確定要清除所有都道府縣等級嗎？',
    exportImage: '下載 PNG',
    exported: '圖片已下載',
    exportError: '圖片產生失敗，請再試一次',
    componentPath: '互動式 Web Component',
    componentPathHint: '在瀏覽器執行，可透過屬性即時更新地圖。',
    staticPath: 'Static HTML renderer',
    staticPathHint: '在建置時輸出完整靜態卡片，沒有前端 JavaScript。',
    componentInstall: '先安裝套件，並在網站程式中匯入：',
    embed: '再貼入產生的元件：',
    copy: '複製 Web Component 程式碼',
    copied: 'Web Component 程式碼已複製',
    copyError: '複製失敗，請手動選取 Web Component 程式碼',
    staticInstall: '先安裝套件，再於建置時輸出靜態 HTML：',
    staticHint: '以下為完整卡片的 Astro 範例，包含統計、圖例與 attribution。',
    staticCopy: '複製 Static HTML 程式碼',
    staticCopied: 'Static HTML 程式碼已複製',
    staticCopyError: '複製失敗，請手動選取 Static HTML 程式碼',
    staticDemo: '查看零 JavaScript 實際輸出',
    componentDemo: '查看 Web Component runtime demo',
    routeEditor: '建立地圖',
    routeComponent: 'Web Component',
    routeStatic: 'Static HTML',
  },
  ja: {
    subtitle: 'JapanExを基にした埋め込み可能な都道府県マップ',
    description: '地図でレベル0〜5を設定し、統合方法を選んでコードをコピーします。',
    github: 'GitHubでソースコードを見る',
    preview: '地図プレビュー',
    controls: '編集設定',
    locale: '言語',
    theme: '地図テーマ',
    dark: 'ダーク',
    light: 'ライト',
    auto: 'システム設定',
    guide: 'レベルの説明',
    mobileEditor: '正確に設定',
    prefecture: '都道府県',
    level: 'レベル',
    embedGuide: 'サイトで使用',
    reset: 'リセット',
    resetConfirm: 'すべての都道府県レベルを消去しますか？',
    exportImage: 'PNGを保存',
    exported: '画像を保存しました',
    exportError: '画像を作成できませんでした。もう一度お試しください',
    componentPath: 'インタラクティブ Web Component',
    componentPathHint: 'ブラウザで動作し、属性で地図を動的に更新できます。',
    staticPath: 'Static HTML renderer',
    staticPathHint: 'ビルド時に完全な静的カードを出力し、フロントエンド JavaScript は不要です。',
    componentInstall: 'パッケージをインストールし、サイトのコードで読み込みます：',
    embed: '生成されたコンポーネントを貼り付けます：',
    copy: 'Web Component コードをコピー',
    copied: 'Web Component コードをコピーしました',
    copyError: 'コピーできませんでした。Web Component コードを手動で選択してください',
    staticInstall: 'パッケージをインストールし、ビルド時に静的 HTML を出力します：',
    staticHint: '統計、凡例、帰属情報を含む完全なカードの Astro 例です。',
    staticCopy: 'Static HTML コードをコピー',
    staticCopied: 'Static HTML コードをコピーしました',
    staticCopyError: 'コピーできませんでした。Static HTML コードを手動で選択してください',
    staticDemo: 'JavaScript なしの実際の出力を見る',
    componentDemo: 'Web Component runtime demoを見る',
    routeEditor: '地図を作成',
    routeComponent: 'Web Component',
    routeStatic: 'Static HTML',
  },
  en: {
    subtitle: 'A Web Component adaptation of JapanEx',
    description: 'Set Levels 0–5, choose an integration path, then copy the code.',
    github: 'View source on GitHub',
    preview: 'Map preview',
    controls: 'Editor settings',
    locale: 'Language',
    theme: 'Map theme',
    dark: 'Dark',
    light: 'Light',
    auto: 'System',
    guide: 'Level guide',
    mobileEditor: 'Precise controls',
    prefecture: 'Prefecture',
    level: 'Level',
    embedGuide: 'Use on your site',
    reset: 'Reset',
    resetConfirm: 'Clear all prefecture levels?',
    exportImage: 'Download PNG',
    exported: 'Image downloaded',
    exportError: 'Could not create the image. Try again.',
    componentPath: 'Interactive Web Component',
    componentPathHint: 'Runs in the browser and updates through element attributes.',
    staticPath: 'Static HTML renderer',
    staticPathHint: 'Outputs a complete static card at build time with no client JavaScript.',
    componentInstall: 'Install the package and import it in your site code:',
    embed: 'Then paste the generated component:',
    copy: 'Copy Web Component code',
    copied: 'Web Component code copied',
    copyError: 'Copy failed. Select the Web Component code manually.',
    staticInstall: 'Install the package, then render static HTML at build time:',
    staticHint: 'This Astro example renders a complete card with stats, a legend, and attribution.',
    staticCopy: 'Copy Static HTML code',
    staticCopied: 'Static HTML code copied',
    staticCopyError: 'Copy failed. Select the Static HTML code manually.',
    staticDemo: 'View the zero-JavaScript output',
    componentDemo: 'View the Web Component runtime demo',
    routeEditor: 'Build a map',
    routeComponent: 'Web Component',
    routeStatic: 'Static HTML',
  },
} as const satisfies Record<JapanMapLocale, Record<string, string>>;

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`[japan-prefecture-map] missing editor element: ${selector}`);
  return element;
}

function track(event: 'copy_embed_code' | 'copy_static_code' | 'download_png' | 'select_component_path' | 'select_static_path' | 'open_component_demo' | 'open_static_demo') {
  (window as typeof window & { gtag?: (command: 'event', event: string) => void }).gtag?.('event', event);
}

const preview = required<JapanPrefectureMapElement>('#preview');
const previewSection = required<HTMLElement>('#preview-section');
const controls = required<HTMLElement>('#controls');
const pageSubtitle = required<HTMLElement>('#page-subtitle');
const pageDescription = required<HTMLElement>('#page-description');
const githubLink = required<HTMLAnchorElement>('#github-link');
const routeEditor = required<HTMLAnchorElement>('#route-editor');
const routeComponent = required<HTMLAnchorElement>('#route-component');
const routeStatic = required<HTMLAnchorElement>('#route-static');
const localeSelect = required<HTMLSelectElement>('#locale');
const localeLabel = required<HTMLLabelElement>('#locale-label');
const themeSelect = required<HTMLSelectElement>('#theme');
const themeLabel = required<HTMLLabelElement>('#theme-label');
const themeDark = required<HTMLOptionElement>('#theme-dark');
const themeLight = required<HTMLOptionElement>('#theme-light');
const themeAuto = required<HTMLOptionElement>('#theme-auto');
const desktopPrefectureSelect = required<HTMLSelectElement>('#desktop-prefecture');
const desktopLevelSelect = required<HTMLSelectElement>('#desktop-level');
const styleAccent = required<HTMLInputElement>('#style-accent');
const styleLevelOne = required<HTMLInputElement>('#style-level-one');
const styleLevelTwo = required<HTMLInputElement>('#style-level-two');
const styleLevelThree = required<HTMLInputElement>('#style-level-three');
const styleLevelFour = required<HTMLInputElement>('#style-level-four');
const styleLevelFive = required<HTMLInputElement>('#style-level-five');
const styleDensity = required<HTMLSelectElement>('#style-density');
const styleGlow = required<HTMLInputElement>('#style-glow');
const previewStyleOverrides = required<HTMLStyleElement>('#preview-style-overrides');
const mobileEditorTitle = required<HTMLElement>('#mobile-editor-title');
const prefectureLabel = required<HTMLLabelElement>('#prefecture-label');
const prefectureSelect = required<HTMLSelectElement>('#prefecture');
const mobileLevelLabel = required<HTMLLabelElement>('#mobile-level-label');
const mobileLevelSelect = required<HTMLSelectElement>('#mobile-level');
const levelGuideTitle = required<HTMLElement>('#level-guide-title');
const levelList = required<HTMLOListElement>('#level-list');
const embedGuideTitle = required<HTMLElement>('#embed-guide-title');
const embedGuide = required<HTMLElement>('#embed-guide');
const componentPathButton = required<HTMLButtonElement>('#component-path');
const componentPathLabel = required<HTMLElement>('#component-path-label');
const componentPathHint = required<HTMLElement>('#component-path-hint');
const staticPathButton = required<HTMLButtonElement>('#static-path');
const staticPathLabel = required<HTMLElement>('#static-path-label');
const staticPathHint = required<HTMLElement>('#static-path-hint');
const componentPanel = required<HTMLElement>('#component-panel');
const staticPanel = required<HTMLElement>('#static-panel');
const componentInstallHint = required<HTMLElement>('#component-install-hint');
const markup = required<HTMLElement>('#markup');
const copyButton = required<HTMLButtonElement>('#copy');
const staticInstallHint = required<HTMLElement>('#static-install-hint');
const staticIdPrefix = required<HTMLInputElement>('#static-id-prefix');
const staticHint = required<HTMLElement>('#static-hint');
const staticMarkup = required<HTMLElement>('#static-markup');
const staticCopyButton = required<HTMLButtonElement>('#copy-static');
const staticDemoLink = required<HTMLAnchorElement>('#static-demo-link');
const componentDemoLink = required<HTMLAnchorElement>('#component-demo-link');
const resetButton = required<HTMLButtonElement>('#reset');
const resetButtonLabel = required<HTMLElement>('#reset span');
const exportButton = required<HTMLButtonElement>('#export-image');
const exportButtonLabel = required<HTMLElement>('#export-image span');
const mapActionStatus = required<HTMLElement>('#map-action-status');
const copyStatus = required<HTMLElement>('#copy-status');
const staticCopyStatus = required<HTMLElement>('#static-copy-status');
const embedHint = required<HTMLElement>('#embed-hint');

let levels: PrefectureLevels = {};
let selectedPrefecture: PrefectureCode = '01';
type IntegrationPath = 'component' | 'static';
const appearanceClass = 'japan-travel-map';

function integrationPathFromLocation(): IntegrationPath {
  return new URLSearchParams(window.location.search).get('path') === 'static' ? 'static' : 'component';
}

let integrationPath = integrationPathFromLocation();

function mapGlowValue() {
  return styleGlow.checked
    ? `radial-gradient(ellipse at center, color-mix(in srgb, ${styleAccent.value} 9%, transparent), transparent 64%)`
    : 'none';
}

function appearanceVariables(indent: string) {
  return [
    `--jpm-accent: ${styleAccent.value};`,
    `--jpm-level-1: ${styleLevelOne.value};`,
    `--jpm-level-2: ${styleLevelTwo.value};`,
    `--jpm-level-3: ${styleLevelThree.value};`,
    `--jpm-level-4: ${styleLevelFour.value};`,
    `--jpm-level-5: ${styleLevelFive.value};`,
    `--jpm-map-glow: ${mapGlowValue()};`,
  ].map(value => `${indent}${value}`).join('\n');
}

function updateAppearance() {
  preview.style.setProperty('--jpm-accent', styleAccent.value);
  preview.style.setProperty('--jpm-level-1', styleLevelOne.value);
  preview.style.setProperty('--jpm-level-2', styleLevelTwo.value);
  preview.style.setProperty('--jpm-level-3', styleLevelThree.value);
  preview.style.setProperty('--jpm-level-4', styleLevelFour.value);
  preview.style.setProperty('--jpm-level-5', styleLevelFive.value);
  preview.style.setProperty('--jpm-map-glow', mapGlowValue());
  controls.style.setProperty('--jpm-level-1', styleLevelOne.value);
  controls.style.setProperty('--jpm-level-2', styleLevelTwo.value);
  controls.style.setProperty('--jpm-level-3', styleLevelThree.value);
  controls.style.setProperty('--jpm-level-4', styleLevelFour.value);
  controls.style.setProperty('--jpm-level-5', styleLevelFive.value);
  previewStyleOverrides.textContent = styleDensity.value === 'compact'
    ? `#preview::part(summary) { padding-block: 1rem 0.5rem; }\n#preview::part(widget) { border-radius: 0.7rem; }`
    : '';
}

function appearanceCss(path: IntegrationPath) {
  const rules = [`.${appearanceClass} {\n${appearanceVariables('  ')}\n}`];
  if (styleDensity.value === 'compact') {
    rules.push(path === 'component'
      ? `.${appearanceClass}::part(summary) { padding-block: 1rem 0.5rem; }\n.${appearanceClass}::part(widget) { border-radius: 0.7rem; }`
      : `/* Astro scopes component styles; set:html output needs :global(). */\n.${appearanceClass} :global(.jpm-summary) { padding-block: 1rem 0.5rem; }\n.${appearanceClass} :global(.jpm-widget) { border-radius: 0.7rem; }`);
  }
  return `<style>\n${rules.join('\n\n')}\n</style>`;
}

function clearCopyStatus() {
  copyStatus.textContent = '';
  staticCopyStatus.textContent = '';
}

function staticIdPrefixValue() {
  const value = staticIdPrefix.value.trim();
  const valid = /^[A-Za-z][A-Za-z0-9_.:-]*$/.test(value);
  staticIdPrefix.setCustomValidity(valid ? '' : 'ID 前綴必須以英文字母開頭，且只包含英數、_、.、: 或 -。');
  return valid ? value : appearanceClass;
}

function updateGeneratedCode() {
  const value = JSON.stringify(sparseLevels(levels));
  const idPrefix = staticIdPrefixValue();
  markup.textContent = `${appearanceCss('component')}

<japan-prefecture-map
  class="${appearanceClass}"
  locale="${preview.locale}"
  theme="${preview.theme}"
  levels='${value}'
></japan-prefecture-map>`;
  staticMarkup.textContent = `---
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import { renderWidget, widgetStyles } from 'japan-prefecture-map/render';

const levels = ${value} satisfies PrefectureLevels;
---

<!-- Include widgetStyles once per page. -->
<style is:inline set:html={widgetStyles}></style>
${appearanceCss('static')}
<div class="${appearanceClass}" set:html={renderWidget(levels, '${preview.locale}', { theme: '${preview.theme}', idPrefix: '${idPrefix}' })} />`;
  updateIntegrationPath();
}

function refreshAppearance() {
  clearCopyStatus();
  updateAppearance();
  updateGeneratedCode();
}

function updateIntegrationPath() {
  const component = integrationPath === 'component';
  embedGuide.dataset.integrationPath = integrationPath;
  componentPathButton.setAttribute('aria-pressed', String(component));
  staticPathButton.setAttribute('aria-pressed', String(!component));
  componentPanel.hidden = !component;
  staticPanel.hidden = component;
}

function setIntegrationPath(path: IntegrationPath, updateUrl = false) {
  integrationPath = path;
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('path', path);
    window.history.replaceState(null, '', url);
  }
  updateIntegrationPath();
}

function decorateMap() {
  const map = preview.shadowRoot?.querySelector<SVGElement>('.japan-map');
  if (!map) return;

  map.dataset.interactive = 'true';
  map.setAttribute('role', 'group');
  map.querySelectorAll<SVGGElement>('.jpm-prefecture').forEach(prefecture => {
    prefecture.setAttribute('role', 'button');
    prefecture.setAttribute('tabindex', '0');
  });
}

function update() {
  clearCopyStatus();
  updateAppearance();
  preview.levels = levels;
  preview.locale = localeSelect.value as JapanMapLocale;
  preview.theme = themeSelect.value as JapanMapTheme;
  const locale = preview.locale;
  const copy = editorCopy['zh-TW'];

  document.documentElement.lang = 'zh-Hant';
  document.title = `${copy.subtitle} · Japan Prefecture Map`;
  pageSubtitle.textContent = copy.subtitle;
  pageDescription.textContent = copy.description;
  githubLink.setAttribute('aria-label', copy.github);
  githubLink.title = copy.github;
  routeEditor.textContent = copy.routeEditor;
  routeComponent.textContent = copy.routeComponent;
  routeStatic.textContent = copy.routeStatic;
  previewSection.setAttribute('aria-label', copy.preview);
  controls.setAttribute('aria-label', copy.controls);
  localeLabel.textContent = copy.locale;
  themeLabel.textContent = copy.theme;
  themeDark.textContent = copy.dark;
  themeLight.textContent = copy.light;
  themeAuto.textContent = copy.auto;
  mobileEditorTitle.textContent = copy.mobileEditor;
  prefectureLabel.textContent = copy.prefecture;
  mobileLevelLabel.textContent = copy.level;
  levelGuideTitle.textContent = copy.guide;
  embedGuideTitle.textContent = copy.embedGuide;
  copyButton.textContent = copy.copy;
  resetButtonLabel.textContent = copy.reset;
  exportButtonLabel.textContent = copy.exportImage;
  componentPathLabel.textContent = copy.componentPath;
  componentPathHint.textContent = copy.componentPathHint;
  staticPathLabel.textContent = copy.staticPath;
  staticPathHint.textContent = copy.staticPathHint;
  componentInstallHint.textContent = copy.componentInstall;
  embedHint.textContent = copy.embed;
  staticInstallHint.textContent = copy.staticInstall;
  staticHint.textContent = copy.staticHint;
  staticCopyButton.textContent = copy.staticCopy;
  staticDemoLink.textContent = copy.staticDemo;
  componentDemoLink.textContent = copy.componentDemo;
  const prefectureOptions = prefectures.map(prefecture => `<option value="${prefecture.code}">${prefecture.names[locale]}</option>`).join('');
  prefectureSelect.innerHTML = prefectureOptions;
  desktopPrefectureSelect.innerHTML = prefectureOptions;
  prefectureSelect.value = selectedPrefecture;
  desktopPrefectureSelect.value = selectedPrefecture;
  const levelOptions = levelLabels[locale].map((item, level) => `<option value="${level}">Level ${level} · ${item.label}</option>`).join('');
  mobileLevelSelect.innerHTML = levelOptions;
  desktopLevelSelect.innerHTML = levelOptions;
  mobileLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
  desktopLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
  levelList.innerHTML = levelLabels[locale].map((item, level) => `<li class="level-item"><span class="level-swatch" data-level="${level}" aria-hidden="true"></span><span class="level-copy"><strong>Level ${level} · ${item.label}</strong> — ${item.description}</span></li>`).join('');
  decorateMap();

  updateGeneratedCode();
}

function setPrefectureLevel(code: PrefectureCode, level: 0 | 1 | 2 | 3 | 4 | 5, restoreFocus = false) {
  const next = { ...levels };
  if (level === 0) delete next[code];
  else next[code] = level;
  levels = next;
  selectedPrefecture = code;
  update();
  if (!restoreFocus) return;

  const name = prefectures.find(prefecture => prefecture.code === code)?.names[preview.locale] ?? code;
  mapActionStatus.textContent = `${name} 已設為 Level ${level}。`;
  window.requestAnimationFrame(() => preview.shadowRoot?.querySelector<SVGGElement>(`[data-code="${code}"]`)?.focus());
}

function selectPrefecture(target: EventTarget | null, restoreFocus = false) {
  const element = target instanceof Element ? target.closest<SVGGElement>('.jpm-prefecture') : null;
  const code = element?.dataset.code as PrefectureCode | undefined;
  if (!code) return;
  setPrefectureLevel(code, (((levels[code] ?? 0) + 1) % 6) as 0 | 1 | 2 | 3 | 4 | 5, restoreFocus);
}

preview.shadowRoot?.addEventListener('click', event => selectPrefecture(event.target));
preview.shadowRoot?.addEventListener('keydown', event => {
  if (!(event instanceof KeyboardEvent)) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  selectPrefecture(event.target, true);
});

localeSelect.addEventListener('change', () => {
  mapActionStatus.textContent = '';
  update();
});
themeSelect.addEventListener('change', update);
[styleAccent, styleLevelOne, styleLevelTwo, styleLevelThree, styleLevelFour, styleLevelFive].forEach(input => input.addEventListener('input', refreshAppearance));
styleDensity.addEventListener('change', refreshAppearance);
styleGlow.addEventListener('change', refreshAppearance);
staticIdPrefix.addEventListener('input', () => {
  clearCopyStatus();
  updateGeneratedCode();
});
prefectureSelect.addEventListener('change', () => {
  selectedPrefecture = prefectureSelect.value as PrefectureCode;
  mobileLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
  desktopPrefectureSelect.value = selectedPrefecture;
  desktopLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
});
mobileLevelSelect.addEventListener('change', () => {
  setPrefectureLevel(selectedPrefecture, Number(mobileLevelSelect.value) as 0 | 1 | 2 | 3 | 4 | 5);
});
desktopPrefectureSelect.addEventListener('change', () => {
  selectedPrefecture = desktopPrefectureSelect.value as PrefectureCode;
  prefectureSelect.value = selectedPrefecture;
  mobileLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
  desktopLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
});
desktopLevelSelect.addEventListener('change', () => {
  setPrefectureLevel(selectedPrefecture, Number(desktopLevelSelect.value) as 0 | 1 | 2 | 3 | 4 | 5);
});
componentPathButton.addEventListener('click', () => {
  track('select_component_path');
  setIntegrationPath('component', true);
});
staticPathButton.addEventListener('click', () => {
  track('select_static_path');
  setIntegrationPath('static', true);
});
componentDemoLink.addEventListener('click', () => track('open_component_demo'));
staticDemoLink.addEventListener('click', () => track('open_static_demo'));
window.addEventListener('popstate', () => setIntegrationPath(integrationPathFromLocation()));
resetButton.addEventListener('click', () => {
  const copy = editorCopy['zh-TW'];
  if (Object.keys(levels).length > 0 && !window.confirm(copy.resetConfirm)) return;
  levels = {};
  mapActionStatus.textContent = '';
  copyStatus.textContent = '';
  staticCopyStatus.textContent = '';
  update();
});

const svgStyleProperties = [
  'dominant-baseline',
  'fill',
  'fill-opacity',
  'font-family',
  'font-size',
  'font-weight',
  'letter-spacing',
  'opacity',
  'paint-order',
  'stroke',
  'stroke-linejoin',
  'stroke-opacity',
  'stroke-width',
  'text-anchor',
  'vector-effect',
  'writing-mode',
] as const;

function copyRenderedStyles(source: SVGSVGElement, target: SVGSVGElement) {
  const sourceElements = [source, ...source.querySelectorAll<SVGElement>('*')];
  const targetElements = [target, ...target.querySelectorAll<SVGElement>('*')];

  sourceElements.forEach((element, index) => {
    const targetElement = targetElements[index];
    if (!targetElement) return;
    const style = getComputedStyle(element);
    svgStyleProperties.forEach(property => targetElement.style.setProperty(property, style.getPropertyValue(property)));
  });
}

const svgNamespace = 'http://www.w3.org/2000/svg';

function svgElement<K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string>) {
  const element = document.createElementNS(svgNamespace, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function svgText(content: string, attributes: Record<string, string>) {
  const element = svgElement('text', attributes);
  element.textContent = content;
  return element;
}

async function mapPng(): Promise<Blob> {
  const map = preview.shadowRoot?.querySelector<SVGSVGElement>('.japan-map');
  const widget = preview.shadowRoot?.querySelector<HTMLElement>('.jpm-widget');
  const scoreElement = preview.shadowRoot?.querySelector<HTMLElement>('.jpm-score');
  const scoreLabel = preview.shadowRoot?.querySelector<HTMLElement>('.jpm-score-label');
  const levelZero = map?.querySelector<SVGElement>('.jpm-level-zero');
  const levelZeroStripe = map?.querySelector<SVGElement>('.jpm-level-zero-stripe');
  if (!map || !widget || !scoreElement || !scoreLabel || !levelZero || !levelZeroStripe) throw new Error('Map is not ready');

  const clone = map.cloneNode(true) as SVGSVGElement;
  copyRenderedStyles(map, clone);
  clone.setAttribute('x', '40');
  clone.setAttribute('y', '280');
  clone.setAttribute('width', '1120');
  clone.setAttribute('height', '1120');
  clone.removeAttribute('data-interactive');
  clone.querySelectorAll('[tabindex]').forEach(element => element.removeAttribute('tabindex'));
  clone.querySelectorAll<SVGTextElement>('.jpm-map-label').forEach(label => {
    const small = label.classList.contains('jpm-small-label');
    label.style.setProperty('font-size', preview.locale === 'en' ? (small ? '11px' : '14px') : (small ? '17px' : '22px'));
  });

  const widgetStyle = getComputedStyle(widget);
  const scoreStyle = getComputedStyle(scoreElement);
  const mutedColor = getComputedStyle(scoreLabel).color;
  const stats = getJapanStats(levels);
  const copy = uiCopy[preview.locale];
  const levelColors = [...levelList.querySelectorAll<HTMLElement>('.level-swatch')]
    .map(swatch => getComputedStyle(swatch).backgroundColor);
  const output = svgElement('svg', {
    xmlns: svgNamespace,
    viewBox: '0 0 1200 1500',
    width: '1200',
    height: '1500',
  });
  const background = svgElement('rect', {
    x: '0',
    y: '0',
    width: '1200',
    height: '1500',
    fill: widgetStyle.backgroundColor,
  });
  const defs = svgElement('defs', {});
  const levelZeroPattern = svgElement('pattern', {
    id: 'jpm-export-level-0',
    width: '12',
    height: '12',
    patternUnits: 'userSpaceOnUse',
    patternTransform: 'rotate(45)',
  });
  levelZeroPattern.append(
    svgElement('rect', { width: '12', height: '12', fill: getComputedStyle(levelZero).fill }),
    svgElement('rect', { width: '4', height: '12', fill: getComputedStyle(levelZeroStripe).fill }),
  );
  defs.append(levelZeroPattern);
  const commonText = {
    fill: widgetStyle.color,
    'font-family': widgetStyle.fontFamily,
  };

  output.append(
    defs,
    background,
    svgText('Japan Prefecture Map', {
      ...commonText,
      x: '52',
      y: '52',
      'font-size': '27',
      'font-weight': '700',
      'letter-spacing': '-0.4',
    }),
    svgText(copy.title, {
      ...commonText,
      x: '52',
      y: '84',
      fill: mutedColor,
      'font-size': '19',
    }),
    svgText(copy.score, {
      ...commonText,
      x: '52',
      y: '135',
      fill: mutedColor,
      'font-size': '20',
      'font-weight': '700',
    }),
    svgText(String(stats.score), {
      ...commonText,
      x: '52',
      y: '225',
      fill: scoreStyle.color,
      'font-size': '86',
      'font-weight': '700',
    }),
  );

  [
    { label: copy.visited, value: `${stats.visited} / ${stats.total}`, x: 650 },
    { label: copy.stayed, value: String(stats.stayed), x: 835 },
    { label: copy.lived, value: String(stats.lived), x: 1020 },
  ].forEach(stat => {
    output.append(
      svgText(stat.label, {
        ...commonText,
        x: String(stat.x),
        y: '138',
        fill: mutedColor,
        'font-size': '19',
      }),
      svgText(stat.value, {
        ...commonText,
        x: String(stat.x),
        y: '205',
        'font-size': '42',
        'font-weight': '600',
      }),
    );
  });

  output.append(
    clone,
    svgText(copy.legend, {
      ...commonText,
      x: '52',
      y: '380',
      'font-size': '22',
      'font-weight': '700',
    }),
  );

  levelLabels[preview.locale].forEach((item, level) => {
    const y = 418 + (level * 43);
    output.append(
      svgElement('rect', {
        x: '52',
        y: String(y - 20),
        width: '24',
        height: '24',
        rx: '5',
        fill: level === 0 ? "url('#jpm-export-level-0')" : (levelColors[level] ?? 'transparent'),
      }),
      svgText(`Level ${level} · ${item.label}`, {
        ...commonText,
        x: '90',
        y: String(y),
        fill: level === 0 ? mutedColor : widgetStyle.color,
        'font-size': '20',
        'font-weight': '600',
      }),
    );
  });

  output.append(
    svgText('github.com/HeiTang/Japan-Prefecture-Map', {
      ...commonText,
      x: '52',
      y: '1460',
      fill: mutedColor,
      'font-size': '18',
    }),
    svgText('Based on JapanEx', {
      ...commonText,
      x: '1148',
      y: '1460',
      fill: mutedColor,
      'font-size': '18',
      'text-anchor': 'end',
    }),
  );

  const svgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(output)], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    image.src = svgUrl;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1500;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is not available');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG encoding failed')), 'image/png');
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

exportButton.addEventListener('click', async () => {
  const copy = editorCopy['zh-TW'];
  exportButton.disabled = true;
  exportButton.setAttribute('aria-busy', 'true');
  mapActionStatus.textContent = '';

  try {
    const pngUrl = URL.createObjectURL(await mapPng());
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = 'japan-prefecture-map.png';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(pngUrl), 0);
    mapActionStatus.textContent = copy.exported;
    track('download_png');
  } catch {
    mapActionStatus.textContent = copy.exportError;
  } finally {
    exportButton.disabled = false;
    exportButton.removeAttribute('aria-busy');
  }
});

copyButton.addEventListener('click', async () => {
  const copy = editorCopy['zh-TW'];
  try {
    await navigator.clipboard.writeText(markup.textContent ?? '');
    copyStatus.textContent = copy.copied;
    track('copy_embed_code');
  } catch {
    copyStatus.textContent = copy.copyError;
  }
});

staticCopyButton.addEventListener('click', async () => {
  const copy = editorCopy['zh-TW'];
  try {
    await navigator.clipboard.writeText(staticMarkup.textContent ?? '');
    staticCopyStatus.textContent = copy.staticCopied;
    track('copy_static_code');
  } catch {
    staticCopyStatus.textContent = copy.staticCopyError;
  }
});

localeSelect.value = 'zh-TW';
update();
