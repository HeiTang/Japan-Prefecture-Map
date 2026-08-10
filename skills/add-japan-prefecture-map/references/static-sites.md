# Static HTML, Hugo, and Jekyll

Resolve the current published package version, then use an exact version in the CDN URL:

```html
<japan-prefecture-map
  locale="zh-TW"
  theme="auto"
  levels='{"01":4,"13":4,"27":5}'
></japan-prefecture-map>

<script type="module">
  import 'https://cdn.jsdelivr.net/npm/japan-prefecture-map@0.1.0/dist/index.js';
</script>
```

Replace `0.1.0` with the version resolved during the workflow. Never use `@latest` in a published site.

For Hugo or Jekyll, put the component in the selected page or partial. Put the module import in a shared layout only when the component appears on multiple pages; otherwise keep it local to the page.

Confirm that the site's Markdown or template pipeline preserves raw custom elements and module scripts. If it escapes or removes either, use a theme partial or layout instead of weakening site-wide sanitization.

Verify the generated site, not only the source template.
