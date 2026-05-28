# Select Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a native `<select>` component to the ptrckschrdtr-ds registry, with Astro and React wrappers, following the exact same architecture as the Input component.

**Architecture:** CSS is the source of truth. A `div.select-field__control` wraps the native `<select>` as a positioning anchor for the chevron icon. The chevron is a `::after` pseudo-element that uses `mask-image` + `background-color: var(--select-icon-color)` — the icon color changes automatically with the design token, including in dark-mode themes.

**Tech Stack:** Plain CSS with custom properties, Astro, React (forwardRef), shadcn registry CLI (`shadcn build`)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `registry/components/select/select.css` | Component tokens, layout, all variants and states — source of truth |
| Create | `registry/components/select/select.astro` | Astro wrapper — thin adapter over `select.css` |
| Create | `registry/components/select/select.tsx` | React wrapper — thin adapter over `select.css` |
| Modify | `registry.json` | Register the new `select` item |

---

## Task 1: select.css — CSS Source of Truth

**Files:**
- Create: `registry/components/select/select.css`

- [ ] **Step 1.1: Create the directory and CSS file**

```bash
mkdir -p registry/components/select
```

Create `registry/components/select/select.css` with the full content below:

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
 */

/* ── Component Tokens ──────────────────────────────────── */
:root {
  --select-font-family:      var(--font-sans);
  --select-font-size:        var(--text-sm);
  --select-radius:           var(--radius-component);
  --select-transition:       var(--transition-default);

  --select-border:           var(--color-border-default);
  --select-border-focus:     var(--color-border-focus);
  --select-border-error:     var(--color-status-error);
  --select-border-success:   var(--color-status-success);

  --select-bg:               var(--color-surface-default);
  --select-bg-disabled:      var(--color-bg-muted);

  --select-text:             var(--color-text-default);
  --select-text-placeholder: var(--color-text-subtle);
  --select-text-disabled:    var(--color-text-disabled);

  --select-label-size:       var(--text-sm);
  --select-label-weight:     var(--weight-medium);
  --select-label-color:      var(--color-text-default);

  --select-hint-size:        var(--text-xs);
  --select-hint-color:       var(--color-text-muted);

  --select-icon-color:       var(--color-text-muted);

  --select-padding-x-sm:     var(--space-2);
  --select-padding-y-sm:     var(--space-1);
  --select-padding-x-md:     var(--space-3);
  --select-padding-y-md:     var(--space-2);
  --select-padding-x-lg:     var(--space-4);
  --select-padding-y-lg:     var(--space-3);
}

/* ── Field Wrapper ─────────────────────────────────────── */
.select-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
}

/* ── Label ─────────────────────────────────────────────── */
.select-field__label {
  font-family: var(--select-font-family);
  font-size: var(--select-label-size);
  font-weight: var(--select-label-weight);
  color: var(--select-label-color);
  line-height: var(--leading-snug);
}

.select-field__label--required::after {
  content: ' *';
  color: var(--color-status-error);
}

/* ── Control (chevron anchor) ──────────────────────────── */
.select-field__control {
  position: relative;
  width: 100%;
}

/* ── Select Element ────────────────────────────────────── */
.select-field__select {
  width: 100%;
  font-family: var(--select-font-family);
  font-size: var(--select-font-size);
  color: var(--select-text);
  background-color: var(--select-bg);
  border: 1px solid var(--select-border);
  border-radius: var(--select-radius);
  outline: none;
  appearance: none;
  cursor: pointer;
  transition:
    border-color var(--select-transition),
    box-shadow var(--select-transition),
    background-color var(--select-transition);

  /* Default size: md — extra padding-right makes room for the chevron */
  padding: var(--select-padding-y-md) calc(var(--select-padding-x-md) + 1.75rem) var(--select-padding-y-md) var(--select-padding-x-md);
}

.select-field__select:focus {
  border-color: var(--select-border-focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-border-focus) 15%, transparent);
}

.select-field__select:disabled {
  background-color: var(--select-bg-disabled);
  color: var(--select-text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

/* ── Chevron Icon ──────────────────────────────────────── */
/* mask-image technique: background-color provides the icon color,
   the SVG mask defines the shape — works with any --select-icon-color value */
.select-field__control::after {
  content: '';
  position: absolute;
  right: var(--select-padding-x-md);
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  background-color: var(--select-icon-color);
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
  font-size: var(--text-xs);
  padding: var(--select-padding-y-sm) calc(var(--select-padding-x-sm) + 1.75rem) var(--select-padding-y-sm) var(--select-padding-x-sm);
}

.select-field--sm .select-field__control::after {
  right: var(--select-padding-x-sm);
}

.select-field--lg .select-field__select {
  font-size: var(--text-md);
  padding: var(--select-padding-y-lg) calc(var(--select-padding-x-lg) + 1.75rem) var(--select-padding-y-lg) var(--select-padding-x-lg);
}

.select-field--lg .select-field__control::after {
  right: var(--select-padding-x-lg);
}

/* ── Variant: Error ────────────────────────────────────── */
.select-field--error .select-field__select {
  border-color: var(--select-border-error);
}

.select-field--error .select-field__select:focus {
  border-color: var(--select-border-error);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-status-error) 15%, transparent);
}

.select-field--error .select-field__hint {
  color: var(--color-status-error);
}

/* ── Variant: Success ──────────────────────────────────── */
.select-field--success .select-field__select {
  border-color: var(--select-border-success);
}

.select-field--success .select-field__select:focus {
  border-color: var(--select-border-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-status-success) 15%, transparent);
}

.select-field--success .select-field__hint {
  color: var(--color-status-success);
}

/* ── Multiple Mode ─────────────────────────────────────── */
/* Listbox mode: no chevron, symmetric padding */
.select-field--multiple .select-field__select {
  padding-right: var(--select-padding-x-md);
  cursor: auto;
}

.select-field--multiple.select-field--sm .select-field__select {
  padding-right: var(--select-padding-x-sm);
}

.select-field--multiple.select-field--lg .select-field__select {
  padding-right: var(--select-padding-x-lg);
}

.select-field--multiple .select-field__control::after {
  display: none;
}

/* ── Hint / Helper Text ────────────────────────────────── */
.select-field__hint {
  font-family: var(--select-font-family);
  font-size: var(--select-hint-size);
  color: var(--select-hint-color);
  line-height: var(--leading-snug);
}
```

- [ ] **Step 1.2: Verify the build succeeds with just the CSS**

```bash
npm run registry:build 2>&1 | tail -20
```

Expected: no errors (the CSS file alone is enough for a partial build check).

- [ ] **Step 1.3: Commit**

```bash
git add registry/components/select/select.css
git commit -m "feat: add select component CSS"
```

---

## Task 2: select.astro — Astro Wrapper

**Files:**
- Create: `registry/components/select/select.astro`

- [ ] **Step 2.1: Create select.astro**

Create `registry/components/select/select.astro` with the full content below:

```astro
---
/**
 * ptrckschrdtr-ds — Select (Astro)
 *
 * Props:
 *   label    — string
 *   hint     — string  → helper or error text below select
 *   variant  — 'default' | 'error' | 'success'  (default: 'default')
 *   size     — 'sm' | 'md' | 'lg'               (default: 'md')
 *   multiple — boolean  → renders listbox mode
 *   required — boolean  → adds * to label
 *   disabled — boolean
 *   name     — string
 *   id       — string  → auto-generated if not provided
 *   class    — additional CSS classes on the wrapper
 *
 * Usage:
 *   <Select label="Country" hint="Select your country.">
 *     <option value="">Choose…</option>
 *     <option value="de">Germany</option>
 *   </Select>
 */

import './select.css'

interface Props {
  label?: string
  hint?: string
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  multiple?: boolean
  required?: boolean
  disabled?: boolean
  name?: string
  id?: string
  class?: string
  [key: string]: unknown
}

const {
  label,
  hint,
  variant = 'default',
  size = 'md',
  multiple = false,
  required = false,
  disabled = false,
  name,
  id = `select-${Math.random().toString(36).slice(2, 7)}`,
  class: className,
  ...rest
} = Astro.props

const wrapperClasses = [
  'select-field',
  variant !== 'default' && `select-field--${variant}`,
  size !== 'md' && `select-field--${size}`,
  multiple && 'select-field--multiple',
  className,
].filter(Boolean).join(' ')
---

<div class={wrapperClasses}>
  {label && (
    <label
      for={id}
      class:list={['select-field__label', required && 'select-field__label--required']}
    >
      {label}
    </label>
  )}

  <div class="select-field__control">
    <select
      id={id}
      name={name}
      class="select-field__select"
      multiple={multiple}
      required={required}
      disabled={disabled}
      {...rest}
    >
      <slot />
    </select>
  </div>

  {hint && <span class="select-field__hint">{hint}</span>}
</div>
```

- [ ] **Step 2.2: Commit**

```bash
git add registry/components/select/select.astro
git commit -m "feat: add select Astro wrapper"
```

---

## Task 3: select.tsx — React Wrapper

**Files:**
- Create: `registry/components/select/select.tsx`

- [ ] **Step 3.1: Create select.tsx**

Create `registry/components/select/select.tsx` with the full content below:

```tsx
/**
 * ptrckschrdtr-ds — Select (React)
 *
 * Props:
 *   label    — string
 *   hint     — string  → helper or error text below select
 *   variant  — 'default' | 'error' | 'success'  (default: 'default')
 *   size     — 'sm' | 'md' | 'lg'               (default: 'md')
 *   multiple — boolean  → renders listbox mode
 *   required — boolean  → adds * to label
 *
 * Usage:
 *   import './select.css'
 *   <Select label="Country" hint="Select your country.">
 *     <option value="">Choose…</option>
 *     <option value="de">Germany</option>
 *   </Select>
 *   <Select label="Tags" multiple>
 *     <option value="a">Alpha</option>
 *     <option value="b">Beta</option>
 *   </Select>
 */

import * as React from 'react'

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  hint?: string
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      variant = 'default',
      size = 'md',
      multiple = false,
      required,
      className,
      id: propId,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = propId ?? generatedId

    const wrapperClasses = [
      'select-field',
      variant !== 'default' && `select-field--${variant}`,
      size !== 'md' && `select-field--${size}`,
      multiple && 'select-field--multiple',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={id}
            className={[
              'select-field__label',
              required && 'select-field__label--required',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
          </label>
        )}

        <div className="select-field__control">
          <select
            ref={ref}
            id={id}
            className="select-field__select"
            multiple={multiple}
            required={required}
            {...props}
          >
            {children}
          </select>
        </div>

        {hint && <span className="select-field__hint">{hint}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
```

- [ ] **Step 3.2: Commit**

```bash
git add registry/components/select/select.tsx
git commit -m "feat: add select React wrapper"
```

---

## Task 4: Register in registry.json and build

**Files:**
- Modify: `registry.json`

- [ ] **Step 4.1: Add the select entry to registry.json**

Open `registry.json`. Find the closing `]` of the `items` array (after the last component entry) and add the following entry before it, keeping the same formatting as the other entries:

```json
    {
      "name": "select",
      "type": "registry:component",
      "title": "Select",
      "description": "Native select dropdown with label, hint text, and validation states. Variants: default, error, success. Sizes: sm, md, lg. Supports multiple (listbox) mode, required, disabled. Available as select.astro and select.tsx (React).",
      "registryDependencies": [
        "ptrckschrdtr-ds/tokens-semantic"
      ],
      "files": [
        {
          "path": "registry/components/select/select.css",
          "type": "registry:style",
          "target": "src/components/ds/select/select.css"
        },
        {
          "path": "registry/components/select/select.astro",
          "type": "registry:component",
          "target": "src/components/ds/select/select.astro"
        },
        {
          "path": "registry/components/select/select.tsx",
          "type": "registry:component",
          "target": "src/components/ds/select/select.tsx"
        }
      ]
    }
```

- [ ] **Step 4.2: Run the full build**

```bash
npm run registry:build 2>&1
```

Expected: build completes with no errors.

- [ ] **Step 4.3: Verify the build output exists**

```bash
ls public/r/ | grep select
```

Expected output:
```
select.json
```

- [ ] **Step 4.4: Spot-check the generated JSON**

```bash
cat public/r/select.json | head -30
```

Expected: JSON object with `"name": "select"`, the three files listed under `"files"`, and `"registryDependencies"` pointing to `ptrckschrdtr-ds/tokens-semantic`.

- [ ] **Step 4.5: Commit and push**

```bash
git add registry.json
git commit -m "feat: register select component in registry"
git push
```

Vercel deploys automatically on push to `main`. The component is then installable via:

```bash
npx shadcn@latest add https://ds.ptrckschrdtr.de/r/select.json
```
