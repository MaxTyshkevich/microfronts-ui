import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./Input";
import { Button } from "../Button/Button";

const schema = z.object({ email: z.email("Enter a valid email") });
type Values = z.infer<typeof schema>;
function Example({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const [submitted, setSubmitted] = useState<Values | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => {
          setSubmitted(values);
          onSubmit(values);
        })}
      >
        <Input<Values> name="email" label="Email" description="Use your work email" type="email" />
        <Button type="submit">Submit</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            setSubmitted(null);
          }}
        >
          Reset
        </Button>
        <output aria-label="Результат отправки">
          {submitted ? "Отправлено: " + submitted.email : "Форма ещё не отправлена"}
        </output>
      </form>
    </FormProvider>
  );
}
const meta = {
  title: "Examples/Input form",
  component: Example,
  tags: ["autodocs"],
  args: { onSubmit: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Интеграция Input с FormProvider, React Hook Form и Zod. Submit/Reset принадлежат этой форме, а не самому Input. Нажмите Submit с пустым email, исправьте значение и отправьте снова; Reset очищает поле, ошибку и результат. Пример не запускает действия автоматически.",
      },
      source: {
        code: 'const schema = z.object({ email: z.email() });\nconst form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });\n<FormProvider {...form}>\n  <form onSubmit={form.handleSubmit(onSubmit)}>\n    <Input name="email" label="Email" />\n    <Button type="submit">Submit</Button>\n  </form>\n</FormProvider>',
      },
    },
  },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {};
