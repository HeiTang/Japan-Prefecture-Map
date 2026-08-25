# Styling Japan Prefecture Map

這份文件說明如何調整 Japan Prefecture Map 的顏色、字型、背景與版面。

先確認你使用哪一條呈現路徑：

```text
Web Component
└─ <japan-prefecture-map>
   ├─ 內建 Shadow DOM 與 CSS
   ├─ 用 --jpm-* 調整視覺 token
   └─ 用 ::part() 調整公開區塊

Static renderer
└─ render*() 回傳 light DOM HTML 字串
   ├─ 呼叫端插入對應的 *Styles
   ├─ 用 --jpm-* 調整視覺 token
   └─ 用 .jpm-* class 調整輸出區塊
```

Static renderer 的三種輸出都不需要前端 JavaScript：

```text
renderMap()      只放地圖
renderLegend()   分級說明
renderWidget()   完整制縣卡片
```

完整的 renderer 整合範例見 [README](../README.md)。

## Web Component

> [!NOTE]
> `<japan-prefecture-map>` 自帶 Shadow DOM 與完整 CSS。不要插入 `mapStyles`、`legendStyles` 或 `widgetStyles`。

### 調整顏色與主題

將公開 `--jpm-*` token 設在 element 本身：

```css
japan-prefecture-map {
  --jpm-surface: #101820;
  --jpm-surface-raised: #192634;
  --jpm-text: #f4f8fb;
  --jpm-muted: #a4b4c6;
  --jpm-border: rgba(196, 219, 246, 0.16);
  --jpm-accent: #7be0b6;
  --jpm-map-glow: radial-gradient(circle, rgba(123, 224, 182, 0.16), transparent 66%);
  --jpm-map-font: "Noto Sans TC", sans-serif;
  --jpm-level-4: #3c9b7c;
  --jpm-level-5: #17684e;
}
```

`theme="light"`、`theme="dark"` 與 `theme="auto"` 提供預設配色。自行設定的 `--jpm-*` token 優先於 theme 預設值。

### 調整公開區塊

Web Component 不允許從外部直接選取 Shadow DOM 內的 `.jpm-*` class。請使用公開 `::part()`：

| `part` | 對應區塊 |
| --- | --- |
| `widget` | 整張卡片 |
| `summary` | 分數與統計列 |
| `score` | 翻牌分數 |
| `stats` | 已踏足、住宿以上、居住 |
| `map` | 地圖區域 |
| `legend` | 0–5 分級、方法說明與 attribution |

```css
japan-prefecture-map::part(summary) {
  padding-block: 2.5rem 1.5rem;
}

japan-prefecture-map::part(legend) {
  margin-inline: auto;
  max-width: 50rem;
}

japan-prefecture-map::part(widget) {
  max-width: 56rem;
  border-radius: 2rem;
}
```

請保留圖例中的旅行等級、方法說明與 JapanEx attribution；它們是元件輸出的必要脈絡。

## Static renderer

Static renderer 輸出普通 HTML。呼叫端負責把 CSS 字串插入頁面，也可以直接選取輸出的 `.jpm-*` class。

### 選擇輸出與 CSS

| Static renderer 輸出 | Renderer | 每頁插入一次的 CSS |
| --- | --- | --- |
| 只放地圖 | `renderMap()` | `mapStyles` |
| 分級說明 | `renderLegend()` | `legendStyles` |
| 地圖加分級說明 | `renderMap()` + `renderLegend()` | `mapStyles` + `legendStyles` |
| 完整制縣卡片 | `renderWidget()` | `widgetStyles` |

> [!NOTE]
> CSS 字串每頁或共用 layout 只插入一次。`widgetStyles` 已包含 `mapStyles` 與 `legendStyles`，因此使用 `renderWidget()` 時不可再插入前兩者。

Astro 範例：

```astro
---
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import { renderWidget, widgetStyles } from 'japan-prefecture-map/render';

const levels = { '01': 4, '13': 4, '27': 5 } satisfies PrefectureLevels;
---

<style is:inline set:html={widgetStyles}></style>
<div set:html={renderWidget(levels, 'zh-TW', {
  theme: 'auto',
  idPrefix: 'profile-japan-map',
})}></div>
```

### 調整顏色與主題

將 token 放在包住 renderer output 的外層容器，讓輸出的 HTML 繼承：

```astro
<section class="my-japan-map">
  <div set:html={renderWidget(levels, 'zh-TW', {
    theme: 'dark',
    idPrefix: 'travel-map',
  })}></div>
</section>

<style>
  .my-japan-map {
    --jpm-surface: #101820;
    --jpm-surface-raised: #192634;
    --jpm-text: #f4f8fb;
    --jpm-muted: #a4b4c6;
    --jpm-border: rgba(196, 219, 246, 0.16);
    --jpm-accent: #7be0b6;
    --jpm-level-4: #3c9b7c;
    --jpm-level-5: #17684e;
  }
</style>
```

`renderWidget(..., { theme })` 支援 `light`、`dark` 與 `auto`。`renderMap()` 與 `renderLegend()` 沒有 theme 選項，請改用 token 控制顏色。

### 調整輸出 HTML 的版面

> [!NOTE]
> Static renderer 在 light DOM 輸出，直接使用 `.jpm-*` class。Astro 的 `set:html` output 不會帶 Astro scoped attribute，因此選取 output 內部元素時請使用 `:global()`：

```css
.my-japan-map :global(.jpm-widget) {
  max-width: 56rem;
  border-radius: 2rem;
}

.my-japan-map :global(.jpm-summary) {
  padding-block: 2.5rem 1.5rem;
}

.my-japan-map :global(.jpm-map-stage) {
  padding-inline: 2rem;
}

.my-japan-map :global(.jpm-legend) {
  margin-inline: auto;
  max-width: 50rem;
}
```

| Static renderer class | 對應區塊 |
| --- | --- |
| `.jpm-widget` | 完整卡片 |
| `.jpm-summary` | 分數與統計列 |
| `.jpm-score` | 翻牌分數 |
| `.jpm-stats` | 已踏足、住宿以上、居住 |
| `.jpm-map-stage` | 地圖容器與 glow |
| `.japan-map` | SVG 本身 |
| `.jpm-prefecture` | 每個都道府縣 SVG group |
| `.jpm-map-label` | 地圖縣名 |
| `.jpm-legend` | 0–5 分級 `<details>` |
| `.jpm-legend-list` | 六級清單 |
| `.jpm-credit` | HeiTang 與 JapanEx attribution |

## CSS Token Reference

> [!NOTE]
> 所有公開樣式設定都使用 `--jpm-*`。`--jpm-widget-*` 與 `--jpm-theme-*` 是內部實作，不是公開設定 API。

### 地圖 token

| Token | 控制內容 |
| --- | --- |
| `--jpm-map-font` | 地圖縣名字型 |
| `--jpm-level-0` | 未踏底色 |
| `--jpm-level-0-stripe` | 未踏斜線 |
| `--jpm-level-1` 至 `--jpm-level-5` | 各旅行等級顏色 |
| `--jpm-focus-ring` | keyboard focus 外框 |

### 卡片與文字 token

| Token | 控制內容 |
| --- | --- |
| `--jpm-surface` | 完整卡片背景 |
| `--jpm-surface-raised` | 分數翻牌與圖例按鈕背景 |
| `--jpm-text` | 主要文字色 |
| `--jpm-muted` | 次要文字與 credit |
| `--jpm-border` | 卡片、圖例、色票邊框 |
| `--jpm-accent` | 分數、credit hover、預設 glow |
| `--jpm-map-glow` | 地圖後方光暈；設為 `none` 可關閉 |

### Token 相容矩陣

呈現路徑的關係如下：

```text
Web Component
└─ <japan-prefecture-map>

Static renderer
├─ 只放地圖：renderMap()
├─ 分級說明：renderLegend()
└─ 完整卡片：renderWidget()
```

| CSS token | Web Component<br>`<japan-prefecture-map>` | Static renderer<br>只放地圖 `renderMap()` | Static renderer<br>分級說明 `renderLegend()` | Static renderer<br>完整卡片 `renderWidget()` |
| --- | ---: | ---: | ---: | ---: |
| `--jpm-map-font` | 有 | 有 | 無 | 有 |
| `--jpm-level-0` | 有 | 有 | 有 | 有 |
| `--jpm-level-0-stripe` | 有 | 有 | 有 | 有 |
| `--jpm-level-1` 至 `--jpm-level-5` | 有 | 有 | 有 | 有 |
| `--jpm-focus-ring` | 有 | 僅 `interactive: true` | 有 | 有 |
| `--jpm-text` | 有 | 無 | 有 | 有 |
| `--jpm-muted` | 有 | 無 | 有 | 有 |
| `--jpm-border` | 有 | 無 | 有 | 有 |
| `--jpm-surface-raised` | 有 | 無 | 有 | 有 |
| `--jpm-accent` | 有 | 無 | 有 | 有 |
| `--jpm-surface` | 有 | 無 | 無 | 有 |
| `--jpm-map-glow` | 有 | 無 | 無 | 有 |
