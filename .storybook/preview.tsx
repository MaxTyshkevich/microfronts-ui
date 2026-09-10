import type { Preview } from "@storybook/react-vite";
import "./styles.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Component color theme",
      toolbar: { title: "Theme", icon: "paintbrush", items: ["light", "dark"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <div
        data-story-state={context.parameters.storyState}
        className={context.globals.theme === "dark" ? "dark" : ""}
        style={{ colorScheme: context.globals.theme === "dark" ? "dark" : "light" }}
      >
        <div className="bg-background text-foreground p-6">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: "error" },
  },
};
export default preview;
