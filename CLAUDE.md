# CLAUDE.md — ptrckschrdtr-ds

Persönliche Design System Registry von Patrick Schröder (@ptrckschrdtr).
Dieses Dokument beschreibt Architektur, Konventionen und Workflows für die Weiterentwicklung mit Claude Code.

---

## Was dieses Projekt ist

Eine shadcn-kompatible Registry, die CSS-Tokens und Komponenten per CLI in beliebige Projekte distribuiert:

```bash
npx shadcn@latest add https://ds.ptrckschrdtr.de/r/button.json
```

Kein npm-Paket. Kein Framework-Zwang. Der Code landet direkt im Zielprojekt und gehört dem Projekt.

Live unter: **https://ds.ptrckschrdtr.de**
Repository: **https://github.com/schroepa/ptrckschrdtr-ds**
Hosting: Vercel (Auto-Deploy bei Push auf `main`)

---

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

---

## Dateistruktur

```
ptrckschrdtr-ds/
├── CLAUDE.md                          ← dieses File
├── registry.json                      ← Einstiegspunkt, alle Items registriert
├── package.json
├── registry/
│   ├── tokens/
│   │   ├── base/
│   │   │   ├── global.css             ← Layer 1: Rohwerte
│   │   │   └── reset.css              ← Minimaler CSS Reset
│   │   └── theme/
│   │       └── theme.css              ← Layer 2: Theme Slots (Light default + [data-theme="dark"])
│   └── components/
│       ├── button/
│       │   ├── button.css             ← Source of Truth
│       │   ├── button.astro           ← Astro-Wrapper
│       │   └── button.tsx             ← React-Wrapper
│       ├── input/
│       ├── card/
│       └── badge/
└── public/
    └── r/                             ← Build-Output (nicht committen, in .gitignore)
```

---

## Verfügbare Registry-Items

| Name | Typ | Beschreibung |
|------|-----|-------------|
| `tokens-base` | Style | Primitives + Reset |
| `tokens-semantic` | Style | Semantic Token Slots |
| `theme-example` | Style | Brand-Starter-Template mit Dark Mode |
| `button` | Component | 4 Varianten, 3 Größen, Loading, Icon-only |
| `input` | Component | Label, Hint, Error/Success States, Textarea |
| `card` | Component | Header/Body/Footer/Media Slots, 4 Varianten |
| `badge` | Component | 7 Varianten, 3 Styles (solid/subtle/outline), Dot |

---

## Workflow: Neue Komponente hinzufügen

### 1. Dateistruktur anlegen

```
registry/components/[name]/
├── [name].css      ← immer zuerst
├── [name].astro
└── [name].tsx
```

### 2. CSS schreiben (Source of Truth)

Reihenfolge einhalten:

```css
/* ── Component Tokens ──────────────────────────────────── */
:root {
  --[name]-[eigenschaft]: var(--semantic-token);
  /* Beispiel: --btn-radius: var(--radius-component); */
}

/* ── Base ──────────────────────────────────────────────── */
.[name] { ... }

/* ── Sizes ─────────────────────────────────────────────── */
.[name]--sm { ... }
.[name]--lg { ... }

/* ── Variants ──────────────────────────────────────────── */
.[name]--primary { ... }
.[name]--secondary { ... }

/* ── States ────────────────────────────────────────────── */
.[name]:hover { ... }
.[name]:disabled { ... }
```

**Regel:** Nur Component Tokens in der CSS verwenden (`var(--btn-*)`), nie direkt `var(--color-brand-primary)` o.ä.

### 3. Astro-Wrapper

```astro
---
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  class?: string
  [key: string]: unknown
}
const { variant = 'primary', size = 'md', class: className, ...rest } = Astro.props
const classes = ['[name]', `[name]--${variant}`, `[name]--${size}`, className].filter(Boolean).join(' ')
---
<div class={classes} {...rest}><slot /></div>
```

### 4. React-Wrapper

Gleiche Props-API wie Astro. Gleiche Klassen-Logik. `React.forwardRef` verwenden.

### 5. In registry.json registrieren

```json
{
  "name": "[name]",
  "type": "registry:component",
  "title": "[Name]",
  "description": "...",
  "registryDependencies": ["ptrckschrdtr-ds/tokens-semantic"],
  "files": [
    { "path": "registry/components/[name]/[name].css",   "type": "registry:style",     "target": "src/components/ds/[name]/[name].css" },
    { "path": "registry/components/[name]/[name].astro", "type": "registry:component", "target": "src/components/ds/[name]/[name].astro" },
    { "path": "registry/components/[name]/[name].tsx",   "type": "registry:component", "target": "src/components/ds/[name]/[name].tsx" }
  ]
}
```

### 6. Bauen und deployen

```bash
npm run registry:build
git add .
git commit -m "feat: add [name] component"
git push
```

Vercel deployt automatisch. Fertig.

---

## Konventionen

### Naming

- CSS-Klassen: BEM-ähnlich — `.card`, `.card__header`, `.card--elevated`
- Component Tokens: `--component-[komponent]-[eigenschaft]` — `--component-button-radius-md`, `--component-card-padding-md`
- Theme Tokens: `--theme-[kategorie]-[variante]` — `--theme-text-default`, `--theme-status-destructive`
- Global Tokens: `--global-[kategorie]-[wert]` — `--global-color-base-5`

### Props-API (beide Frameworks identisch)

- `variant` — visuelle Variante (`primary | secondary | ghost | danger`)
- `size` — Größe (`sm | md | lg`), default immer `md`
- `class` (Astro) / `className` (React) — zusätzliche Klassen
- Spread `...rest` auf das Root-Element für maximale Flexibilität

### Dateikopf-Kommentar (jede Komponente)

```
/**
 * ptrckschrdtr-ds — Component: [Name]
 * ────────────────────────────────────
 * Variants:   primary | secondary | ...
 * Sizes:      sm | md | lg
 * States:     hover, focus, disabled
 *
 * Anatomy:
 *   .[name]           → ...
 *   .[name]__[part]   → ...
 */
```

---

## Wichtige Regeln

1. **CSS-Datei ist die Wahrheit.** Astro und React sind nur Wrapper. Designentscheidungen gehören in `.css`, nicht in die Wrapper.

2. **Nie Primitives in Komponenten.** Immer über Component Tokens → Semantic Tokens → Primitives.

3. **`public/r/` nicht committen.** Ist in `.gitignore`. Wird von Vercel beim Deploy generiert.

4. **`registryDependencies` pflegen.** Jede Komponente die Semantic Tokens braucht, listet `ptrckschrdtr-ds/tokens-semantic`. Komponenten die andere Komponenten brauchen, listen diese ebenfalls.

5. **Beide Framework-Wrapper bauen.** Auch wenn ein Projekt nur Astro nutzt — die React-Version kostet 10 Minuten und macht das System für zukünftige Projekte verwendbar.

6. **Props-API dokumentieren.** Immer im Dateikopf-Kommentar. Das ist der Vertrag für Framework-Wrapper die später kommen.

---

## Häufige Aufgaben für Claude Code

### Komponente hinzufügen

> „Baue eine [Name]-Komponente mit Varianten [x, y, z] und Größen sm/md/lg. Folge der Architektur in CLAUDE.md."

### Bestehende Komponente erweitern

> „Füge der Card-Komponente eine `loading`-Variante hinzu mit Skeleton-Effekt."

### Neues Brand-Theme erstellen

> „Erstelle ein Theme für Brand [Name] mit Primärfarbe [Hex], Sekundärfarbe [Hex], Font [Name], runden Ecken."

### Registry deployen

> „Baue die Registry und zeige mir ob der Output in public/r/ vollständig ist."

---

## Build-Befehl

```bash
npm run registry:build
```

Output: `public/r/*.json` — eine JSON-Datei pro Registry-Item.

## Lokaler Test

Nach dem Build eine JSON-Datei prüfen:
```bash
cat public/r/button.json | head -50
```

Oder einen lokalen Server starten (falls Framework vorhanden):
```bash
npx serve public
# → http://localhost:3000/r/button.json
```