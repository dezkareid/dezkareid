---
description: "Create a technical implementation plan from a specification"
---

## Instructions

1. Check whether `osddt.plan.md` already exists in the working directory:
   - If it **does not exist**, proceed to generate it.
   - If it **already exists**, ask the user whether to:
     - **Regenerate** — discard the existing file and create a fresh plan from scratch
     - **Update** — read the existing file and apply targeted changes based on $ARGUMENTS
     - **Do nothing** — stop here and leave the file as-is
2. Read `osddt.spec.md` from the working directory
3. Break down the implementation into logical phases and steps
4. Identify technical decisions, dependencies, and risks
5. Write the plan to `osddt.plan.md` in the working directory

## Plan Format

The plan should include:
- **Architecture Overview**: High-level design decisions
- **Implementation Phases**: Ordered phases with goals
- **Technical Dependencies**: Libraries, APIs, services needed
- **Risks & Mitigations**: Known risks and how to address them
- **Out of Scope**: Explicitly what will not be built

## Arguments

$ARGUMENTS

## Next Step

Run the following command to generate the task list:

```
/osddt.tasks $ARGUMENTS
```
