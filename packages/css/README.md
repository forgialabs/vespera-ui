# @vespera-ui/css

Framework-agnostic CSS for the **Vespera** design system — design tokens plus component
styles, all driven by CSS variables on the `.vsp-root` element. Works in any framework, or
plain HTML.

> 🚧 **Scaffolding.** Phase 1 ports the prototype's `styles.css` + `ui.css` into this package
> (split into tokens / base / shell / components) and rebrands the `.ag-` prefix to `.vsp-`.

## Usage (planned)

```js
import '@vespera-ui/css';
```

```html
<div class="vsp-root" data-theme="dark" data-density="comfortable">
  <!-- your app -->
</div>
```

Re-theme by overriding tokens on `.vsp-root` — never hardcode hex in components.

## License

[Apache-2.0](../../LICENSE)
