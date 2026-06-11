---
'@vespera-ui/react': minor
'@vespera-ui/icons': minor
---

First set of React components and the icon set.

- `@vespera-ui/icons` — framework-neutral stroke icon set as typed React components
  (`Icon.check`, etc.), replacing the prototype's `window.Icon` globals.
- `@vespera-ui/react` — typed ESM primitives: `Button`, `IconButton`, `Field`, `Input`,
  `Textarea`, `Select`, `InputAffix`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`,
  `Badge`, `Tag`, `Kbd`, `Divider`, `Alert`, `Progress`, `Skeleton`, `Spinner`, `Tabs`,
  `Tooltip`, `Breadcrumb`, `Pagination`, `Stepper`, `Card`, `CardHead`, plus the `cx` helper.
  Components consume `@vespera-ui/css` classes and render inside a `.vsp-root`. Storybook is
  set up as the component workbench.
