# TODO — Docs Site

Planned work for the ds.ptrckschrdtr.de docs site (not the distributed
registry itself). Check items off as they ship; add new ones as they
come up.

## Planned

- [ ] **Colored letter-icon avatars on homepage component cards** — use
  our own Avatar component (`type="initials"`, one accent color per
  card) on the `docs-component-grid` cards instead of plain text.
  Inspired by markodenic.tech's Tools page card grid. Polish, not
  substance — do after the command palette.

## Done

- [x] ⌘K command palette — search overlay listing Home, Tokens, and all
  11 components, arrow-key navigation, Enter-to-open. Trigger's
  press/hover feel adapted from bencho.dev's "Search" block (MIT),
  reimplemented in vanilla JS (no new dependency); results overlay is
  our own build since the block itself was only ever the trigger shell.
- [x] Liquid dark/light toggle in the header — SVG goo-filter thumb,
  technique adapted from bencho.dev's "Liquid toggle" block (MIT),
  reimplemented without Framer Motion (small hand-rolled
  requestAnimationFrame chase instead) to avoid adding React as a
  rendering framework. Respects prefers-reduced-motion.
- [x] Global → Theme → Component token migration (Figma GTC source)
- [x] 6 new components: Checkbox, Switch, Avatar, Separator, Alert, Tabs
- [x] Real font loading (Geist Variable, Geist Mono, PP Editorial New)
- [x] Dark/light toggle with localStorage persistence
- [x] Mobile hamburger + off-canvas drawer navigation
- [x] Page Header + Do/Dont Block layout matching Figma's shared components
