import { expect, test } from "@playwright/test";
import { openStory } from "../../test/storybook";

for (const theme of ["light", "dark"]) {
  test.describe("Button / " + theme, () => {
    test("Hovered и Focused показывают реальные стили кнопки", async ({ page }) => {
      await openStory(page, "components-button--default", theme);
      const button = page.getByRole("button", { name: "Continue", exact: true });
      const normal = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
      await test.step("Проверить настоящее наведение мыши", async () => {
        await button.hover();
        await expect
          .poll(() => button.evaluate((el) => getComputedStyle(el).backgroundColor))
          .not.toBe(normal);
      });
      const hovered = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
      await test.step("Проверить закреплённые Hovered и Focused", async () => {
        await openStory(page, "components-button--hovered", theme);
        await expect(button).toHaveCSS("background-color", hovered);
        await openStory(page, "components-button--focused", theme);
        await expect(button).toHaveCSS("outline-style", "solid");
      });
      await test.step("Проверить клавиатурный фокус в Default", async () => {
        await openStory(page, "components-button--default", theme);
        await page.keyboard.press("Tab");
        await expect(button).toBeFocused();
      });
    });
    test("Docs показывает hover, focus и ошибку независимо друг от друга", async ({ page }) => {
      await openStory(page, "components-button--docs", theme, true);
      const button = (state: string) =>
        page
          .locator("#story--components-button--" + state)
          .getByRole("button", { name: "Continue" });
      await expect(button("default")).toBeVisible();
      const normal = await button("default").evaluate((el) => getComputedStyle(el).backgroundColor);
      await expect
        .poll(() => button("hovered").evaluate((el) => getComputedStyle(el).backgroundColor))
        .not.toBe(normal);
      await expect(button("focused")).toHaveCSS("outline-style", "solid");
      await expect(button("error")).toHaveAttribute("aria-invalid", "true");
      await expect(button("disabled")).toBeDisabled();
    });
  });
}
