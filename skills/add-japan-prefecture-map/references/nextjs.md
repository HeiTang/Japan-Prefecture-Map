# Next.js

The package touches browser globals when imported. Do not import it from a Server Component.

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

Run the existing Next.js build. Also inspect the page in a browser when possible because a successful server build does not prove that the custom element registered after hydration.
