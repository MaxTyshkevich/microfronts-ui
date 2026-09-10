import { expect, test } from "@playwright/test";
import { openStory } from "../../test/storybook";

for (const theme of ["light", "dark"]) {
  test.describe("Input / " + theme, () => {
    test("Поле показывается без кнопок, а hover и focus совпадают с живыми состояниями", async ({
      page,
    }) => {
      let hoveredColor = "";
      await test.step("Открыть Default и проверить отсутствие кнопок формы", async () => {
        await openStory(page, "components-input--default", theme);
        await expect(page.locator("#storybook-root button")).toHaveCount(0);
        await expect(page.getByRole("textbox")).toHaveValue("");
      });
      await test.step("Навести мышь и проверить изменение границы", async () => {
        const input = page.getByRole("textbox");
        const before = await input.evaluate((el) => getComputedStyle(el).borderColor);
        await input.hover();
        await expect
          .poll(() => input.evaluate((el) => getComputedStyle(el).borderColor))
          .not.toBe(before);
        hoveredColor = await input.evaluate((el) => getComputedStyle(el).borderColor);
      });
      await test.step("Сравнить закреплённый Hovered с настоящим наведением", async () => {
        await openStory(page, "components-input--hovered", theme);
        await expect(page.getByRole("textbox")).toHaveCSS("border-color", hoveredColor);
      });
      await test.step("Проверить реальный Tab и закреплённый Focused", async () => {
        await openStory(page, "components-input--default", theme);
        await page.keyboard.press("Tab");
        await expect(page.getByRole("textbox")).toBeFocused();
        await expect(page.getByRole("textbox")).toHaveCSS("outline-style", "solid");
        await openStory(page, "components-input--focused", theme);
        await expect(page.getByRole("textbox")).toHaveCSS("outline-style", "solid");
      });
    });
    test("Ошибка видна сразу, disabled запрещает ввод", async ({ page }) => {
      await test.step("Проверить текст ошибки и связь ARIA", async () => {
        await openStory(page, "components-input--error", theme);
        await expect(page.getByRole("alert")).toHaveText("Введите корректный email");
        const errorId = await page.getByRole("alert").getAttribute("id");
        await expect(page.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
        await expect(page.getByRole("textbox")).toHaveAttribute(
          "aria-describedby",
          new RegExp(errorId!),
        );
      });
      await test.step("Проверить отключённое поле", async () => {
        await openStory(page, "components-input--disabled", theme);
        await expect(page.getByRole("textbox")).toBeDisabled();
        await page.keyboard.press("Tab");
        await expect(page.getByRole("textbox")).not.toBeFocused();
      });
    });
    test("Docs одновременно показывает разные состояния без запуска play", async ({
      page,
    }, info) => {
      await openStory(page, "components-input--docs", theme, true);
      const story = (state: string) => page.locator("#story--components-input--" + state);
      await expect(story("default").getByRole("textbox")).toBeVisible();
      const normal = await story("default")
        .getByRole("textbox")
        .evaluate((el) => getComputedStyle(el).borderColor);
      await expect
        .poll(() =>
          story("hovered")
            .getByRole("textbox")
            .evaluate((el) => getComputedStyle(el).borderColor),
        )
        .not.toBe(normal);
      await expect(story("focused").getByRole("textbox")).toHaveCSS("outline-style", "solid");
      await expect(story("error").getByRole("alert")).toBeVisible();
      await expect(story("disabled").getByRole("textbox")).toBeDisabled();
      await expect(page.locator(".docs-story button")).toHaveCount(0);
      await info.attach("Input Docs " + theme, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    });
  });
}
