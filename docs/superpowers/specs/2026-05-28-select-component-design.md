# Select Component — Design Spec
**Date:** 2026-05-28  
**Status:** Approved

---

## Overview

A styled native `<select>` component for the ptrckschrdtr-ds registry. Follows the existing Input component pattern — CSS is the source of truth, Astro and React wrappers are thin adapters. No JavaScript required.

---

## Architecture Decision

**Native `<select>` with a Control wrapper** (Ansatz A).

A `div.select-field__control` wraps the native `<select>` as a positioning anchor for the chevron icon. The chevron is rendered via a `::after` pseudo-element using `mask-image` + `background-color: var(--select-icon-color)`, so the icon color changes automatically with the token — including in dark-mode themes.

Alternative (background-image SVG directly on `<select>`) was rejected because it requires a hardcoded hex color in the SVG data URL, making theme overrides fragile.

---

## Anatomy

```
.select-field                    → flex-column wrapper (label + control + hint)
.select-field__label             → label text
.select-field__label--required   → appends " *" via ::after
.select-field__control           → position: relative — chevron anchor
.select-field__select            → native <select>, appearance: none
.select-field__hint              → helper / error / success text
```

Modifier classes on `.select-field`:

| Modifier                   | Effect                                    |
|----------------------------|-------------------------------------------|
| `.select-field--sm`        | Small size                                |
| `.select-field--lg`        | Large size                                |
| `.select-field--error`     | Red border + red hint                     |
| `.select-field--success`   | Green border + green hint                 |
| `.select-field--multiple`  | Listbox mode, chevron hidden              |

---

## Component Tokens

```css
/* Typography */
--select-font-family:         var(--font-sans)
--select-font-size:           var(--text-sm)

/* Layout */
--select-radius:              var(--radius-component)
--select-transition:          var(--transition-default)

/* Borders */
--select-border:              var(--color-border-default)
--select-border-focus:        var(--color-border-focus)
--select-border-error:        var(--color-status-error)
--select-border-success:      var(--color-status-success)

/* Backgrounds */
--select-bg:                  var(--color-surface-default)
--select-bg-disabled:         var(--color-bg-muted)

/* Text */
--select-text:                var(--color-text-default)
--select-text-placeholder:    var(--color-text-subtle)
--select-text-disabled:       var(--color-text-disabled)

/* Label */
--select-label-size:          var(--text-sm)
--select-label-weight:        var(--weight-medium)
--select-label-color:         var(--color-text-default)

/* Hint */
--select-hint-size:           var(--text-xs)
--select-hint-color:          var(--color-text-muted)

/* Icon */
--select-icon-color:          var(--color-text-muted)

/* Padding per size */
--select-padding-x-sm:        var(--space-2)
--select-padding-y-sm:        var(--space-1)
--select-padding-x-md:        var(--space-3)
--select-padding-y-md:        var(--space-2)
--select-padding-x-lg:        var(--space-4)
--select-padding-y-lg:        var(--space-3)
```

---

## CSS Structure Order

```css
/* ── Component Tokens ──────────────────────────────────── */
/* ── Field Wrapper ─────────────────────────────────────── */
/* ── Label ─────────────────────────────────────────────── */
/* ── Control (chevron anchor) ──────────────────────────── */
/* ── Select Element ────────────────────────────────────── */
/* ── Chevron Icon ──────────────────────────────────────── */
/* ── Sizes ─────────────────────────────────────────────── */
/* ── Variant: Error ────────────────────────────────────── */
/* ── Variant: Success ──────────────────────────────────── */
/* ── Multiple Mode ─────────────────────────────────────── */
/* ── Hint / Helper Text ────────────────────────────────── */
```

---

## Props API

Both Astro and React wrappers expose an identical interface:

| Prop              | Type                              | Default      | Notes                              |
|-------------------|-----------------------------------|--------------|------------------------------------|
| `label`           | string                            | —            | Optional label above the select    |
| `hint`            | string                            | —            | Helper / error / success text      |
| `variant`         | `'default' \| 'error' \| 'success'` | `'default'`  |                                    |
| `size`            | `'sm' \| 'md' \| 'lg'`           | `'md'`       |                                    |
| `multiple`        | boolean                           | `false`      | Renders listbox mode               |
| `required`        | boolean                           | `false`      | Adds * to label                    |
| `disabled`        | boolean                           | `false`      |                                    |
| `name`            | string                            | —            |                                    |
| `id`              | string                            | auto-generated |                                   |
| `class`/`className` | string                          | —            | Extra classes on wrapper           |

Options are passed as children / `<slot />` — the consumer controls `<option>` markup directly.

React: `React.forwardRef<HTMLSelectElement>`, all unknown props spread onto the `<select>` element.

---

## Files to Create

```
registry/components/select/
├── select.css      ← source of truth
├── select.astro    ← Astro wrapper
└── select.tsx      ← React wrapper
```

Register in `registry.json` with `registryDependencies: ["ptrckschrdtr-ds/tokens-semantic"]`.

---

## Out of Scope

- Custom dropdown UI (open/close via JS)
- Option grouping styles (`<optgroup>`)
- Searchable/combobox behaviour
