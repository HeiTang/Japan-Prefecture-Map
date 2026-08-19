# Japan Prefecture Map

![Japan Prefecture Map：用地圖記錄你的日本旅程](https://raw.githubusercontent.com/HeiTang/Japan-Prefecture-Map/main/assets/japan-prefecture-map-preview.png)

Japan Prefecture Map 是基於 [JapanEx](https://github.com/ukyouz/JapanEx) 地圖與制縣等級概念，重新製作成可嵌入任何網站的 Web Component。

用一張地圖記錄你在日本 47 個都道府縣的旅行經驗。

它是一個可以直接放進網站的地圖元件：設定每個縣的等級後，元件會顯示地圖、總分和統計數字。資料留在你的網站，不需要帳號，也不會連到外部服務。

你會得到：

- 一張完整的日本 47 都道府縣地圖
- 旅行程度、總分與簡單統計
- 繁體中文、日文、英文
- 明亮、暗黑和跟隨系統的主題
- 不依賴帳號、資料庫或外部服務

## 用線上編輯器產生你的地圖

不必先手寫 47 個都道府縣的設定。線上編輯器可以直接完成設定並產生要貼進網站的內容。

**[開啟 Japan Prefecture Map Editor →](https://japanmap.purr.tw/)**

1. 選擇繁體中文、日文或英文
2. 選擇明亮、暗黑或跟隨系統主題
3. 點選都道府縣，設定各自的旅行等級
4. 按下「複製嵌入碼」，取得完整的地圖元件

編輯器會產生可以直接貼進網站的內容：

```html
<japan-prefecture-map
  locale="zh-TW"
  theme="auto"
  levels='{"01":4,"13":4,"27":5}'
></japan-prefecture-map>
```

貼上元件後，再依照下方方式載入套件即可顯示地圖。以後想修改，只要回到編輯器重新設定並替換這段內容。

## 讓 AI 協助加入網站

即使沒有下載這個專案，也可以把以下提示貼給支援 Skills 的 AI：

```text
請使用這個 Skill，協助我把 Japan Prefecture Map 加入目前的網站：

https://github.com/HeiTang/Japan-Prefecture-Map/tree/main/skills/add-japan-prefecture-map
```

Skill 會檢查你的網站環境，並引導你完成安裝、地圖設定與外觀調整。

## 快速開始

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
      import 'https://cdn.jsdelivr.net/npm/japan-prefecture-map@0.1.3/dist/index.js';
    </script>
  </body>
</html>
```

## 使用方式

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

### 設定資料

使用日本官方的兩位數都道府縣代碼（JIS）：

```ts
import type { PrefectureLevels } from 'japan-prefecture-map/data';

const levels = {
  '01': 4, // 北海道：住過
  '13': 4, // 東京：住過
  '27': 5, // 大阪：曾經生活或工作
} satisfies PrefectureLevels;

const map = document.querySelector('japan-prefecture-map');
if (map) map.levels = levels;
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

輸入未知縣市、非整數或 `0`–`5` 以外的數字時，元件會顯示錯誤訊息，不會悄悄產生錯誤地圖。錯誤的語言會回到繁體中文，錯誤的主題會回到自動模式。

### 統計資料

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

`japan-prefecture-map/data` 不會碰瀏覽器畫面，適合在 Astro 等伺服器端先產生標題、摘要或結構化資料。

### 在伺服器端直接輸出地圖

如果你的網站是 Astro、Next.js 這類會先產生 HTML 的框架，可以不載入 Web Component，改成在建置時就把地圖畫進 HTML：

```astro
---
import { mapStyles, renderMap } from 'japan-prefecture-map/render';

const levels = { '01': 4, '13': 4, '27': 5 };
---

<div set:html={renderMap(levels, 'zh-TW')} />
<style is:inline set:html={mapStyles}></style>
```

這條路徑不需要瀏覽器，也不會載入任何前端 JavaScript：地圖直接在 HTML 裡，搜尋引擎與站內搜尋可以讀到 47 個都道府縣的名稱與等級。代價是沒有 Web Component 附帶的分數、統計與圖例，這些要自己排版（`getJapanStats` 會給你需要的數字）。

`mapStyles` 讀的是同一組 `--jpm-level-*` 變數，所以配色調整方式跟 Web Component 一樣。

## 外觀與相容性

### 外觀變數完整對照

所有對外樣式都使用 `--jpm-*`；不要覆寫內部的 `--theme-*`。使用 Web Component 時，把變數放在 `japan-prefecture-map`；使用 SSR SVG 時，把可用變數放在包住 `.japan-map` 的容器或 `:root`。

| 類別 | 變數 | 預設值 | 控制內容 | 適用路徑 |
| --- | --- | --- | --- | --- |
| 卡片 | `--jpm-surface` | 深色 `#11151c`；淺色 `#f7f4ef` | 元件卡片主背景 | Web Component |
| 卡片 | `--jpm-surface-raised` | 深色 `#1b212b`；淺色 `#fff` | 分數數字、圖例按鈕等凸起區塊背景 | Web Component |
| 文字 | `--jpm-text` | 深色 `#f7f8fa`；淺色 `#20252d` | 元件主要文字 | Web Component |
| 文字 | `--jpm-muted` | 深色 `#9aa5b4`；淺色 `#626c79` | 分數標籤、統計標籤等次要文字 | Web Component |
| 邊框 | `--jpm-border` | 深色 `rgba(255, 255, 255, 0.1)`；淺色 `rgba(32, 37, 45, 0.14)` | 卡片、分數數字、圖例按鈕與色塊邊框 | Web Component |
| 強調色 | `--jpm-accent` | `#ff8c61` | 分數數字與預設地圖光暈的基準色 | Web Component |
| 地圖 | `--jpm-map-glow` | 以 `--jpm-accent` 產生的中央 radial glow | 地圖後方光暈；設為 `none` 關閉 | Web Component |
| 地圖 | `--jpm-map-font` | `ui-sans-serif, system-ui, sans-serif` | 都道府縣名稱字型 | Web Component、SSR SVG |
| 等級 0 | `--jpm-level-0` | `#252b35` | 未去過區域的底色 | Web Component、SSR SVG |
| 等級 0 | `--jpm-level-0-stripe` | `#39404c` | 未去過區域的斜線色 | Web Component、SSR SVG |
| 等級 1 | `--jpm-level-1` | `#ffe3d6` | 等級 1 區域色 | Web Component、SSR SVG |
| 等級 2 | `--jpm-level-2` | `#ffc1a5` | 等級 2 區域色 | Web Component、SSR SVG |
| 等級 3 | `--jpm-level-3` | `#ff9a6f` | 等級 3 區域色 | Web Component、SSR SVG |
| 等級 4 | `--jpm-level-4` | `#f66f41` | 等級 4 區域色 | Web Component、SSR SVG |
| 等級 5 | `--jpm-level-5` | `#c9461f` | 等級 5 區域色 | Web Component、SSR SVG |

`theme="auto"` 依系統設定使用深色或淺色預設值；只有表中標示「Web Component、SSR SVG」的變數會影響 `renderMap()` 輸出的地圖。

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

SSR 的 `renderMap()` 只輸出 SVG，沒有 Shadow DOM 或 `part`，因此不能使用 `::part()`；請直接對 `.japan-map` 或外層容器寫一般 CSS。

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

這個套件只負責「顯示地圖和統計」：

- 不會自動記錄你的旅行
- 不會儲存資料或建立帳號
- 不會提供旅遊路線或景點推薦
- 不會替你的網站產生頁面標題、導覽列或搜尋引擎資料

資料儲存、搜尋引擎呈現方式和互動編輯由使用它的網站決定。專案內的 `demo/` 只是一個方便設定等級並產生嵌入碼的編輯器。公開元件本身預設是唯讀的。

### 無障礙

- 地圖有標題與說明文字
- 每個縣都有名稱和等級
- 圖例可以用鍵盤展開
- 分數動畫會遵守系統的「減少動態效果」設定

### 瀏覽器支援

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
