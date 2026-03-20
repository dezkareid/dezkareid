# Agent Instructions: @dezkareid/types

This package is a collection of shared TypeScript types for APIs, structured data, and browser APIs.

## Development Workflow

- **Language**: TypeScript 5.9.3
- **Build**: `npm run build` (uses `tsc`)
- **Testing**: `npm run test` or `npm run test:types` (uses `vitest`)
- **Structure**:
  - `src/index.ts`: The main entry point that exports all types.
  - `src/*.ts`: Individual type definition files.

## Guidelines for Adding Types

1. **Reusability**: Prefer defining base interfaces and extending them for specialized rules.
2. **Documentation**: Use JSDoc comments to provide descriptions and link to official specifications (e.g., W3C, MDN).
3. **Naming**: Use clear, descriptive names for types and interfaces.
4. **Experimental Features**: Mark experimental or non-standard properties with the `@experimental` JSDoc tag.
5. **Testing**: Always add a `.test-d.ts` file for new types to verify correctness and prevent regressions. Use `vitest`'s `assertType` and `expectTypeOf`.

## Example: Speculation Rules

The Speculation Rules API types are defined in `src/speculation-rules.ts`. When updating these types, refer to the latest [W3C Speculation Rules specification](https://wicg.github.io/nav-speculation/speculation-rules.html).
