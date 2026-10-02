import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire, registerHooks } from "node:module";
import { build } from "esbuild";
import postcss from "postcss";

const require = createRequire(import.meta.url);
const runtimeExternals = [
  "react",
  "react-dom",
  "react-hook-form",
  "@base-ui/react",
  "cn",
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
];
// Node has no CSS loader. Check real bundler extraction before loading JS exports.
for (const entry of ["@microfronts/ui", "@microfronts/ui/button", "@microfronts/ui/input"]) {
  const result = await build({
    stdin: {
      contents: `import * as kit from "${entry}"; console.log(kit);`,
      resolveDir: process.cwd(),
    },
    bundle: true,
    write: false,
    outdir: "dist/consumer-check",
    format: "esm",
    external: runtimeExternals,
  });
  assert.equal(result.warnings.length, 0, `Bundler warnings for ${entry}`);
  const css = result.outputFiles.find((file) => file.path.endsWith(".css"));
  assert.ok(css?.text.includes("--background"), `Missing automatic CSS for ${entry}`);
  postcss.parse(css.text).walkAtRules("layer", (rule) => {
    assert.ok(rule.params.trim() !== "base" || !rule.nodes, `Unexpected reset in ${entry}`);
  });
}
const hooks = registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".css")) return { format: "module", source: "", shortCircuit: true };
    return nextLoad(url, context);
  },
});
const root = await import("@microfronts/ui");
const cjs = require("@microfronts/ui");
assert.deepEqual(Object.keys(root).sort(), ["Badge", "Button", "Input", "Panel"]);
for (const [entry, name] of [
  ["button", "Button"],
  ["input", "Input"],
]) {
  const direct = await import("@microfronts/ui/" + entry);
  assert.deepEqual(Object.keys(direct), [name]);
  assert.equal(root[name], direct[name]);
  assert.equal(cjs[name], require("@microfronts/ui/" + entry)[name]);
}
assert.throws(() => require.resolve("@microfronts/ui/shared/ui/shadcn/button"), {
  code: "ERR_PACKAGE_PATH_NOT_EXPORTED",
});
const cssPath = require.resolve("@microfronts/ui/styles.css");
postcss.parse(fs.readFileSync(cssPath, "utf8")).walkDecls((decl) => {
  assert.ok(!/\dpx\b/.test(decl.value), "Absolute unit in " + decl.toString());
});
hooks.deregister();

const cssText = fs.readFileSync(cssPath, "utf8");
postcss.parse(cssText).walkAtRules("layer", (rule) => {
  assert.ok(
    rule.params.trim() !== "base" || !rule.nodes,
    "Global base rules leaked into component CSS",
  );
});
const resetText = fs.readFileSync(require.resolve("@microfronts/ui/reset.css"), "utf8");
assert.ok(resetText.includes("box-sizing"), "Missing Preflight in explicit reset");
assert.ok(resetText.includes("body"), "Missing global theme defaults in explicit reset");
assert.ok(!resetText.includes("--tw-shadow:"), "Component utilities leaked into reset");
assert.ok(!cssText.includes(".p-6{"), "Storybook decorator padding leaked into package CSS");
assert.ok(!cssText.includes("data-story-state"), "Storybook state aliases leaked into package CSS");
for (const name of fs.readdirSync("dist")) {
  if (!/\.(js|cjs)$/.test(name)) continue;
  const code = fs.readFileSync("dist/" + name, "utf8");
  const links = [...code.matchAll(/sourceMappingURL=([^\s]+)/g)];
  assert.equal(links.length, 1, "Expected one source map link in " + name);
  assert.equal(links[0][1], name + ".map");
  const map = JSON.parse(fs.readFileSync("dist/" + name + ".map", "utf8"));
  assert.equal(map.version, 3);
  assert.equal(typeof map.mappings, "string");
}

const buttonOnly = await build({
  stdin: {
    contents: 'import { Button } from "@microfronts/ui"; console.log(Button);',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  outdir: "dist/consumer-check",
  format: "esm",
  external: runtimeExternals,
  metafile: true,
});
assert.equal(buttonOnly.warnings.length, 0);
for (const output of Object.values(buttonOnly.metafile.outputs)) {
  assert.ok(
    !output.imports.some((item) => item.path === "react-hook-form"),
    "Button-only import retains form runtime",
  );
}
assert.ok(
  buttonOnly.outputFiles.some((file) => file.path.endsWith(".css")),
  "Tree shaking dropped Button CSS",
);
console.log(
  "Automatic CSS bundling, ESM/CJS root and direct imports, private exports, relative CSS: passed",
);
