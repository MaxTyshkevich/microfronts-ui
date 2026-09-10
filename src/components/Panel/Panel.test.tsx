import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { Panel } from "./Panel";
import { Badge } from "../Badge/Badge";
import { render } from "../../test/render";

test("Panel renders its heading and nested content", async () => {
  await render(
    <Panel title="Status">
      <Badge tone="green">Ready</Badge>
    </Panel>,
  );
  await expect.element(page.getByRole("heading", { name: "Status", level: 2 })).toBeVisible();
  await expect.element(page.getByText("Ready")).toHaveClass("mf-badge-green");
});
