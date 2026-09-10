import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    button: "src/components/Button/Button.tsx",
    input: "src/components/Input/Input.tsx",
  },
  format: ["esm", "cjs"],
  banner: ({ format }) => ({
    js: format === "esm" ? 'import "./styles.css";' : 'require("./styles.css");',
  }),
  dts: true,
  clean: true,
  splitting: true,
  treeshake: {
    // Generated JS chunks follow the package's sideEffects contract.
    // Keep CSS and dependency side effects; drop redundant bare chunk imports.
    moduleSideEffects: (id) => !/^\.\/chunk-[\w-]+\.(?:js|cjs)$/.test(id),
  },
  onSuccess: "node scripts/finalize-build.mjs",
  minify: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "react-hook-form",
    "@base-ui/react",
    "class-variance-authority",
    "cn",
    "clsx",
    "tailwind-merge",
  ],
});
