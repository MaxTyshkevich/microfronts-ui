import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Continue" },
  argTypes: {
    children: { control: "text", description: "Текст кнопки; иконке без текста нужен aria-label." },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
      description: "Смысловой вариант оформления.",
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean", description: "Отключает активацию и клавиатурный фокус." },
    error: { control: "boolean", description: "Включает aria-invalid и контур ошибки." },
    onClick: { action: "clicked", description: "Событие активации мышью или клавиатурой." },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Кнопка на Base UI/shadcn. Для отправки формы задайте type=submit. Hovered и Focused показывают закреплённое оформление; живые состояния проверяются мышью и клавишей Tab в Default.",
      },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Обычная кнопка. Нажатия видны в Actions; история не кликает автоматически.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button")).toBeEnabled();
  },
};
export const Hovered: Story = {
  parameters: {
    storyState: "hovered",
    docs: {
      description: {
        story:
          "Закреплённый :hover, без необходимости держать мышь над кнопкой. Фон отличается от Default.",
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
          "Закреплённый клавиатурный контур :focus-visible. Реальная клавиатурная активация проверяется Playwright.",
      },
    },
  },
};
export const Error: Story = {
  args: { error: true },
  parameters: {
    docs: {
      description: {
        story:
          "Контур ошибки и aria-invalid. Текстовое объяснение ошибки должен предоставлять контекст формы.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  },
};
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: { description: { story: "Кнопка не активируется и пропускается при Tab." } },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button")).toBeDisabled();
  },
};
export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { docs: { description: { story: "Обычный вариант с тёмными токенами." } } },
};
