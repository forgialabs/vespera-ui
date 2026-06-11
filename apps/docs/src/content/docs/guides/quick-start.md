---
title: Quick start
description: Build your first themed Vespera UI in a few minutes.
---

This walks through a small themed card using only `@vespera-ui/css` classes — no JavaScript
framework required.

## 1. Set up the root

Everything Vespera renders must live inside a `.vsp-root` element, which carries the theme:

```html
<div class="vsp-root" data-theme="dark" style="--accent: #4a7cff">
  <!-- your UI -->
</div>
```

## 2. Add a card with controls

```html
<div class="vsp-root" data-theme="dark" style="--accent: #4a7cff">
  <div class="card" style="max-width: 380px">
    <div class="card-head">
      <h3>Create workspace</h3>
    </div>
    <div class="card-pad" style="display: flex; flex-direction: column; gap: 14px">
      <div class="ui-field">
        <label class="ui-label">Name</label>
        <input class="ui-input" placeholder="Acme Inc." />
      </div>
      <div class="ui-field">
        <label class="ui-label">Plan</label>
        <button class="ui-selectbtn"><span class="val">Pro — $29/mo</span></button>
      </div>
      <div style="display: flex; gap: 8px">
        <button class="btn btn-primary">Create</button>
        <button class="btn btn-ghost">Cancel</button>
      </div>
    </div>
  </div>
</div>
```

## 3. Try the tokens

Change one attribute or variable and the whole UI responds:

- `data-theme="light"` → switch to the light palette
- `style="--accent: #1fb574"` → recolor everything emerald
- `data-density="compact"` → tighter controls and spacing
- `data-corners="sharp"` → squared corners

See it all live on the [demo page](/vespera-ui/demo), and read [Theming](/vespera-ui/guides/theming/)
for the full token reference.
