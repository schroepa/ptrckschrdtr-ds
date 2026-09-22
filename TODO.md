# TODO — Docs Site

Planned work for the ds.ptrckschrdtr.de docs site (not the distributed
registry itself). Check items off as they ship; add new ones as they
come up.

## Planned

- [ ] **⌘K command palette** — search overlay triggered by `⌘K`/`Ctrl+K` or
  a header button, listing Home, Tokens, and all 11 components with
  arrow-key navigation and Enter-to-open. Inspired by markodenic.tech's
  search. Should work well from the mobile drawer too (search beats
  scrolling a long list on small screens).

- [ ] **Colored letter-icon avatars on homepage component cards** — use
  our own Avatar component (`type="initials"`, one accent color per
  card) on the `docs-component-grid` cards instead of plain text.
  Inspired by markodenic.tech's Tools page card grid. Polish, not
  substance — do after the command palette.

## Done

- [x] Global → Theme → Component token migration (Figma GTC source)
- [x] 6 new components: Checkbox, Switch, Avatar, Separator, Alert, Tabs
- [x] Real font loading (Geist Variable, Geist Mono, PP Editorial New)
- [x] Dark/light toggle with localStorage persistence
- [x] Mobile hamburger + off-canvas drawer navigation
- [x] Page Header + Do/Dont Block layout matching Figma's shared components
