# Использование useFormField

`useFormField` — внутренний хук библиотеки. Он соединяет React Hook Form с полем и создаёт идентификаторы для label, описания и ошибки. В npm API хук не экспортируется: приложения используют публичный Input.

## В приложении: готовый Input с control

```tsx
import { useForm } from "react-hook-form";
import { Button, Input } from "@microfronts/ui";
import "@microfronts/ui/styles.css";

type Values = { email: string };

export function ExampleForm() {
  const form = useForm<Values>({
    defaultValues: { email: "" },
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      <Input
        control={form.control}
        name="email"
        label="Email"
        description="Адрес для ответа"
        rules={{ required: "Введите email" }}
      />
      <Button type="submit">Отправить</Button>
    </form>
  );
}
```

Input сам вызывает useFormField. Пользователь не регистрирует это же поле дополнительно через register. Для схемы Zod передайте zodResolver(schema) в useForm: хук получит ошибки через RHF.

## В приложении: FormProvider

```tsx
import { FormProvider, useForm } from "react-hook-form";
import { Button, Input } from "@microfronts/ui";

export function ExampleForm() {
  const form = useForm({ defaultValues: { email: "" } });
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <Input name="email" label="Email" />
        <Button type="submit">Отправить</Button>
      </form>
    </FormProvider>
  );
}
```

При пропущенном control React Hook Form использует ближайший FormProvider. Должен быть хотя бы один из этих способов подключения. Явный control удобен для небольших форм и лучше показывает зависимость компонента; контекст удобен для глубоко вложенных полей.

## При разработке нового поля внутри библиотеки

Посмотрите рабочий пример в [Input.tsx](../components/Input/Input.tsx). Из компонента в src/components/Name импорт будет таким:

```tsx
import { useFormField } from "../../form/use-form-field";

// Внутри React-компонента, без условий и циклов:
const { field, fieldState, id, descriptionId, errorId, describedBy } = useFormField({
  name,
  control,
  rules,
  defaultValue,
  disabled,
  shouldUnregister,
  id: suppliedId,
  description,
});
```

Это фрагмент компонента: name, control и остальные значения приходят из его props. Хук вызывается один раз для одного поля.

| Результат                            | Куда передавать                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| field.value                          | Значение контрола. Для текстового поля можно использовать value ?? "".                   |
| field.onChange                       | Обработчик изменения. Для Checkbox передавайте boolean, для Select — выбранное значение. |
| field.onBlur                         | Событие потери фокуса для touched и валидации onBlur.                                    |
| field.ref                            | Реальный фокусируемый элемент, чтобы RHF мог сфокусировать ошибку.                       |
| field.name, field.disabled           | Имя и фактическое disabled-состояние контрола.                                           |
| fieldState.error, fieldState.invalid | Текст ошибки и aria-invalid.                                                             |
| id                                   | id контрола и htmlFor его label.                                                         |
| descriptionId                        | id текста описания, если description непустой.                                           |
| errorId                              | id сообщения ошибки, когда ошибка существует.                                            |
| describedBy                          | aria-describedby; объединяет только существующие описание и ошибку.                      |

Если потребитель передал свой aria-describedby, объедините его с describedBy, как в Input. Собственные onChange/onBlur вызывайте вместе с обработчиками field, не вместо них. В примере Input это уже реализовано.

Хук не рисует оболочку поля. При добавлении новых shadcn-контролов используйте принятую композицию Field/FieldLabel/FieldDescription, предварительно установив соответствующие примитивы. Текущий структурный перенос не меняет разметку уже существующего Input.

## Почему не Controller

useFormField уже использует useController. Controller — другой интерфейс того же механизма RHF с render-функцией. Наш вариант позволяет переиспользовать связь с формой и ARIA-идентификаторы отдельно от JSX конкретного контрола. Для простого нативного input register также может быть достаточным; подробное сравнение находится в [карте проекта](../../docs/PROJECT_STRUCTURE.mdx).

## Что важно учитывать

- Начальные значения удобнее задавать в useForm.defaultValues; для текстового поля используйте пустую строку вместо undefined.
- Генерируемый id стабилен между рендерами смонтированного поля; это не постоянный идентификатор после размонтирования.
- Переданный id используется как есть. Его уникальность обеспечивает вызывающий код.
- disabled-поле не участвует в отправляемом значении так же, как обычное поле RHF с disabled.
- Хук не содержит бизнес-правил, схемы Zod и конвертации Checkbox/Select. Адаптацию событий выполняет обёртка контрола.
- Без control и FormProvider подключение к форме некорректно. Не используйте хук как независимый useState.

## Тесты

[use-form-field.test.tsx](use-form-field.test.tsx) выполняется в Chromium через Vitest/Playwright. Нативный тестовый input изолирует контракт хука от shadcn, а тесты Input отдельно проверяют интеграцию.

Проверяются оба способа подключения, уникальные стабильные ID, явный ID, появление/удаление ARIA-ссылки на ошибку, фокус ошибки, dirty/touched/reset и исключение disabled-поля из отправки.

```sh
npm test -- --project components src/form/use-form-field.test.tsx
```
