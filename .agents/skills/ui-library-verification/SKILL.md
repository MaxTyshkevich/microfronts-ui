---
name: ui-library-verification
description: Verify @microfronts/ui changes with the smallest complete set of lint, type, browser, package, and Storybook checks.
---

# UI library verification

Use this skill after changing this UI library. Select every row that the change affects, then record the commands, outcomes, and limitations in the active plan under `.codex/plans/`.

| Change | Required verification |
| --- | --- |
| Any tracked source, config, or documentation file | `npm run lint`, `npm run format:check`, `npm run typecheck` when TypeScript configuration or sources are affected |
| Public component, form hook, styles, or unit/browser test | `npm test`; verify the affected states, both themes where color or interaction applies, and public imports |
| Story or Storybook configuration | `npm run test:playwright` and `npm run build-storybook`; use `test.step` for multi-step browser scenarios |
| Export, tsup, package metadata, dependencies, CSS entry, or build script | `npm run check-package`; inspect relevant public import paths and package contents |
| Release metadata | `npx changeset status` |

Run `npm run build` when `check-package` is not applicable but produced package artifacts need validation. Do not run a broad check merely to compensate for an unrelated failed command; localize and rerun the affected check after the fix.

For public components, browser checks must exercise real interaction through Vitest Browser or Playwright. A component with visual states must cover relevant hover, keyboard focus, disabled, and error behavior. Keep one-component state stories separate from interactive form examples.

Report checks that could not run, their observed blocker, and the remaining risk. Do not weaken assertions, omit browser coverage, or edit installed shadcn primitives to make verification pass.
