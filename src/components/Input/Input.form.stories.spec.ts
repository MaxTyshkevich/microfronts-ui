import { expect, test } from "@playwright/test";
import { openStory } from "../../test/storybook";

test("Форма: ошибка → исправление → отправка → сброс", async ({ page }) => {
  await openStory(page, "examples-input-form--interactive", "light");
  const input = page.getByRole("textbox", { name: "Email" });
  await test.step("Отправить пустую форму и увидеть ошибку Zod", async () => {
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText("Enter a valid email");
    await expect(input).toBeFocused();
  });
  await test.step("Ввести корректный email и отправить форму", async () => {
    await input.fill("hello@example.com");
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByRole("status", { name: "Результат отправки" })).toHaveText(
      "Отправлено: hello@example.com",
    );
  });
  await test.step("Reset возвращает форму в начальное состояние", async () => {
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(input).toHaveValue("");
    await expect(page.getByRole("status", { name: "Результат отправки" })).toHaveText(
      "Форма ещё не отправлена",
    );
  });
});
