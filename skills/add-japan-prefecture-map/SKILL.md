---
name: add-japan-prefecture-map
description: Guide users through adding Japan Prefecture Map to an existing blog or website. Use when asked to install, embed, integrate, or configure japan-prefecture-map in Astro, Next.js, Vite, Hugo, Jekyll, or plain HTML. Inspect the project, offer guided choices, send the user to the official Editor to generate locale, theme, and levels, consume the copied Web Component markup, implement the smallest compatible integration, and verify the result.
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

- Use npm with the existing package manager for a project that already bundles client-side JavaScript.
- Use a version-pinned jsDelivr URL for plain HTML or a static template without a client bundler.

Ask only when both approaches are equally suitable. Recommend npm when a package manager already exists.

Resolve the current published version before installing or writing a CDN URL. Prefer `npm view japan-prefecture-map version`. If registry access is unavailable, use the version already documented by the project and state that it was not refreshed.

### 4. Collect the map settings from the Editor

Skip this step when the user already supplied a complete valid `<japan-prefecture-map>` element.

Open the Editor when browser control is available. Otherwise provide this link:

<https://heitang.github.io/Japan-Prefecture-Map/>

Tell the user:

> Set the language, theme, and prefecture levels in the Editor. When the map is ready, choose Copy embed code and paste the complete `<japan-prefecture-map>` element here.

Do not ask the user to paste JSON separately. The copied element is the configuration source of truth.

Accept the element with or without a Markdown code fence. Extract only:

- `locale`: `zh-TW`, `ja`, or `en`;
- `theme`: `light`, `dark`, or `auto`;
- `levels`: a JSON object whose keys are two-digit prefecture codes `01` through `47` and whose values are integers `0` through `5`.

Reject malformed JSON, unsupported attributes that execute code, invalid prefecture codes, and invalid levels. Explain the exact field to correct and direct the user back to the Editor when regeneration is easier.

### 5. Implement the integration

- Use the site's existing page, layout, component, naming, and styling patterns.
- Preserve the copied locale, theme, and levels even when framework syntax requires transforming the HTML.
- Load the package only in the browser. The package defines a custom element and must not be imported during server rendering.
- Keep the map in a readable-width content area. Avoid narrow sidebars unless the user explicitly requests one.
- Add a page title or section heading by following the site's existing content style.
- Do not add a framework, wrapper library, state store, or new configuration format for this integration.

### 6. Verify

Run the repository's existing build or test command. When browser control is available, also open the resulting page and verify:

- the custom element renders instead of remaining blank;
- there are no console errors caused by the integration;
- the selected locale, theme, and non-zero levels appear;
- the map fits desktop and mobile widths without horizontal overflow.

If a required check cannot run, state exactly which part remains unverified. Do not describe a successful build as a successful deployment.

### 7. Hand off

Report:

- files changed;
- page URL or route;
- installation method and pinned package version;
- checks that passed;
- how to change the map later: reopen the Editor, copy a new element, and replace the existing element settings;
- any requested commit, push, or deployment as a separate next action.
