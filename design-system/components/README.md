# @dezkareid/components

A package that exports UI components for React, Astro, and Vue. Built on the `@dezkareid/design-tokens` design system with full light/dark theme support via CSS semantic tokens.

## Installation

```bash
pnpm add @dezkareid/components @dezkareid/design-tokens
```

## Package Exports

| Export | Points to | Notes |
|---|---|---|
| `@dezkareid/components/react` | `dist/react.js` | Pre-compiled ES module, includes `.d.ts` types |
| `@dezkareid/components/astro` | `src/astro/index.ts` | Source — compiled by the consuming Astro app |
| `@dezkareid/components/vue` | `src/vue/index.ts` | Source — compiled by the consuming Vite/Vue app |
| `@dezkareid/components/css` | `dist/components.min.css` | Pre-compiled CSS Modules bundle |

## Setup

### 1. Import design tokens

Import the design tokens CSS once at the root of your app — this provides all the CSS custom properties (`--color-*`, `--spacing-*`, etc.) that components depend on:

```js
import '@dezkareid/design-tokens/dist/css/variables.css';
```

### 2. Import component styles

Import the compiled component styles once at the root of your app:

```js
import '@dezkareid/components/css';
```

> **Note:** The component CSS uses CSS Modules scoped class names. The `@dezkareid/components/css` export is the processed bundle that matches the class names used by the compiled JS — do not import the raw source CSS files from `src/css/`.

Both imports must come before any component usage.

---

## Components

### Button

A clickable element for triggering actions.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'success'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `disabled` | `boolean` | `false` | Disables interaction |

#### React

```tsx
import { Button } from '@dezkareid/components/react';

<Button variant="primary" size="md" onClick={() => {}}>Click me</Button>
<Button variant="secondary" size="lg">Secondary</Button>
<Button disabled>Disabled</Button>
```

#### Astro

```astro
---
import { Button } from '@dezkareid/components/astro';
---
<Button variant="primary" size="md">Click me</Button>
```

#### Vue

```vue
<script setup>
import { Button } from '@dezkareid/components/vue';
</script>

<template>
  <Button variant="secondary" size="sm">Click me</Button>
</template>
```

---

### Tag

A small inline label for categorising or annotating content. Accepts arbitrary slot/children.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'success' \| 'danger'` | `'default'` | Semantic colour |

#### React

```tsx
import { Tag } from '@dezkareid/components/react';

<Tag variant="default">Draft</Tag>
<Tag variant="success">Published</Tag>
<Tag variant="danger">Error</Tag>
<Tag><strong>Bold label</strong></Tag>
```

#### Astro

```astro
---
import { Tag } from '@dezkareid/components/astro';
---
<Tag variant="success">Published</Tag>
```

#### Vue

```vue
<script setup>
import { Tag } from '@dezkareid/components/vue';
</script>

<template>
  <Tag variant="danger">Error</Tag>
</template>
```

---

### Card

A contained surface that groups related content.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `elevation` | `'flat' \| 'raised'` | `'raised'` | Shadow depth |

#### React

```tsx
import { Card } from '@dezkareid/components/react';

<Card elevation="raised">
  <h2>Title</h2>
  <p>Body content</p>
</Card>

<Card elevation="flat">Flat card</Card>
```

#### Astro

```astro
---
import { Card } from '@dezkareid/components/astro';
---
<Card elevation="raised">
  <h2>Title</h2>
  <p>Body</p>
</Card>
```

#### Vue

```vue
<script setup>
import { Card } from '@dezkareid/components/vue';
</script>

<template>
  <Card elevation="flat">
    <p>Content</p>
  </Card>
</template>
```

---

### ThemeToggle

A self-contained toggle that switches between light and dark colour schemes. Reads from and persists to `localStorage` (key: `color-scheme`), falling back to the OS `prefers-color-scheme` preference. Applies the theme by setting `color-scheme` on `<html>`.

**Props**: none

#### React

```tsx
import { ThemeToggle } from '@dezkareid/components/react';

<ThemeToggle />
```

#### Astro

```astro
---
import { ThemeToggle } from '@dezkareid/components/astro';
---
<ThemeToggle />
```

> The Astro component includes an inline script that runs before first paint to prevent FOUC.

#### Vue

```vue
<script setup>
import { ThemeToggle } from '@dezkareid/components/vue';
</script>

<template>
  <ThemeToggle />
</template>
```

---

## License

ISC
