---
title: "Spec-Driven Development Tool"
description: "A workflow toolkit for AI-assisted feature development — spec, plan, tasks, and implement in a structured loop."
image: "https://placehold.co/600x400"
techStack: ["TypeScript", "Node.js", "Claude Code"]
type: "personal"
featured: false
order: 4
---

## Project Overview

OSDDT (Other Spec-Driven Development Tool) is a set of slash commands and conventions that guide AI agents through a structured development workflow: write a spec, create a plan, generate tasks, implement one by one, and mark the feature done.

### Key Features

- **Structured workflow**: Spec → Plan → Tasks → Implement → Done loop keeps AI agents focused and auditable.
- **Working directory per feature**: All artifacts live under `working-on/<feature>/` for easy review.
- **Claude Code integration**: Commands run directly as Claude Code skills.
- **Monorepo-friendly**: Works per-package with project path resolution.
