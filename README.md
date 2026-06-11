<div align="center">

# Vespera

**A deep-space, weightless design system.**

Deep navy surfaces · electric cornflower accent · hairline borders · glassy depth · tasteful motion.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Status](<https://img.shields.io/badge/status-pre--release%20(0.x)-orange.svg>)](./docs/ROADMAP.md)

📖 **[Documentation & live demo →](https://forgialabs.github.io/vespera-ui/)**

</div>

> ⚠️ **Pre-release.** Vespera is being productized from a working prototype into modular,
> framework-agnostic packages. APIs and class names will change until `1.0`. See the
> [roadmap](./docs/ROADMAP.md).
>
> The docs site (`apps/docs`) auto-deploys to GitHub Pages from `main` once Pages is enabled
> (Settings → Pages → Source: **GitHub Actions**).

---

## What is Vespera?

Vespera is a flexible, modular, multi-framework design system. Its core is a
**token-driven CSS layer** — every visual decision (theme, accent, density, corners, glow)
is a CSS variable on the `.vsp-root` element. Because the look lives in CSS, the same design
works in **any framework, or plain HTML**. React is the flagship component layer; other
frameworks are thin wrappers over the same CSS.

It is also built to be **AI-consumable**: a machine-readable component manifest plus skills
let coding agents author and theme Vespera correctly.

## Packages

| Package                                 | Description                                                  | Status              |
| --------------------------------------- | ------------------------------------------------------------ | ------------------- |
| [`@vespera-ui/css`](./packages/css)     | Framework-agnostic tokens + component CSS. Works everywhere. | ✅ ported (preview) |
| [`@vespera-ui/react`](./packages/react) | React components (flagship).                                 | 🚧 scaffolding      |
| [`@vespera-ui/icons`](./packages/icons) | Framework-neutral SVG icon set.                              | 🚧 scaffolding      |

Planned: `@vespera-ui/tokens`, `@vespera-ui/tailwind`, `@vespera-ui/charts`, `@vespera-ui/widgets`.

## Quick start (development)

```bash
pnpm install      # install workspace deps
pnpm build        # build all packages
pnpm typecheck    # type-check
pnpm lint         # lint
pnpm format       # format with Prettier
```

## Repository layout

```
packages/    publishable packages (css, react, icons, …)
apps/        the docs site (later)
prototype/   the original design build — the source of truth for design decisions
skills/      AI skills (later)
docs/        ROADMAP.md and project docs
```

## Contributing

Contributions are welcome — please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.
By contributing you agree to the [Developer Certificate of Origin](./CONTRIBUTING.md#developer-certificate-of-origin)
and the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License & trademarks

Code is licensed under [Apache-2.0](./LICENSE). The names "Vespera" and "Forgia" are
trademarks — see [TRADEMARK.md](./TRADEMARK.md).

Vespera is a [Forgia](https://github.com/forgialabs) project, operated by
PT Sentra Digital Kreatif.
