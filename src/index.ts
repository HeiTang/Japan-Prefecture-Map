import {
  isLocale,
  isTheme,
  sparseLevels,
  uiCopy,
  validateLevels,
  type JapanMapLocale,
  type JapanMapTheme,
  type PrefectureLevels,
} from './model.js';
import { renderWidget, widgetStyles } from './render.js';

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

  ${widgetStyles}

  .jpm-error {
    margin: 0;
    padding: 1.25rem;
    color: #d92d20;
    font-weight: 700;
  }
`;

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

    try {
      const levels = this.#readLevels();
      this.#root.innerHTML = `<style>${styles}</style>${renderWidget(levels, locale, { theme })}`;

      if (!this.#animated && Object.values(levels).some(level => level > 0)) {
        this.#animated = true;
        requestAnimationFrame(() => void this.#animateScore());
      }
    } catch {
      this.#root.innerHTML = `<style>${styles}</style><section class="jpm-widget" part="widget" data-theme="${theme}" lang="${locale}" role="alert"><p class="jpm-error">${uiCopy[locale].error}</p></section>`;
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

    for (let index = 0; index < digits.length; index += 1) {
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
