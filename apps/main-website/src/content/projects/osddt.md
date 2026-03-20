---
title: "Spec-Driven Development Tool"
description: "A structured workflow for AI-assisted development — turns vague feature ideas into auditable specs, plans, and task lists that AI agents execute one step at a time."
npmUrl: "https://www.npmjs.com/package/@dezkareid/osddt"
techStack: ["TypeScript", "Node.js", "Claude Code"]
type: "personal"
featured: false
order: 5
---

## Project Overview

AI agents are fast, but without structure they drift — implementing the wrong thing, skipping edge cases, or producing code that's hard to review. OSDDT solves this by enforcing a spec-first workflow before any code is written.

Each feature starts with a written spec, becomes a plan, gets broken into discrete tasks, and is implemented one task at a time. Every artifact is committed alongside the code, so the intent behind every change is always traceable.

This website was built using OSDDT.

### Key Outcomes

- **No runaway implementations**: The Spec → Plan → Tasks → Implement loop keeps AI agents focused on one thing at a time, with explicit sign-off between phases.
- **Full audit trail**: Every feature leaves a working directory with spec, plan, and task checklist — reviewable by humans, not just inferred from commit messages.
- **Claude Code native**: Commands run as Claude Code skills, directly in the editor where the work happens.
- **Monorepo-ready**: Resolves project paths per-package, so each workspace package has its own working directory.
