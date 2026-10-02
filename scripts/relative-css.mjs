import fs from "node:fs";
import postcss from "postcss";
import { relativeUnits } from "./relative-units.mjs";
const path = "dist/styles.css";
const result = await postcss([relativeUnits()]).process(fs.readFileSync(path, "utf8"), {
  from: path,
  to: path,
});
// Components must not reset their host page when loaded as a remote.
// Keep the immutable shadcn source theme intact and separate its global base
// rules together with Preflight in the generated package.
const reset = postcss.root();
reset.append(postcss.atRule({ name: "layer", params: "theme, base, components, utilities" }));
result.root.walkAtRules("layer", (rule) => {
  if (rule.params.trim() === "base" && rule.nodes) {
    reset.append(rule.clone());
    rule.remove();
  }
});
fs.writeFileSync(path, result.root.toString());
fs.writeFileSync("dist/reset.css", reset.toString());
