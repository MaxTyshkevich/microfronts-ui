import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useForm, type FieldErrors } from "react-hook-form";
import { Input, type InputProps } from "./Input";

type Values = { email: string };
const exampleErrors: FieldErrors<Values> = {
  email: { type: "manual", message: "Введите корректный email" },
};
function FieldPreview({ args, error = false }: { args: InputProps<Values>; error?: boolean }) {
  const form = useForm<Values>({
    defaultValues: { email: "" },
    errors: error ? exampleErrors : undefined,
  });
  return <Input {...args} control={form.control} />;
}
const meta = {
  title: "Components/Input",
  component: Input<Values>,
  tags: ["autodocs"],
  args: {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "name@example.com",
    description: "Адрес для ответа",
  },
  render: (args, context) => <FieldPreview args={args} error={context.parameters.fieldError} />,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "28rem" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    name: {
      control: false,
      description: "Имя поля в React Hook Form; тип проверяется относительно значений формы.",
    },
    label: {
      control: "text",
      description: "Доступная подпись поля, связанная через htmlFor и id.",
    },
    description: {
      control: "text",
      description: "Подсказка. Её id включается в aria-describedby.",
    },
    placeholder: { control: "text", description: "Пример значения; не заменяет label." },
    type: { control: "select", options: ["text", "email", "password", "search", "tel", "url"] },
    disabled: {
      control: "boolean",
      description: "Запрещает ввод и исключает поле из отправляемого значения RHF.",
    },
    control: {
      control: false,
      table: { category: "React Hook Form" },
      description: "Передайте form.control либо оберните поле в FormProvider.",
    },
    rules: {
      control: false,
      table: { category: "React Hook Form" },
      description: "Правила RHF. Для Zod задайте resolver на уровне useForm.",
    },
    defaultValue: {
      control: false,
      table: { category: "React Hook Form" },
      description: "Обычно начальное значение задают через useForm.defaultValues.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Текстовое поле с label, подсказкой и ошибкой, подключённое к React Hook Form. Здесь показан только Input; кнопки отправки и сброса находятся в Examples/Input form. Hovered и Focused закреплены визуально и не перехватывают ввод на странице Docs. Для проверки настоящего фокуса используйте Tab в Default.",
      },
      source: {
        code: 'const form = useForm({ defaultValues: { email: "" } });\n<Input control={form.control} name="email" label="Email" />',
      },
    },
  },
} satisfies Meta<typeof Input<Values>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Обычное поле без ошибки. Наведите мышь, нажмите Tab или введите текст. Controls изменяют props самого Input.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox")).toBeEnabled();
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};
export const Hovered: Story = {
  parameters: {
    storyState: "hovered",
    docs: {
      description: {
        story:
          "Закреплённый вид :hover: граница использует токен ring. Состояние видно без наведения, включая Docs.",
      },
    },
  },
};
export const Focused: Story = {
  parameters: {
    storyState: "focused",
    docs: {
      description: {
        story:
          "Закреплённый вид клавиатурного :focus-visible: заметный контур вокруг поля. Это демонстрация оформления, а не программный перенос фокуса.",
      },
    },
  },
};
export const Error: Story = {
  parameters: {
    fieldError: true,
    docs: {
      description: {
        story:
          "Ошибка RHF задана сразу: красный контур, aria-invalid и текст ошибки. Поле не нужно отправлять, чтобы увидеть состояние.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Введите корректный email");
  },
};
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story: "Поле отключено: приглушено, недоступно для ввода и клавиатурной навигации.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox")).toBeDisabled();
  },
};
export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: {
    docs: {
      description: {
        story:
          "Обычное поле с тёмными токенами. Другие состояния можно проверить через переключатель Theme.",
      },
    },
  },
};
