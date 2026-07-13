# japan-prefecture-map

A dependency-free Web Component for showing travel levels across Japan's 47 prefectures.

- Full widget: score, travel stats, SVG map, and level legend
- `zh-TW`, `ja`, and `en`
- `light`, `dark`, and system-aware `auto` themes
- Shadow DOM style isolation
- SSR-safe data helpers
- No runtime dependencies

## Install

```sh
npm install japan-prefecture-map
```

Import the custom element from client-side code:

```ts
import 'japan-prefecture-map';
```

Then render it with a JSON object keyed by two-digit JIS prefecture codes:

```html
<japan-prefecture-map
  locale="en"
  theme="auto"
  levels='{"01":4,"13":4,"27":5}'
></japan-prefecture-map>
```

Missing prefectures default to Level 0. Invalid codes, non-integers, or values outside 0–5 render an error instead of a misleading empty map.

## JavaScript API

```ts
import 'japan-prefecture-map';
import type { PrefectureLevels } from 'japan-prefecture-map/data';

const levels = {
  '01': 4,
  '13': 4,
  '27': 5,
} satisfies PrefectureLevels;

const map = document.querySelector('japan-prefecture-map');
if (map) map.levels = levels;
```

Attributes and properties:

| Name | Values | Default |
| --- | --- | --- |
| `levels` | JSON object with JIS codes `01`–`47` and levels `0`–`5` | `{}` |
| `locale` | `zh-TW`, `ja`, `en` | `zh-TW` |
| `theme` | `light`, `dark`, `auto` | `auto` |

## Astro

Keep SEO and structured data server-rendered by importing helpers from the DOM-free data entrypoint:

```astro
---
import { getJapanStats, type PrefectureLevels } from 'japan-prefecture-map/data';

const levels = { '01': 4, '13': 4, '27': 5 } satisfies PrefectureLevels;
const stats = getJapanStats(levels);
---

<h1>Japan Prefecture Map — Level {stats.score}</h1>
<japan-prefecture-map
  locale="en"
  theme="auto"
  levels={JSON.stringify(levels)}
></japan-prefecture-map>

<script>
  import 'japan-prefecture-map';
</script>
```

## Theme variables

Override only what your site needs:

```css
japan-prefecture-map {
  --jpm-accent: #0ea5e9;
  --jpm-level-4: #0284c7;
  --jpm-level-5: #075985;
}
```

Available variables: `--jpm-surface`, `--jpm-surface-raised`, `--jpm-text`, `--jpm-muted`, `--jpm-border`, `--jpm-accent`, `--jpm-level-0`, `--jpm-level-0-stripe`, and `--jpm-level-1` through `--jpm-level-5`.

## Data helpers

```ts
import {
  getJapanStats,
  levelLabels,
  locales,
  prefectures,
  themes,
} from 'japan-prefecture-map/data';
```

`getJapanStats(levels)` returns:

```ts
{
  score: number;
  total: 47;
  visited: number; // level > 0
  stayed: number;  // level >= 4
  lived: number;   // level === 5
}
```

## Accessibility

The map has an accessible title and description, every prefecture exposes its localized name and level, the legend uses native `<details>`, and the score animation respects `prefers-reduced-motion`.

The component intentionally does not render a page heading, breadcrumb, metadata, or JSON-LD. The host page owns those semantics.

## License

MIT. SVG geometry is adapted from [ukyouz/JapanEx](https://github.com/ukyouz/JapanEx) under the MIT License. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
