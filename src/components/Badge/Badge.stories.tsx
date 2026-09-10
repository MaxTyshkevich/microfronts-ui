import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Ready", tone: "blue" },
  parameters: {
    docs: {
      description: {
        component: "Legacy badge: mf-* styles are supplied by the consuming application.",
      },
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ready")).toBeVisible();
    await expect(canvas.getByText("Ready")).toHaveClass("mf-badge-blue");
  },
};
export const Green: Story = { args: { tone: "green" } };
export const Amber: Story = { args: { tone: "amber" } };
export const Dark: Story = { globals: { theme: "dark" } };
