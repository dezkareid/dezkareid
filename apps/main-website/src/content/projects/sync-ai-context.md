---
title: "Sync AI Context"
description: "A CLI tool that keeps AI agent context files in sync across Claude, Gemini, and other providers using a single AGENTS.md source of truth."
image: "https://placehold.co/600x400"
techStack: ["TypeScript", "Node.js", "Commander"]
type: "personal"
featured: true
order: 2
---

## Project Overview

Managing AI context files across multiple providers (Claude, Gemini) is repetitive and error-prone. This CLI reads a single `AGENTS.md` source file and syncs it to the correct format and location for each configured provider.

### Key Features

- **Single source of truth**: One `AGENTS.md` drives all provider-specific files.
- **Multi-provider**: Supports Claude (`CLAUDE.md`), Gemini, and Gemini Markdown formats.
- **Configurable**: Driven by a `.ai-context-configrc` file per project.
- **Monorepo-aware**: Works across workspace packages with independent configs.
