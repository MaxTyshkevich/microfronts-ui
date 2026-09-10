import fs from "node:fs";
import postcss from "postcss";
import { relativeUnits } from "./relative-units.mjs";
const path = "dist/styles.css";
const result = await postcss([relativeUnits()]).process(fs.readFileSync(path, "utf8"), {
  from: path,
  to: path,
});
fs.writeFileSync(path, result.css);
