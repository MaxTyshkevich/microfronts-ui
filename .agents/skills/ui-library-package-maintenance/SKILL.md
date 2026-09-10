---
name: ui-library-package-maintenance
description: Change @microfronts/ui exports, dependencies, tsup, CSS delivery, or Changesets while preserving consumer compatibility.
---

# UI library package maintenance

Use this skill when changing package entry points, exports, dependencies, peer dependencies, tsup configuration, CSS delivery, build scripts, or Changesets. Do not use it for ordinary component implementation unless the package contract changes too.

## Contract first

Before editing, inspect `package.json`, `tsup.config.ts`, the applicable entry point, and `docs/BUILD.mdx`. Record the intended consumer-facing behavior and compatibility impact in the active plan under `.codex/plans/`.

- Keep existing public subpaths such as `/button` and `/input` unless the task explicitly authorizes a breaking change.
- Keep React and form-context dependencies as compatible peer dependency ranges; do not pin consumers to an exact version.
- Keep internal hooks and shadcn primitives out of public exports unless the API decision explicitly includes them.
- Treat CSS imports and `sideEffects` as consumer-facing behavior. Confirm they continue to work from both package entry points and the CSS subpath.
- Update `docs/BUILD.mdx` for build behavior, entries, or measured output sizes. Update `docs/PROJECT_STRUCTURE.mdx` when ownership or file layout changes.

## Completion

Apply `ui-library-verification`. For a publishable surface change, run `npm run check-package`, inspect `npm pack --dry-run --ignore-scripts --json`, and run `npx changeset status` when a Changeset is required. Do not publish the package unless explicitly asked.
