# Astro and Vite

## Astro

Choose the Web Component when the page needs the complete card. Use server-rendered SVG only when the user explicitly needs static HTML, no client JavaScript, or only the map.

### Web Component (default)

Install with the repository's existing package manager. Keep the generated custom element in the `.astro` template and import the package from a client-side script:

```astro
<section aria-labelledby="japan-map-title">
  <h1 id="japan-map-title">My Japan Travel Map</h1>
  <japan-prefecture-map
    locale="zh-TW"
    theme="auto"
    levels='{"01":4,"13":4,"27":5}'
  ></japan-prefecture-map>
</section>

<script>
  import 'japan-prefecture-map';
</script>
```

Do not import the root `japan-prefecture-map` entrypoint in Astro frontmatter. Frontmatter runs during server rendering, while the root entrypoint needs browser globals.

Place a site-wide import in a shared client script only when multiple pages use the component. Otherwise keep the import beside the page to avoid widening scope.

### Server-rendered SVG

`japan-prefecture-map/render` is DOM-free, so it is safe in frontmatter. It renders the map only: add surrounding title or statistics with the site's ordinary template code when needed.

```astro
---
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import { mapStyles, renderMap } from 'japan-prefecture-map/render';

const levels = {
  '01': 4,
  '13': 4,
  '27': 5,
} satisfies PrefectureLevels;
---

<section aria-labelledby="japan-map-title">
  <h1 id="japan-map-title">My Japan Travel Map</h1>
  <div set:html={renderMap(levels, 'zh-TW')} />
</section>
<style is:inline set:html={mapStyles}></style>
```

Include `mapStyles` once per page or shared layout. Do not import the root entrypoint or add a client script for this path.

## Browser-side Vite projects

Import the package once from the existing browser entry point:

```ts
import 'japan-prefecture-map';
```

Place the Editor-generated element in the existing template or page component. When the Vite project uses a UI framework, follow that framework's custom-element convention rather than adding a wrapper dependency.

## Verification

Run the existing build command. For the Web Component, confirm the custom element is registered and visible. For server-rendered SVG, confirm the generated HTML contains the SVG and inline map styles without a client package import.
