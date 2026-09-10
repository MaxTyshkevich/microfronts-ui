import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const directory = "dist";
function readFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(folder, entry.name);
    return entry.isDirectory()
      ? readFiles(filePath)
      : [
          {
            name: path.relative(directory, filePath),
            content: fs.readFileSync(filePath),
          },
        ];
  });
}
const files = readFiles(directory);
const groups = {
  "ESM (all entries and shared chunks)": (file) => file.name.endsWith(".js"),
  "CommonJS (all entries and shared chunks)": (file) => file.name.endsWith(".cjs"),
  CSS: (file) => file.name.endsWith(".css"),
  Declarations: (file) => /\.d\.(ts|cts)$/.test(file.name),
  "Source maps": (file) => file.name.endsWith(".map"),
};
console.table(
  Object.entries(groups).map(([group, matches]) => {
    const selected = files.filter(matches);
    return {
      group,
      files: selected.length,
      bytes: selected.reduce((sum, file) => sum + file.content.length, 0),
      gzipBytes: selected.reduce((sum, file) => sum + gzipSync(file.content).length, 0),
    };
  }),
);
console.log(
  "gzipBytes sums separately compressed files. Runtime dependencies and Storybook are excluded.",
);
