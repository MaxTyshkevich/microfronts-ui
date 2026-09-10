import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { act } from "react";
import { render } from "../../test/render";
import { Button } from "./Button";

test("Button responds to real click and keyboard; disabled button is skipped", async () => {
  const onClick = vi.fn();
  const onDisabledClick = vi.fn();
  await render(
    <>
      <Button onClick={onClick}>Continue</Button>
      <Button disabled onClick={onDisabledClick}>
        Unavailable
      </Button>
      <a href="#next">Next</a>
    </>,
  );
  await act(async () => {
    await page.getByRole("button", { name: "Continue" }).click();
  });
  expect(onClick).toHaveBeenCalledTimes(1);
  await act(async () => {
    await userEvent.keyboard("{Enter}");
  });
  expect(onClick).toHaveBeenCalledTimes(2);
  await expect.element(page.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  await act(async () => {
    await userEvent.tab();
  });
  await expect.element(page.getByRole("link", { name: "Next" })).toHaveFocus();
  expect(onDisabledClick).not.toHaveBeenCalled();
});

for (const theme of ["light", "dark"]) {
  test(theme + ": Button applies theme and real hover styles", async () => {
    await render(
      <div className={theme}>
        <div className="bg-background text-foreground p-6">
          <Button>Continue</Button>
        </div>
      </div>,
    );
    const button = page.getByRole("button", { name: "Continue" });
    const element = button.element();
    const container = element.parentElement!;
    expect(getComputedStyle(container).backgroundColor).toBe(
      theme === "dark" ? "oklch(0.145 0 0)" : "oklch(1 0 0)",
    );
    await userEvent.hover(container, { position: { x: 1, y: 1 } });
    const initial = getComputedStyle(element).backgroundColor;
    await button.hover();
    await expect.poll(() => element.matches(":hover")).toBe(true);
    await expect.poll(() => getComputedStyle(element).backgroundColor).not.toBe(initial);
  });
}
