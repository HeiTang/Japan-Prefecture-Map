import {
  getJapanStats,
  isLocale,
  isTheme,
  levelLabels,
  sparseLevels,
  uiCopy,
  validateLevels,
  type JapanMapLocale,
  type JapanMapTheme,
  type PrefectureLevels,
} from './model.js';
import { renderMap } from './render.js';

export type {
  JapanMapLocale,
  JapanMapTheme,
  PrefectureCode,
  PrefectureLevel,
  PrefectureLevels,
} from './model.js';

const styles = String.raw`
  :host {
    display: block;
    width: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget {
    --surface: var(--jpm-surface, var(--theme-surface));
    --surface-raised: var(--jpm-surface-raised, var(--theme-surface-raised));
    --text: var(--jpm-text, var(--theme-text));
    --muted: var(--jpm-muted, var(--theme-muted));
    --border: var(--jpm-border, var(--theme-border));
    --accent: var(--jpm-accent, #ff8c61);
    --level-0: var(--jpm-level-0, #252b35);
    --level-0-stripe: var(--jpm-level-0-stripe, #39404c);
    --level-1: var(--jpm-level-1, #ffe3d6);
    --level-2: var(--jpm-level-2, #ffc1a5);
    --level-3: var(--jpm-level-3, #ff9a6f);
    --level-4: var(--jpm-level-4, #f66f41);
    --level-5: var(--jpm-level-5, #c9461f);
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    background: var(--surface);
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .widget[data-theme='dark'],
  .widget[data-theme='auto'] {
    --theme-surface: #11151c;
    --theme-surface-raised: #1b212b;
    --theme-text: #f7f8fa;
    --theme-muted: #9aa5b4;
    --theme-border: rgba(255, 255, 255, 0.1);
    color-scheme: dark;
  }

  .widget[data-theme='light'] {
    --theme-surface: #f7f4ef;
    --theme-surface-raised: #fff;
    --theme-text: #20252d;
    --theme-muted: #626c79;
    --theme-border: rgba(32, 37, 45, 0.14);
    color-scheme: light;
  }

  @media (prefers-color-scheme: light) {
    .widget[data-theme='auto'] {
      --theme-surface: #f7f4ef;
      --theme-surface-raised: #fff;
      --theme-text: #20252d;
      --theme-muted: #626c79;
      --theme-border: rgba(32, 37, 45, 0.14);
      color-scheme: light;
    }
  }

  .summary {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem 2rem;
    align-items: end;
    justify-content: space-between;
    padding: clamp(1.25rem, 4vw, 2.5rem);
  }

  .score-label {
    display: block;
    margin-bottom: 0.45rem;
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .score {
    display: inline-flex;
    gap: 0.08em;
    perspective: 6em;
    color: var(--accent);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: clamp(2.5rem, 8vw, 4.75rem);
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    line-height: 1;
  }

  .score-digit {
    position: relative;
    display: inline-grid;
    width: 0.72em;
    height: 0.96em;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.1em;
    place-items: center;
    background: linear-gradient(to bottom, var(--surface-raised) 0 49%, var(--surface) 50% 100%);
    box-shadow: 0 0.08em 0.2em rgba(0, 0, 0, 0.24);
    transform-origin: center;
    backface-visibility: hidden;
  }

  .score-digit::after {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.36);
    content: '';
  }

  .score-digit.is-flipping {
    animation: score-flip 56ms linear;
  }

  @keyframes score-flip {
    0% { filter: brightness(1); transform: rotateX(0); }
    49% { filter: brightness(0.72); transform: rotateX(-88deg); }
    50% { filter: brightness(0.72); transform: rotateX(88deg); }
    100% { filter: brightness(1); transform: rotateX(0); }
  }

  .stats {
    display: flex;
    gap: clamp(1rem, 4vw, 2rem);
    margin: 0;
  }

  .stat {
    min-width: 3.5rem;
  }

  .stat dt {
    margin-bottom: 0.4rem;
    color: var(--muted);
    font-size: 0.72rem;
  }

  .stat dd {
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1.35rem;
    font-variant-numeric: tabular-nums;
  }

  .map-stage {
    padding: 0 clamp(0.25rem, 2vw, 1.5rem);
    background: var(--jpm-map-glow, radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 9%, transparent), transparent 64%));
  }

  .japan-map {
    display: block;
    width: 100%;
    height: auto;
  }

  .level-zero { fill: var(--level-0); }
  .level-zero-stripe { fill: var(--level-0-stripe); }

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

  .prefecture[data-level='1'] { fill: var(--level-1); }
  .prefecture[data-level='2'] { fill: var(--level-2); }
  .prefecture[data-level='3'] { fill: var(--level-3); }
  .prefecture[data-level='4'] { fill: var(--level-4); }
  .prefecture[data-level='5'] { fill: var(--level-5); }

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
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.02em;
    pointer-events: none;
  }

  .japan-map[data-locale='en'] .map-label { font-size: 11px; }
  .small-label { font-size: 14px; }
  .japan-map[data-locale='en'] .small-label { font-size: 9px; }
  .vertical-label { writing-mode: vertical-rl; }

  .legend {
    margin: 0;
    padding: 0 clamp(1.25rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2rem);
  }

  .legend summary {
    width: fit-content;
    min-height: 44px;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface-raised);
    cursor: pointer;
    color: var(--text);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .legend-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.85rem;
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
  }

  .legend-item {
    display: grid;
    grid-template-columns: 1.4rem 1fr;
    gap: 0.6rem;
    align-items: center;
  }

  .swatch {
    width: 1.4rem;
    aspect-ratio: 1;
    border: 1px solid var(--border);
    border-radius: 0.35rem;
  }

  .swatch[data-level='0'] { background: repeating-linear-gradient(45deg, var(--level-0) 0 6px, var(--level-0-stripe) 6px 12px); }
  .swatch[data-level='1'] { background: var(--level-1); }
  .swatch[data-level='2'] { background: var(--level-2); }
  .swatch[data-level='3'] { background: var(--level-3); }
  .swatch[data-level='4'] { background: var(--level-4); }
  .swatch[data-level='5'] { background: var(--level-5); }

  .legend-item strong,
  .legend-item small {
    display: block;
  }

  .legend-item strong { font-size: 0.78rem; }
  .legend-item small,
  .method,
  .credit { color: var(--muted); font-size: 0.72rem; line-height: 1.5; }
  .method { margin: 1rem 0 0; }
  .credit { margin: 0.35rem 0 0; }
  .credit a { color: var(--accent); }

  .error {
    margin: 0;
    padding: 1.25rem;
    color: #d92d20;
    font-weight: 700;
  }

  @media (max-width: 560px) {
    .summary { align-items: start; flex-direction: column; }
    .stats { width: 100%; justify-content: space-between; }
    .map-stage { margin-inline: -9%; }
    .legend-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .score-digit { animation: none !important; }
  }
`;

function digitsFor(score: number) {
  return String(score).split('').map(digit => `<span class="score-digit" data-score-digit="${digit}">${digit}</span>`).join('');
}

function legendFor(locale: JapanMapLocale) {
  return levelLabels[locale].map((item, level) => `<li class="legend-item"><span class="swatch" data-level="${level}" aria-hidden="true"></span><span><strong>Level ${level} · ${item.label}</strong><small>${item.description}</small></span></li>`).join('');
}

export class JapanPrefectureMapElement extends HTMLElement {
  static observedAttributes = ['levels', 'locale', 'theme'];

  readonly #root = this.attachShadow({ mode: 'open' });
  #connected = false;
  #animated = false;

  get levels(): PrefectureLevels {
    return this.#readLevels();
  }

  set levels(value: PrefectureLevels) {
    this.setAttribute('levels', JSON.stringify(sparseLevels(value)));
  }

  get locale(): JapanMapLocale {
    const locale = this.getAttribute('locale');
    return isLocale(locale) ? locale : 'zh-TW';
  }

  set locale(value: JapanMapLocale) {
    this.setAttribute('locale', isLocale(value) ? value : 'zh-TW');
  }

  get theme(): JapanMapTheme {
    const theme = this.getAttribute('theme');
    return isTheme(theme) ? theme : 'auto';
  }

  set theme(value: JapanMapTheme) {
    this.setAttribute('theme', isTheme(value) ? value : 'auto');
  }

  connectedCallback() {
    this.#connected = true;
    this.#render();
  }

  disconnectedCallback() {
    this.#connected = false;
  }

  attributeChangedCallback() {
    if (this.#connected) this.#render();
  }

  #readLevels() {
    const value = this.getAttribute('levels');
    return validateLevels(value ? JSON.parse(value) : {});
  }

  #render() {
    const locale = this.locale;
    const theme = this.theme;
    const copy = uiCopy[locale];

    try {
      const levels = this.#readLevels();
      const stats = getJapanStats(levels);

      this.#root.innerHTML = `<style>${styles}</style><section class="widget" data-theme="${theme}" lang="${locale}" aria-label="${copy.title}"><header class="summary"><div><span class="score-label">${copy.score}</span><div class="score" data-score="${stats.score}" aria-label="${copy.score} ${stats.score}">${digitsFor(stats.score)}</div></div><dl class="stats"><div class="stat"><dt>${copy.visited}</dt><dd>${stats.visited}<small> / ${stats.total}</small></dd></div><div class="stat"><dt>${copy.stayed}</dt><dd>${stats.stayed}</dd></div><div class="stat"><dt>${copy.lived}</dt><dd>${stats.lived}</dd></div></dl></header><div class="map-stage">${renderMap(levels, locale)}</div><details class="legend"><summary>${copy.legend}</summary><ol class="legend-list">${legendFor(locale)}</ol><p class="method">${copy.method}</p><p class="credit">${copy.source}: <a href="https://github.com/ukyouz/JapanEx" rel="external noopener">JapanEx</a> · MIT</p></details></section>`;

      if (!this.#animated && stats.score > 0) {
        this.#animated = true;
        requestAnimationFrame(() => void this.#animateScore());
      }
    } catch {
      this.#root.innerHTML = `<style>${styles}</style><section class="widget" data-theme="${theme}" lang="${locale}" role="alert"><p class="error">${copy.error}</p></section>`;
    }
  }

  async #animateScore() {
    if (!this.#connected || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const score = this.#root.querySelector<HTMLElement>('[data-score]');
    if (!score) return;

    const digits = [...score.querySelectorAll<HTMLElement>('[data-score-digit]')];
    const targets = digits.map(digit => Number(digit.dataset.scoreDigit));
    if (!targets.every(Number.isInteger)) return;

    const wait = (duration: number) => new Promise<void>(resolve => window.setTimeout(resolve, duration));
    const values = digits.map(() => 0);
    digits.forEach(digit => { digit.textContent = '0'; });

    for (const index of digits.keys()) {
      const activeDigits = digits.slice(index);
      const target = targets[index];
      if (target === undefined) continue;
      const flips = 10 + ((target - (values[index] ?? 0) + 10) % 10);

      for (let step = 0; step < flips; step += 1) {
        activeDigits.forEach(digit => {
          digit.classList.remove('is-flipping');
          void digit.offsetWidth;
          digit.classList.add('is-flipping');
        });
        await wait(28);
        activeDigits.forEach((digit, offset) => {
          const digitIndex = index + offset;
          const value = ((values[digitIndex] ?? 0) + 1) % 10;
          values[digitIndex] = value;
          digit.textContent = String(value);
        });
        await wait(28);
        activeDigits.forEach(digit => digit.classList.remove('is-flipping'));
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'japan-prefecture-map': JapanPrefectureMapElement;
  }
}

if (!customElements.get('japan-prefecture-map')) {
  customElements.define('japan-prefecture-map', JapanPrefectureMapElement);
}
