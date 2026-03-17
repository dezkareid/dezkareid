---
title: "Sync AI Context"
description: "A CLI that eliminates manual AI context drift — one AGENTS.md file, automatically synced to every provider your team uses."
image: "https://placehold.co/600x400"
techStack: ["TypeScript", "Node.js", "Commander"]
npmUrl: "https://www.npmjs.com/package/@dezkareid/ai-context-sync"
type: "personal"
featured: true
order: 2
---

## Project Overview

Every AI provider — Claude, Gemini, Cursor — expects its context file in a different format and location. Keeping them aligned manually means drift, inconsistency, and wasted time.

This CLI solves it with a single `AGENTS.md` as the source of truth. Run one command and every provider-specific file is regenerated in the right format, in the right place.

### Key Outcomes

- **No more drift**: One edit to `AGENTS.md` propagates to all providers — no manual copying or reformatting.
- **Multi-provider**: Ships with support for Claude (`CLAUDE.md`), Gemini, and Gemini Markdown out of the box.
- **Per-project config**: A `.ai-context-configrc` file controls which providers to target and where to write files.
