---
title: Accessibility
description: How Vespera supports accessible UIs — focus, keyboard, color, motion — and what's still on you.
---

Accessibility starts in the CSS layer, so every framework inherits the same behavior. Vespera
gives you accessible defaults; building a fully accessible product is a shared effort, so this
page covers both what Vespera does **and** what's on you.

## Focus is always visible

- **Form controls** (`.ui-input`, `.ui-textarea`, `.ui-select`) show a clear focus ring — an
  accent border plus a soft accent glow — so keyboard users always see where they are.
- **Buttons and other interactive elements** use the browser's native focus-visible outline,
  which only appears for keyboard navigation (not mouse clicks).

Never remove focus styles without replacing them.

## Real, keyboard-operable elements

Components are built from semantic HTML — `<button>` for actions, `<input>`/`<textarea>` for
fields, `<label>` for labels. That means **keyboard support comes for free**: Tab to move, Enter
/ Space to activate, arrow keys in native controls. The React/Vue/Svelte/Angular wrappers all
emit the same semantic markup.

A few component specifics:

- **Switch** is a `<button>` with `aria-pressed` reflecting its state.
- **Checkbox** wraps a real (visually hidden) `<input type="checkbox">`, so it's keyboard- and
  screen-reader-operable and works inside forms.
- **Icon-only buttons** take a `label` (React/Vue/Angular) — always pass one; it becomes the
  `aria-label` so the control is announced.

## Color & contrast

The **dark** and **light** themes are designed with readable text/background contrast across
the surface and text tokens. Two things to keep in mind:

- The **accent** is customizable (`--accent`). If you set a custom accent, check that text on
  accent-colored surfaces (e.g. primary buttons) still meets contrast — `--accent-ink` is the
  text color used on accent backgrounds.
- **`color-scheme`** is set per theme, so native UI (scrollbars, date pickers, form controls)
  matches your light/dark choice automatically.

## Reduced motion

Vespera respects `prefers-reduced-motion`. The ambient background glow animation is disabled,
and decorative transitions are gated behind `prefers-reduced-motion: no-preference`, so users
who ask for less motion get a calmer UI.

## What's on you

Vespera can't know your content or structure. To ship something accessible:

- **Label every field.** Use `Field`'s `label` (and `htmlFor` to tie it to the control), or add
  your own `<label>`. Don't rely on placeholder text as a label.
- **Give icon-only controls a name** via the `label` prop / `aria-label`.
- **Use headings and landmarks** (`<main>`, `<nav>`, `<h1>`…) to structure pages.
- **Provide alt text** for meaningful images and icons that convey information.
- **Manage focus** when you open dialogs, sheets, and menus — move focus in, restore it on
  close, and let Escape dismiss.
- **Test it.** Tab through your UI, try it with a screen reader, and check contrast with your
  chosen accent.

## Found a gap?

Accessibility is never "done." If a component is missing an ARIA attribute or a keyboard
interaction, please [open an issue](https://github.com/forgialabs/vespera-ui/issues) — these
fixes land in the CSS/wrapper layer and benefit every framework at once.
