# @dezkareid/components

A package that exports UI components for React, Astro, and Vue. Built on the `@dezkareid/design-tokens` design system with full light/dark theme support via CSS semantic tokens.

## Installation

```bash
pnpm add @dezkareid/components @dezkareid/design-tokens
```

## Package Exports

| Export | Points to | Notes |
|---|---|---|
| `@dezkareid/components/react` | `dist/react/index.js` | Pre-compiled ES module, includes `.d.ts` types. For non-Next.js React consumers. |
| `@dezkareid/components/react-server` | `dist/react-server/index.js` | Server-safe components only (`Button`, `Card`, `Tag`). Use in Next.js Server Components. |
| `@dezkareid/components/react-client` | `dist/react-client/index.js` | Client components only (`ThemeToggle`). Ships with `'use client'` directive. Use in Next.js Client Components. |
| `@dezkareid/components/astro` | `src/astro/index.ts` | Source — compiled by the consuming Astro app |
| `@dezkareid/components/vue` | `src/vue/index.ts` | Source — compiled by the consuming Vite/Vue app |
| `@dezkareid/components/angular` | `dist/angular/index.d.ts` | Pre-compiled — Angular Package Format (APF) |
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

## Next.js App Router

When using this package in a Next.js App Router project, import from the entry point that matches the rendering context:

```tsx
// In a Server Component (no 'use client' needed in your file)
import { Button, Card, Tag } from '@dezkareid/components/react-server';

export default function Page() {
  return (
    <Card elevation="raised">
      <Tag variant="success">Active</Tag>
      <Button variant="primary">Get started</Button>
    </Card>
  );
}
```

```tsx
// In a Client Component (or a file that already has 'use client')
import { ThemeToggle } from '@dezkareid/components/react-client';

export default function Header() {
  return <ThemeToggle />;
}
```

> The `react-client` entry point ships with the `'use client'` directive already embedded in the compiled output — you do not need to add it yourself.

For non-Next.js React consumers, `@dezkareid/components/react` continues to export all components unchanged.

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

#### Angular

```html
<!-- Import { ButtonComponent } from '@dezkareid/components/angular' -->
<button db-button variant="primary" size="md">Click me</button>
<a db-button variant="secondary" href="/contact">Link button</a>
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

#### Angular

```html
<!-- Import { TagComponent } from '@dezkareid/components/angular' -->
<span db-tag variant="success">Published</span>
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

#### Angular

```html
<!-- Import { CardComponent } from '@dezkareid/components/angular' -->
<div db-card elevation="raised">
  <h2>Title</h2>
  <p>Body</p>
</div>
```

---

### ThemeToggle

A self-contained toggle that switches between light and dark colour schemes. Reads from and persists to `localStorage` (key: `color-scheme`), falling back to the OS `prefers-color-scheme` preference. Applies the theme by setting `color-scheme` on `<html>`.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `cssProcessor` | `'css' \| 'lightningcss'` | `'css'` | CSS processing mode. Use `'lightningcss'` for Next.js/Turbopack (see note below). |
| `onChange` | `(theme: 'light' \| 'dark') => void` | — | Called after each theme change with the new value. |

> **`cssProcessor` note:** Next.js/Turbopack processes CSS through [LightningCSS](https://lightningcss.dev/transpilation.html), which compiles `light-dark()` into `--lightningcss-light` / `--lightningcss-dark` toggle variables driven by `@media (prefers-color-scheme: dark)`. Setting only `color-scheme` on `<html>` has no effect in this case. Pass `cssProcessor="lightningcss"` so the component overrides those variables directly.

#### React (non-Next.js)

```tsx
import { ThemeToggle } from '@dezkareid/components/react';

<ThemeToggle />

// With onChange
<ThemeToggle onChange={(theme) => console.log('theme changed:', theme)} />
```

#### React (Next.js / Turbopack)

```tsx
import { ThemeToggle } from '@dezkareid/components/react-client';

<ThemeToggle cssProcessor="lightningcss" />

// With onChange
<ThemeToggle cssProcessor="lightningcss" onChange={(theme) => console.log(theme)} />
```

> The `react-client` entry ships with `'use client'` already embedded — no need to add it yourself.

> **FOUC prevention (Next.js):** Add this inline script to your root `layout.tsx` `<head>` and `suppressHydrationWarning` on `<html>` to avoid a flash of the wrong theme before hydration:
> ```tsx
> <html suppressHydrationWarning>
>   <head>
>     <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('color-scheme');if(t==='dark'){document.documentElement.style.colorScheme='dark';document.documentElement.style.setProperty('--lightningcss-light',' ');document.documentElement.style.setProperty('--lightningcss-dark','initial');}else if(t==='light'){document.documentElement.style.colorScheme='light';document.documentElement.style.setProperty('--lightningcss-light','initial');document.documentElement.style.setProperty('--lightningcss-dark',' ');}}catch(_){}})();` }} />
>   </head>
> ```

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

#### Angular

```html
<!-- Import { ThemeToggleComponent } from '@dezkareid/components/angular' -->
<db-theme-toggle (onChange)="onThemeChange($event)"></db-theme-toggle>
```

---

### Breadcrumb

A navigation aid that helps users understand their location within the application.

#### React

```tsx
import { Breadcrumb } from '@dezkareid/components/react';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'Figures' },
  ]}
/>
```

#### Astro

```astro
---
import { Breadcrumb } from '@dezkareid/components/astro';
---
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Collections' },
  ]}
/>
```

---

### Image

A responsive image component with support for Cloudinary optimizations and different loading strategies.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image source URL |
| `alt` | `string` | — | Accessible description |
| `mode` | `'responsive' \| 'fixed'` | `'responsive'` | Rendering mode |
| `strategy` | `'default' \| 'cloudinary'` | `'default'` | Optimization strategy |
| `aspectRatio` | `string` | — | CSS aspect-ratio (e.g. "16 / 9") |
| `priority` | `boolean` | `false` | If true, loads eagerly with high priority |

#### React

```tsx
import { Image } from '@dezkareid/components/react';

<Image
  src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
  alt="Sample"
  mode="responsive"
  aspectRatio="16 / 9"
/>
```

---

### LikeButton

A specialized toggle for liking items. Built on top of `ActionToggle`.

#### React

```tsx
import { LikeButton } from '@dezkareid/components/react';

<LikeButton
  active={isLiked}
  onChange={(liked) => handleLike(liked)}
  aria-label="Like this item"
/>
```

---

### Modal

A standardized overlay for dialogs and focused interactions.

#### React

```tsx
import { Modal } from '@dezkareid/components/react';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

---

### VerifiedBadge

A small UI primitive to indicate verified status.

#### React

```tsx
import { VerifiedBadge } from '@dezkareid/components/react';

<VerifiedBadge size={16} />
```

---

### ConsentBanner

A reusable banner for cookie consent and privacy notifications.

#### React

```tsx
import { ConsentBanner } from '@dezkareid/components/react';

<ConsentBanner />
```

---

## License

ISC
