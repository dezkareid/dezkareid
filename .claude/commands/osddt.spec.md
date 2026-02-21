---
description: "Analyze requirements and write a feature specification"
---

## Instructions

1. Check whether `osddt.research.md` exists in the working directory.
   - If it exists, read it and use its findings (key insights, constraints, open questions, codebase findings) as additional context when writing the specification.
   - If it does not exist, proceed using only the requirements provided in $ARGUMENTS.
2. Analyze the requirements provided in $ARGUMENTS
3. Identify the core problem being solved
4. Define the scope, constraints, and acceptance criteria
5. Write the specification to `osddt.spec.md` in the working directory

## Specification Format

The spec should include:
- **Overview**: What and why
- **Requirements**: Functional and non-functional
- **Scope**: What is in and out of scope
- **Acceptance Criteria**: Clear, testable criteria
- **Open Questions**: Any ambiguities to resolve

> If `osddt.research.md` was found, add a **Research Summary** section that briefly references the key insights and constraints it identified.

## Arguments

$ARGUMENTS

## Next Step

Run the following command to create the implementation plan:

```
/osddt.plan $ARGUMENTS
```
