---
description: "Detect the current workflow phase and prompt the next command to run"
---

## Context

Before proceeding, run the following command and parse the JSON output to get the current branch and date:

```
npx @dezkareid/osddt meta-info
```

## Repository Configuration

Before proceeding, read the `.osddtrc` file in the root of the repository to determine the project path.

```json
// .osddtrc example
{ "repoType": "monorepo" | "single" }
```

- If `repoType` is `"single"`: the project path is the repository root.
- If `repoType` is `"monorepo"`: ask the user which package to work on (e.g. `packages/my-package`), then use `<repo-root>/<package>` as the project path.

## Working Directory

All generated files live under `<project-path>/working-on/<feature-name>/`. The `<feature-name>` is derived from the arguments provided. Create the directory if it does not exist.

> All file paths in the instructions below are relative to `<project-path>/working-on/<feature-name>/`.

## Instructions

Check the working directory `<project-path>/working-on/<feature-name>` for the files listed below **in order** to determine the current phase. Use the first matching condition:

| Condition | Current phase | Run next |
| --------- | ------------- | -------- |
| `osddt.tasks.md` exists **and** has at least one unchecked task (`- [ ]`) | Implementing | `/osddt.implement $ARGUMENTS` |
| `osddt.tasks.md` exists **and** all tasks are checked (`- [x]`) | Ready to close | `/osddt.done $ARGUMENTS` |
| `osddt.plan.md` exists | Planning done | `/osddt.tasks $ARGUMENTS` |
| `osddt.spec.md` exists | Spec done | `/osddt.plan $ARGUMENTS` |
| `osddt.research.md` exists | Research done | `/osddt.spec $ARGUMENTS` |
| None of the above | Not started | `/osddt.spec $ARGUMENTS` (or `/osddt.research $ARGUMENTS` if research is needed first) |

Report which file was found, which phase that corresponds to, and the exact command the user should run next.

## Arguments

$ARGUMENTS
