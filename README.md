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
  <strong><a href="https://japanmap.purr.tw/">開啟 Japan Prefecture Map Editor →</a></strong>
</p>

## 這是什麼？

Japan Prefecture Map 是基於 [JapanEx](https://github.com/ukyouz/JapanEx) 地圖幾何與制縣等級概念的可嵌入日本 47 都道府縣地圖，讓你以 0–5 級記錄在日本各地的通過、到訪、住宿與居住經驗。

同一份旅行資料可選兩條整合路徑：Web Component 會在瀏覽器顯示完整卡片；Static SVG（SSR / SSG）則在伺服器端或建置時直接輸出純 SVG，不載入前端 JavaScript。

它提供：

- 一張完整的日本 47 都道府縣地圖
- Web Component 的旅行程度、總分與簡單統計
- Static SVG 的純地圖輸出
- 繁體中文、日文、英文
- 不依賴帳號、資料庫或外部服務


## 開始使用

### 選擇整合方式

| 你的需求 | 選擇 | 會得到 |
| --- | --- | --- |
| 想直接貼入完整旅遊卡片，需要分數、統計、圖例與主題 | [Web Component](#web-component) | 瀏覽器端元件與完整 UI |
| 只想要地圖、靜態 HTML、零前端 JavaScript | [Static SVG](#static-svg-ssr--ssg) | 伺服器端或建置期輸出的可存取 SVG |
| 還不確定 | [🗺️ 線上編輯器](https://japanmap.purr.tw/) | 設定等級後分別複製兩種程式碼 |
| 想讓 AI 依網站環境完成整合 | [🤖 讓 AI 協助加入網站](https://github.com/HeiTang/Japan-Prefecture-Map/tree/main/skills/add-japan-prefecture-map) | 選擇適合的路徑、加入地圖並調整外觀 |

> [!NOTE]
> 兩條路徑共用 `levels` 與 `locale`。只有 Web Component 支援 `theme`、卡片外觀、統計列與 `::part()`。

### 🗺️ 線上編輯器

不必先手寫 47 個都道府縣的設定。線上編輯器可以完成設定並產生兩條路徑各自要貼進網站的內容。

**[開啟 Japan Prefecture Map Editor →](https://japanmap.purr.tw/)**

1. 選擇繁體中文、日文或英文，並點選都道府縣設定旅行等級。
2. 使用 Web Component 時，選擇亮色、暗色或跟隨系統主題，再按「複製嵌入碼」。
3. 使用 Static SVG 時，展開「使用 SSR SVG（Astro）」並複製對應程式碼；它不會帶入 `theme`。

設定完成後，直接複製對應程式碼貼進網站；日後只要回到編輯器更新設定，再貼回原本位置即可。

### 🤖 讓 AI 協助加入網站

即使沒有下載這個專案，也可以把以下提示貼給支援 Skills 的 AI：

```text
請使用這個 Skill，協助我把 Japan Prefecture Map 加入目前的網站：

https://github.com/HeiTang/Japan-Prefecture-Map/tree/main/skills/add-japan-prefecture-map
```

Skill 會檢查你的網站環境，並依需求選擇 Web Component 或 Static SVG，再完成安裝、地圖設定與外觀調整。

## 共用資料與等級

### 等級代表什麼？

每個都道府縣只記錄最高等級：

| 等級 | 意義 |
| ---: | --- |
| 0 | 尚未去過 |
| 1 | 只是經過，沒有下車 |
| 2 | 下車、轉車或短暫停留 |
| 3 | 去玩或一日遊，但沒有過夜 |
| 4 | 至少住過一晚 |
| 5 | 曾經長期生活或工作 |

### 設定 levels

使用日本官方的兩位數都道府縣代碼（JIS）：

```ts
import type { PrefectureLevels } from 'japan-prefecture-map/data';

const levels: PrefectureLevels = {
  '01': 4, // 北海道：住過
  '13': 4, // 東京：住過
  '27': 5, // 大阪：曾經生活或工作
};
```

levels 是稀疏資料：沒有寫入的都道府縣就是 Level 0。代碼使用 JIS `01`–`47`，等級限 `0`–`5`。

### 統計資料

兩條路徑都可在自己的程式中取得統計：

```ts
import { getJapanStats } from 'japan-prefecture-map/data';

getJapanStats({ '01': 4, '13': 4, '27': 5 });
// {
//   score: 13,
//   total: 47,
//   visited: 3,
//   stayed: 3,
//   lived: 1,
// }
```

Web Component 會自動顯示這些數字；Static SVG 只輸出地圖，若需要分數、統計或圖例，可用這個函式依網站版面自行排出。

## Static SVG (SSR / SSG)

適合靜態網站、伺服器端渲染、無 hydration，或頁面本身已有統計與版面、只想嵌入地圖的情況。

`renderMap()` 回傳的是單一可存取 SVG，不會產生 Web Component 卡片、分數、統計、圖例、`theme` 行為或 `part`。

### Astro 範例

```astro
---
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import { mapStyles, renderMap } from 'japan-prefecture-map/render';

const levels = { '01': 4, '13': 4, '27': 5 } satisfies PrefectureLevels;
---

<style is:inline set:html={mapStyles}></style>
<div set:html={renderMap(levels, 'zh-TW')} />
<small>
  Made by <a href="https://github.com/HeiTang">HeiTang</a>
  · Map geometry based on
  <a href="https://github.com/ukyouz/JapanEx">JapanEx</a> (MIT)
</small>
```

> [!IMPORTANT]
> `mapStyles` 每頁或共用 layout 只需引入一次。Static SVG 路徑不要同時匯入根入口 `japan-prefecture-map`，也不要加入 `theme`。

Astro 範例同樣適用於 Next.js、React Router / Remix、Nuxt、SvelteKit、SolidStart、Vite SSR，以及其他可在伺服器端或建置期載入 ESM 的 SSR / SSG 架構；差別只有各框架插入原始 HTML 字串的語法。Hugo、Jekyll、純 HTML 與多數 CMS 預設應使用 Web Component；如要 Static SVG，請由 Node 建置步驟預先產出 SVG 或 HTML。無論使用哪個架構，都請把 credit 與地圖放在一起。需要分數、統計或圖例時，用 `getJapanStats` 和網站既有元件自行排版。

### Static SVG 地圖樣式

Static SVG 只讀地圖相關變數。將它們放在 `.japan-map` 或包住它的容器：

| 類別 | 變數 | 預設值 |
| --- | --- | --- |
| 字型 | `--jpm-map-font` | `ui-sans-serif, system-ui, sans-serif` |
| 等級 0 | `--jpm-level-0` | `#252b35` |
| 等級 0 斜線 | `--jpm-level-0-stripe` | `#39404c` |
| 等級 1 | `--jpm-level-1` | `#ffe3d6` |
| 等級 2 | `--jpm-level-2` | `#ffc1a5` |
| 等級 3 | `--jpm-level-3` | `#ff9a6f` |
| 等級 4 | `--jpm-level-4` | `#f66f41` |
| 等級 5 | `--jpm-level-5` | `#c9461f` |

```css
.japan-map {
  --jpm-map-font: "Noto Sans JP", sans-serif;
  --jpm-level-4: #0284c7;
  --jpm-level-5: #075985;
}
```

Static SVG 不支援 `--jpm-surface`、`--jpm-map-glow`、`::part()` 或卡片相關樣式；這些只存在於 Web Component。

## Web Component

適合要直接嵌入完整旅遊卡片的網站。它會在瀏覽器顯示地圖、總分、統計、可展開圖例與 attribution。

### 有 Vite、Astro 或其他前端專案

```sh
npm install japan-prefecture-map
```

```ts
import 'japan-prefecture-map';
```

```html
<japan-prefecture-map
  locale="zh-TW"
  theme="auto"
  levels='{"01":4,"13":4,"27":5}'
></japan-prefecture-map>
```

### 只有一個 HTML 檔案

不需要另外安裝工具，直接載入瀏覽器模組即可：

```html
<!doctype html>
<html lang="zh-Hant">
  <body>
    <japan-prefecture-map levels='{"13":4,"27":5}'></japan-prefecture-map>

    <script type="module">
      import 'https://cdn.jsdelivr.net/npm/japan-prefecture-map@0.2.1/dist/index.js';
    </script>
  </body>
</html>
```

### 設定資料

將前一節的 `levels` 寫入元素屬性即可：

```ts
const map = document.querySelector('japan-prefecture-map');
if (map) map.setAttribute('levels', JSON.stringify(levels));
```

也可以直接使用 HTML 屬性：

```html
<japan-prefecture-map
  locale="en"
  theme="dark"
  levels='{"01":4,"13":4,"27":5}'
></japan-prefecture-map>
```

#### 可用設定

| 名稱 | 可用值 | 預設值 |
| --- | --- | --- |
| `levels` | JIS 代碼對應 `0`–`5` | `{}` |
| `locale` | `zh-TW`、`ja`、`en` | `zh-TW` |
| `theme` | `light`、`dark`、`auto` | `auto` |

輸入未知縣市、非整數或 `0`–`5` 以外的數字時，Web Component 會顯示錯誤訊息，不會悄悄產生錯誤地圖。錯誤的語言會回到繁體中文，錯誤的主題會回到自動模式。

## Web Component 外觀與相容性

### 卡片與完整 UI

這一節只說完整卡片的外觀。將變數放在 `japan-prefecture-map`；Static SVG 的可用變數已列在前面的 [Static SVG 地圖樣式](#static-svg-地圖樣式)。

| 類別 | 變數 | 預設值 | 控制內容 |
| --- | --- | --- | --- |
| 卡片 | `--jpm-surface` | 深色 `#11151c`；淺色 `#f7f4ef` | 元件卡片主背景 |
| 卡片 | `--jpm-surface-raised` | 深色 `#1b212b`；淺色 `#fff` | 分數數字、圖例按鈕等凸起區塊背景 |
| 文字 | `--jpm-text` | 深色 `#f7f8fa`；淺色 `#20252d` | 元件主要文字 |
| 文字 | `--jpm-muted` | 深色 `#9aa5b4`；淺色 `#626c79` | 分數標籤、統計標籤等次要文字 |
| 邊框 | `--jpm-border` | 深色 `rgba(255, 255, 255, 0.1)`；淺色 `rgba(32, 37, 45, 0.14)` | 卡片、分數數字、圖例按鈕與色塊邊框 |
| 強調色 | `--jpm-accent` | `#ff8c61` | 分數數字與預設地圖光暈的基準色 |
| 地圖 | `--jpm-map-glow` | 以 `--jpm-accent` 產生的中央 radial glow | 地圖後方光暈；設為 `none` 關閉 |

`theme="auto"` 依系統設定使用深色或淺色預設值。地圖標籤字型與各等級顏色見 [Static SVG 地圖樣式](#static-svg-地圖樣式)。

### 常見覆寫

#### Web Component：調整地圖配色

```css
japan-prefecture-map {
  --jpm-accent: #0ea5e9;
  --jpm-level-4: #0284c7;
  --jpm-level-5: #075985;
}
```

#### Web Component：讓地圖融入既有版面

```css
japan-prefecture-map {
  --jpm-surface: transparent;
  --jpm-surface-raised: transparent;
  --jpm-border: transparent;
  --jpm-map-glow: none;
}
```

### Web Component：用 `part` 隱藏或改寫內建區塊

這是 Web Component 的公開 `part` API：元件 Shadow DOM 裡的每個可客製區塊都標上名稱，外部可用 [`::part()`](https://developer.mozilla.org/docs/Web/CSS/::part) 改樣式。

Static SVG 路徑的 `renderMap()` 只輸出 SVG，沒有 Shadow DOM 或 `part`，因此不能使用 `::part()`；請直接對 `.japan-map` 或外層容器寫一般 CSS。

| `part` 名稱 | 對應區塊 |
| --- | --- |
| `widget` | 整張卡片 |
| `summary` | 上方的分數與統計列 |
| `score` | 分數的翻牌數字 |
| `stats` | 已踏足／住宿以上／居住三個數字 |
| `map` | 地圖本身 |
| `legend` | 下方的 0–5 分級 |

如果頁面上已經有自己的標題與統計，只想留地圖：

```css
japan-prefecture-map::part(summary),
japan-prefecture-map::part(legend) {
  display: none;
}

japan-prefecture-map::part(widget) {
  border: 0;
  background: none;
}
```

`::part()` 只能改樣式，不能改變區塊的順序或內容；也無法選取區塊內部的元素（例如 `::part(summary) .score` 無效），所以需要單獨控制的區塊都已經各自標好 part。

## 專案範圍

這個套件只負責旅行等級的呈現：

- Web Component 額外提供分數、統計與圖例。
- Static SVG 只提供地圖本身。
- 不會自動記錄你的旅行
- 不會儲存資料或建立帳號
- 不會提供旅遊路線或景點推薦
- 不會替你的網站產生頁面標題、導覽列或搜尋引擎資料

資料儲存、搜尋引擎呈現方式和互動編輯由使用它的網站決定。專案內的 `demo/` 是設定等級並產生 Web Component 或 Static SVG 程式碼的編輯器。公開元件本身預設是唯讀的。

### 無障礙

- 兩條路徑的地圖都有標題、說明文字、各縣名稱與等級。
- Web Component 的圖例可以用鍵盤展開。
- Web Component 的分數動畫會遵守系統的「減少動態效果」設定。

### Web Component 瀏覽器支援

- 需要支援網站自訂元件（Custom Elements）、隔離樣式（Shadow DOM）和 SVG 的現代瀏覽器
- 目前 Chrome、Edge、Firefox、Safari 的近期版本可用；不支援 Internet Explorer

## 本機開發

```sh
npm install
npm run build       # 編譯程式並產生 site/
node scripts/server.mjs # 啟動本機展示頁
npm test            # 執行資料、安裝和瀏覽器測試
npm run pack:check  # 查看 npm 套件會包含哪些檔案
```

## 授權

MIT。地圖幾何資料改編自 [ukyouz/JapanEx](https://github.com/ukyouz/JapanEx)，同樣採 MIT 授權；詳細資訊見 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
