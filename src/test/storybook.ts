import { expect, type Page } from "@playwright/test";

export async function openStory(page: Page, id: string, theme: string, docs = false) {
  await page.goto(
    "/iframe.html?id=" + id + "&viewMode=" + (docs ? "docs" : "story") + "&globals=theme:" + theme,
  );
  await expect(page.locator(docs ? ".sbdocs-content" : "#storybook-root")).toBeVisible();
  // Remove transition timing from color comparisons; selectors and states remain real.
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
  });
  await page.mouse.move(0, 0);
}
