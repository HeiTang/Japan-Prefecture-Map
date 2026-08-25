<h1 align="center">Japan Prefecture Map</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/japan-prefecture-map">
    <img src="https://img.shields.io/npm/v/japan-prefecture-map?logo=npm&amp;label=npm" alt="npm version">
  </a>
  <a href="https://github.com/HeiTang/Japan-Prefecture-Map/actions/workflows/ci.yml">
    <img src="https://github.com/HeiTang/Japan-Prefecture-Map/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI status">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/HeiTang/Japan-Prefecture-Map?label=license" alt="MIT license">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/badge/runtime%20dependencies-0-2ea44f" alt="0 runtime dependencies">
  </a>
</p>

![Japan Prefecture Map：用地圖記錄你的日本旅程](https://raw.githubusercontent.com/HeiTang/Japan-Prefecture-Map/main/assets/japan-prefecture-map-preview.png)

<p align="center">
  <strong><a href="https://japanmap.purr.tw/">開啟 Editor</a></strong>
  ·
  <strong><a href="https://japanmap.purr.tw/ssr.html">查看零 JavaScript SSR demo</a></strong>
</p>

Japan Prefecture Map 是基於 [JapanEx](https://github.com/ukyouz/JapanEx) 地圖幾何與制縣等級概念的可嵌入日本 47 都道府縣地圖，讓你以 0–5 級記錄在日本各地的通過、到訪、住宿與居住經驗。

- **兩種整合路徑**：

  - **Web Component**：瀏覽器內執行的 `<japan-prefecture-map>`。

  - **Static HTML renderer**：Node、SSR 或 SSG 在建置時輸出 HTML。

- **可被搜尋與索引**：Static renderer 將地圖、縣名與等級直接輸出到 HTML

- **完整旅行呈現**：分數、統計、地圖、0–5 分級與 attribution

- **彈性輸出層級**：SVG 地圖、標準分級說明與完整制縣卡片

- **三語支援**：繁體中文、日文與英文

- **開放且獨立**：MIT 授權，無廣告、無帳號

> [!NOTE]
> `Static HTML` 描述的是輸出時機，不是單一畫面類型。它可以只輸出地圖、輸出標準分級說明，或輸出完整制縣卡片；只有這條路徑不載入 runtime JavaScript。

## 先選你想呈現的畫面

| 你需要什麼？ | 選擇 | 前端 JavaScript | 使用的 API 與 CSS |
| --- | --- | ---: | --- |
| 在瀏覽器中更新 `levels`、使用 Custom Element | Web Component | 需要 | `<japan-prefecture-map>` |
| SEO、Pagefind、零 hydration，但要完整分數與統計 | 完整制縣卡片 | 不需要 | `renderWidget()` + `widgetStyles` |
| 保留網站自己的標題、統計或版面，只借地圖與標準分級 | 地圖加分級說明 | 不需要 | `renderMap()` + `renderLegend()` + `mapStyles` + `legendStyles` |
| 只需要 47 都道府縣 SVG | 只放地圖 | 不需要 | `renderMap()` + `mapStyles` |

完整制縣卡片的組成如下：

```text
renderWidget()
├─ 分數與旅行統計
├─ renderMap()      地圖 SVG
└─ renderLegend()   0–5 分級、方法說明與 attribution
```

## 安裝與旅行資料

```sh
npm install japan-prefecture-map
```

每個都道府縣使用 JIS 兩位數代碼，未列出的縣預設為 Level 0。

```ts
import type { PrefectureLevels } from 'japan-prefecture-map/data';

const levels = {
  '01': 4, // 北海道：住宿
  '13': 4, // 東京：住宿
  '27': 5, // 大阪：居住
} satisfies PrefectureLevels;
```

| Level | 意義 |
| ---: | --- |
| 0 | 未踏：尚未到訪 |
| 1 | 通過：交通路過，未下車 |
| 2 | 接地：下車、轉乘或短暫休息 |
| 3 | 到訪：觀光或一日活動，未過夜 |
| 4 | 住宿：至少過夜一次 |
| 5 | 居住：曾長期生活或工作 |

若網站要自行顯示分數與統計，可使用：

```ts
import { getJapanStats } from 'japan-prefecture-map/data';

getJapanStats(levels);
// { score, total: 47, visited, stayed, lived }
```

## Web Component

適合需要在瀏覽器載入、更新 element attribute 或直接嵌入完整卡片的網站。

```html
<japan-prefecture-map
  locale="zh-TW"
  theme="auto"
  levels='{"01":4,"13":4,"27":5}'
></japan-prefecture-map>

<script type="module">
  import 'japan-prefecture-map';
</script>
```

Astro、Next.js 等 SSR 框架不要在伺服器端匯入 root entrypoint `japan-prefecture-map`，因為它需要瀏覽器的 Custom Elements API。Astro 請放在一般 `<script>`；Next.js 請在 Client Component 動態載入。

### 純 HTML 或沒有 bundler 的網站

使用固定版號的 jsDelivr URL，不要在已發佈網站使用 `@latest`：

```html
<japan-prefecture-map
  locale="zh-TW"
  theme="auto"
  levels='{"01":4,"13":4,"27":5}'
></japan-prefecture-map>

<script type="module">
  import 'https://cdn.jsdelivr.net/npm/japan-prefecture-map@0.3.0/dist/index.js';
</script>
```

### Web Component 屬性

| 屬性 | 可用值 | 預設值 | 用途 |
| --- | --- | --- | --- |
| `levels` | JIS 代碼對應 Level 0–5 的 JSON | `{}` | 旅行資料 |
| `locale` | `zh-TW`、`ja`、`en` | `zh-TW` | 縣名、統計、圖例語言 |
| `theme` | `light`、`dark`、`auto` | `auto` | 完整卡片的預設色系 |

## Static HTML renderer：不載入前端 JavaScript

`japan-prefecture-map/render` 不使用 `document`、`window` 或 Custom Elements，可在 Node、Astro frontmatter、Next Server Component、SSG build script 直接呼叫。

每個 renderer 回傳 HTML 字串；每頁或共用 layout 只插入**一次**對應的 CSS 字串。

| 你要呈現的畫面 | 呼叫 renderer | 需要插入的 CSS | 不要再插入 |
| --- | --- | --- | --- |
| 只放地圖 | `renderMap()` | `mapStyles` | `widgetStyles` |
| 加入標準分級說明 | `renderLegend()` | `legendStyles` | `widgetStyles` |
| 地圖加分級說明 | `renderMap()` + `renderLegend()` | `mapStyles` + `legendStyles` | `widgetStyles` |
| 完整制縣卡片 | `renderWidget()` | `widgetStyles` | `mapStyles`、`legendStyles` |

> [!NOTE]
> `widgetStyles` 已包含 `mapStyles` 與 `legendStyles`。使用 `renderWidget()` 時，不要再插入前兩者。

### 完整制縣卡片

適合想要完整分數、統計、地圖、0–5 分級與 attribution，但不想載入前端 JavaScript 的網站。

```astro
---
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import { renderWidget, widgetStyles } from 'japan-prefecture-map/render';

const levels = { '01': 4, '13': 4, '27': 5 } satisfies PrefectureLevels;
---

<style is:inline set:html={widgetStyles}></style>

<section class="my-japan-map">
  <div set:html={renderWidget(levels, 'zh-TW', {
    theme: 'auto',
    idPrefix: 'profile-japan-map',
  })}></div>
</section>
```

`theme` 只影響已輸出 HTML 的 CSS 預設值，沒有 hydration 或 runtime 行為。

### 地圖加分級說明

適合網站已有自己的標題、翻牌分數、統計列或版面，只需要標準地圖與 0–5 說明。

```astro
---
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import {
  legendStyles,
  mapStyles,
  renderLegend,
  renderMap,
} from 'japan-prefecture-map/render';

const levels = { '01': 4, '13': 4, '27': 5 } satisfies PrefectureLevels;
---

<style is:inline set:html={mapStyles}></style>
<style is:inline set:html={legendStyles}></style>

<section class="my-japan-map">
  <div set:html={renderMap(levels, 'zh-TW', {
    idPrefix: 'article-japan-map',
  })}></div>
  <div set:html={renderLegend('zh-TW', { open: true })}></div>
</section>
```

`renderLegend()` 已包含六級說明、方法說明與以下 attribution：

```text
Made by HeiTang · Map geometry based on JapanEx (MIT)
```

如果只想把標準分級說明放進 sidebar 或 footer，只保留 `renderLegend()` 與 `legendStyles` 即可：

```astro
---
import { legendStyles, renderLegend } from 'japan-prefecture-map/render';
---

<style is:inline set:html={legendStyles}></style>
<div set:html={renderLegend('zh-TW', { open: true })}></div>
```

### 只放地圖

適合已經有自己的圖例、統計或 attribution 排版，只需要 SVG。

```astro
---
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import { mapStyles, renderMap } from 'japan-prefecture-map/render';

const levels = { '01': 4, '13': 4, '27': 5 } satisfies PrefectureLevels;
---

<style is:inline set:html={mapStyles}></style>

<div set:html={renderMap(levels, 'zh-TW', {
  idPrefix: 'article-japan-map',
})}></div>

<small>
  Made by <a href="https://github.com/HeiTang">HeiTang</a>
  · Map geometry based on
  <a href="https://github.com/ukyouz/JapanEx">JapanEx</a> (MIT)
</small>
```

### Renderer 選項

| Renderer | 選項 | 用途 |
| --- | --- | --- |
| `renderMap()` | `idPrefix` | SVG title、description、pattern 的 ID 前綴 |
| `renderMap()` | `interactive` | 加入 keyboard focus 與按鈕語意；不會自動綁定 click handler |
| `renderLegend()` | `open` | 預設展開原生 `<details>` |
| `renderWidget()` | `idPrefix` | 內部地圖的 ID 前綴 |
| `renderWidget()` | `theme` | `light`、`dark`、`auto` 的靜態預設色系 |
| `renderWidget()` | `legendOpen` | 預設展開完整卡片內的圖例 |

> [!NOTE]
> 單張地圖可使用預設 `idPrefix`。同一頁有兩張以上 `renderMap()` 或 `renderWidget()` 時，必須為每張地圖設定不同前綴，避免 SVG 的 title、description 與 pattern ID 重複：

```ts
renderMap(firstLevels, 'zh-TW', { idPrefix: 'home-map' });
renderMap(secondLevels, 'ja', { idPrefix: 'article-map' });
```

## 外觀客製

Web Component 使用 `--jpm-*` token 與 `::part()`；Static renderer 使用 `--jpm-*` token 與輸出的 `.jpm-*` class。完整的 CSS 載入方式、token 相容性、公開 `part`、Static renderer class 與 Astro `:global()` 範例見 [Styling Japan Prefecture Map](./docs/styling.md)。

## Editor 與展示頁

- [Japan Prefecture Map Editor](https://japanmap.purr.tw/)：主入口。設定 locale、theme、levels 與外觀 CSS，選擇 Web Component 或 Static HTML 路徑並複製可直接使用的程式碼。
- [Web Component demo](https://japanmap.purr.tw/component.html)：在瀏覽器內即時更新 `levels`、`locale` 與 `theme`，檢視 Custom Element runtime 行為。
- [Static renderer demo](https://japanmap.purr.tw/ssr.html)：檢視沒有 custom element、hydration 或 `<script>` 的完整輸出，並以原生 disclosure 導覽 renderer、recipe 與樣式規則。

## 無障礙與限制

- 每張地圖都輸出 title、description、縣名、等級與對應的 `lang`。
- `renderLegend()` 使用原生 `<details>`，可用鍵盤展開。
- `renderMap(..., { interactive: true })` 只提供 keyboard focus 與按鈕語意；事件處理由呼叫端負責。
- Web Component 的分數動畫會遵守系統的「減少動態效果」設定。
- 套件不會儲存旅行資料、建立帳號、推薦景點或替網站建立頁面內容。

## 本機開發

```sh
npm install
npm run build       # 編譯並產生 site/
node scripts/server.mjs # 啟動本機 Editor、Web Component 與 SSR demo
npm test            # Node 與 Playwright 測試
npm run pack:check  # 檢查 npm tarball 內容
```

## 授權

MIT。地圖幾何資料改編自 [ukyouz/JapanEx](https://github.com/ukyouz/JapanEx)，同樣採 MIT 授權；詳細資訊見 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
