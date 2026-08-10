# Astro and Vite

## Astro

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

Do not import `japan-prefecture-map` in Astro frontmatter. Frontmatter runs during server rendering, while this package needs browser globals.

Place a site-wide import in a shared client script only when multiple pages use the component. Otherwise keep the import beside the page to avoid widening scope.

## Browser-side Vite projects

Import the package once from the existing browser entry point:

```ts
import 'japan-prefecture-map';
```

Place the Editor-generated element in the existing template or page component. When the Vite project uses a UI framework, follow that framework's custom-element convention rather than adding a wrapper dependency.

## Verification

Run the existing build command. If a development or preview command already exists, open the target route and confirm the custom element is registered and visible.
