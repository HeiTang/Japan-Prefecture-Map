# Next.js

The root `japan-prefecture-map` entrypoint touches browser globals and must not be imported from a Server Component. `japan-prefecture-map/render` is DOM-free and is safe in a Server Component.

## Web Component (default)

Create one small Client Component and load the package after mount:

```tsx
'use client';

import { createElement, useEffect } from 'react';

export function JapanTravelMap() {
  useEffect(() => {
    void import('japan-prefecture-map');
  }, []);

  return createElement('japan-prefecture-map', {
    locale: 'zh-TW',
    theme: 'auto',
    levels: '{"01":4,"13":4,"27":5}',
  });
}
```

Replace the example values with the attributes copied from the Editor. Import this wrapper from the target page using the site's existing component conventions.

Keep the attributes as strings. Do not create a state layer or JSON file unless the host site already stores page content that way.

## Server-rendered SVG

Use this path only when the user explicitly needs static HTML, no hydration, or only the map. It does not include the component card, score, statistics, legend, or `theme` behavior.

```tsx
import type { PrefectureLevels } from 'japan-prefecture-map/data';
import { mapStyles, renderMap } from 'japan-prefecture-map/render';

const levels = {
  '01': 4,
  '13': 4,
  '27': 5,
} satisfies PrefectureLevels;

export function JapanTravelMapStatic() {
  return (
    <section aria-labelledby="japan-map-title">
      <h1 id="japan-map-title">My Japan Travel Map</h1>
      <div dangerouslySetInnerHTML={{ __html: renderMap(levels, 'zh-TW') }} />
      <style>{mapStyles}</style>
    </section>
  );
}
```

Pass only validated `locale` and `levels` to `renderMap`; never insert raw user HTML. Include `mapStyles` once per page or shared layout.

## Verification

Run the existing Next.js build. For the Web Component, inspect the page in a browser because a successful server build does not prove that the custom element registered after hydration. For server-rendered SVG, confirm the rendered HTML includes one `.japan-map` SVG, its styles, and no root package import or hydration requirement.
