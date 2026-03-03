# @dezkareid/components

A package that exports UI components for React, Astro, and Vue. Built on the `@dezkareid/design-tokens` design system with full light/dark theme support via CSS semantic tokens.

## Installation

```bash
pnpm add @dezkareid/components @dezkareid/design-tokens
```

## Setup

Import the design tokens CSS file once at the root of your app (before any component styles):

```js
import '@dezkareid/design-tokens/dist/css/variables.css';
```

---

## Components

### Button

A clickable element for triggering actions.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Visual style |
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
import Button from '@dezkareid/components/astro/Button/index.astro';
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
import Tag from '@dezkareid/components/astro/Tag/index.astro';
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
import Card from '@dezkareid/components/astro/Card/index.astro';
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
import ThemeToggle from '@dezkareid/components/astro/ThemeToggle/index.astro';
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
