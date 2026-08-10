# Japan Prefecture Map

Japan Prefecture Map 是基於 [JapanEx](https://github.com/ukyouz/JapanEx) 地圖與制縣等級概念，重新製作成可嵌入任何網站的 Web Component。

用一張地圖記錄你在日本 47 個都道府縣的旅行經驗。

它是一個可以直接放進網站的地圖元件：設定每個縣的等級後，元件會顯示地圖、總分和統計數字。資料留在你的網站，不需要帳號，也不會連到外部服務。

你會得到：

- 一張完整的日本 47 都道府縣地圖
- 旅行程度、總分與簡單統計
- 繁體中文、日文、英文
- 明亮、暗黑和跟隨系統的主題
- 不依賴帳號、資料庫或外部服務

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
      import 'https://cdn.jsdelivr.net/npm/japan-prefecture-map@0.1.0/dist/index.js';
    </script>
  </body>
</html>
```

> CDN 方式需要先把套件發布到 npm。專案內也有可直接操作的編輯器：執行 `npm run build` 和 `node scripts/server.mjs`，再開啟 <http://127.0.0.1:4173>。

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

## 外觀與相容性

### 外觀調整

只覆寫需要的顏色即可：

```css
japan-prefecture-map {
  --jpm-accent: #0ea5e9;
  --jpm-level-4: #0284c7;
  --jpm-level-5: #075985;
}
```

可調整的變數包括 `--jpm-surface`、`--jpm-text`、`--jpm-muted`、`--jpm-border`、`--jpm-accent`，以及 `--jpm-level-0` 到 `--jpm-level-5`。

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
