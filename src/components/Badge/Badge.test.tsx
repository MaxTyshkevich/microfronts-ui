import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { Badge } from "./Badge";
import { render } from "../../test/render";

test.each(["blue", "green", "amber"] as const)(
  "Badge renders %s tone and content",
  async (tone) => {
    await render(<Badge tone={tone}>Ready</Badge>);
    await expect.element(page.getByText("Ready")).toBeVisible();
    await expect.element(page.getByText("Ready")).toHaveClass("mf-badge-" + tone);
  },
);
