---
title: "Platzi Internationalization"
description: "Architected and implemented the i18n system for Platzi's platform, enabling content and UI to be delivered in multiple languages at scale."
image: "https://placehold.co/600x400"
techStack: ["React", "Next.js", "TypeScript", "i18next"]
type: "work"
featured: false
order: 7
---

## Project Overview

Expanding Platzi to new markets required a robust internationalization system that could handle UI strings, content, and routing without degrading performance. I designed and implemented the i18n architecture from the ground up.

### Key Outcomes

- **Scalable i18n pipeline**: Built a translation workflow that allowed the content team to ship new languages without engineering support.
- **No performance regression**: Lazy-loaded translation bundles kept the initial bundle size unchanged.
- **Routing support**: Implemented locale-aware routing with Next.js, including redirects and canonical URLs.
