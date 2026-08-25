---
name: add-japan-prefecture-map
description: Guide users through adding Japan Prefecture Map to an existing blog or website. Use when asked to install, embed, integrate, or configure japan-prefecture-map in Astro, Next.js, Vite, Hugo, Jekyll, or plain HTML. Inspect the project, offer guided choices, use the official Editor to collect locale, theme, and levels, then implement either the interactive Web Component or DOM-free server-rendered output as appropriate and verify the result.
---

# Add Japan Prefecture Map

Integrate Japan Prefecture Map into an existing site without making the user translate visual settings into framework code.

## Interaction rules

- Inspect the project before asking questions.
- Ask only about choices that cannot be inferred from files or the user's request.
- Ask one short question at a time. Offer two or three mutually exclusive options and put the recommended option first.
- Use a structured choice UI when available; otherwise use a numbered list.
- Match the user's language.
- Explain the visible result of each option in plain language. Do not ask the user to choose technical tools they do not need to understand.
- Preserve existing user changes. Do not commit, push, deploy, or change hosting settings without explicit permission.

## Workflow

### 1. Inspect the site

Determine:

- framework and rendering model;
- package manager from the lockfile;
- existing page, route, layout, and styling conventions;
- available build or test commands;
- current Git status when the project uses Git.

Do not ask the user which framework or package manager they use when the repository answers it.

Route framework-specific work as follows:

- Astro or a browser-side Vite project: read [references/astro-vite.md](references/astro-vite.md).
- Next.js: read [references/nextjs.md](references/nextjs.md).
- Hugo, Jekyll, or plain HTML without a client bundler: read [references/static-sites.md](references/static-sites.md).
- WordPress or a CMS that may strip scripts: report the limitation and ask whether the user can edit the theme or page template. Do not pretend a Custom HTML block can always load JavaScript.

### 2. Choose the placement

Skip this question if the user already named a target page or file. Otherwise ask:

1. Create a dedicated Japan travel map page (Recommended) — gives the map enough width and a stable URL.
2. Add it to the homepage — makes it immediately visible but uses more homepage space.
3. Add it to an existing page — keeps the current site structure.

If the user chooses an existing page, ask them to name it only when it cannot be identified from context.

### 3. Choose the installation path

Select automatically when the answer is clear:

- Use npm with the existing package manager for Astro, Next.js, or a project that already bundles client-side JavaScript.
- Use a version-pinned jsDelivr URL for plain HTML or a static template without a client bundler.

Ask only when both approaches are equally suitable. Recommend npm when a package manager already exists.

Resolve the current published version before installing or writing a CDN URL. Prefer `npm view japan-prefecture-map version`. If registry access is unavailable, use the version already documented by the project and state that it was not refreshed.

### 4. Collect the map settings from the Editor

Skip this step when the user already supplied a complete valid `<japan-prefecture-map>` element.

Open the Editor when browser control is available. Otherwise provide this link:

<https://japanmap.purr.tw/>

Tell the user:

> Set the language, theme, and prefecture levels in the Editor. When the map is ready, choose Copy embed code and paste the complete `<japan-prefecture-map>` element here.

Do not ask the user to paste JSON separately. The copied element is the configuration source of truth.

Accept the element with or without a Markdown code fence. Extract only:

- `locale`: `zh-TW`, `ja`, or `en`;
- `theme`: `light`, `dark`, or `auto`;
- `levels`: a JSON object whose keys are two-digit prefecture codes `01` through `47` and whose values are integers `0` through `5`.

Reject malformed JSON, unsupported attributes that execute code, invalid prefecture codes, and invalid levels. Explain the exact field to correct and direct the user back to the Editor when regeneration is easier.

### 5. Choose the rendering path

Select automatically when the request makes the answer clear:

1. Web Component (Recommended) — keeps the score, statistics, expandable legend, and Editor-generated embed element. Load it only in the browser.
2. Static widget — emits a complete card with score, statistics, expandable legend, attribution, and no client JavaScript. Use it when static HTML needs the complete presentation.
3. Static map — emits only the accessible SVG with no client JavaScript. Use it when the page already owns its statistics and layout, or only the map is needed.

Ask only when multiple paths fit. Do not make a user who only wants a map choose framework terminology.

### 6. Choose how the map fits the site

Skip this step for the static map path. It has no card surface or glow; use the host site's `--jpm-level-*` variables when map colours need adjustment. The static widget accepts the same `--jpm-*` appearance variables and a build-time `theme` option as the Web Component.

Skip this question when the user already chose an appearance. Otherwise inspect the target page, recommend the best fit, and ask with these choices:

1. Blend into the site — removes the card surfaces, border, and map glow.
2. Transparent with glow — removes the card surfaces and border but keeps the map glow.
3. Complete card — keeps the component's self-contained background, border, and glow.

Recommend blending when the page already has a designed background or container. Recommend the complete card on a plain content surface. Put the recommendation first and explain the visible result without asking about CSS variables.

Apply the selected appearance in the site's existing stylesheet:

```css
japan-prefecture-map {
  --jpm-surface: transparent;
  --jpm-surface-raised: transparent;
  --jpm-border: transparent;
  --jpm-map-glow: none;
}
```

For transparent with glow, omit `--jpm-map-glow`. For the complete card, add no appearance overrides. Do not change `theme`; it controls the component colors, not whether it has a card background.

When handing off appearance CSS, explain only the variables that were added:

- `--jpm-surface` controls the main card background.
- `--jpm-surface-raised` controls the score digits and legend button backgrounds.
- `--jpm-border` controls the outer and small control borders.
- `--jpm-map-glow` controls the glow behind the map; `none` disables it.

When the page already renders its own score or statistics, keep only the needed Web Component blocks through public parts:

```css
japan-prefecture-map::part(summary),
japan-prefecture-map::part(legend) {
  display: none;
}
```

Available parts are `widget`, `summary`, `score`, `stats`, `map`, and `legend`. Use them only for the Web Component path; static renderer output has no Shadow DOM or parts.

### 7. Implement the integration

- Use the site's existing page, layout, component, naming, and styling patterns.
- Preserve the copied `locale` and `levels`. For static rendering, never import the root entrypoint or add client JavaScript.
- For the Web Component path, load the root `japan-prefecture-map` entrypoint only in the browser and preserve the Editor-generated element.
- For the static widget path, import `renderWidget` and `widgetStyles` from `japan-prefecture-map/render`; include `widgetStyles` once. For map-only layouts, import `renderMap` and `mapStyles`; add `renderLegend` and `legendStyles` only when the host needs the supplied 0–5 legend. Use distinct `idPrefix` values when one page renders multiple maps.
- Keep the map in a readable-width content area. Avoid narrow sidebars unless the user explicitly requests one.
- Add a page title or section heading by following the site's existing content style.
- Do not add a framework, wrapper library, state store, or new configuration format for this integration.

### 8. Verify

Run the repository's existing build or test command.

For the Web Component path, when browser control is available, verify:

- the custom element renders instead of remaining blank;
- there are no console errors caused by the integration;
- the selected locale, theme, and non-zero levels appear;
- the selected card background and glow behavior match the user's choice;
- the map fits desktop and mobile widths without horizontal overflow.

For static renderer paths, verify:

- the generated page contains the selected `.japan-map` SVG output, locale, and non-zero levels;
- the matching style export is present once and the SVG has its intended level colours and labels;
- static widget output includes score, statistics, legend, and attribution when that path was selected;
- the root Web Component entrypoint is not imported or hydrated;
- the map fits desktop and mobile widths without horizontal overflow.

If a required check cannot run, state exactly which part remains unverified. Do not describe a successful build as a successful deployment.

### 9. Hand off

Report:

- files changed;
- page URL or route;
- installation method and pinned package version;
- rendering path: Web Component, static widget, or static map;
- selected appearance: blended, transparent with glow, or complete card, when using the Web Component;
- checks that passed;
- how to change the map later: reopen the Editor, then replace the element settings or the validated renderer locale and levels;
- any requested commit, push, or deployment as a separate next action.
