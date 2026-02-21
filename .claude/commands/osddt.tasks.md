---
description: "Generate actionable tasks from an implementation plan"
---

## Instructions

1. Check whether `osddt.tasks.md` already exists in the working directory:
   - If it **does not exist**, proceed to generate it.
   - If it **already exists**, ask the user whether to:
     - **Regenerate** — discard the existing file and create a fresh task list from scratch
     - **Update** — read the existing file and apply targeted changes based on $ARGUMENTS
     - **Do nothing** — stop here and leave the file as-is
2. Read `osddt.plan.md` from the working directory
3. Break each phase into discrete, executable tasks
4. Estimate complexity (S/M/L) for each task
5. Write the task list to `osddt.tasks.md` in the working directory

## Tasks Format

The task list should include:
- **Checklist** of tasks grouped by phase
- Each task should be: `- [ ] [S/M/L] Description of task`
- **Dependencies**: Note which tasks must complete before others
- **Definition of Done**: Clear completion criteria per phase

## Arguments

$ARGUMENTS

## Next Step

Run the following command to start implementing tasks:

```
/osddt.implement $ARGUMENTS
```
