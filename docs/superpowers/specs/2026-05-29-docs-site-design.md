# Astro Docs-Site — Design Spec
**Date:** 2026-05-29
**Status:** Approved

---

## Ziel

Eine Astro-Dokumentationssite für ptrckschrdtr-ds, die auf ds.ptrckschrdtr.de läuft. Die Site dokumentiert alle Registry-Komponenten visuell und ist gleichzeitig Doku und Integrationstest — sie nutzt die eigenen DS-Komponenten und Token.

---

## Architektur-Entscheidung

**Ansatz: Astro im bestehenden Root-Verzeichnis.**

Astro wird im Repo-Root installiert. `src/` wird Astros Pages/Layouts-Ordner. `public/` bleibt Astros Static-Assets-Ordner — `public/r/` (Registry-Output) liegt darin und wird bei `astro build` automatisch nach `dist/r/` kopiert.

Pipeline:
```
npm run registry:build  →  public/r/*.json
npm run build           →  dist/ (inkl. dist/r/*.json aus public/)
```

Kein separates Repo, keine Subdomains.

---

## Dateistruktur

```
ptrckschrdtr-ds/
├── src/
│   ├── layouts/
│   │   └── DocsLayout.astro          ← Shell: Sidebar + Content-Area
│   ├── pages/
│   │   ├── index.astro               ← Home Page
│   │   ├── tokens.astro              ← Token-Übersichtsseite
│   │   └── components/
│   │       ├── button.astro
│   │       ├── input.astro
│   │       ├── card.astro
│   │       ├── badge.astro
│   │       └── select.astro
│   └── styles/
│       └── docs.css                  ← Docs-Layout-CSS (nur DS-Tokens)
├── astro.config.mjs
└── package.json                      ← + astro dependency
```

**Erweitern:** Neue Komponente = neue Datei in `src/pages/components/` anlegen.

---

## Layout: DocsLayout.astro

### Struktur

```
┌─────────────────────────────────────────┐
│  Header (Logo + Site-Titel)             │
├──────────────┬──────────────────────────┤
│  Sidebar     │  <slot /> (Content)      │
│  Navigation  │                          │
│  (fixed)     │                          │
└──────────────┴──────────────────────────┘
```

- CSS Grid: `grid-template-columns: 240px 1fr`
- Sidebar: scrollbar, fixed-position, Links zu allen Seiten
- Mobile: Sidebar wird via `<details>`/`<summary>` klappbar — **kein JavaScript**

### Navigation-Struktur

```
Home
Tokens

Komponenten
  Button
  Input
  Card
  Badge
  Select
```

### Token-Loading-Reihenfolge

In `DocsLayout.astro` als `<link>`-Tags oder Imports:
1. `registry/tokens/base/primitives.css`
2. `registry/tokens/base/reset.css`
3. `registry/tokens/semantic/semantic.css`
4. `registry/tokens/themes/example/theme.css`
5. `src/styles/docs.css`

### Dark Mode

`theme.css` nutzt `[data-theme="dark"]` (nicht `@media`). `DocsLayout.astro` liest die System-Präferenz und setzt das Attribut im `<head>` via Inline-Script — kein FOUC:

```html
<script is:inline>
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.dataset.theme = 'dark'
  }
</script>
```

`docs.css` nutzt ausschließlich Semantic Tokens → reagiert automatisch auf den Theme-Switch.

---

## docs.css

Ausschließlich DS-Tokens (`var(--color-*)`, `var(--space-*)`, `var(--text-*)` etc.). Kein Tailwind, kein zusätzliches Framework.

Abgedeckte Styles:
- `.docs-layout` — Grid-Shell
- `.docs-sidebar` — Sidebar-Wrapper, Nav-Links, aktiver Zustand
- `.docs-content` — Content-Bereich, max-width, padding
- `.docs-section` — Abstandshalter zwischen Abschnitten
- `.docs-preview` — Wrapper für Komponenten-Previews (Border, Padding, Hintergrund)
- `.docs-code` — Install-Befehl Code-Block
- `.token-grid` — Grid für Token-Swatches
- `.token-swatch` — einzelner Farb-Swatch mit Label

---

## Home Page (index.astro)

Inhalt:
1. **Titel + Tagline** — „ptrckschrdtr-ds — Personal Design System Registry"
2. **Was ist das** — 2–3 Sätze Erklärung
3. **Quick Install** — Code-Block mit `npx shadcn@latest add https://ds.ptrckschrdtr.de/r/button.json`
4. **Komponenten-Übersicht** — Cards-Grid mit allen verfügbaren Komponenten (Name + Link)

---

## Komponenten-Seiten

### Pattern (gleich für alle)

```
1. Titel + Beschreibung (eine Zeile)
2. Install-Befehl (code block)
3. Varianten-Sektion (alle Varianten nebeneinander)
4. Größen-Sektion (sm / md / lg)
5. States-Sektion (disabled, ggf. loading)
```

### Previews

Echte Astro-Komponenten, direkt importiert aus `registry/components/[name]/[name].astro`. Kein Storybook, kein iframe.

Beispiel `src/pages/components/button.astro`:
```astro
import Button from '../../../registry/components/button/button.astro'
---
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
```

### Copy-Button für Install-Befehl

Ein `<button>` mit `onclick="navigator.clipboard.writeText(...)"` — minimales Inline-JS, kein Build-Step.

---

## Token-Seite (tokens.astro)

Sektionen:
1. **Brand-Farben** — `--color-brand-*` als Farbswatches
2. **Surface & Background** — `--color-bg-*`, `--color-surface-*`
3. **Text** — `--color-text-*` auf Hintergrund
4. **Border** — `--color-border-*`
5. **Status** — success / warning / error / info
6. **Spacing** — visuelle Skala von `--space-1` bis `--space-24`
7. **Radius** — visuelle Skala von `--radius-none` bis `--radius-full`
8. **Typography** — Größen (`--text-xs` bis `--text-5xl`), Weights

Werte-Anzeige: `getComputedStyle(document.documentElement).getPropertyValue('--token-name')` via `<script>` Tag (client-side, kein Build-Step nötig).

---

## Build & Deploy

### package.json scripts

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "registry:build": "shadcn build",
  "build:all": "npm run registry:build && npm run build"
}
```

### Vercel-Konfiguration

`vercel.json`:
```json
{
  "buildCommand": "npm run build:all",
  "outputDirectory": "dist"
}
```

Oder direkt in Vercel-Dashboard: Build Command = `npm run build:all`, Output = `dist`.

### astro.config.mjs

```js
import { defineConfig } from 'astro/config'
export default defineConfig({
  site: 'https://ds.ptrckschrdtr.de',
})
```

---

## Dependencies

```json
"dependencies": {
  "astro": "^5.x"
}
```

Keine weiteren Dependencies. Kein React-Integration nötig (Docs-Site ist rein Astro).

---

## Out of Scope

- Search-Funktionalität
- Versionierung der Docs
- i18n
- Storybook / MDX
- React-Previews (Astro-Wrapper ausreichend für Docs)
