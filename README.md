# @microfronts/ui

Библиотека базовых компонентов для shell, catalog и cart. Пакет не публикуется в рамках задания.

## Использование

```tsx
import { Button, Input } from "@microfronts/ui";
// Или отдельные точки входа:
import { Button as KitButton } from "@microfronts/ui/button";
import { Input as KitInput } from "@microfronts/ui/input";
// Стили подключаются автоматически при импорте компонентов.
```

CSS автоматически подключается через JS-входы пакета; отдельный импорт не требуется. Потребителю не нужны Tailwind, shadcn CLI, Storybook или tsup.
Для автоматического подключения нужен сборщик с поддержкой CSS (например, Vite). Прямое выполнение пакета в Node требует CSS loader; это относится и к SSR без обработки CSS сборщиком.
Готовый CSS компонентов не включает Preflight и глобальные правила слоя base. Владелец страницы должен один раз импортировать `@microfronts/ui/reset.css` в своей точке входа: shell — для интеграции, main.tsx remote — только для standalone. Exposed-компоненты reset не импортируют. Reset использует переменные темы из автоматически подключаемого styles.css.
Для тёмной темы установите класс `dark` на предке компонентов и `color-scheme: dark`.
Токены цветов можно переопределять CSS-переменными. Размеры в поставляемом CSS относительные (база пересчёта — 16 CSS px).
Кнопка поддерживает `variant`, `size`, `disabled`, `error`, стандартные атрибуты и ref.

## Формы и Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@microfronts/ui";

const schema = z.object({ email: z.email("Введите корректный email") });
type Values = z.infer<typeof schema>;

export function Form() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  return (
    <form noValidate onSubmit={form.handleSubmit(console.log)}>
      <Input control={form.control} name="email" label="Email" type="email" />
      <Button type="submit">Отправить</Button>
    </form>
  );
}
```

Вместо явного `control` можно использовать `FormProvider`. Задавайте начальные значения через `defaultValues`.
Input связывает label, описание и ошибку через ARIA; поддерживает правила RHF, обработчики onChange/onBlur и фокус при ошибке.
Внутренний адаптер `useFormField` рассчитан на будущие поля; он не экспортируется из пакета.
Схема и resolver принадлежат приложению, поэтому Zod не является runtime-зависимостью UI-Kit.
Для приведённого примера установите Zod 4 и совместимый `@hookform/resolvers`.

Поддерживаются React/React DOM 19 и React Hook Form 7 через диапазоны peerDependencies.
Точная версия не фиксируется; будущие несовместимые major-версии не объявлены поддерживаемыми.
Примитивы используют ref как prop (React 19). React 18 не объявлен совместимым.
Badge и Panel сохранены из существующего публичного API; их стили `mf-*` по-прежнему задаёт приложение.

## Разработка и проверки

- `npm install`
- `npx playwright install chromium`
- `npm run storybook` — документация и переключатель темы.
- `npm run typecheck`
- `npm test` — браузерные истории Vitest/Playwright и проверки доступности.
- `npm run build` — ESM, CommonJS, декларации типов и готовый CSS.
- `npm run build-storybook`
- `npm pack --dry-run` — проверка содержимого без публикации.

`npm run dev` наблюдает за TypeScript через tsup; после изменения CSS запустите `npm run build:css`.
Истории и тесты находятся рядом с компонентами в `src/components`; вводная MDX находится в `src/docs`.
Исходники примитивов Button/Input не изменяются. Настройки путей shadcn находятся в `components.json`.
CSS пакета сканирует компоненты и примитивы; истории и оформление документации подключены отдельным входом Storybook. Общая тема и tw-animate-css сохранены.
Сканирование классов ограничено явными источниками согласно [документации Tailwind](https://tailwindcss.com/docs/detecting-classes-in-source-files).

## Версионирование

`npm run changeset` добавляет запись об изменении; `npm run version-packages` применяет записи к версии и changelog.
Начальная запись для нового API подготовлена в `.changeset/ui-kit.md`.
Публикация требует отдельного действия и не выполняется автоматически.

## Качество кода и устройство проекта

- `npm run lint` — проверить JS/TypeScript и React Hooks.
- `npm run lint:fix` — применить доступные исправления линтера.
- `npm run format` — отформатировать поддерживаемые файлы.
- `npm run format:check` — проверить форматирование без изменений.

Назначение файлов, выбор useController и способ подключения CSS описаны в [устройстве проекта](docs/PROJECT_STRUCTURE.mdx). Этот документ предназначен для работы с исходным репозиторием.

## Storybook, тесты и сборка

В Storybook описаны Button, Input, Badge и Panel. Запуск: `npm run storybook`.
Браузерные тесты запускаются через Vitest с Playwright: `npm test`; для первого запуска установите Chromium командой `npx playwright install chromium`.

`npm run build:report` собирает пакет и выводит размер JS, CSS, типов и sourcemaps. Устройство сборки, измерения и варианты оптимизации описаны в [docs/BUILD.mdx](docs/BUILD.mdx).

Собственные файлы компонентов именуются в PascalCase: src/components/Button/Button.tsx и src/components/Input/Input.tsx. Публичные подпути /button и /input сохраняются.

Использование Input через control/FormProvider и применение внутреннего useFormField при создании новых полей описаны в [src/form/README.md](src/form/README.md). Прямые тесты хука находятся рядом с ним.

## Проверка самого Storybook

`npm run test:playwright` проверяет Canvas/Docs и сценарий формы в настоящем Chromium. `npm run test:playwright:report` открывает отчёт с описанными шагами. Сервер тестов использует порт 6007. После изменения .storybook/main.ts перезапустите запущенный Storybook.
