import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { relativeUnits } from "./scripts/relative-units.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright({}),
  instances: [{ browser: "chromium" as const }],
});
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        test: { name: "storybook", browser: browser() },
      },
      {
        plugins: [react(), tailwindcss()],
        resolve: { alias: { "@": path.join(dirname, "src") } },
        optimizeDeps: { include: ["@hookform/resolvers/zod", "zod", "@base-ui/react/separator"] },
        css: { postcss: { plugins: [relativeUnits()] } },
        test: {
          name: "components",
          include: ["src/components/**/*.test.tsx", "src/form/**/*.test.tsx"],
          browser: browser(),
        },
      },
    ],
  },
});
