---
description: "Mark a feature as done and move it from working-on to done"
---

## Instructions

1. Resolve the project path:
   - Read `.osddtrc` from the repository root.
   - If `repoType` is `"single"`: the project path is the repository root.
   - If `repoType` is `"monorepo"`: ask the user which package to work on (e.g. `packages/my-package`), then use `<repo-root>/<package>` as the project path.
2. Derive the feature name from $ARGUMENTS using the same rules as the other commands (last segment of a branch name, or a kebab-cased slug — subject to the 30-character limit). This must match the folder name under `working-on/`.
3. Confirm all tasks in `osddt.tasks.md` are checked off (`- [x]`)
4. Run the following command to move the feature folder from `working-on` to `done`:

```
npx @dezkareid/osddt done <feature-name> --dir <project-path>
```

   The command will automatically prefix the destination folder name with today's date in `YYYY-MM-DD` format.
   For example, `working-on/feature-a` will be moved to `done/YYYY-MM-DD-feature-a`.

5. Report the result of the command, including the full destination path

## Arguments

$ARGUMENTS
