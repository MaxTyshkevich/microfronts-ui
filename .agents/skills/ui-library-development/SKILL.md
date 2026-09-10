---
name: ui-library-development
description: Implement or change reusable components in @microfronts/ui while preserving package boundaries, shadcn primitives, and component documentation.
---

# UI library development

Use this skill when adding, changing, or fixing a public component, a form adapter, or its Storybook documentation in this repository. Do not use it for package metadata or build-only changes; use `ui-library-package-maintenance` for those.

## Before editing

Read `StoryBook.md` (if absent from the working tree, use `git show :StoryBook.md` or Git history without restoring it), the applicable public entry point, the component folder, and the relevant current plan in `.codex/plans/`. Update or create that plan before changing source code. Record the confirmed problem or missing behavior, expected and actual behavior, options, chosen approach, implementation stages, and checks.

## Library invariants

- Build reusable UI with no shell, catalog, cart, or other microfrontend business scenarios.
- Do not edit files in `src/shared/ui/shadcn`. Compose or wrap installed primitives in `src/components` instead.
- Keep public components and their files in PascalCase folders with colocated implementation, story, and browser test. Keep form internals in `src/form` and do not export them without an API decision.
- Preserve existing public imports. If an API, component layout, source list, or build entry changes, update the applicable documentation in `docs/`.

## Component work

Prefer an installed primitive and semantic Tailwind tokens. Use the local `cn` helper for conditional classes in owned wrappers. Keep static component states in normal stories; place submit-capable forms in `*.form.stories.tsx`. Make hover, focus, disabled, and error states visible in Docs when they apply.

When the work touches a shadcn component, apply the `shadcn` skill as well. Its project rules take precedence for primitive composition, forms, semantic tokens, and accessibility.

## Completion

Use `ui-library-verification` to select and run proportionate checks. Record actual commands and results in the task plan; do not mark a check complete before it passes.
