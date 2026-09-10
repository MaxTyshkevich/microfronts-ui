import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Panel } from "./Panel";
import { Badge } from "../Badge/Badge";

const meta = {
  title: "Components/Panel",
  component: Panel,
  tags: ["autodocs"],
  args: { title: "Status", children: "Panel content" },
  parameters: {
    docs: {
      description: {
        component:
          "Semantic section with an h2 heading. mf-* styles are supplied by the consuming application.",
      },
    },
  },
} satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Status", level: 2 })).toBeVisible();
    await expect(canvas.getByText("Panel content")).toBeVisible();
  },
};
export const WithBadge: Story = { args: { children: <Badge tone="green">Ready</Badge> } };
export const Dark: Story = { globals: { theme: "dark" } };
