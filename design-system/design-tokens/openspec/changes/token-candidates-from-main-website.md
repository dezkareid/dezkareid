# Token Candidates from `main-website`

> **Status**: Candidate notes — not yet implemented.
> **Source**: Audit of `apps/main-website/src` hardcoded CSS values as of 2026-03-18.
> **Purpose**: Track design values used in `main-website` that are not yet covered by the design system and should be considered for promotion to `design-system/design-tokens`.

---

## 1. Semantic Color — Secondary Text

**Priority: HIGH** — already has 3 `TODO(design-system)` annotations in the codebase.

The website uses a secondary/muted text color in multiple files but it is hardcoded with `light-dark()`:

```css
color: light-dark(#4b5563, #9ca3af);
```

- Light value `#4b5563` = gray-600 (missing from global palette — closest is `gray-500: #6b7280`)
- Dark value `#9ca3af` = gray-400 (missing from global palette — closest is `gray-500`)

**Affected files:**
- `src/components/ProjectCard.astro:215`
- `src/pages/projects/index.astro:76-77`
- `src/pages/projects/[slug].astro:137-138`

**Proposed addition to `color/global.json`:**
```json
"gray": {
  "100": { "value": "#f3f4f6" },
  "400": { "value": "#9ca3af" },
  "500": { "value": "#6b7280" },
  "600": { "value": "#4b5563" },
  "900": { "value": "#111827" }
}
```

**Proposed addition to `color/semantic.json`:**
```json
"light": {
  "text": {
    "primary": { "value": "{color.base.gray.900}" },
    "secondary": { "value": "{color.base.gray.600}" },
    "inverse": { "value": "{color.base.white}" }
  }
},
"dark": {
  "text": {
    "primary": { "value": "{color.base.white}" },
    "secondary": { "value": "{color.base.gray.400}" },
    "inverse": { "value": "{color.base.gray.900}" }
  }
}
```

Generated CSS var: `--color-text-secondary`

---

## 2. Semantic Color — Badge / Category Colors

**Priority: MEDIUM** — used for project type badges (personal / work / contribution).

Hardcoded in `src/components/ProjectCard.astro`:

| Badge     | Light value           | Dark value  | Maps to global                        |
|-----------|-----------------------|-------------|---------------------------------------|
| personal  | `#1d4ed8` (blue-700)  | `#93c5fd` (blue-300) | Need blue-300 and blue-700 globals |
| work      | `#22c55e` (green-500) | same        | Already exists as `color.base.green.500` |
| contribution | `#f59e0b` (amber-500) | same     | Need amber global palette             |

**Proposed new global palette entries:**

`color/global.json`:
```json
"blue": {
  "100": { "value": "#dbeafe" },
  "300": { "value": "#93c5fd" },
  "500": { "value": "#3b82f6" },
  "700": { "value": "#1d4ed8" },
  "900": { "value": "#1e3a8a" }
},
"amber": {
  "100": { "value": "#fef3c7" },
  "500": { "value": "#f59e0b" },
  "900": { "value": "#78350f" }
}
```

**Proposed semantic tokens** (if category colors are a design system concept):
```json
"light": {
  "category": {
    "personal": { "value": "{color.base.blue.700}" },
    "work":     { "value": "{color.base.green.500}" },
    "contribution": { "value": "{color.base.amber.500}" }
  }
},
"dark": {
  "category": {
    "personal": { "value": "{color.base.blue.300}" },
    "work":     { "value": "{color.base.green.500}" },
    "contribution": { "value": "{color.base.amber.500}" }
  }
}
```

> **Note**: Category color tokens are domain-specific to `main-website`. Consider whether they belong in the design system or should remain local custom properties in the app.

---

## 3. Typography — Letter Spacing

**Priority: MEDIUM** — used in `src/styles/global.css` as local custom properties.

The website defines these locally but they are not in the design system:

| Local var                  | Value      | Usage context         |
|----------------------------|------------|-----------------------|
| `--letter-spacing-tight`   | `-0.02em`  | Headings              |
| `--letter-spacing-wide`    | `0.08em`   | Labels / eyebrow text |

**Proposed addition to `typography.json`:**
```json
"font": {
  "letter-spacing": {
    "tight":  { "value": "-0.02em" },
    "normal": { "value": "0" },
    "wide":   { "value": "0.08em" }
  }
}
```

Generated CSS vars: `--font-letter-spacing-tight`, `--font-letter-spacing-normal`, `--font-letter-spacing-wide`

---

## 4. Border Radius — Pill

**Priority: MEDIUM** — repeated pattern used across badges, skill tags, and social links.

Hardcoded value: `border-radius: 9999px`

Used in:
- `src/components/ProjectCard.astro` (badge pills)
- `src/components/SkillsList.astro` (skill tags)
- `src/styles/global.css` as local `--border-radius-pill: 9999px`

**Proposed new token file `src/tokens/border-radius.json`:**
```json
{
  "border-radius": {
    "none":   { "value": "0" },
    "small":  { "value": "0.25rem" },
    "medium": { "value": "0.5rem" },
    "large":  { "value": "1rem" },
    "pill":   { "value": "9999px" }
  }
}
```

Generated CSS vars: `--border-radius-none`, `--border-radius-small`, `--border-radius-medium`, `--border-radius-large`, `--border-radius-pill`

---

## 5. Shadow — Card Elevation

**Priority: MEDIUM** — used in `src/components/Card.astro` as local custom properties.

The website defines these locally:

```css
/* rest */
--shadow-card: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06);
/* hover */
--shadow-card-hover: 0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px color-mix(in srgb, var(--color-primary) 20%, transparent);
```

Also used in `src/components/SkillsList.astro`:
```css
box-shadow: 0 2px 8px rgba(0,0,0,0.08);
```

**Proposed new token file `src/tokens/shadow.json`:**
```json
{
  "shadow": {
    "none":         { "value": "none" },
    "subtle":       { "value": "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)" },
    "card":         { "value": "0 2px 8px rgba(0,0,0,0.08)" },
    "card-hover":   { "value": "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.1)" }
  }
}
```

> **Note**: The hover shadow has a `color-mix` ring that references `--color-primary` — this cannot be a static token value. The base shadow layers can be tokenized; the primary-color ring should remain a local CSS rule.

Generated CSS vars: `--shadow-none`, `--shadow-subtle`, `--shadow-card`, `--shadow-card-hover`

---

## 6. Typography — Responsive / Fluid Font Size

**Priority: LOW** — these use `clamp()` which is inherently dynamic and hard to tokenize directly.

Hardcoded in the website:

| Usage          | Value                              | File                        |
|----------------|------------------------------------|-----------------------------|
| Hero title     | `clamp(2.5rem, 6vw, 5rem)`         | `src/components/Hero.astro` |
| Hero line-height | `1.05`                           | `src/components/Hero.astro` |
| Quote text     | `clamp(1.125rem, 2.5vw, 1.375rem)` | `src/pages/index.astro`     |

**Proposed addition to `typography.json`** (fluid scale):
```json
"font": {
  "size": {
    "fluid-body": { "value": "clamp(1.125rem, 2.5vw, 1.375rem)" },
    "fluid-hero":  { "value": "clamp(2.5rem, 6vw, 5rem)" }
  },
  "line-height": {
    "none":     { "value": "1" },
    "tightest": { "value": "1.05" },
    "tight":    { "value": "1.25" },
    "normal":   { "value": "1.5" },
    "relaxed":  { "value": "1.75" }
  }
}
```

> **Note**: `clamp()` fluid values may not work well in all Style Dictionary output formats (especially JS/SCSS). Consider documenting them as CSS-only tokens or keeping them as local design decisions.

---

## 7. Spacing — Container Max-Widths

**Priority: LOW** — used as `max-width` constraints across many pages but not part of current spacing scale.

| Usage              | Value    | Files                                    |
|--------------------|----------|------------------------------------------|
| Page container     | `1200px` | Multiple pages                           |
| Content / article  | `800px`  | `projects/[slug].astro`, `services/[slug].astro` |
| Narrow content     | `600px`  | Multiple sections                        |

**Proposed new token file `src/tokens/layout.json`:**
```json
{
  "layout": {
    "container": {
      "narrow":  { "value": "37.5rem" },
      "content": { "value": "50rem" },
      "wide":    { "value": "75rem" }
    }
  }
}
```

> **Note**: `800px = 50rem`, `1200px = 75rem`, `600px = 37.5rem` (coincides with `breakpoint.medium.min`). Confirm with design intent before adding.

---

## 8. Motion — Transition Timing

**Priority: LOW** — currently hardcoded throughout as local custom properties.

The website defines locally in `src/styles/global.css`:
```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;
```

**Proposed new token file `src/tokens/motion.json`:**
```json
{
  "motion": {
    "duration": {
      "fast":   { "value": "150ms" },
      "base":   { "value": "250ms" },
      "slow":   { "value": "400ms" }
    },
    "easing": {
      "default": { "value": "ease" },
      "in":      { "value": "ease-in" },
      "out":     { "value": "ease-out" },
      "in-out":  { "value": "ease-in-out" }
    }
  }
}
```

Generated CSS vars: `--motion-duration-fast`, `--motion-duration-base`, `--motion-duration-slow`, `--motion-easing-default`, etc.

---

## Summary Table

| # | Token Group          | New file / location              | Priority | CSS var pattern                     |
|---|----------------------|----------------------------------|----------|-------------------------------------|
| 1 | Text secondary color | `color/semantic.json`            | HIGH     | `--color-text-secondary`            |
| 2 | Badge category colors| `color/global.json` + semantic   | MEDIUM   | `--color-category-{personal,work,contribution}` |
| 3 | Letter spacing       | `typography.json`                | MEDIUM   | `--font-letter-spacing-{tight,normal,wide}` |
| 4 | Border radius        | new `border-radius.json`         | MEDIUM   | `--border-radius-{none,small,medium,large,pill}` |
| 5 | Card shadows         | new `shadow.json`                | MEDIUM   | `--shadow-{none,subtle,card,card-hover}` |
| 6 | Fluid font sizes     | `typography.json`                | LOW      | `--font-size-fluid-{body,hero}`     |
| 7 | Container max-widths | new `layout.json`                | LOW      | `--layout-container-{narrow,content,wide}` |
| 8 | Motion / transitions | new `motion.json`                | LOW      | `--motion-duration-{fast,base,slow}` |

---

## Out of Scope

The following hardcoded values were observed but are intentionally **not** candidate tokens:

- `transform: translateY(-Xpx)` hover micro-animations — these are interaction-specific and too granular for a token system.
- `border: 3px solid` avatar borders — a one-off visual detail.
- `width/height` pixel values for specific images (`150px`, `300px`) — component-specific sizing.
- `backdrop-filter: blur(12px)` header glass — highly contextual UI effect.
- Media query usage of breakpoints — breakpoints are already tokenized; the website just isn't consuming `--breakpoint-*` vars inside `@media` (a CSS limitation; tokens are reference-only for this use case).
