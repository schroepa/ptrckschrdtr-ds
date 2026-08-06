# Figma GTC → ptrckschrdtr-ds Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this registry's Primitives/Semantic token layer with the
Figma "ptrckschrdtr GTC DS" system (Global/Theme/Component naming, Light
default + Dark mode), and add six new components matching Figma
(Checkbox, Switch, Avatar, Separator, Alert, Tabs).

**Architecture:** Three token files replace two: `global.css` (raw
values, was `primitives.css`) → `theme.css` (Light `:root` default +
`[data-theme="dark"]` override, was `semantic.css`) → per-component
`--component-[name]-*` tokens (was `--[shortname]-*`, e.g. `--btn-*`).
`theme-example.css` is removed since the brand-color concept it existed
for is dropped. Existing components (Button/Input/Card/Badge/Select) get
their token references renamed/repointed; six new components are built
following the same three-file (`.css`/`.astro`/`.tsx`) pattern already
used by every component in this registry.

**Tech Stack:** Astro (docs site + `.astro` wrappers), React (`.tsx`
wrappers), plain CSS custom properties, `shadcn` CLI for registry builds.
No test runner exists in this project — verification is
`npm run registry:build` (registry JSON builds without error) and manual
visual checks via `npm run dev` in the browser.

## Global Constraints

- Source of truth for values: `gtc-tokens.json` (DTCG export, supplied by
  the user) and `AGENTS.md` (rationale/rules), both already read into
  this plan — do not re-derive values from Figma unless a gap is found.
- Every renamed/new CSS custom property follows `--global-*` /
  `--theme-*` / `--component-[name]-*` naming — no more `--primitive-*`,
  `--color-*`, or bare `--[shortname]-*` component tokens.
- Light mode is the default (`:root`, no wrapper); Dark mode lives in
  `[data-theme="dark"]`.
- No `brand-primary`/`brand-secondary` tokens anywhere in the final code.
- Tokens marked "extension" in comments (not sourced from Figma) are
  allowed only where an existing component's functionality would
  otherwise break — see the spec's amendment section.
- Every new/changed CSS file keeps the existing file-header comment
  convention (`ptrckschrdtr-ds — Component: [Name]` etc.).

---

## Task 1: Global tokens (`global.css`)

**Files:**
- Create: `registry/tokens/base/global.css`
- Delete: `registry/tokens/base/primitives.css`
- Modify: `registry.json:8-24` (the `tokens-base` entry)

**Interfaces:**
- Produces: every `--global-*` custom property consumed by Task 2 and all
  component tasks (3–13). Exact names are fixed by this task — no
  downstream task may invent a different `--global-*` name for a value
  that already has one here.

- [ ] **Step 1: Create `registry/tokens/base/global.css`**

```css
/**
 * ptrckschrdtr-ds — Global Tokens
 * ─────────────────────────────────
 * Raw values, sourced from the Figma "ptrckschrdtr GTC DS" file
 * (Global tier, gtc-tokens.json). Never reference these directly in
 * components — use Theme or Component tokens instead.
 *
 * Tokens commented "extension" do not exist in the Figma file. They
 * were added to keep existing components working; update them if/when
 * Figma defines the real value.
 */

:root {
  /* ── Color: Neutral Ramp (13 steps) ─────────────────────── */
  --global-color-base-0:  #0a0907;
  --global-color-base-1:  #0c0b09;
  --global-color-base-2:  #13110f;
  --global-color-base-3:  #211f1d;
  --global-color-base-4:  #66635f;
  --global-color-base-5:  #82807d;
  --global-color-base-6:  #918f8b;
  --global-color-base-7:  #a09e9b;
  --global-color-base-8:  #dfdedb;
  --global-color-base-9:  #e6e4e2;
  --global-color-base-10: #f3f1f0;
  --global-color-base-11: #f6f5f3;
  --global-color-base-12: #ffffff;

  /* ── Color: Accent (Destructive) ─────────────────────────── */
  --global-color-accent-vivid:    #e7000b; /* light-mode surfaces */
  --global-color-accent-bright:   #ff6467; /* dark-mode surfaces */
  --global-color-accent-a-subtle: rgba(231, 0, 11, 0.08);
  --global-color-accent-a-strong: rgba(231, 0, 11, 0.16);

  /* ── Color: Success ───────────────────────────────────────── */
  --global-color-success-vivid:    #267d30;
  --global-color-success-bright:   #5bbe62;
  --global-color-success-a-subtle: rgba(38, 125, 48, 0.08);
  --global-color-success-a-strong: rgba(38, 125, 48, 0.16);

  /* ── Color: Warning (extension — not in Figma) ────────────── */
  --global-color-warning-vivid:    #ca8a04;
  --global-color-warning-bright:   #facc15;
  --global-color-warning-a-subtle: rgba(202, 138, 4, 0.08);
  --global-color-warning-a-strong: rgba(202, 138, 4, 0.16);

  /* ── Color: Info (extension — not in Figma) ───────────────── */
  --global-color-info-vivid:    #0284c7;
  --global-color-info-bright:   #38bdf8;
  --global-color-info-a-subtle: rgba(2, 132, 199, 0.08);
  --global-color-info-a-strong: rgba(2, 132, 199, 0.16);

  /* ── Color: Overlay ───────────────────────────────────────── */
  --global-color-overlay-white-a10: rgba(255, 255, 255, 0.10);
  --global-color-overlay-white-a15: rgba(255, 255, 255, 0.15);

  /* ── Typography: Font Families ────────────────────────────── */
  --global-font-family-sans:    'Geist Variable', ui-sans-serif, system-ui, sans-serif;
  --global-font-family-mono:    'Geist Mono', ui-monospace, "Cascadia Code", monospace;
  --global-font-family-display: 'PP Editorial New', ui-serif, Georgia, serif;
  /* Import Geist / Geist Mono / PP Editorial New in the consuming
     project. Geist + Geist Mono: https://vercel.com/font — PP Editorial
     New is a licensed font (Pangram Pangram) — bring your own files. */

  /* ── Typography: Type Scale ────────────────────────────────── */
  --global-type-scale-ratio: 1.25; /* Major Third — generative source for the steps below */

  --global-font-size-xs:   0.625rem;  /* 10px */
  --global-font-size-sm:   0.8125rem; /* 13px */
  --global-font-size-base: 1rem;      /* 16px */
  --global-font-size-md:   1.25rem;   /* 20px */
  --global-font-size-lg:   1.5625rem; /* 25px */
  --global-font-size-xl:   1.9375rem; /* 31px */
  --global-font-size-2xl:  2.4375rem; /* 39px */
  --global-font-size-3xl:  3.0625rem; /* 49px */
  --global-font-size-4xl:  3.8125rem; /* 61px */
  --global-font-size-5xl:  4.75rem;   /* 76px */

  /* ── Typography: Font Weights ──────────────────────────────── */
  --global-font-weight-regular:   400;
  --global-font-weight-medium:    500;
  --global-font-weight-semibold:  600;
  --global-font-weight-bold:      700;
  --global-font-weight-extrabold: 800;

  /* ── Typography: Line Heights ──────────────────────────────── */
  --global-line-height-tight:  1.1;
  --global-line-height-snug:   1.3;
  --global-line-height-normal: 1.6;
  --global-line-height-loose:  1.8;

  /* ── Typography: Letter Spacing ────────────────────────────── */
  --global-letter-spacing-tight:  -0.03em;
  --global-letter-spacing-snug:   -0.01em;
  --global-letter-spacing-normal: 0em;
  --global-letter-spacing-wide:   0.06em;

  /* ── Control Heights (fixed heights for icon-bearing controls) ── */
  --global-control-height-14: 0.875rem;  /* 14px */
  --global-control-height-20: 1.25rem;   /* 20px */
  --global-control-height-24: 1.5rem;    /* 24px */
  --global-control-height-31: 1.9375rem; /* 31px */

  /* ── Spacing (Size Unit) ────────────────────────────────────── */
  --global-size-unit-0:   0px;
  --global-size-unit-0-5: 0.125rem; /* 2px */
  --global-size-unit-1:   0.25rem;  /* 4px */
  --global-size-unit-1-5: 0.375rem; /* 6px */
  --global-size-unit-2:   0.5rem;   /* 8px */
  --global-size-unit-3:   0.75rem;  /* 12px */
  --global-size-unit-4:   1rem;     /* 16px */
  --global-size-unit-6:   1.5rem;   /* 24px */
  --global-size-unit-8:   2rem;     /* 32px */
  --global-size-unit-12:  3rem;     /* 48px */
  --global-size-unit-16:  4rem;     /* 64px */
  --global-size-unit-24:  6rem;     /* 96px */
  --global-size-unit-32:  8rem;     /* 128px */

  /* ── Border Radius ──────────────────────────────────────────── */
  --global-radius-none: 0px;
  --global-radius-xs:   0.125rem; /* 2px */
  --global-radius-sm:   0.25rem;  /* 4px */
  --global-radius-md:   0.5rem;   /* 8px */
  --global-radius-lg:   0.75rem;  /* 12px */
  --global-radius-xl:   1rem;     /* 16px */
  --global-radius-2xl:  1.5rem;   /* 24px */
  --global-radius-3xl:  1.75rem;  /* 28px */
  --global-radius-4xl:  2rem;     /* 32px */
  --global-radius-full: 1.25rem;  /* 20px — a regular scale step */
  --global-radius-pill: 999px;    /* forces full rounding regardless of height */
  --global-radius-4-32: 4.32px;   /* Checkbox radius */
  --global-radius-5-76: 5.76px;   /* Tabs-trigger radius */
  --global-radius-7-2:  7.2px;    /* Alert / Tabs-list radius */

  /* ── Border Width ───────────────────────────────────────────── */
  --global-border-width-hairline: 1px;
  --global-border-width-thin:     2px;

  /* ── Motion ─────────────────────────────────────────────────── */
  --global-motion-duration-fast: 150ms;
  --global-motion-duration-base: 250ms;
  --global-motion-duration-slow: 400ms;
  --global-motion-easing-in:     cubic-bezier(0.4, 0, 1, 1);
  --global-motion-easing-out:    cubic-bezier(0, 0, 0.2, 1);
  --global-motion-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* ── Z-Index ────────────────────────────────────────────────── */
  --global-z-index-base:     0;
  --global-z-index-dropdown: 10;
  --global-z-index-overlay:  20;
  --global-z-index-modal:    30;
  --global-z-index-toast:    40;

  /* ── Opacity ────────────────────────────────────────────────── */
  --global-opacity-0:   0;
  --global-opacity-25:  0.25;
  --global-opacity-50:  0.5;
  --global-opacity-75:  0.75;
  --global-opacity-100: 1;

  /* ── Blur ───────────────────────────────────────────────────── */
  --global-blur-sm: 0.25rem; /* 4px */
  --global-blur-md: 0.75rem; /* 12px */
  --global-blur-lg: 1.5rem;  /* 24px */

  /* ── Shadow ─────────────────────────────────────────────────── */
  --global-shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05);
  --global-shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10);
  --global-shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.15);
  --global-shadow-none: none; /* extension — needed for Card's outlined/ghost variants */

  /* ── Icon Sizes ─────────────────────────────────────────────── */
  --global-icon-size-xs: 0.75rem; /* 12px */
  --global-icon-size-sm: 1rem;    /* 16px */
  --global-icon-size-md: 1.25rem; /* 20px */
  --global-icon-size-lg: 1.5rem;  /* 24px */
}
```

- [ ] **Step 2: Delete the old primitives file**

```bash
rm "registry/tokens/base/primitives.css"
```

- [ ] **Step 3: Update `registry.json`'s `tokens-base` entry**

Replace (lines 7–24):

```json
    {
      "name": "tokens-base",
      "type": "registry:style",
      "title": "Base Tokens",
      "description": "Primitive values (colors, spacing, radius, typography, shadows, motion). Always install this first — it is the foundation of the entire system.",
      "files": [
        {
          "path": "registry/tokens/base/primitives.css",
          "type": "registry:style",
          "target": "src/styles/ds/primitives.css"
        },
        {
          "path": "registry/tokens/base/reset.css",
          "type": "registry:style",
          "target": "src/styles/ds/reset.css"
        }
      ]
    },
```

with:

```json
    {
      "name": "tokens-global",
      "type": "registry:style",
      "title": "Global Tokens",
      "description": "Raw values (colors, spacing, radius, typography, shadows, motion), sourced from the Figma GTC design system. Always install this first — it is the foundation of the entire system.",
      "files": [
        {
          "path": "registry/tokens/base/global.css",
          "type": "registry:style",
          "target": "src/styles/ds/global.css"
        },
        {
          "path": "registry/tokens/base/reset.css",
          "type": "registry:style",
          "target": "src/styles/ds/reset.css"
        }
      ]
    },
```

- [ ] **Step 4: Verify the registry builds**

Run: `npm run registry:build`
Expected: no errors; `public/r/tokens-global.json` exists and contains the
new file paths.

```bash
npm run registry:build && test -f public/r/tokens-global.json && echo OK
```

- [ ] **Step 5: Commit**

```bash
git add registry/tokens/base/global.css registry.json
git rm registry/tokens/base/primitives.css
git commit -m "feat: replace primitives.css with Figma GTC global.css"
```

---

## Task 2: Theme tokens (`theme.css`), remove `theme-example`

**Files:**
- Create: `registry/tokens/theme/theme.css`
- Delete: `registry/tokens/semantic/semantic.css` (and remove the now-empty `registry/tokens/semantic/` directory)
- Delete: `registry/tokens/themes/example/theme.css` (and the `registry/tokens/themes/` directory tree)
- Modify: `registry.json` (`tokens-semantic` entry → `tokens-theme`; remove `theme-example` entry)

**Interfaces:**
- Consumes: every `--global-*` token from Task 1.
- Produces: every `--theme-*` custom property consumed by all component
  tasks (3–13). Exact names are fixed here.

- [ ] **Step 1: Create `registry/tokens/theme/theme.css`**

```css
/**
 * ptrckschrdtr-ds — Theme Tokens
 * ─────────────────────────────────
 * Maps Global tokens to meaning. Light is the default mode (:root);
 * Dark is a distinct, hand-tuned second mode, not an inversion — set
 * [data-theme="dark"] on <html> (or any ancestor) to activate it.
 *
 * Tokens commented "extension" below do not exist in the Figma GTC
 * file. They exist so Button/Input/Card/Badge/Select keep working
 * without a brand-color concept — see
 * docs/superpowers/specs/2026-08-06-figma-gtc-sync-design.md.
 *
 * Sections:
 *   1. Surface   2. Text   3. Border   4. Button (Primary)
 *   5. Icon      6. Status 7. Motion (convenience alias)
 */

:root {
  /* ── 1. Surface ───────────────────────────────────────────── */
  --theme-surface-page:    var(--global-color-base-12);
  --theme-surface-raised:  var(--global-color-base-12);
  --theme-surface-overlay: var(--global-color-base-10);
  --theme-surface-subtle:  var(--global-color-base-11); /* extension */
  --theme-surface-muted:   var(--global-color-base-9);  /* extension */

  /* ── 2. Text ──────────────────────────────────────────────── */
  --theme-text-default:    var(--global-color-base-1);
  --theme-text-muted:      var(--global-color-base-4);
  --theme-text-subtle:     var(--global-color-base-6);  /* extension */
  --theme-text-on-primary: var(--global-color-base-12);

  /* ── 3. Border ────────────────────────────────────────────── */
  --theme-border-default:    var(--global-color-base-8);
  --theme-border-input:      var(--global-color-base-8);
  --theme-border-subtle:     var(--global-color-base-9); /* extension */
  --theme-border-focus-ring: var(--global-color-base-7);

  /* ── 4. Button (Primary) ─────────────────────────────────── */
  --theme-button-primary-bg:     var(--global-color-base-2);
  --theme-button-primary-text:   var(--global-color-base-12);
  --theme-button-primary-hover:  var(--global-color-base-3);
  --theme-button-primary-active: var(--global-color-base-4);

  /* ── 5. Icon ──────────────────────────────────────────────── */
  --theme-icon-default:    var(--theme-text-default);
  --theme-icon-muted:      var(--theme-text-muted);
  --theme-icon-on-primary: var(--theme-text-on-primary);

  /* ── 6. Status ────────────────────────────────────────────── */
  --theme-status-destructive:           var(--global-color-accent-vivid);
  --theme-status-destructive-subtle-bg: var(--global-color-accent-a-subtle);
  --theme-status-destructive-text:      var(--global-color-base-12); /* extension */

  --theme-status-success:           var(--global-color-success-vivid);
  --theme-status-success-subtle-bg: var(--global-color-success-a-subtle);
  --theme-status-success-text:      var(--global-color-base-12); /* extension */

  --theme-status-warning:           var(--global-color-warning-vivid); /* extension */
  --theme-status-warning-subtle-bg: var(--global-color-warning-a-subtle); /* extension */
  --theme-status-warning-text:      var(--global-color-base-1); /* extension — amber bg needs dark text */

  --theme-status-info:           var(--global-color-info-vivid); /* extension */
  --theme-status-info-subtle-bg: var(--global-color-info-a-subtle); /* extension */
  --theme-status-info-text:      var(--global-color-base-12); /* extension */

  /* ── 7. Motion (convenience alias, extension) ────────────── */
  --theme-transition-default: var(--global-motion-duration-base) var(--global-motion-easing-in-out);
}

[data-theme="dark"] {
  /* ── 1. Surface ───────────────────────────────────────────── */
  --theme-surface-page:    var(--global-color-base-0);
  --theme-surface-raised:  var(--global-color-base-2);
  --theme-surface-overlay: var(--global-color-base-3);
  --theme-surface-subtle:  var(--global-color-base-1);
  --theme-surface-muted:   var(--global-color-base-4);

  /* ── 2. Text ──────────────────────────────────────────────── */
  --theme-text-default:    var(--global-color-base-11);
  --theme-text-muted:      var(--global-color-base-6);
  --theme-text-subtle:     var(--global-color-base-5);
  --theme-text-on-primary: var(--global-color-base-2);

  /* ── 3. Border ────────────────────────────────────────────── */
  --theme-border-default:    var(--global-color-overlay-white-a10);
  --theme-border-input:      var(--global-color-overlay-white-a15);
  --theme-border-subtle:     var(--global-color-overlay-white-a10);
  --theme-border-focus-ring: var(--global-color-base-5);

  /* ── 4. Button (Primary) ─────────────────────────────────── */
  --theme-button-primary-bg:     var(--global-color-base-9);
  --theme-button-primary-text:   var(--global-color-base-2);
  --theme-button-primary-hover:  var(--global-color-base-8);
  --theme-button-primary-active: var(--global-color-base-7);

  /* ── 6. Status ────────────────────────────────────────────── */
  --theme-status-destructive:           var(--global-color-accent-bright);
  --theme-status-destructive-subtle-bg: var(--global-color-accent-a-subtle);

  --theme-status-success:           var(--global-color-success-bright);
  --theme-status-success-subtle-bg: var(--global-color-success-a-subtle);

  --theme-status-warning:           var(--global-color-warning-bright);
  --theme-status-warning-subtle-bg: var(--global-color-warning-a-subtle);

  --theme-status-info:           var(--global-color-info-bright);
  --theme-status-info-subtle-bg: var(--global-color-info-a-subtle);

  /* icon-*, *-text, and transition-default are mode-independent — inherited from :root */
}
```

- [ ] **Step 2: Delete the old semantic and theme-example files**

```bash
rm "registry/tokens/semantic/semantic.css"
rmdir "registry/tokens/semantic"
rm "registry/tokens/themes/example/theme.css"
rmdir "registry/tokens/themes/example"
rmdir "registry/tokens/themes"
```

- [ ] **Step 3: Update `registry.json`**

Replace the `tokens-semantic` entry (originally lines 26–41):

```json
    {
      "name": "tokens-semantic",
      "type": "registry:style",
      "title": "Semantic Tokens",
      "description": "Semantic token layer that maps primitives to meaning (brand, surface, text, border, status). Install after tokens-base. Brand themes override these slots.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-base"
      ],
      "files": [
        {
          "path": "registry/tokens/semantic/semantic.css",
          "type": "registry:style",
          "target": "src/styles/ds/semantic.css"
        }
      ]
    },
```

with:

```json
    {
      "name": "tokens-theme",
      "type": "registry:style",
      "title": "Theme Tokens",
      "description": "Theme token layer that maps global tokens to meaning (surface, text, border, button, status). Install after tokens-global. Light mode is the default; Dark mode activates via [data-theme=\"dark\"].",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-global"
      ],
      "files": [
        {
          "path": "registry/tokens/theme/theme.css",
          "type": "registry:style",
          "target": "src/styles/ds/theme.css"
        }
      ]
    },
```

Then delete the entire `theme-example` entry (originally lines 43–58):

```json
    {
      "name": "theme-example",
      "type": "registry:style",
      "title": "Theme: Example Brand",
      "description": "Starter brand theme. Duplicate this file and rename it theme-[your-brand].css to create a new brand. Override the semantic slots with your brand values.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-semantic"
      ],
      "files": [
        {
          "path": "registry/tokens/themes/example/theme.css",
          "type": "registry:style",
          "target": "src/styles/ds/theme.css"
        }
      ]
    },
```

(delete this whole block — no replacement)

- [ ] **Step 4: Verify the registry builds**

Run: `npm run registry:build`
Expected: no errors; `public/r/tokens-theme.json` exists;
`public/r/theme-example.json` no longer exists.

```bash
npm run registry:build && test -f public/r/tokens-theme.json && test ! -f public/r/theme-example.json && echo OK
```

- [ ] **Step 5: Commit**

```bash
git add registry/tokens/theme/theme.css registry.json
git rm -r registry/tokens/semantic registry/tokens/themes
git commit -m "feat: replace semantic.css with Figma GTC theme.css, drop theme-example"
```

---

## Task 3: Rename Button's token references

**Files:**
- Modify: `registry/components/button/button.css` (full rewrite)
- Modify: `registry.json` (button entry's `registryDependencies`)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `--component-button-*` tokens. No other task depends on
  these names.

- [ ] **Step 1: Replace `registry/components/button/button.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Button
 * ──────────────────────────────────────
 * Variants:   primary | secondary | ghost | danger
 * Sizes:      sm | md | lg
 * States:     hover, active, focus-visible, disabled, loading
 *
 * Figma's GTC Button has no variant axis (only Size × State) and no
 * brand-hue concept. secondary/ghost/danger below are built from
 * generic surface/border/status tokens, not literal Figma values — see
 * docs/superpowers/specs/2026-08-06-figma-gtc-sync-design.md.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-button-font-family: var(--global-font-family-sans);
  --component-button-font-weight: var(--global-font-weight-medium);
  --component-button-transition:  var(--theme-transition-default);

  --component-button-radius-sm: var(--global-radius-md);
  --component-button-radius-md: var(--global-radius-lg);
  --component-button-radius-lg: var(--global-radius-lg);

  --component-button-padding-x-sm: var(--global-size-unit-3);
  --component-button-padding-y-sm: var(--global-size-unit-1);
  --component-button-text-sm:      var(--global-font-size-xs);

  --component-button-padding-x-md: var(--global-size-unit-4);
  --component-button-padding-y-md: var(--global-size-unit-2);
  --component-button-text-md:      var(--global-font-size-sm);

  --component-button-padding-x-lg: var(--global-size-unit-6);
  --component-button-padding-y-lg: var(--global-size-unit-3);
  --component-button-text-lg:      var(--global-font-size-base);
}

/* ── Base ──────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--global-size-unit-2);
  white-space: nowrap;
  font-family: var(--component-button-font-family);
  font-weight: var(--component-button-font-weight);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color var(--component-button-transition),
    border-color var(--component-button-transition),
    color var(--component-button-transition),
    opacity var(--component-button-transition),
    box-shadow var(--component-button-transition);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn:focus-visible {
  outline: 2px solid var(--theme-border-focus-ring);
  outline-offset: 2px;
}

.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: var(--global-opacity-50);
  cursor: not-allowed;
  pointer-events: none;
}

.btn--loading {
  cursor: wait;
  pointer-events: none;
}

/* ── Sizes ─────────────────────────────────────────────── */
.btn--sm {
  padding: var(--component-button-padding-y-sm) var(--component-button-padding-x-sm);
  font-size: var(--component-button-text-sm);
  border-radius: var(--component-button-radius-sm);
  line-height: var(--global-line-height-snug);
}

.btn--md {
  padding: var(--component-button-padding-y-md) var(--component-button-padding-x-md);
  font-size: var(--component-button-text-md);
  border-radius: var(--component-button-radius-md);
  line-height: var(--global-line-height-normal);
}

.btn--lg {
  padding: var(--component-button-padding-y-lg) var(--component-button-padding-x-lg);
  font-size: var(--component-button-text-lg);
  border-radius: var(--component-button-radius-lg);
  line-height: var(--global-line-height-normal);
}

/* ── Variant: Primary ──────────────────────────────────── */
.btn--primary {
  background-color: var(--theme-button-primary-bg);
  color: var(--theme-button-primary-text);
  border-color: var(--theme-button-primary-bg);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--theme-button-primary-hover);
  border-color: var(--theme-button-primary-hover);
}

.btn--primary:active:not(:disabled) {
  background-color: var(--theme-button-primary-active);
  border-color: var(--theme-button-primary-active);
}

/* ── Variant: Secondary ────────────────────────────────── */
/* Extension: GTC has no "secondary" concept, so this is a neutral
   outline button rather than a second brand hue. */
.btn--secondary {
  background-color: transparent;
  color: var(--theme-text-default);
  border-color: var(--theme-border-default);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--theme-surface-muted);
}

.btn--secondary:active:not(:disabled) {
  background-color: var(--theme-surface-subtle);
}

/* ── Variant: Ghost ────────────────────────────────────── */
.btn--ghost {
  background-color: transparent;
  color: var(--theme-text-default);
  border-color: transparent;
}

.btn--ghost:hover:not(:disabled) {
  background-color: var(--theme-surface-muted);
}

.btn--ghost:active:not(:disabled) {
  background-color: var(--theme-surface-subtle);
}

/* ── Variant: Danger ───────────────────────────────────── */
.btn--danger {
  background-color: var(--theme-status-destructive);
  color: var(--theme-status-destructive-text);
  border-color: var(--theme-status-destructive);
}

.btn--danger:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--theme-status-destructive) 85%, black);
  border-color: color-mix(in srgb, var(--theme-status-destructive) 85%, black);
}

/* ── Icon-only ─────────────────────────────────────────── */
.btn--icon {
  padding: var(--component-button-padding-y-md);
  aspect-ratio: 1;
}

.btn--icon.btn--sm { padding: var(--component-button-padding-y-sm); }
.btn--icon.btn--lg { padding: var(--component-button-padding-y-lg); }

/* ── Full width ────────────────────────────────────────── */
.btn--full {
  width: 100%;
}
```

Note: border-radius now varies per size class (it previously came from a
single shared `--radius-component` meta-token, which GTC doesn't have) —
this is a small, deliberate visual change.

- [ ] **Step 2: Update `registry.json`'s button entry**

In the `button` entry, change:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-semantic"
      ],
```

to:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
```

- [ ] **Step 3: Verify the registry builds and no old tokens remain**

```bash
npm run registry:build
grep -E -- "--(primitive|color-brand|radius-component|leading-|text-(xs|sm|md|lg|xl))\b" registry/components/button/button.css && echo "FAIL: old token found" || echo OK
```

Expected: `OK` (no matches).

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:4321/components/button`.
Expected: all variants/sizes render, no unstyled/transparent buttons (a
missing custom property renders as invalid/empty, which would show as no
background color).

- [ ] **Step 5: Commit**

```bash
git add registry/components/button/button.css registry.json
git commit -m "refactor: repoint button.css at global/theme tokens"
```

---

## Task 4: Rename Badge's token references

**Files:**
- Modify: `registry/components/badge/badge.css` (full rewrite)
- Modify: `registry.json` (badge entry's `registryDependencies`)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `--component-badge-*` tokens.

- [ ] **Step 1: Replace `registry/components/badge/badge.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Badge
 * ────────────────────────────────────
 * Variants:   default | primary | secondary | success | warning | error | info
 * Styles:     solid | subtle | outline
 * Sizes:      sm | md | lg
 *
 * Figma's GTC Badge has no variant axis (only Size). primary/secondary
 * map onto theme.button.primary / a muted neutral; warning/info use the
 * extension status colors from theme.css — none of this is literal
 * Figma output, see docs/superpowers/specs/2026-08-06-figma-gtc-sync-design.md.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-badge-font-family: var(--global-font-family-sans);
  --component-badge-font-weight: var(--global-font-weight-medium);
  --component-badge-radius:      var(--global-radius-full);
  --component-badge-transition:  var(--theme-transition-default);

  --component-badge-padding-x-sm: var(--global-size-unit-1-5);
  --component-badge-padding-y-sm: var(--global-size-unit-0-5);
  --component-badge-text-sm:      var(--global-font-size-xs);

  --component-badge-padding-x-md: var(--global-size-unit-2);
  --component-badge-padding-y-md: var(--global-size-unit-0-5);
  --component-badge-text-md:      var(--global-font-size-xs);

  --component-badge-padding-x-lg: var(--global-size-unit-3);
  --component-badge-padding-y-lg: var(--global-size-unit-0-5);
  --component-badge-text-lg:      var(--global-font-size-sm);
}

/* ── Base ──────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--global-size-unit-1);
  font-family: var(--component-badge-font-family);
  font-weight: var(--component-badge-font-weight);
  border-radius: var(--component-badge-radius);
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1;

  /* Default size: md */
  padding: var(--component-badge-padding-y-md) var(--component-badge-padding-x-md);
  font-size: var(--component-badge-text-md);
}

/* ── Sizes ─────────────────────────────────────────────── */
.badge--sm {
  padding: var(--component-badge-padding-y-sm) var(--component-badge-padding-x-sm);
  font-size: var(--component-badge-text-sm);
}

.badge--lg {
  padding: var(--component-badge-padding-y-lg) var(--component-badge-padding-x-lg);
  font-size: var(--component-badge-text-lg);
}

/* ── Style: Solid (default) ────────────────────────────── */
.badge--default {
  background-color: var(--theme-surface-muted);
  color: var(--theme-text-default);
  border-color: var(--theme-border-default);
}

.badge--primary {
  background-color: var(--theme-button-primary-bg);
  color: var(--theme-button-primary-text);
}

.badge--secondary {
  background-color: var(--theme-surface-subtle);
  color: var(--theme-text-muted);
}

.badge--success {
  background-color: var(--theme-status-success);
  color: var(--theme-status-success-text);
}

.badge--warning {
  background-color: var(--theme-status-warning);
  color: var(--theme-status-warning-text);
}

.badge--error {
  background-color: var(--theme-status-destructive);
  color: var(--theme-status-destructive-text);
}

.badge--info {
  background-color: var(--theme-status-info);
  color: var(--theme-status-info-text);
}

/* ── Style: Subtle ─────────────────────────────────────── */
.badge--subtle.badge--default {
  background-color: var(--theme-surface-subtle);
  color: var(--theme-text-muted);
  border-color: transparent;
}

.badge--subtle.badge--primary {
  background-color: var(--theme-surface-muted);
  color: var(--theme-text-default);
  border-color: transparent;
}

.badge--subtle.badge--secondary {
  background-color: var(--theme-surface-subtle);
  color: var(--theme-text-subtle);
  border-color: transparent;
}

.badge--subtle.badge--success {
  background-color: var(--theme-status-success-subtle-bg);
  color: var(--theme-status-success);
  border-color: transparent;
}

.badge--subtle.badge--warning {
  background-color: var(--theme-status-warning-subtle-bg);
  color: var(--theme-status-warning);
  border-color: transparent;
}

.badge--subtle.badge--error {
  background-color: var(--theme-status-destructive-subtle-bg);
  color: var(--theme-status-destructive);
  border-color: transparent;
}

.badge--subtle.badge--info {
  background-color: var(--theme-status-info-subtle-bg);
  color: var(--theme-status-info);
  border-color: transparent;
}

/* ── Style: Outline ────────────────────────────────────── */
.badge--outline.badge--default {
  background-color: transparent;
  color: var(--theme-text-default);
  border-color: var(--theme-border-default);
}

.badge--outline.badge--primary {
  background-color: transparent;
  color: var(--theme-button-primary-bg);
  border-color: var(--theme-button-primary-bg);
}

.badge--outline.badge--secondary {
  background-color: transparent;
  color: var(--theme-text-muted);
  border-color: var(--theme-border-default);
}

.badge--outline.badge--success {
  background-color: transparent;
  color: var(--theme-status-success);
  border-color: var(--theme-status-success);
}

.badge--outline.badge--warning {
  background-color: transparent;
  color: var(--theme-status-warning);
  border-color: var(--theme-status-warning);
}

.badge--outline.badge--error {
  background-color: transparent;
  color: var(--theme-status-destructive);
  border-color: var(--theme-status-destructive);
}

.badge--outline.badge--info {
  background-color: transparent;
  color: var(--theme-status-info);
  border-color: var(--theme-status-info);
}

/* ── Dot indicator ─────────────────────────────────────── */
.badge__dot {
  width: 0.4em;
  height: 0.4em;
  border-radius: var(--global-radius-full);
  background-color: currentColor;
  flex-shrink: 0;
}
```

- [ ] **Step 2: Update `registry.json`'s badge entry**

In the `badge` entry, change:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-semantic"
      ],
```

to:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
```

- [ ] **Step 3: Verify**

```bash
npm run registry:build
grep -E -- "--(primitive|color-brand|color-status|radius-component)\b" registry/components/badge/badge.css && echo "FAIL: old token found" || echo OK
```

Expected: `OK`.

- [ ] **Step 4: Manual visual check**

`npm run dev`, open `/components/badge` — all 7 variants × 3 styles ×
3 sizes render with distinct, non-transparent colors.

- [ ] **Step 5: Commit**

```bash
git add registry/components/badge/badge.css registry.json
git commit -m "refactor: repoint badge.css at global/theme tokens"
```

---

## Task 5: Rename Input's token references, adopt opacity-based disabled state

**Files:**
- Modify: `registry/components/input/input.css` (full rewrite)
- Modify: `registry.json` (input entry's `registryDependencies`)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `--component-input-*` tokens.

- [ ] **Step 1: Replace `registry/components/input/input.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Input
 * ────────────────────────────────────
 * Variants:   default | error | success
 * Sizes:      sm | md | lg
 * States:     focus, disabled, readonly, placeholder
 *
 * Anatomy:
 *   .input-field          → wrapper (label + input + hint)
 *   .input-field__label   → label text
 *   .input-field__input   → the actual input element
 *   .input-field__hint    → helper or error text below
 *
 * Disabled state uses opacity (--global-opacity-50) instead of a
 * separate background/text color pair, matching Figma's Input pattern.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-input-font-family: var(--global-font-family-sans);
  --component-input-font-size:   var(--global-font-size-sm);
  --component-input-radius:      var(--global-radius-lg);
  --component-input-transition:  var(--theme-transition-default);

  --component-input-border:         var(--theme-border-input);
  --component-input-border-focus:   var(--theme-border-focus-ring);
  --component-input-border-error:   var(--theme-status-destructive);
  --component-input-border-success: var(--theme-status-success);

  --component-input-bg: var(--theme-surface-raised);

  --component-input-text:             var(--theme-text-default);
  --component-input-text-placeholder: var(--theme-text-subtle);

  --component-input-label-size:   var(--global-font-size-sm);
  --component-input-label-weight: var(--global-font-weight-medium);
  --component-input-label-color:  var(--theme-text-default);

  --component-input-hint-size:  var(--global-font-size-xs);
  --component-input-hint-color: var(--theme-text-muted);

  --component-input-padding-x-sm: var(--global-size-unit-2);
  --component-input-padding-y-sm: var(--global-size-unit-1);
  --component-input-padding-x-md: var(--global-size-unit-3);
  --component-input-padding-y-md: var(--global-size-unit-2);
  --component-input-padding-x-lg: var(--global-size-unit-4);
  --component-input-padding-y-lg: var(--global-size-unit-3);
}

/* ── Field Wrapper ─────────────────────────────────────── */
.input-field {
  display: flex;
  flex-direction: column;
  gap: var(--global-size-unit-1);
  width: 100%;
}

/* ── Label ─────────────────────────────────────────────── */
.input-field__label {
  font-family: var(--component-input-font-family);
  font-size: var(--component-input-label-size);
  font-weight: var(--component-input-label-weight);
  color: var(--component-input-label-color);
  line-height: var(--global-line-height-snug);
}

.input-field__label--required::after {
  content: ' *';
  color: var(--theme-status-destructive);
}

/* ── Input Element ─────────────────────────────────────── */
.input-field__input {
  width: 100%;
  font-family: var(--component-input-font-family);
  font-size: var(--component-input-font-size);
  color: var(--component-input-text);
  background-color: var(--component-input-bg);
  border: 1px solid var(--component-input-border);
  border-radius: var(--component-input-radius);
  outline: none;
  appearance: none;
  transition:
    border-color var(--component-input-transition),
    box-shadow var(--component-input-transition),
    background-color var(--component-input-transition);

  /* Default size: md */
  padding: var(--component-input-padding-y-md) var(--component-input-padding-x-md);
}

.input-field__input::placeholder {
  color: var(--component-input-text-placeholder);
}

.input-field__input:focus {
  border-color: var(--component-input-border-focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-border-focus-ring) 15%, transparent);
}

.input-field__input:disabled {
  opacity: var(--global-opacity-50);
  cursor: not-allowed;
}

.input-field__input:read-only {
  background-color: var(--theme-surface-subtle);
  cursor: default;
}

/* ── Sizes ─────────────────────────────────────────────── */
.input-field--sm .input-field__input {
  font-size: var(--global-font-size-xs);
  padding: var(--component-input-padding-y-sm) var(--component-input-padding-x-sm);
}

.input-field--lg .input-field__input {
  font-size: var(--global-font-size-base);
  padding: var(--component-input-padding-y-lg) var(--component-input-padding-x-lg);
}

/* ── Variant: Error ────────────────────────────────────── */
.input-field--error .input-field__input {
  border-color: var(--component-input-border-error);
}

.input-field--error .input-field__input:focus {
  border-color: var(--component-input-border-error);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-status-destructive) 15%, transparent);
}

.input-field--error .input-field__hint {
  color: var(--theme-status-destructive);
}

/* ── Variant: Success ──────────────────────────────────── */
.input-field--success .input-field__input {
  border-color: var(--component-input-border-success);
}

.input-field--success .input-field__input:focus {
  border-color: var(--component-input-border-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-status-success) 15%, transparent);
}

.input-field--success .input-field__hint {
  color: var(--theme-status-success);
}

/* ── Hint / Helper Text ────────────────────────────────── */
.input-field__hint {
  font-family: var(--component-input-font-family);
  font-size: var(--component-input-hint-size);
  color: var(--component-input-hint-color);
  line-height: var(--global-line-height-snug);
}

/* ── Textarea ──────────────────────────────────────────── */
.input-field__input--textarea {
  resize: vertical;
  min-height: 6rem;
  line-height: var(--global-line-height-normal);
}
```

- [ ] **Step 2: Update `registry.json`'s input entry**

In the `input` entry, change:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-semantic"
      ],
```

to:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
```

- [ ] **Step 3: Verify**

```bash
npm run registry:build
grep -E -- "--(primitive|color-|radius-component|leading-)\b" registry/components/input/input.css && echo "FAIL: old token found" || echo OK
```

Expected: `OK`.

- [ ] **Step 4: Manual visual check**

`npm run dev`, open `/components/input` — default/error/success states,
disabled state now dims the whole field (opacity) instead of swapping
colors, readonly state still visible.

- [ ] **Step 5: Commit**

```bash
git add registry/components/input/input.css registry.json
git commit -m "refactor: repoint input.css at global/theme tokens, opacity-based disabled state"
```

---

## Task 6: Rename Card's token references

**Files:**
- Modify: `registry/components/card/card.css` (full rewrite)
- Modify: `registry.json` (card entry's `registryDependencies`)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `--component-card-*` tokens.

- [ ] **Step 1: Replace `registry/components/card/card.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Card
 * ────────────────────────────────────
 * Variants:   default | outlined | ghost | elevated
 * Sizes:      sm | md | lg  (controls internal padding)
 *
 * Anatomy:
 *   .card              → outer container
 *   .card__header      → top section (title, actions)
 *   .card__title       → heading inside header
 *   .card__description → subtext inside header
 *   .card__body        → main content area
 *   .card__footer      → bottom section (actions, meta)
 *   .card__media       → full-bleed image/video area (before body)
 *
 * Figma's GTC Card has no variant axis (only Size). outlined/ghost/
 * elevated below are built from generic surface/border/shadow tokens
 * that already exist in Theme/Global — no extension tokens needed here.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-card-bg:           var(--theme-surface-raised);
  --component-card-border:       var(--theme-border-default);
  --component-card-radius:       var(--global-radius-xl);
  --component-card-shadow:       var(--global-shadow-sm);
  --component-card-shadow-hover: var(--global-shadow-md);
  --component-card-transition:   var(--theme-transition-default);

  --component-card-padding-sm: var(--global-size-unit-4);
  --component-card-padding-md: var(--global-size-unit-6);
  --component-card-padding-lg: var(--global-size-unit-8);

  --component-card-title-size:   var(--global-font-size-base);
  --component-card-title-weight: var(--global-font-weight-semibold);
  --component-card-desc-size:    var(--global-font-size-sm);

  --component-card-footer-border: var(--theme-border-subtle);
  --component-card-header-border: var(--theme-border-subtle);
}

/* ── Base ──────────────────────────────────────────────── */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--component-card-bg);
  border-radius: var(--component-card-radius);
  border: 1px solid var(--component-card-border);
  box-shadow: var(--component-card-shadow);
  overflow: hidden;
}

/* ── Sizes ─────────────────────────────────────────────── */
.card--sm {
  --card-padding-current: var(--component-card-padding-sm);
}
.card--md,
.card:not([class*='card--']) {
  --card-padding-current: var(--component-card-padding-md);
}
.card--lg {
  --card-padding-current: var(--component-card-padding-lg);
}

/* ── Variants ──────────────────────────────────────────── */
.card--outlined {
  box-shadow: var(--global-shadow-none);
}

.card--ghost {
  background-color: transparent;
  border-color: transparent;
  box-shadow: var(--global-shadow-none);
}

.card--elevated {
  border-color: transparent;
  box-shadow: var(--global-shadow-lg);
}

/* ── Interactive (clickable cards) ────────────────────── */
.card--interactive {
  cursor: pointer;
  transition:
    box-shadow var(--component-card-transition),
    transform var(--component-card-transition);
}

.card--interactive:hover {
  box-shadow: var(--component-card-shadow-hover);
  transform: translateY(-1px);
}

.card--interactive:active {
  transform: translateY(0);
  box-shadow: var(--component-card-shadow);
}

/* ── Media ─────────────────────────────────────────────── */
.card__media {
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

.card__media img,
.card__media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Header ────────────────────────────────────────────── */
.card__header {
  display: flex;
  flex-direction: column;
  gap: var(--global-size-unit-1);
  padding: var(--card-padding-current, var(--component-card-padding-md));
  padding-bottom: var(--global-size-unit-3);
}

.card__header + .card__body {
  padding-top: 0;
}

.card__header--bordered {
  border-bottom: 1px solid var(--component-card-header-border);
  padding-bottom: var(--card-padding-current, var(--component-card-padding-md));
}

/* ── Title & Description ───────────────────────────────── */
.card__title {
  font-size: var(--component-card-title-size);
  font-weight: var(--component-card-title-weight);
  color: var(--theme-text-default);
  line-height: var(--global-line-height-snug);
  margin: 0;
}

.card__description {
  font-size: var(--component-card-desc-size);
  color: var(--theme-text-muted);
  line-height: var(--global-line-height-normal);
  margin: 0;
}

/* ── Body ──────────────────────────────────────────────── */
.card__body {
  flex: 1;
  padding: var(--card-padding-current, var(--component-card-padding-md));
}

/* ── Footer ────────────────────────────────────────────── */
.card__footer {
  display: flex;
  align-items: center;
  gap: var(--global-size-unit-2);
  padding: var(--global-size-unit-3) var(--card-padding-current, var(--component-card-padding-md));
  border-top: 1px solid var(--component-card-footer-border);
}

.card__footer--end {
  justify-content: flex-end;
}

.card__footer--between {
  justify-content: space-between;
}
```

Note: `--component-card-padding-sm` changes from 12px to 16px and
`-md` from 20px to 24px — these now use GTC's real documented Card
padding values (Small/Medium) instead of the old arbitrary spacing
steps. Deliberate, small visual change.

- [ ] **Step 2: Update `registry.json`'s card entry**

In the `card` entry, change:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-semantic"
      ],
```

to:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
```

- [ ] **Step 3: Verify**

```bash
npm run registry:build
grep -E -- "--(primitive|color-|radius-component|leading-|shadow-(sm|md|lg|none))\b" registry/components/card/card.css | grep -v -- "--global-shadow" && echo "FAIL: old token found" || echo OK
```

Expected: `OK`.

- [ ] **Step 4: Manual visual check**

`npm run dev`, open `/components/card` — default/outlined/ghost/elevated
render distinctly, sizes show the slightly larger padding.

- [ ] **Step 5: Commit**

```bash
git add registry/components/card/card.css registry.json
git commit -m "refactor: repoint card.css at global/theme tokens"
```

---

## Task 7: Rename Select's token references, adopt opacity-based disabled state

**Files:**
- Modify: `registry/components/select/select.css` (full rewrite)
- Modify: `registry.json` (select entry's `registryDependencies`)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `--component-select-*` tokens.

- [ ] **Step 1: Replace `registry/components/select/select.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Select
 * ────────────────────────────────────
 * Variants:   default | error | success
 * Sizes:      sm | md | lg
 * States:     focus, disabled, multiple
 *
 * Anatomy:
 *   .select-field           → wrapper (label + control + hint)
 *   .select-field__label    → label text
 *   .select-field__control  → chevron anchor (position: relative)
 *   .select-field__select   → native <select> element
 *   .select-field__hint     → helper or error text below
 *
 * Figma's GTC file has no Select component yet (still "planned" on the
 * roadmap). Token values fall back to Input's real values since Select
 * is visually analogous — update when Figma defines it.
 *
 * Disabled state uses opacity (--global-opacity-50), matching Button/Input.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-select-font-family: var(--global-font-family-sans);
  --component-select-font-size:   var(--global-font-size-sm);
  --component-select-radius:      var(--global-radius-lg);
  --component-select-transition:  var(--theme-transition-default);

  --component-select-border:         var(--theme-border-input);
  --component-select-border-focus:   var(--theme-border-focus-ring);
  --component-select-border-error:   var(--theme-status-destructive);
  --component-select-border-success: var(--theme-status-success);

  --component-select-bg: var(--theme-surface-raised);

  --component-select-text: var(--theme-text-default);

  --component-select-label-size:   var(--global-font-size-sm);
  --component-select-label-weight: var(--global-font-weight-medium);
  --component-select-label-color:  var(--theme-text-default);

  --component-select-hint-size:  var(--global-font-size-xs);
  --component-select-hint-color: var(--theme-text-muted);

  --component-select-icon-color: var(--theme-text-muted);

  --component-select-padding-x-sm: var(--global-size-unit-2);
  --component-select-padding-y-sm: var(--global-size-unit-1);
  --component-select-padding-x-md: var(--global-size-unit-3);
  --component-select-padding-y-md: var(--global-size-unit-2);
  --component-select-padding-x-lg: var(--global-size-unit-4);
  --component-select-padding-y-lg: var(--global-size-unit-3);
}

/* ── Field Wrapper ─────────────────────────────────────── */
.select-field {
  display: flex;
  flex-direction: column;
  gap: var(--global-size-unit-1);
  width: 100%;
}

/* ── Label ─────────────────────────────────────────────── */
.select-field__label {
  font-family: var(--component-select-font-family);
  font-size: var(--component-select-label-size);
  font-weight: var(--component-select-label-weight);
  color: var(--component-select-label-color);
  line-height: var(--global-line-height-snug);
}

.select-field__label--required::after {
  content: ' *';
  color: var(--theme-status-destructive);
}

/* ── Control (chevron anchor) ──────────────────────────── */
.select-field__control {
  position: relative;
  width: 100%;
}

/* ── Select Element ────────────────────────────────────── */
.select-field__select {
  width: 100%;
  font-family: var(--component-select-font-family);
  font-size: var(--component-select-font-size);
  color: var(--component-select-text);
  background-color: var(--component-select-bg);
  border: 1px solid var(--component-select-border);
  border-radius: var(--component-select-radius);
  outline: none;
  appearance: none;
  cursor: pointer;
  transition:
    border-color var(--component-select-transition),
    box-shadow var(--component-select-transition),
    background-color var(--component-select-transition);

  /* Default size: md — extra padding-right makes room for the chevron */
  padding: var(--component-select-padding-y-md) calc(var(--component-select-padding-x-md) + 1.75rem) var(--component-select-padding-y-md) var(--component-select-padding-x-md);
}

.select-field__select:focus {
  border-color: var(--component-select-border-focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-border-focus-ring) 15%, transparent);
}

.select-field__select:disabled {
  opacity: var(--global-opacity-50);
  cursor: not-allowed;
}

/* ── Chevron Icon ──────────────────────────────────────── */
/* mask-image technique: background-color provides the icon color,
   the SVG mask defines the shape — works with any --component-select-icon-color value */
.select-field__control::after {
  content: '';
  position: absolute;
  right: var(--component-select-padding-x-md);
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  background-color: var(--component-select-icon-color);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

/* ── Sizes ─────────────────────────────────────────────── */
.select-field--sm .select-field__select {
  font-size: var(--global-font-size-xs);
  padding: var(--component-select-padding-y-sm) calc(var(--component-select-padding-x-sm) + 1.75rem) var(--component-select-padding-y-sm) var(--component-select-padding-x-sm);
}

.select-field--sm .select-field__control::after {
  right: var(--component-select-padding-x-sm);
}

.select-field--lg .select-field__select {
  font-size: var(--global-font-size-base);
  padding: var(--component-select-padding-y-lg) calc(var(--component-select-padding-x-lg) + 1.75rem) var(--component-select-padding-y-lg) var(--component-select-padding-x-lg);
}

.select-field--lg .select-field__control::after {
  right: var(--component-select-padding-x-lg);
}

/* ── Variant: Error ────────────────────────────────────── */
.select-field--error .select-field__select {
  border-color: var(--component-select-border-error);
}

.select-field--error .select-field__select:focus {
  border-color: var(--component-select-border-error);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-status-destructive) 15%, transparent);
}

.select-field--error .select-field__hint {
  color: var(--theme-status-destructive);
}

/* ── Variant: Success ──────────────────────────────────── */
.select-field--success .select-field__select {
  border-color: var(--component-select-border-success);
}

.select-field--success .select-field__select:focus {
  border-color: var(--component-select-border-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-status-success) 15%, transparent);
}

.select-field--success .select-field__hint {
  color: var(--theme-status-success);
}

/* ── Multiple Mode ─────────────────────────────────────── */
.select-field--multiple .select-field__select {
  padding-right: var(--component-select-padding-x-md);
  cursor: auto;
}

.select-field--multiple.select-field--sm .select-field__select {
  padding-right: var(--component-select-padding-x-sm);
}

.select-field--multiple.select-field--lg .select-field__select {
  padding-right: var(--component-select-padding-x-lg);
}

.select-field--multiple .select-field__control::after {
  display: none;
}

/* ── Hint / Helper Text ────────────────────────────────── */
.select-field__hint {
  font-family: var(--component-select-font-family);
  font-size: var(--component-select-hint-size);
  color: var(--component-select-hint-color);
  line-height: var(--global-line-height-snug);
}
```

- [ ] **Step 2: Update `registry.json`'s select entry**

In the `select` entry, change:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-semantic"
      ],
```

to:

```json
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
```

- [ ] **Step 3: Verify**

```bash
npm run registry:build
grep -E -- "--(primitive|color-|radius-component|leading-)\b" registry/components/select/select.css && echo "FAIL: old token found" || echo OK
```

Expected: `OK`.

- [ ] **Step 4: Manual visual check**

`npm run dev`, open `/components/select` — chevron renders, disabled
dims via opacity, multiple mode hides the chevron.

- [ ] **Step 5: Commit**

```bash
git add registry/components/select/select.css registry.json
git commit -m "refactor: repoint select.css at global/theme tokens, opacity-based disabled state"
```

---

## Task 8: New component — Checkbox

**Files:**
- Create: `registry/components/checkbox/checkbox.css`
- Create: `registry/components/checkbox/checkbox.astro`
- Create: `registry/components/checkbox/checkbox.tsx`
- Create: `src/pages/components/checkbox.astro`
- Modify: `registry.json` (add `checkbox` entry)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `.checkbox`, `.checkbox-field`, `.checkbox-field__label` CSS
  classes; `<Checkbox>` Astro/React components with props
  `checked?, disabled?, label?, name?, value?, class?/className?`.

- [ ] **Step 1: Create `registry/components/checkbox/checkbox.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Checkbox
 * ────────────────────────────────────
 * States: unchecked | checked | hover | focus-visible | disabled
 *
 * Anatomy:
 *   .checkbox              → the <input type="checkbox"> itself
 *   .checkbox-field        → optional wrapper when a label is used
 *   .checkbox-field__label → label text
 *
 * The check glyph is a real icon (mask-image SVG, same technique as
 * Select's chevron), not a text character.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-checkbox-size:           var(--global-icon-size-sm);
  --component-checkbox-radius:         var(--global-radius-4-32);
  --component-checkbox-border:         var(--theme-border-input);
  --component-checkbox-bg:             var(--theme-surface-raised);
  --component-checkbox-checked-bg:     var(--theme-button-primary-bg);
  --component-checkbox-checked-border: var(--theme-button-primary-bg);
  --component-checkbox-glyph-color:    var(--theme-button-primary-text);
  --component-checkbox-transition:     var(--theme-transition-default);
}

/* ── Base ──────────────────────────────────────────────── */
.checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: var(--component-checkbox-size);
  height: var(--component-checkbox-size);
  margin: 0;
  border-radius: var(--component-checkbox-radius);
  border: 1px solid var(--component-checkbox-border);
  background-color: var(--component-checkbox-bg);
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition:
    background-color var(--component-checkbox-transition),
    border-color var(--component-checkbox-transition);
}

.checkbox::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--component-checkbox-glyph-color);
  opacity: 0;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' d='M20 6 9 17l-5-5'/%3E%3C/svg%3E");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: 70%;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' d='M20 6 9 17l-5-5'/%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: 70%;
  transition: opacity var(--component-checkbox-transition);
}

.checkbox:checked {
  background-color: var(--component-checkbox-checked-bg);
  border-color: var(--component-checkbox-checked-border);
}

.checkbox:checked::after {
  opacity: 1;
}

.checkbox:focus-visible {
  outline: 2px solid var(--theme-border-focus-ring);
  outline-offset: 2px;
}

.checkbox:disabled {
  opacity: var(--global-opacity-50);
  cursor: not-allowed;
}

/* ── With label wrapper ──────────────────────────────────── */
.checkbox-field {
  display: inline-flex;
  align-items: center;
  gap: var(--global-size-unit-2);
  cursor: pointer;
}

.checkbox-field__label {
  font-family: var(--global-font-family-sans);
  font-size: var(--global-font-size-sm);
  color: var(--theme-text-default);
}

.checkbox-field:has(.checkbox:disabled) {
  cursor: not-allowed;
  opacity: var(--global-opacity-50);
}

.checkbox-field:has(.checkbox:disabled) .checkbox {
  opacity: 1; /* wrapper already dims; avoid double-dimming */
}
```

- [ ] **Step 2: Create `registry/components/checkbox/checkbox.astro`**

```astro
---
/**
 * ptrckschrdtr-ds — Checkbox (Astro)
 *
 * Props:
 *   checked  — boolean
 *   disabled — boolean
 *   label    — string  → renders a <label> next to the checkbox
 *   name     — string
 *   value    — string
 *   class    — additional CSS classes
 */

import './checkbox.css'

interface Props {
  checked?: boolean
  disabled?: boolean
  label?: string
  name?: string
  value?: string
  class?: string
  [key: string]: unknown
}

const {
  checked = false,
  disabled = false,
  label,
  name,
  value,
  class: className,
  ...rest
} = Astro.props

const classes = ['checkbox', className].filter(Boolean).join(' ')
---

{label ? (
  <label class="checkbox-field">
    <input type="checkbox" class={classes} checked={checked} disabled={disabled} name={name} value={value} {...rest} />
    <span class="checkbox-field__label">{label}</span>
  </label>
) : (
  <input type="checkbox" class={classes} checked={checked} disabled={disabled} name={name} value={value} {...rest} />
)}
```

- [ ] **Step 3: Create `registry/components/checkbox/checkbox.tsx`**

```tsx
/**
 * ptrckschrdtr-ds — Checkbox (React)
 *
 * Props:
 *   label — string  → renders a <label> next to the checkbox
 *   (plus all native <input type="checkbox"> props)
 *
 * Usage:
 *   import './checkbox.css'
 *   <Checkbox label="Accept terms" />
 *   <Checkbox checked disabled />
 */

import * as React from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const classes = ['checkbox', className].filter(Boolean).join(' ')

    const input = <input ref={ref} type="checkbox" id={inputId} className={classes} {...props} />

    if (!label) return input

    return (
      <label className="checkbox-field" htmlFor={inputId}>
        {input}
        <span className="checkbox-field__label">{label}</span>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
```

- [ ] **Step 4: Create `src/pages/components/checkbox.astro`**

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro'
import Checkbox from '../../../registry/components/checkbox/checkbox.astro'
---

<DocsLayout title="Checkbox" currentPath="/components/checkbox">
  <h1 class="docs-page-title">Checkbox</h1>
  <p class="docs-page-description">A single checkbox control with an optional label.</p>

  <div class="docs-install">
    <code>npx shadcn@latest add https://ds.ptrckschrdtr.de/r/checkbox.json</code>
    <button
      class="docs-install__copy"
      onclick="navigator.clipboard.writeText('npx shadcn@latest add https://ds.ptrckschrdtr.de/r/checkbox.json').then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500) })"
    >Copy</button>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">States</h2>
    <div class="docs-preview">
      <Checkbox />
      <Checkbox checked />
      <Checkbox disabled />
      <Checkbox checked disabled />
    </div>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">With label</h2>
    <div class="docs-preview">
      <Checkbox label="Accept terms and conditions" />
      <Checkbox label="Already checked" checked />
    </div>
  </div>
</DocsLayout>
```

- [ ] **Step 5: Add the `checkbox` entry to `registry.json`**

Insert after the `select` entry (before the closing `]` of `items`):

```json
    ,
    {
      "name": "checkbox",
      "type": "registry:component",
      "title": "Checkbox",
      "description": "Single checkbox control with an optional label. States: unchecked, checked, disabled.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
      "files": [
        {
          "path": "registry/components/checkbox/checkbox.css",
          "type": "registry:style",
          "target": "src/components/ds/checkbox/checkbox.css"
        },
        {
          "path": "registry/components/checkbox/checkbox.astro",
          "type": "registry:component",
          "target": "src/components/ds/checkbox/checkbox.astro"
        },
        {
          "path": "registry/components/checkbox/checkbox.tsx",
          "type": "registry:component",
          "target": "src/components/ds/checkbox/checkbox.tsx"
        }
      ]
    }
```

(place this immediately after the `select` item's closing `}`, adding a
comma after that `}` and removing the leading comma shown above — i.e.
standard JSON array insertion)

- [ ] **Step 6: Verify the registry builds**

```bash
npm run registry:build && test -f public/r/checkbox.json && echo OK
```

- [ ] **Step 7: Manual visual check**

`npm run dev`, open `/components/checkbox` — unchecked/checked/disabled
states render, check glyph visible when checked, label variants align.

- [ ] **Step 8: Commit**

```bash
git add registry/components/checkbox registry.json src/pages/components/checkbox.astro
git commit -m "feat: add checkbox component"
```

---

## Task 9: New component — Switch

**Files:**
- Create: `registry/components/switch/switch.css`
- Create: `registry/components/switch/switch.astro`
- Create: `registry/components/switch/switch.tsx`
- Create: `src/pages/components/switch.astro`
- Modify: `registry.json` (add `switch` entry)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `.switch`, `.switch-field`, `.switch-field__label` CSS
  classes; `<Switch>` Astro/React components, same props shape as
  Checkbox (`checked?, disabled?, label?, name?, value?, class?/className?`).

- [ ] **Step 1: Create `registry/components/switch/switch.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Switch
 * ────────────────────────────────────
 * States: off | on | hover | focus-visible | disabled
 *
 * Anatomy:
 *   .switch              → the <input type="checkbox"> styled as a track
 *   .switch-field        → optional wrapper when a label is used
 *   .switch-field__label → label text
 *
 * Track radius uses the "pill" pattern value (999px), not the regular
 * radius-full scale step, so it stays fully round regardless of height.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-switch-width:      2.25rem;
  --component-switch-height:     var(--global-control-height-20);
  --component-switch-radius:     var(--global-radius-pill);
  --component-switch-track-off:  var(--theme-border-default);
  --component-switch-track-on:   var(--theme-button-primary-bg);
  --component-switch-thumb:      var(--theme-surface-page);
  --component-switch-transition: var(--theme-transition-default);
}

/* ── Base ──────────────────────────────────────────────── */
.switch {
  appearance: none;
  -webkit-appearance: none;
  width: var(--component-switch-width);
  height: var(--component-switch-height);
  margin: 0;
  border-radius: var(--component-switch-radius);
  background-color: var(--component-switch-track-off);
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color var(--component-switch-transition);
}

.switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(var(--component-switch-height) - 4px);
  height: calc(var(--component-switch-height) - 4px);
  border-radius: var(--global-radius-pill);
  background-color: var(--component-switch-thumb);
  transition: transform var(--component-switch-transition);
}

.switch:checked {
  background-color: var(--component-switch-track-on);
}

.switch:checked::after {
  transform: translateX(calc(var(--component-switch-width) - var(--component-switch-height)));
}

.switch:focus-visible {
  outline: 2px solid var(--theme-border-focus-ring);
  outline-offset: 2px;
}

.switch:disabled {
  opacity: var(--global-opacity-50);
  cursor: not-allowed;
}

/* ── With label wrapper ──────────────────────────────────── */
.switch-field {
  display: inline-flex;
  align-items: center;
  gap: var(--global-size-unit-2);
  cursor: pointer;
}

.switch-field__label {
  font-family: var(--global-font-family-sans);
  font-size: var(--global-font-size-sm);
  color: var(--theme-text-default);
}

.switch-field:has(.switch:disabled) {
  cursor: not-allowed;
  opacity: var(--global-opacity-50);
}

.switch-field:has(.switch:disabled) .switch {
  opacity: 1;
}
```

- [ ] **Step 2: Create `registry/components/switch/switch.astro`**

```astro
---
/**
 * ptrckschrdtr-ds — Switch (Astro)
 *
 * Props:
 *   checked  — boolean
 *   disabled — boolean
 *   label    — string  → renders a <label> next to the switch
 *   name     — string
 *   value    — string
 *   class    — additional CSS classes
 */

import './switch.css'

interface Props {
  checked?: boolean
  disabled?: boolean
  label?: string
  name?: string
  value?: string
  class?: string
  [key: string]: unknown
}

const {
  checked = false,
  disabled = false,
  label,
  name,
  value,
  class: className,
  ...rest
} = Astro.props

const classes = ['switch', className].filter(Boolean).join(' ')
---

{label ? (
  <label class="switch-field">
    <input type="checkbox" role="switch" class={classes} checked={checked} disabled={disabled} name={name} value={value} {...rest} />
    <span class="switch-field__label">{label}</span>
  </label>
) : (
  <input type="checkbox" role="switch" class={classes} checked={checked} disabled={disabled} name={name} value={value} {...rest} />
)}
```

- [ ] **Step 3: Create `registry/components/switch/switch.tsx`**

```tsx
/**
 * ptrckschrdtr-ds — Switch (React)
 *
 * Props:
 *   label — string  → renders a <label> next to the switch
 *   (plus all native <input type="checkbox"> props)
 *
 * Usage:
 *   import './switch.css'
 *   <Switch label="Enable notifications" />
 *   <Switch checked disabled />
 */

import * as React from 'react'

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const classes = ['switch', className].filter(Boolean).join(' ')

    const input = <input ref={ref} type="checkbox" role="switch" id={inputId} className={classes} {...props} />

    if (!label) return input

    return (
      <label className="switch-field" htmlFor={inputId}>
        {input}
        <span className="switch-field__label">{label}</span>
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
```

- [ ] **Step 4: Create `src/pages/components/switch.astro`**

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro'
import Switch from '../../../registry/components/switch/switch.astro'
---

<DocsLayout title="Switch" currentPath="/components/switch">
  <h1 class="docs-page-title">Switch</h1>
  <p class="docs-page-description">An on/off toggle control with an optional label.</p>

  <div class="docs-install">
    <code>npx shadcn@latest add https://ds.ptrckschrdtr.de/r/switch.json</code>
    <button
      class="docs-install__copy"
      onclick="navigator.clipboard.writeText('npx shadcn@latest add https://ds.ptrckschrdtr.de/r/switch.json').then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500) })"
    >Copy</button>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">States</h2>
    <div class="docs-preview">
      <Switch />
      <Switch checked />
      <Switch disabled />
      <Switch checked disabled />
    </div>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">With label</h2>
    <div class="docs-preview">
      <Switch label="Enable notifications" />
      <Switch label="Already on" checked />
    </div>
  </div>
</DocsLayout>
```

- [ ] **Step 5: Add the `switch` entry to `registry.json`**

Insert after the `checkbox` entry (before the closing `]` of `items`,
adding a comma after checkbox's closing `}`):

```json
    {
      "name": "switch",
      "type": "registry:component",
      "title": "Switch",
      "description": "On/off toggle control with an optional label. States: off, on, disabled.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
      "files": [
        {
          "path": "registry/components/switch/switch.css",
          "type": "registry:style",
          "target": "src/components/ds/switch/switch.css"
        },
        {
          "path": "registry/components/switch/switch.astro",
          "type": "registry:component",
          "target": "src/components/ds/switch/switch.astro"
        },
        {
          "path": "registry/components/switch/switch.tsx",
          "type": "registry:component",
          "target": "src/components/ds/switch/switch.tsx"
        }
      ]
    }
```

- [ ] **Step 6: Verify**

```bash
npm run registry:build && test -f public/r/switch.json && echo OK
```

- [ ] **Step 7: Manual visual check**

`npm run dev`, open `/components/switch` — thumb slides on toggle, on
state uses the primary color, disabled dims.

- [ ] **Step 8: Commit**

```bash
git add registry/components/switch registry.json src/pages/components/switch.astro
git commit -m "feat: add switch component"
```

---

## Task 10: New component — Avatar

**Files:**
- Create: `registry/components/avatar/avatar.css`
- Create: `registry/components/avatar/avatar.astro`
- Create: `registry/components/avatar/avatar.tsx`
- Create: `src/pages/components/avatar.astro`
- Modify: `registry.json` (add `avatar` entry)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `.avatar`, `.avatar--sm`, `.avatar__icon` CSS classes;
  `<Avatar>` Astro/React components with props
  `type?: 'initials'|'icon'|'image', src?, alt?, initials?, size?: 'sm'|'md', class?/className?`.

- [ ] **Step 1: Create `registry/components/avatar/avatar.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Avatar
 * ────────────────────────────────────
 * Type: initials | icon | image
 * Sizes: sm | md
 *
 * Radius uses the "pill" pattern value (999px), not the regular
 * radius-full scale step, so it stays fully round regardless of size.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-avatar-size-sm: var(--global-control-height-24);
  --component-avatar-size-md: var(--global-control-height-31);
  --component-avatar-radius:  var(--global-radius-pill);
  --component-avatar-bg:      var(--theme-surface-muted);
  --component-avatar-text:    var(--theme-text-default);

  --component-avatar-font-size-sm: var(--global-font-size-xs);
  --component-avatar-font-size-md: var(--global-font-size-sm);

  --component-avatar-icon-size-sm: var(--global-icon-size-sm);
  --component-avatar-icon-size-md: var(--global-icon-size-md);
}

/* ── Base (Medium, default) ───────────────────────────── */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--component-avatar-size-md);
  height: var(--component-avatar-size-md);
  border-radius: var(--component-avatar-radius);
  background-color: var(--component-avatar-bg);
  color: var(--component-avatar-text);
  font-family: var(--global-font-family-sans);
  font-weight: var(--global-font-weight-medium);
  font-size: var(--component-avatar-font-size-md);
  overflow: hidden;
  flex-shrink: 0;
  user-select: none;
}

.avatar--sm {
  width: var(--component-avatar-size-sm);
  height: var(--component-avatar-size-sm);
  font-size: var(--component-avatar-font-size-sm);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar__icon {
  width: var(--component-avatar-icon-size-md);
  height: var(--component-avatar-icon-size-md);
}

.avatar--sm .avatar__icon {
  width: var(--component-avatar-icon-size-sm);
  height: var(--component-avatar-icon-size-sm);
}
```

- [ ] **Step 2: Create `registry/components/avatar/avatar.astro`**

```astro
---
/**
 * ptrckschrdtr-ds — Avatar (Astro)
 *
 * Props:
 *   type     — 'initials' | 'icon' | 'image'  (default: 'initials')
 *   src      — string  → image URL, used when type='image'
 *   alt      — string  → alt text for image
 *   initials — string  → shown when type='initials'
 *   size     — 'sm' | 'md'  (default: 'md')
 *   class    — additional CSS classes
 */

import './avatar.css'

interface Props {
  type?: 'initials' | 'icon' | 'image'
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md'
  class?: string
  [key: string]: unknown
}

const {
  type = 'initials',
  src,
  alt = '',
  initials,
  size = 'md',
  class: className,
  ...rest
} = Astro.props

const classes = ['avatar', size === 'sm' && 'avatar--sm', className].filter(Boolean).join(' ')
---

<span class={classes} {...rest}>
  {type === 'image' && src && <img src={src} alt={alt} />}
  {type === 'icon' && (
    <svg class="avatar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )}
  {type === 'initials' && initials}
</span>
```

- [ ] **Step 3: Create `registry/components/avatar/avatar.tsx`**

```tsx
/**
 * ptrckschrdtr-ds — Avatar (React)
 *
 * Props:
 *   type     — 'initials' | 'icon' | 'image'  (default: 'initials')
 *   src      — string  → image URL, used when type='image'
 *   alt      — string  → alt text for image
 *   initials — string  → shown when type='initials'
 *   size     — 'sm' | 'md'  (default: 'md')
 *
 * Usage:
 *   import './avatar.css'
 *   <Avatar type="initials" initials="PS" />
 *   <Avatar type="image" src="/me.jpg" alt="Patrick" />
 *   <Avatar type="icon" size="sm" />
 */

import * as React from 'react'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: 'initials' | 'icon' | 'image'
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md'
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ type = 'initials', src, alt = '', initials, size = 'md', className, ...props }, ref) => {
    const classes = ['avatar', size === 'sm' && 'avatar--sm', className].filter(Boolean).join(' ')

    return (
      <span ref={ref} className={classes} {...props}>
        {type === 'image' && src && <img src={src} alt={alt} />}
        {type === 'icon' && (
          <svg className="avatar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
        {type === 'initials' && initials}
      </span>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
```

- [ ] **Step 4: Create `src/pages/components/avatar.astro`**

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro'
import Avatar from '../../../registry/components/avatar/avatar.astro'
---

<DocsLayout title="Avatar" currentPath="/components/avatar">
  <h1 class="docs-page-title">Avatar</h1>
  <p class="docs-page-description">Initials, icon, or image representation of a user. 2 sizes.</p>

  <div class="docs-install">
    <code>npx shadcn@latest add https://ds.ptrckschrdtr.de/r/avatar.json</code>
    <button
      class="docs-install__copy"
      onclick="navigator.clipboard.writeText('npx shadcn@latest add https://ds.ptrckschrdtr.de/r/avatar.json').then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500) })"
    >Copy</button>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">Type</h2>
    <div class="docs-preview">
      <Avatar type="initials" initials="PS" />
      <Avatar type="icon" />
    </div>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">Sizes</h2>
    <div class="docs-preview">
      <Avatar type="initials" initials="PS" size="sm" />
      <Avatar type="initials" initials="PS" />
    </div>
  </div>
</DocsLayout>
```

- [ ] **Step 5: Add the `avatar` entry to `registry.json`**

Insert after the `switch` entry (before the closing `]` of `items`,
adding a comma after switch's closing `}`):

```json
    {
      "name": "avatar",
      "type": "registry:component",
      "title": "Avatar",
      "description": "Initials, icon, or image representation of a user. Sizes: sm, md.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
      "files": [
        {
          "path": "registry/components/avatar/avatar.css",
          "type": "registry:style",
          "target": "src/components/ds/avatar/avatar.css"
        },
        {
          "path": "registry/components/avatar/avatar.astro",
          "type": "registry:component",
          "target": "src/components/ds/avatar/avatar.astro"
        },
        {
          "path": "registry/components/avatar/avatar.tsx",
          "type": "registry:component",
          "target": "src/components/ds/avatar/avatar.tsx"
        }
      ]
    }
```

- [ ] **Step 6: Verify**

```bash
npm run registry:build && test -f public/r/avatar.json && echo OK
```

- [ ] **Step 7: Manual visual check**

`npm run dev`, open `/components/avatar` — initials/icon types render,
both sizes are fully round.

- [ ] **Step 8: Commit**

```bash
git add registry/components/avatar registry.json src/pages/components/avatar.astro
git commit -m "feat: add avatar component"
```

---

## Task 11: New component — Separator

**Files:**
- Create: `registry/components/separator/separator.css`
- Create: `registry/components/separator/separator.astro`
- Create: `registry/components/separator/separator.tsx`
- Create: `src/pages/components/separator.astro`
- Modify: `registry.json` (add `separator` entry)

**Interfaces:**
- Consumes: `--theme-border-default` (Task 2), `--global-border-width-hairline` (Task 1).
- Produces: `.separator`, `.separator--horizontal` CSS classes;
  `<Separator>` Astro/React components (no variant props — horizontal
  only in this phase, see spec).

- [ ] **Step 1: Create `registry/components/separator/separator.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Separator
 * ────────────────────────────────────
 * Horizontal-only in this phase — Figma's page doesn't document an
 * orientation variant. Add --separator--vertical later if needed.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-separator-color:     var(--theme-border-default);
  --component-separator-thickness: var(--global-border-width-hairline);
}

/* ── Base ──────────────────────────────────────────────── */
.separator {
  border: none;
  background-color: var(--component-separator-color);
  flex-shrink: 0;
}

.separator--horizontal {
  width: 100%;
  height: var(--component-separator-thickness);
}
```

- [ ] **Step 2: Create `registry/components/separator/separator.astro`**

```astro
---
/**
 * ptrckschrdtr-ds — Separator (Astro)
 *
 * Props:
 *   class — additional CSS classes
 */

import './separator.css'

interface Props {
  class?: string
  [key: string]: unknown
}

const { class: className, ...rest } = Astro.props
const classes = ['separator', 'separator--horizontal', className].filter(Boolean).join(' ')
---

<hr class={classes} role="separator" {...rest} />
```

- [ ] **Step 3: Create `registry/components/separator/separator.tsx`**

```tsx
/**
 * ptrckschrdtr-ds — Separator (React)
 *
 * Usage:
 *   import './separator.css'
 *   <Separator />
 */

import * as React from 'react'

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, ...props }, ref) => {
    const classes = ['separator', 'separator--horizontal', className].filter(Boolean).join(' ')
    return <hr ref={ref} className={classes} role="separator" {...props} />
  }
)

Separator.displayName = 'Separator'

export default Separator
```

- [ ] **Step 4: Create `src/pages/components/separator.astro`**

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro'
import Separator from '../../../registry/components/separator/separator.astro'
---

<DocsLayout title="Separator" currentPath="/components/separator">
  <h1 class="docs-page-title">Separator</h1>
  <p class="docs-page-description">A horizontal rule for dividing content.</p>

  <div class="docs-install">
    <code>npx shadcn@latest add https://ds.ptrckschrdtr.de/r/separator.json</code>
    <button
      class="docs-install__copy"
      onclick="navigator.clipboard.writeText('npx shadcn@latest add https://ds.ptrckschrdtr.de/r/separator.json').then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500) })"
    >Copy</button>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">Default</h2>
    <div style="max-width: 320px;">
      <p>Content above</p>
      <Separator />
      <p>Content below</p>
    </div>
  </div>
</DocsLayout>
```

- [ ] **Step 5: Add the `separator` entry to `registry.json`**

Insert after the `avatar` entry (before the closing `]` of `items`,
adding a comma after avatar's closing `}`):

```json
    {
      "name": "separator",
      "type": "registry:component",
      "title": "Separator",
      "description": "Horizontal rule for dividing content.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
      "files": [
        {
          "path": "registry/components/separator/separator.css",
          "type": "registry:style",
          "target": "src/components/ds/separator/separator.css"
        },
        {
          "path": "registry/components/separator/separator.astro",
          "type": "registry:component",
          "target": "src/components/ds/separator/separator.astro"
        },
        {
          "path": "registry/components/separator/separator.tsx",
          "type": "registry:component",
          "target": "src/components/ds/separator/separator.tsx"
        }
      ]
    }
```

- [ ] **Step 6: Verify**

```bash
npm run registry:build && test -f public/r/separator.json && echo OK
```

- [ ] **Step 7: Manual visual check**

`npm run dev`, open `/components/separator` — a thin horizontal line
renders between the two paragraphs.

- [ ] **Step 8: Commit**

```bash
git add registry/components/separator registry.json src/pages/components/separator.astro
git commit -m "feat: add separator component"
```

---

## Task 12: New component — Alert

**Files:**
- Create: `registry/components/alert/alert.css`
- Create: `registry/components/alert/alert.astro`
- Create: `registry/components/alert/alert.tsx`
- Create: `src/pages/components/alert.astro`
- Modify: `registry.json` (add `alert` entry)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `.alert`, `.alert--destructive`, `.alert__icon`,
  `.alert__content`, `.alert__title`, `.alert__description` CSS classes;
  `<Alert>` Astro/React components with props
  `variant?: 'default'|'destructive', title: string, description?: string, class?/className?`.

- [ ] **Step 1: Create `registry/components/alert/alert.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Alert
 * ────────────────────────────────────
 * Variant: default | destructive
 *
 * Anatomy:
 *   .alert              → outer container
 *   .alert__icon        → variant-bound icon (not a free slot)
 *   .alert__content     → title + description wrapper
 *   .alert__title       → heading text
 *   .alert__description → body text
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-alert-font-size: var(--global-font-size-sm);
  --component-alert-radius:    var(--global-radius-7-2);
  --component-alert-icon-size: var(--global-icon-size-md);
  --component-alert-padding:   var(--global-size-unit-4);
  --component-alert-gap:       var(--global-size-unit-3);
}

/* ── Base ──────────────────────────────────────────────── */
.alert {
  display: flex;
  gap: var(--component-alert-gap);
  padding: var(--component-alert-padding);
  border-radius: var(--component-alert-radius);
  border: 1px solid var(--theme-border-default);
  background-color: var(--theme-surface-raised);
  font-family: var(--global-font-family-sans);
}

.alert__icon {
  width: var(--component-alert-icon-size);
  height: var(--component-alert-icon-size);
  flex-shrink: 0;
  color: var(--theme-text-default);
}

.alert__content {
  display: flex;
  flex-direction: column;
  gap: var(--global-size-unit-1);
}

.alert__title {
  font-size: var(--component-alert-font-size);
  font-weight: var(--global-font-weight-semibold);
  color: var(--theme-text-default);
  line-height: var(--global-line-height-snug);
}

.alert__description {
  font-size: var(--component-alert-font-size);
  color: var(--theme-text-muted);
  line-height: var(--global-line-height-normal);
}

/* ── Variant: Destructive ──────────────────────────────── */
.alert--destructive {
  background-color: var(--theme-status-destructive-subtle-bg);
  border-color: var(--theme-status-destructive);
}

.alert--destructive .alert__icon,
.alert--destructive .alert__title {
  color: var(--theme-status-destructive);
}
```

- [ ] **Step 2: Create `registry/components/alert/alert.astro`**

```astro
---
/**
 * ptrckschrdtr-ds — Alert (Astro)
 *
 * Props:
 *   variant     — 'default' | 'destructive'  (default: 'default')
 *   title       — string
 *   description — string  → optional, or use <slot />
 *   class       — additional CSS classes
 *
 * Icon is bound to variant (info for default, triangle-alert for
 * destructive) and is intentionally not a free icon-slot prop — an
 * error alert with an arbitrary icon could contradict its own meaning.
 */

import './alert.css'

interface Props {
  variant?: 'default' | 'destructive'
  title: string
  description?: string
  class?: string
  [key: string]: unknown
}

const {
  variant = 'default',
  title,
  description,
  class: className,
  ...rest
} = Astro.props

const classes = ['alert', variant === 'destructive' && 'alert--destructive', className].filter(Boolean).join(' ')
---

<div class={classes} role="alert" {...rest}>
  {variant === 'destructive' ? (
    <svg class="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ) : (
    <svg class="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )}
  <div class="alert__content">
    <div class="alert__title">{title}</div>
    {description ? <div class="alert__description">{description}</div> : <slot />}
  </div>
</div>
```

- [ ] **Step 3: Create `registry/components/alert/alert.tsx`**

```tsx
/**
 * ptrckschrdtr-ds — Alert (React)
 *
 * Props:
 *   variant     — 'default' | 'destructive'  (default: 'default')
 *   title       — string
 *   description — string  → optional, or use children
 *
 * Icon is bound to variant, not a free prop — see the Astro version's
 * header comment for the reasoning.
 *
 * Usage:
 *   import './alert.css'
 *   <Alert title="Heads up">Something to know.</Alert>
 *   <Alert variant="destructive" title="Error" description="Something broke." />
 */

import * as React from 'react'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
  title: string
  description?: string
}

const InfoIcon = () => (
  <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

const TriangleAlertIcon = () => (
  <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', title, description, className, children, ...props }, ref) => {
    const classes = ['alert', variant === 'destructive' && 'alert--destructive', className].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={classes} role="alert" {...props}>
        {variant === 'destructive' ? <TriangleAlertIcon /> : <InfoIcon />}
        <div className="alert__content">
          <div className="alert__title">{title}</div>
          {description ? <div className="alert__description">{description}</div> : children}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export default Alert
```

- [ ] **Step 4: Create `src/pages/components/alert.astro`**

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro'
import Alert from '../../../registry/components/alert/alert.astro'
---

<DocsLayout title="Alert" currentPath="/components/alert">
  <h1 class="docs-page-title">Alert</h1>
  <p class="docs-page-description">A callout for important information. Variant-bound icon.</p>

  <div class="docs-install">
    <code>npx shadcn@latest add https://ds.ptrckschrdtr.de/r/alert.json</code>
    <button
      class="docs-install__copy"
      onclick="navigator.clipboard.writeText('npx shadcn@latest add https://ds.ptrckschrdtr.de/r/alert.json').then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500) })"
    >Copy</button>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">Variants</h2>
    <div class="docs-preview" style="flex-direction: column; align-items: stretch; gap: var(--global-size-unit-3);">
      <Alert title="Heads up" description="This is a default informational alert." />
      <Alert variant="destructive" title="Something went wrong" description="Your changes could not be saved." />
    </div>
  </div>
</DocsLayout>
```

- [ ] **Step 5: Add the `alert` entry to `registry.json`**

Insert after the `separator` entry (before the closing `]` of `items`,
adding a comma after separator's closing `}`):

```json
    {
      "name": "alert",
      "type": "registry:component",
      "title": "Alert",
      "description": "Callout for important information. Variant: default, destructive. Icon is bound to variant.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
      "files": [
        {
          "path": "registry/components/alert/alert.css",
          "type": "registry:style",
          "target": "src/components/ds/alert/alert.css"
        },
        {
          "path": "registry/components/alert/alert.astro",
          "type": "registry:component",
          "target": "src/components/ds/alert/alert.astro"
        },
        {
          "path": "registry/components/alert/alert.tsx",
          "type": "registry:component",
          "target": "src/components/ds/alert/alert.tsx"
        }
      ]
    }
```

- [ ] **Step 6: Verify**

```bash
npm run registry:build && test -f public/r/alert.json && echo OK
```

- [ ] **Step 7: Manual visual check**

`npm run dev`, open `/components/alert` — default shows an info icon,
destructive shows a triangle-alert icon and a tinted red background.

- [ ] **Step 8: Commit**

```bash
git add registry/components/alert registry.json src/pages/components/alert.astro
git commit -m "feat: add alert component"
```

---

## Task 13: New component — Tabs

**Files:**
- Create: `registry/components/tabs/tabs.css`
- Create: `registry/components/tabs/tabs.astro`
- Create: `registry/components/tabs/tabs.tsx`
- Create: `src/pages/components/tabs.astro`
- Modify: `registry.json` (add `tabs` entry)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).
- Produces: `.tabs-list`, `.tabs-trigger`, `.tabs-panel` CSS classes;
  `<Tabs items={{id,label}[]} defaultTab?>` Astro/React components.
  Astro version: panels are child elements tagged `data-tab-panel="<id>"`
  in the default slot. React version: panels are children with a
  `data-tab-panel` prop.

- [ ] **Step 1: Create `registry/components/tabs/tabs.css`**

```css
/**
 * ptrckschrdtr-ds — Component: Tabs
 * ────────────────────────────────────
 * State: selected | not selected (per trigger)
 *
 * Anatomy:
 *   .tabs-list          → trigger container
 *   .tabs-trigger        → individual tab button
 *   .tabs-trigger__icon  → optional leading icon
 *   .tabs-panel          → content panel for one tab
 *
 * Trigger height is fixed (control-height.31) so an optional leading
 * icon never changes tab height.
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --component-tabs-font-size:      var(--global-font-size-sm);
  --component-tabs-list-radius:    var(--global-radius-7-2);
  --component-tabs-trigger-radius: var(--global-radius-5-76);
  --component-tabs-trigger-height: var(--global-control-height-31);
  --component-tabs-icon-size:      var(--global-icon-size-xs);
}

/* ── List ──────────────────────────────────────────────── */
.tabs-list {
  display: inline-flex;
  gap: var(--global-size-unit-1);
  padding: var(--global-size-unit-1);
  background-color: var(--theme-surface-muted);
  border-radius: var(--component-tabs-list-radius);
}

/* ── Trigger ───────────────────────────────────────────── */
.tabs-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--global-size-unit-1);
  height: var(--component-tabs-trigger-height);
  padding: 0 var(--global-size-unit-3);
  border: none;
  background: transparent;
  border-radius: var(--component-tabs-trigger-radius);
  font-family: var(--global-font-family-sans);
  font-size: var(--component-tabs-font-size);
  font-weight: var(--global-font-weight-medium);
  color: var(--theme-text-muted);
  cursor: pointer;
  transition:
    background-color var(--theme-transition-default),
    color var(--theme-transition-default);
}

.tabs-trigger__icon {
  width: var(--component-tabs-icon-size);
  height: var(--component-tabs-icon-size);
}

.tabs-trigger[aria-selected="true"] {
  background-color: var(--theme-surface-raised);
  color: var(--theme-text-default);
}

.tabs-trigger:focus-visible {
  outline: 2px solid var(--theme-border-focus-ring);
  outline-offset: 2px;
}

/* ── Panel ─────────────────────────────────────────────── */
.tabs-panel {
  padding: var(--global-size-unit-4) 0;
}

.tabs-panel[hidden] {
  display: none;
}
```

- [ ] **Step 2: Create `registry/components/tabs/tabs.astro`**

```astro
---
/**
 * ptrckschrdtr-ds — Tabs (Astro)
 *
 * Props:
 *   items      — { id: string, label: string }[]
 *   defaultTab — string  → id of the initially active tab (default: items[0].id)
 *   class      — additional CSS classes
 *
 * Usage: put one panel element per tab in the default slot, each
 * tagged class="tabs-panel" data-tab-panel="<id>" matching an item id.
 *
 *   <Tabs items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}>
 *     <div class="tabs-panel" data-tab-panel="a">Panel A</div>
 *     <div class="tabs-panel" data-tab-panel="b">Panel B</div>
 *   </Tabs>
 *
 * Note: panels render via the slot and are hidden by client-side JS
 * once it runs — there is a brief flash of all panels on first paint.
 * Acceptable for v1; revisit with panels-as-prop if it becomes an issue.
 */

import './tabs.css'

interface TabItem {
  id: string
  label: string
}

interface Props {
  items: TabItem[]
  defaultTab?: string
  class?: string
  [key: string]: unknown
}

const {
  items,
  defaultTab = items[0]?.id,
  class: className,
  ...rest
} = Astro.props

const groupId = `tabs-${Math.random().toString(36).slice(2, 9)}`
---

<div class={['tabs', className].filter(Boolean).join(' ')} data-tabs-root data-default-tab={defaultTab} {...rest}>
  <div class="tabs-list" role="tablist">
    {items.map((item) => (
      <button
        type="button"
        class="tabs-trigger"
        id={`${groupId}-tab-${item.id}`}
        role="tab"
        aria-selected={item.id === defaultTab ? 'true' : 'false'}
        aria-controls={`${groupId}-panel-${item.id}`}
        tabindex={item.id === defaultTab ? 0 : -1}
        data-tab-trigger={item.id}
      >
        {item.label}
      </button>
    ))}
  </div>
  <slot />
</div>

<script>
  document.querySelectorAll<HTMLElement>('[data-tabs-root]').forEach((root) => {
    const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab-trigger]'))
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-tab-panel]'))

    function activate(id: string) {
      triggers.forEach((trigger) => {
        const isActive = trigger.dataset.tabTrigger === id
        trigger.setAttribute('aria-selected', String(isActive))
        trigger.tabIndex = isActive ? 0 : -1
      })
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== id
      })
    }

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => activate(trigger.dataset.tabTrigger!))
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          const next = triggers[(index + 1) % triggers.length]
          next.focus()
          activate(next.dataset.tabTrigger!)
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const prev = triggers[(index - 1 + triggers.length) % triggers.length]
          prev.focus()
          activate(prev.dataset.tabTrigger!)
        }
      })
    })

    const defaultTab = root.dataset.defaultTab
    if (defaultTab) activate(defaultTab)
  })
</script>
```

- [ ] **Step 3: Create `registry/components/tabs/tabs.tsx`**

```tsx
/**
 * ptrckschrdtr-ds — Tabs (React)
 *
 * Props:
 *   items      — { id: string, label: string }[]
 *   defaultTab — string  → id of the initially active tab (default: items[0].id)
 *   children   — one element per tab, each with a data-tab-panel prop
 *                matching an item id
 *
 * Usage:
 *   <Tabs items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}>
 *     <div data-tab-panel="a">Panel A</div>
 *     <div data-tab-panel="b">Panel B</div>
 *   </Tabs>
 */

import * as React from 'react'

export interface TabItem {
  id: string
  label: string
}

export interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ items, defaultTab, children, className }: TabsProps) {
  const [active, setActive] = React.useState(defaultTab ?? items[0]?.id)
  const groupId = React.useId()

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setActive(items[(index + 1) % items.length].id)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive(items[(index - 1 + items.length) % items.length].id)
    }
  }

  return (
    <div className={['tabs', className].filter(Boolean).join(' ')}>
      <div className="tabs-list" role="tablist">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="tabs-trigger"
            id={`${groupId}-tab-${item.id}`}
            role="tab"
            aria-selected={item.id === active}
            aria-controls={`${groupId}-panel-${item.id}`}
            tabIndex={item.id === active ? 0 : -1}
            onClick={() => setActive(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        const panelId = (child.props as { 'data-tab-panel'?: string })['data-tab-panel']
        if (!panelId) return child
        return panelId === active ? child : null
      })}
    </div>
  )
}

export default Tabs
```

- [ ] **Step 4: Create `src/pages/components/tabs.astro`**

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro'
import Tabs from '../../../registry/components/tabs/tabs.astro'
---

<DocsLayout title="Tabs" currentPath="/components/tabs">
  <h1 class="docs-page-title">Tabs</h1>
  <p class="docs-page-description">Switch between panels of content.</p>

  <div class="docs-install">
    <code>npx shadcn@latest add https://ds.ptrckschrdtr.de/r/tabs.json</code>
    <button
      class="docs-install__copy"
      onclick="navigator.clipboard.writeText('npx shadcn@latest add https://ds.ptrckschrdtr.de/r/tabs.json').then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500) })"
    >Copy</button>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">Default</h2>
    <Tabs items={[{ id: 'overview', label: 'Overview' }, { id: 'details', label: 'Details' }, { id: 'settings', label: 'Settings' }]}>
      <div class="tabs-panel" data-tab-panel="overview">Overview panel content.</div>
      <div class="tabs-panel" data-tab-panel="details" hidden>Details panel content.</div>
      <div class="tabs-panel" data-tab-panel="settings" hidden>Settings panel content.</div>
    </Tabs>
  </div>
</DocsLayout>
```

- [ ] **Step 5: Add the `tabs` entry to `registry.json`**

Insert after the `alert` entry (before the closing `]` of `items` — this
is the last entry, so no trailing comma):

```json
    {
      "name": "tabs",
      "type": "registry:component",
      "title": "Tabs",
      "description": "Switch between panels of content. Fixed trigger height so an optional leading icon never changes tab height.",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-theme"
      ],
      "files": [
        {
          "path": "registry/components/tabs/tabs.css",
          "type": "registry:style",
          "target": "src/components/ds/tabs/tabs.css"
        },
        {
          "path": "registry/components/tabs/tabs.astro",
          "type": "registry:component",
          "target": "src/components/ds/tabs/tabs.astro"
        },
        {
          "path": "registry/components/tabs/tabs.tsx",
          "type": "registry:component",
          "target": "src/components/ds/tabs/tabs.tsx"
        }
      ]
    }
```

- [ ] **Step 6: Verify**

```bash
npm run registry:build && test -f public/r/tabs.json && echo OK
```

- [ ] **Step 7: Manual visual check**

`npm run dev`, open `/components/tabs` — clicking a trigger switches the
visible panel, arrow-left/right keys move focus and switch panels too.

- [ ] **Step 8: Commit**

```bash
git add registry/components/tabs registry.json src/pages/components/tabs.astro
git commit -m "feat: add tabs component"
```

---

## Task 14: Update the tokens overview page

**Files:**
- Modify: `src/pages/tokens.astro` (full rewrite)

**Interfaces:**
- Consumes: `--global-*` (Task 1), `--theme-*` (Task 2).

- [ ] **Step 1: Replace `src/pages/tokens.astro`**

```astro
---
import DocsLayout from '../layouts/DocsLayout.astro'

const colorGroups = [
  {
    title: 'Surface',
    tokens: ['--theme-surface-page', '--theme-surface-raised', '--theme-surface-overlay', '--theme-surface-subtle', '--theme-surface-muted'],
  },
  {
    title: 'Text',
    tokens: ['--theme-text-default', '--theme-text-muted', '--theme-text-subtle', '--theme-text-on-primary'],
  },
  {
    title: 'Border',
    tokens: ['--theme-border-default', '--theme-border-input', '--theme-border-subtle', '--theme-border-focus-ring'],
  },
  {
    title: 'Button (Primary)',
    tokens: ['--theme-button-primary-bg', '--theme-button-primary-hover', '--theme-button-primary-active'],
  },
  {
    title: 'Status',
    tokens: ['--theme-status-destructive', '--theme-status-success', '--theme-status-warning', '--theme-status-info'],
  },
]

const spacingTokens = ['--global-size-unit-1', '--global-size-unit-2', '--global-size-unit-3', '--global-size-unit-4', '--global-size-unit-6', '--global-size-unit-8', '--global-size-unit-12', '--global-size-unit-16', '--global-size-unit-24', '--global-size-unit-32']
const radiusTokens  = ['--global-radius-none', '--global-radius-sm', '--global-radius-md', '--global-radius-lg', '--global-radius-xl', '--global-radius-2xl', '--global-radius-full', '--global-radius-pill']
const textTokens    = ['--global-font-size-xs', '--global-font-size-sm', '--global-font-size-base', '--global-font-size-md', '--global-font-size-lg', '--global-font-size-xl', '--global-font-size-2xl', '--global-font-size-3xl', '--global-font-size-4xl', '--global-font-size-5xl']
---

<DocsLayout title="Tokens" currentPath="/tokens">
  <h1 class="docs-page-title">Design Tokens</h1>
  <p class="docs-page-description">Global → Theme → Component, sourced from the Figma "ptrckschrdtr GTC DS" file. Light is the default mode.</p>

  {colorGroups.map(group => (
    <div class="docs-section">
      <h2 class="docs-section__title">Theme — {group.title}</h2>
      <div class="token-grid">
        {group.tokens.map(token => (
          <div class="token-swatch">
            <div class="token-swatch__color" style={`background-color: var(${token})`}></div>
            <div class="token-swatch__info">
              <div class="token-swatch__name">{token}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}

  <div class="docs-section">
    <h2 class="docs-section__title">Spacing</h2>
    <div class="token-spacing">
      {spacingTokens.map(token => (
        <div class="token-spacing__item">
          <div class="token-spacing__bar" style={`width: var(${token})`}></div>
          <span class="token-spacing__label">{token}</span>
        </div>
      ))}
    </div>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">Radius</h2>
    <div style="display: flex; flex-wrap: wrap; gap: var(--global-size-unit-4);">
      {radiusTokens.map(token => (
        <div style="text-align: center;">
          <div style={`width: 48px; height: 48px; background: var(--theme-button-primary-bg); border-radius: var(${token}); margin-bottom: var(--global-size-unit-2);`}></div>
          <div style="font-size: var(--global-font-size-xs); color: var(--theme-text-muted); font-family: var(--global-font-family-mono);">{token.replace('--global-radius-', '')}</div>
        </div>
      ))}
    </div>
  </div>

  <div class="docs-section">
    <h2 class="docs-section__title">Typography</h2>
    <div style="display: flex; flex-direction: column; gap: var(--global-size-unit-3);">
      {textTokens.map(token => (
        <div style="display: flex; align-items: baseline; gap: var(--global-size-unit-4);">
          <span style={`font-size: var(${token}); color: var(--theme-text-default); font-family: var(--global-font-family-sans); min-width: 40px;`}>Aa</span>
          <span style="font-size: var(--global-font-size-xs); color: var(--theme-text-muted); font-family: var(--global-font-family-mono);">{token}</span>
        </div>
      ))}
    </div>
  </div>
</DocsLayout>
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, open `http://localhost:4321/tokens`.
Expected: all swatches render with real colors (no blank/transparent
swatches), spacing bars scale visibly, radius swatches show increasing
roundness, typography rows scale up.

- [ ] **Step 3: Commit**

```bash
git add src/pages/tokens.astro
git commit -m "docs: update tokens page for global/theme token names"
```

---

## Task 15: Housekeeping — package.json and CLAUDE.md

**Files:**
- Modify: `package.json:4`
- Modify: `CLAUDE.md` (Architecture, Dateistruktur, Naming, remove "Neue Brand" workflow)

**Interfaces:** None — documentation/metadata only, no code depends on this.

- [ ] **Step 1: Update `package.json`'s description**

Replace:

```json
  "description": "Personal design system registry by @ptrckschrdtr. Multi-brand, framework-agnostic, built on shadcn registry.",
```

with:

```json
  "description": "Personal design system registry by @ptrckschrdtr. Built on shadcn registry, tokens sourced from the Figma GTC design system.",
```

- [ ] **Step 2: Update `CLAUDE.md`'s Architecture section**

Replace:

```markdown
## Architektur

```
Primitives → Semantic → Component
```

| Layer | Datei | Regel |
|-------|-------|-------|
| 1 — Primitives | `registry/tokens/base/primitives.css` | Nur Rohwerte. Nie direkt in Komponenten. |
| 2 — Semantic | `registry/tokens/semantic/semantic.css` | Bedeutung. Brands überschreiben diese Slots. |
| 3 — Component | `[component]/[name].css` | Tokens die Semantic konsumieren. |

**Wichtig:** Komponenten greifen NUR auf Component Tokens zu, niemals direkt auf Semantic oder Primitive Tokens.
```

with:

```markdown
## Architektur

```
Global → Theme → Component
```

Modell und Werte kommen aus dem Figma-File "ptrckschrdtr GTC DS"
(File-Key `5FKdZiYvwYJrdSNDD5PuLZ`).

| Layer | Datei | Regel |
|-------|-------|-------|
| 1 — Global | `registry/tokens/base/global.css` | Nur Rohwerte. Nie direkt in Komponenten. |
| 2 — Theme | `registry/tokens/theme/theme.css` | Bedeutung. Light ist Default, Dark via `[data-theme="dark"]`. |
| 3 — Component | `[component]/[name].css` | Tokens die Theme konsumieren. |

**Wichtig:** Komponenten greifen NUR auf Component Tokens zu, niemals direkt auf Theme- oder Global-Tokens. Es gibt kein `brand-primary`/`brand-secondary`-Konzept — Primary ist der höchstkontrastige Neutralton, keine eigene Markenfarbe.
```

- [ ] **Step 3: Update `CLAUDE.md`'s Dateistruktur section**

Replace:

```markdown
│   ├── tokens/
│   │   ├── base/
│   │   │   ├── primitives.css         ← Layer 1: Rohwerte
│   │   │   └── reset.css              ← Minimaler CSS Reset
│   │   ├── semantic/
│   │   │   └── semantic.css           ← Layer 2: Semantic Slots
│   │   └── themes/
│   │       └── example/
│   │           └── theme.css          ← Brand-Starter-Template
```

with:

```markdown
│   ├── tokens/
│   │   ├── base/
│   │   │   ├── global.css             ← Layer 1: Rohwerte
│   │   │   └── reset.css              ← Minimaler CSS Reset
│   │   └── theme/
│   │       └── theme.css              ← Layer 2: Theme Slots (Light default + [data-theme="dark"])
```

- [ ] **Step 4: Update CLAUDE.md's naming conventions section**

Replace:

```markdown
### Naming

- CSS-Klassen: BEM-ähnlich — `.card`, `.card__header`, `.card--elevated`
- Component Tokens: `--[komponent]-[eigenschaft]` — `--btn-radius`, `--card-padding-md`
- Semantic Tokens: `--color-[kategorie]-[variante]` — `--color-brand-primary`, `--color-text-muted`
- Primitive Tokens: `--primitive-[kategorie]-[wert]` — `--primitive-neutral-500`
```

with:

```markdown
### Naming

- CSS-Klassen: BEM-ähnlich — `.card`, `.card__header`, `.card--elevated`
- Component Tokens: `--component-[komponent]-[eigenschaft]` — `--component-button-radius-md`, `--component-card-padding-md`
- Theme Tokens: `--theme-[kategorie]-[variante]` — `--theme-text-default`, `--theme-status-destructive`
- Global Tokens: `--global-[kategorie]-[wert]` — `--global-color-base-5`
```

- [ ] **Step 5: Remove the "Neue Brand" workflow section**

Delete the entire `## Workflow: Neue Brand / neues Projekt` section
(from its `##` heading through the code block ending in
`git commit -m "feat: add theme-[brand]" && git push`) — this workflow
no longer applies since brand theming was dropped.

- [ ] **Step 6: Commit**

```bash
git add package.json CLAUDE.md
git commit -m "docs: update package.json and CLAUDE.md for GTC token model"
```

---

## Task 16: Full build verification

**Files:** None created/modified — verification only.

- [ ] **Step 1: Clean registry build**

```bash
rm -rf public/r
npm run registry:build
```

Expected: no errors; `ls public/r/` shows exactly: `tokens-global.json`,
`tokens-theme.json`, `input.json`, `card.json`, `badge.json`,
`button.json`, `select.json`, `checkbox.json`, `switch.json`,
`avatar.json`, `separator.json`, `alert.json`, `tabs.json` (13 files, no
`tokens-base.json`/`tokens-semantic.json`/`theme-example.json`).

```bash
ls public/r/ | sort
```

- [ ] **Step 2: Astro site build**

```bash
npm run build
```

Expected: exits 0, no Astro build errors (this also type-checks the
`.astro` frontmatter TypeScript for every page touched in this plan).

- [ ] **Step 3: Full manual pass in the browser**

Run: `npm run dev`, then for each of `/`, `/tokens`,
`/components/{button,input,card,badge,select,checkbox,switch,avatar,separator,alert,tabs}`:
confirm the page loads without console errors and renders with real
colors (no transparent/unstyled elements, which would indicate a
dangling reference to a removed token).

- [ ] **Step 4: Grep the whole registry for any leftover old token names**

```bash
grep -rn -E -- "--(primitive-|color-brand|color-status|color-bg-|color-surface-default|color-text-subtle|color-text-disabled|color-border-subtle|radius-component)\b" registry/ src/ || echo "OK: no old tokens remain"
```

Expected: `OK: no old tokens remain`.

- [ ] **Step 5: Final commit (only if any of the above surfaced fixes)**

If Steps 1–4 required any fixes, commit them:

```bash
git add -A
git commit -m "fix: resolve remaining issues from full build verification"
```

If no fixes were needed, this task requires no commit — the plan is
complete as of Task 15's commit.
