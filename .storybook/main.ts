import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { storyStatesVite } from "./story-states.mjs";
import { relativeUnits } from "../scripts/relative-units.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/docs/**/*.mdx", "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",

  viteFinal: async (config) => {
    config.optimizeDeps ??= {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      "@base-ui/react/separator",
    ];
    config.plugins ??= [];
    config.plugins.push(tailwindcss(), storyStatesVite());
    config.css = { ...config.css, postcss: { plugins: [relativeUnits()] } };

    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(dirname, "../src"),
    };

    return config;
  },
};
export default config;
