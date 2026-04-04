# @dezkareid/scaffolding

A CLI tool to standardize and automate the creation of new software projects within the Dezkareid Enterprise ecosystem.

## Installation

You don't need to install this globally. You can use it via `npx`.

## Usage

### Using npx

```bash
npx @dezkareid/scaffolding create my-new-project
```

## Options

The CLI supports both interactive mode and command-line arguments:

- `[name]`: The name of the project (required).
- `-d, --description <description>`: A brief description of the project.
- `-a, --author <author>`: The author's name.
- `-u, --author-username <username>`: The author's GitHub username (used for repository links).

### Example with all arguments

```bash
npx @dezkareid/scaffolding create my-library \
  --description "A shared utility library" \
  --author "Joel Humberto Gomez Paredes" \
  --author-username "dezkareid"
```

## What's Included

When you scaffold a new "TS/JS Library" project, you get:

- **TypeScript** configured with internal standards.
- **Tsup** for fast, ESM-only bundling.
- **Vitest** for unit testing.
- **ESLint** with `@dezkareid/eslint-plugin-web` and `typescript-eslint`.
- **Prettier** for consistent formatting.
- **Documentation Templates**: `README.md` and `AGENTS.md`.
- **Git Initialization**: Automatically runs `git init` (if not already in a repo).
- **Package Config**: `package.json` with standard scripts and public publication settings.

## License

MIT
