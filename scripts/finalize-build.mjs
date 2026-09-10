import fs from "node:fs";
import path from "node:path";

// tsup 8.5 appends a source-map link after Rollup has already emitted one.
// Remove only duplicate trailing links; executable code and mappings stay intact.
for (const name of fs.readdirSync("dist")) {
  if (!/\.(js|cjs)$/.test(name)) continue;
  const file = path.join("dist", name);
  const code = fs.readFileSync(file, "utf8");
  const suffix = code.match(/(?:\/\/# sourceMappingURL=[^\r\n]+\s*){2,}$/);
  if (!suffix) continue;
  const links = [...suffix[0].matchAll(/sourceMappingURL=([^\s]+)/g)].map((match) => match[1]);
  if (!links.every((link) => link === name + ".map")) {
    throw new Error("Conflicting source maps in " + name);
  }
  fs.writeFileSync(file, code.slice(0, suffix.index) + "//# sourceMappingURL=" + links[0] + "\n");
}
