# Figma GTC → ptrckschrdtr-ds sync

**Date:** 2026-08-06
**Status:** Approved, ready for planning

## Context

Patrick built a design system in Figma (`ptrckschrdtr GTC DS`, file key
`5FKdZiYvwYJrdSNDD5PuLZ`) modeled as **G**lobal → **T**heme → **C**omponent
(GTC), documented exhaustively in `AGENTS.md` and exported machine-readably
in `gtc-tokens.json` (both supplied by the user, DTCG format). It already
uses a three-tier token architecture that maps almost 1:1 onto this
project's existing Primitives → Semantic → Component model, so adopting it
as the new source of truth is a rename + value-resync exercise, not a
rearchitecture.

Ten components exist in Figma: Button, Input, Card, Badge, Checkbox,
Switch, Avatar, Separator, Alert, Tabs. Five already exist in this registry
(Button, Input, Card, Badge, Select — note Select isn't in Figma yet,
Figma has six the registry doesn't: Checkbox, Switch, Avatar, Separator,
Alert, Tabs).

## Decisions

1. **Full replace, not additive.** `primitives.css` and `semantic.css`
   values are replaced by the GTC `global`/`theme` tiers, not kept as a
   separate "theme-example" option.
2. **Dark/Light is a first-class semantic-layer feature.** Light is the
   default mode (`:root`), Dark is a distinct hand-tuned second mode
   (`[data-theme="dark"]`) — not a naive inversion. This matches the
   `[data-theme="dark"]` mechanism `theme-example.css` already used, so no
   new pattern is introduced.
3. **The `brand-primary`/`brand-secondary` concept is dropped.** GTC has no
   brand-hue concept — its primary button color is the highest-contrast
   neutral, not an arbitrary hue. Multi-brand theming (the old
   "Neue Brand"-Workflow) is no longer a first-class feature of this
   registry going forward.
4. **CSS custom properties are renamed to match Figma's naming 1:1**:
   `--primitive-*` → `--global-*`, `--color-*`/other semantic slots →
   `--theme-*`, per-component tokens (`--btn-*`) →
   `--component-[name]-*`. This makes future Figma↔code sync mechanical
   (per the workflow `HANDOFF.md` describes: change Figma → screenshot →
   sync docs).
5. **Scope for this phase = foundation tokens + six new components.**
   Reconciling the five existing components' *visual* values against their
   Figma pages (fixed heights, focus-ring pattern, hairline borders, icon
   slots) is explicitly deferred to a later phase. This phase only does a
   mechanical token-reference rename on them so they keep working.

## Token layer changes

### `registry/tokens/base/primitives.css` → `registry/tokens/base/global.css`

All values replaced 1:1 from `gtc-tokens.json`'s `global` tier. New
categories not present today: `control-height` (14/20/24/31px, fixed
control heights so icons never change component height),
`border-width` (hairline 1px / thin 2px), `opacity` (0/25/50/75/100 as
disabled-state values, not color alpha), `blur` (sm/md/lg), `letter-spacing`
(tight/normal/wide/snug), `type-scale-ratio` (1.25, documented as the
generative source for `font-size.*`, even though delivered values are
rounded to whole pixels per `AGENTS.md`).

Font families become the real ones from Patrick's site: Geist Variable
(sans), Geist Mono (mono), PP Editorial New (display) — with a comment
that the consuming project must import/self-host these (PP Editorial New
is a licensed font, not bundled in the registry).

Color: 13-step neutral ramp (`base.0`…`base.12`, replacing the old 12-step
`neutral` scale), `accent` (destructive, vivid/bright + a-subtle/a-strong
alpha pair), `success` (same pattern), `overlay` (white-a10/a15). No
`warning`/`info` status color exists in the GTC source — out of scope to
invent one; add it later if a component needs it.

Radius: `none/xs/sm/md/lg/xl/2xl/3xl/4xl` scale steps, plus `full` (a
regular scale step, 20px) and `pill` (999px hard-coded pattern value,
distinct from `full` — used where an element must stay fully round
regardless of height, e.g. Switch track, Avatar). Component-specific
non-scale radius values (checkbox 4.32px, tabs-trigger 5.76px, alert
7.2px, etc.) become their own named global tokens exactly as `AGENTS.md`
specifies — never silently rounded to the nearest scale step.

### `registry/tokens/semantic/semantic.css` → `registry/tokens/theme/theme.css`

Light values in `:root`, Dark values in `[data-theme="dark"]`. Slots:
`surface.{page,raised,overlay}`, `text.{default,muted,on-primary}`,
`border.{default,input,focus-ring}`, `button.primary.{bg,text,hover,active}`,
`icon.{default,muted,on-primary}` (aliases onto `text.*`), `status.
{destructive,success}` (+ `subtle-bg` alpha variant for each). No brand
slots (decision #3).

### `registry/tokens/themes/example/theme.css` — removed

Its only purpose was brand-color overriding, which no longer applies. Not
replaced with anything in this phase.

### `registry.json`

- `tokens-base` → `tokens-global`
- `tokens-semantic` → `tokens-theme`
- `theme-example` entry removed
- All `registryDependencies` and file `target` paths updated to match
  (`src/styles/ds/global.css`, `src/styles/ds/theme.css`)

### Existing components (Button, Input, Card, Badge, Select)

Mechanical rename only: their component-token blocks (`--btn-radius` etc.)
get renamed to `--component-[name]-*` and repointed at the new
`--theme-*`/`--global-*` names so the build doesn't break. No visual
changes, no attempt to match Figma's fixed-height/focus-ring/hairline-border
patterns yet — that's future work.

## New components (Checkbox, Switch, Avatar, Separator, Alert, Tabs)

Each gets `.css` + `.astro` + `.tsx` following the existing file-header/
Props-API conventions, registered in `registry.json` with
`registryDependencies: ["ptrckschrdtr-ds/tokens-theme"]`, plus a docs page
under `src/pages/components/[name].astro` (matching the pattern already
used for Button/Input/Card/Badge/Select).

Component-specific notes, sourced from `AGENTS.md` so behavior matches
Figma exactly:

- **Checkbox** — Figma models State: Unchecked/Checked. This registry adds
  hover/focus-visible/disabled on top, consistent with how Button/Input
  already extend their Figma state sets with standard interactive states.
  Check glyph is an inline SVG icon (Lucide `check`), not a text character.
  Radius uses the component-specific `4.32px` token, not a scale step.
- **Switch** — States: off/on. Track radius uses the `pill` (999px)
  pattern value, not `radius.full`.
- **Avatar** — Needs a `type` prop: `initials | icon` (icon = photo-less
  fallback, Lucide `user`). Radius uses `pill`, sizes Medium/Small.
- **Separator** — Simplest component: a rule using `theme.border.default`.
  Figma's page doesn't document an orientation variant, so this ships
  horizontal-only in this phase; a `vertical` variant can be added later
  if a real layout needs it.
- **Alert** — Variant: `default | destructive`. Icon is bound to variant
  (default → info icon, destructive → triangle-alert icon) via inline SVG
  in the wrapper, **not** a freely swappable slot/prop — this encodes
  meaning per `AGENTS.md`, so don't build it as a generic icon-slot.
  Radius uses the component-specific `7.2px` token.
- **Tabs** — State-driven trigger styling, fixed `trigger-height`
  (`control-height.31`) so an optional leading icon never changes tab
  height. List radius `7.2px`, trigger radius `5.76px` (both
  component-specific, not scale steps).

Icons: source is Lucide. Since the existing Button component takes icon
content via `<slot />` rather than a dedicated icon prop, new components
follow the same pattern where the icon is user-supplied (none of these six
need a free icon slot except Alert, which is meaning-bound and therefore
inlines its own SVG rather than accepting one).

## Also touched (mechanical, not a design decision)

- `src/pages/tokens.astro` — update to reflect new token names/values.
- Existing five component docs pages — update any token references that
  changed name.

## Out of scope for this phase

- Reconciling Button/Input/Card/Badge/Select visual details against their
  Figma pages (fixed heights, focus-ring, hairline borders, icon-slot
  patterns).
- The ~29 "planned" components from the Figma roadmap not yet built in
  Figma either.
- A general icon-library integration for the registry (Lucide is used
  as-needed per component, not bundled wholesale).
- Multi-brand theming replacement (no new mechanism proposed to replace
  what `brand-primary`/`secondary` used to enable).
