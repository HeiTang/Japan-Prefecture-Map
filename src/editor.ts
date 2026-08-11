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
    description: '點擊地圖設定 Level 0–5，完成後複製嵌入碼。',
    github: '在 GitHub 查看原始碼',
    preview: '地圖預覽',
    controls: '編輯設定',
    locale: '語言',
    theme: '地圖主題',
    dark: '深色',
    light: '淺色',
    auto: '跟隨系統',
    guide: '等級說明',
    mobileEditor: '精準設定',
    prefecture: '都道府縣',
    level: '等級',
    embedGuide: '在網站中使用',
    copy: '複製嵌入碼',
    reset: '重設',
    resetConfirm: '確定要清除所有都道府縣等級嗎？',
    exportImage: '下載 PNG',
    exported: '圖片已下載',
    exportError: '圖片產生失敗，請再試一次',
    install: '先安裝套件，並在網站程式中匯入：',
    embed: '再貼入產生的元件：',
    copied: '嵌入碼已複製',
    copyError: '複製失敗，請手動選取嵌入碼',
  },
  ja: {
    subtitle: 'JapanExを基にした埋め込み可能な都道府県マップ',
    description: '地図でレベル0〜5を設定し、埋め込みコードをコピーします。',
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
    copy: '埋め込みコードをコピー',
    reset: 'リセット',
    resetConfirm: 'すべての都道府県レベルを消去しますか？',
    exportImage: 'PNGを保存',
    exported: '画像を保存しました',
    exportError: '画像を作成できませんでした。もう一度お試しください',
    install: 'パッケージをインストールし、サイトのコードで読み込みます：',
    embed: '生成されたコンポーネントを貼り付けます：',
    copied: '埋め込みコードをコピーしました',
    copyError: 'コピーできませんでした。コードを手動で選択してください',
  },
  en: {
    subtitle: 'A Web Component adaptation of JapanEx',
    description: 'Set Levels 0–5 on the map, then copy the embed code.',
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
    copy: 'Copy embed code',
    reset: 'Reset',
    resetConfirm: 'Clear all prefecture levels?',
    exportImage: 'Download PNG',
    exported: 'Image downloaded',
    exportError: 'Could not create the image. Try again.',
    install: 'Install the package and import it in your site code:',
    embed: 'Then paste the generated component:',
    copied: 'Embed code copied',
    copyError: 'Copy failed. Select the embed code manually.',
  },
} as const satisfies Record<JapanMapLocale, Record<string, string>>;

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`[japan-prefecture-map] missing editor element: ${selector}`);
  return element;
}

function track(event: 'copy_embed_code' | 'download_png') {
  (window as typeof window & { gtag?: (command: 'event', event: string) => void }).gtag?.('event', event);
}

const preview = required<JapanPrefectureMapElement>('#preview');
const previewSection = required<HTMLElement>('#preview-section');
const controls = required<HTMLElement>('#controls');
const pageSubtitle = required<HTMLElement>('#page-subtitle');
const pageDescription = required<HTMLElement>('#page-description');
const githubLink = required<HTMLAnchorElement>('#github-link');
const localeSelect = required<HTMLSelectElement>('#locale');
const localeLabel = required<HTMLLabelElement>('#locale-label');
const themeSelect = required<HTMLSelectElement>('#theme');
const themeLabel = required<HTMLLabelElement>('#theme-label');
const themeDark = required<HTMLOptionElement>('#theme-dark');
const themeLight = required<HTMLOptionElement>('#theme-light');
const themeAuto = required<HTMLOptionElement>('#theme-auto');
const mobileEditorTitle = required<HTMLElement>('#mobile-editor-title');
const prefectureLabel = required<HTMLLabelElement>('#prefecture-label');
const prefectureSelect = required<HTMLSelectElement>('#prefecture');
const mobileLevelLabel = required<HTMLLabelElement>('#mobile-level-label');
const mobileLevelSelect = required<HTMLSelectElement>('#mobile-level');
const levelGuideTitle = required<HTMLElement>('#level-guide-title');
const levelList = required<HTMLOListElement>('#level-list');
const embedGuideTitle = required<HTMLElement>('#embed-guide-title');
const markup = required<HTMLElement>('#markup');
const copyButton = required<HTMLButtonElement>('#copy');
const resetButton = required<HTMLButtonElement>('#reset');
const resetButtonLabel = required<HTMLElement>('#reset span');
const exportButton = required<HTMLButtonElement>('#export-image');
const exportButtonLabel = required<HTMLElement>('#export-image span');
const mapActionStatus = required<HTMLElement>('#map-action-status');
const copyStatus = required<HTMLElement>('#copy-status');
const installHint = required<HTMLElement>('#install-hint');
const embedHint = required<HTMLElement>('#embed-hint');

let levels: PrefectureLevels = {};
let selectedPrefecture: PrefectureCode = '01';

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
  const locale = preview.locale;
  const copy = editorCopy[locale];

  document.documentElement.lang = locale === 'zh-TW' ? 'zh-Hant' : locale;
  document.title = `${copy.subtitle} · Japan Prefecture Map`;
  pageSubtitle.textContent = copy.subtitle;
  pageDescription.textContent = copy.description;
  githubLink.setAttribute('aria-label', copy.github);
  githubLink.title = copy.github;
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
  installHint.textContent = copy.install;
  embedHint.textContent = copy.embed;
  prefectureSelect.innerHTML = prefectures.map(prefecture => `<option value="${prefecture.code}">${prefecture.names[locale]}</option>`).join('');
  prefectureSelect.value = selectedPrefecture;
  mobileLevelSelect.innerHTML = levelLabels[locale].map((item, level) => `<option value="${level}">Level ${level} · ${item.label}</option>`).join('');
  mobileLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
  levelList.innerHTML = levelLabels[locale].map((item, level) => `<li class="level-item"><span class="level-swatch" data-level="${level}" aria-hidden="true"></span><span class="level-copy"><strong>Level ${level} · ${item.label}</strong> — ${item.description}</span></li>`).join('');
  decorateMap();

  const value = JSON.stringify(sparseLevels(levels));
  markup.textContent = `<japan-prefecture-map\n  locale="${preview.locale}"\n  theme="${preview.theme}"\n  levels='${value}'\n></japan-prefecture-map>`;
}

function setPrefectureLevel(code: PrefectureCode, level: 0 | 1 | 2 | 3 | 4 | 5) {
  const next = { ...levels };
  if (level === 0) delete next[code];
  else next[code] = level;
  levels = next;
  selectedPrefecture = code;
  update();
}

function selectPrefecture(target: EventTarget | null) {
  const element = target instanceof Element ? target.closest<SVGGElement>('.prefecture') : null;
  const code = element?.dataset.code as PrefectureCode | undefined;
  if (!code) return;
  setPrefectureLevel(code, (((levels[code] ?? 0) + 1) % 6) as 0 | 1 | 2 | 3 | 4 | 5);
}

preview.shadowRoot?.addEventListener('click', event => selectPrefecture(event.target));
preview.shadowRoot?.addEventListener('keydown', event => {
  if (!(event instanceof KeyboardEvent)) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  selectPrefecture(event.target);
});

localeSelect.addEventListener('change', () => {
  mapActionStatus.textContent = '';
  copyStatus.textContent = '';
  update();
});
themeSelect.addEventListener('change', update);
prefectureSelect.addEventListener('change', () => {
  selectedPrefecture = prefectureSelect.value as PrefectureCode;
  mobileLevelSelect.value = String(levels[selectedPrefecture] ?? 0);
});
mobileLevelSelect.addEventListener('change', () => {
  setPrefectureLevel(selectedPrefecture, Number(mobileLevelSelect.value) as 0 | 1 | 2 | 3 | 4 | 5);
});
resetButton.addEventListener('click', () => {
  const copy = editorCopy[preview.locale];
  if (Object.keys(levels).length > 0 && !window.confirm(copy.resetConfirm)) return;
  levels = {};
  mapActionStatus.textContent = '';
  copyStatus.textContent = '';
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
  const widget = preview.shadowRoot?.querySelector<HTMLElement>('.widget');
  const scoreElement = preview.shadowRoot?.querySelector<HTMLElement>('.score');
  const scoreLabel = preview.shadowRoot?.querySelector<HTMLElement>('.score-label');
  const levelZero = map?.querySelector<SVGElement>('.level-zero');
  const levelZeroStripe = map?.querySelector<SVGElement>('.level-zero-stripe');
  if (!map || !widget || !scoreElement || !scoreLabel || !levelZero || !levelZeroStripe) throw new Error('Map is not ready');

  const clone = map.cloneNode(true) as SVGSVGElement;
  copyRenderedStyles(map, clone);
  clone.setAttribute('x', '40');
  clone.setAttribute('y', '280');
  clone.setAttribute('width', '1120');
  clone.setAttribute('height', '1120');
  clone.removeAttribute('data-interactive');
  clone.querySelectorAll('[tabindex]').forEach(element => element.removeAttribute('tabindex'));
  clone.querySelectorAll<SVGTextElement>('.map-label').forEach(label => {
    const small = label.classList.contains('small-label');
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
  const copy = editorCopy[preview.locale];
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
  const copy = editorCopy[preview.locale];
  try {
    await navigator.clipboard.writeText(markup.textContent ?? '');
    copyStatus.textContent = copy.copied;
    track('copy_embed_code');
  } catch {
    copyStatus.textContent = copy.copyError;
  }
});

const browserLanguage = navigator.languages.find(language => /^(zh|ja|en)(-|$)/i.test(language)) ?? 'en';
localeSelect.value = browserLanguage.toLowerCase().startsWith('zh') ? 'zh-TW' : browserLanguage.toLowerCase().startsWith('ja') ? 'ja' : 'en';
update();
