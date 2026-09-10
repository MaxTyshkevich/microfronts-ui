# Правила UI-библиотеки

Это репозиторий npm-библиотеки `@microfronts/ui`, а не микрофронт и не приложение. Здесь живут базовые компоненты без бизнес-логики, пригодные для shell, catalog и cart. Не добавлять сценарии конкретного потребителя, например `CatalogProductCard` или `CartCheckoutButton`.

## Постоянные правила

- Поддерживаем React 19, TypeScript, Tailwind CSS 4, Storybook React/Vite, React Hook Form, Vitest/Playwright, tsup и Changesets.
- Исходники установленных shadcn-примитивов находятся в `src/shared/ui/shadcn` и не изменяются, не форматируются и не исправляются автоматически. Расширять их через собственные обёртки и композицию; использовать алиас `@/shared/ui/shadcn`.
- Собственные публичные компоненты и файлы компонентов именуются в PascalCase и находятся в `src/components/Name/`. Рядом размещаются `Name.tsx`, `Name.stories.tsx` и `Name.test.tsx`; интерактивные формы выносятся в `Name.form.stories.tsx`.
- Общие тестовые утилиты находятся в `src/test`; внутренние хуки форм — в `src/form` вместе с тестами и руководством. Не экспортировать внутренний хук без отдельного решения об API.
- Публичные подпути `/button` и `/input` сохраняются. React и зависимости контекста форм остаются peerDependencies с совместимыми диапазонами, без точной фиксации версии потребителя.
- `StoryBook.md` — источник требований. Его не переписывают. Если файл удалён из рабочей копии, читать сохранённую версию через `git show :StoryBook.md` или историю Git; автоматически не восстанавливать. Все планы ведутся в `.codex/plans/`: для новой задачи создаётся понятный файл, а продолжающаяся задача обновляет существующий. `IMPLEMENTATION.md` — общий план UI-Kit.
- При изменении структуры обновлять `docs/PROJECT_STRUCTURE.mdx`; при изменении сборки, exports или измерений — `docs/BUILD.mdx`.

## Workflows

- Для компонента, формы или истории применять `ui-library-development` и при необходимости `shadcn`.
- Для exports, зависимостей, tsup, CSS-поставки и Changesets применять `ui-library-package-maintenance`.
- После изменения библиотеки применять `ui-library-verification`: он определяет необходимый набор проверок и порядок отчёта.

## Основные команды

`npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run test:playwright`, `npm run check-package`, `npm run build-storybook` и `npm run build`. Подробный выбор проверок находится в `ui-library-verification`.
