/*
  Update relative imports to use aliases:
  - interfaces -> @/interfaces
  - apis -> @/apis
  - theme -> @/theme
*/
const fs = require("fs");
const path = require("path");

/** @param {string} dir */
function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (
      entry.isFile() &&
      (full.endsWith(".ts") || full.endsWith(".tsx"))
    ) {
      yield full;
    }
  }
}

/** @param {string} content */
function replaceImports(content) {
  let updated = content;
  const patterns = [
    {
      re: /from\s+"(?:\.\.?\/)+[^"']*interfaces\//g,
      rep: 'from "@/interfaces/',
    },
    {
      re: /from\s+"(?:\.\.?\/)+[^"']*interfaces"/g,
      rep: 'from "@/interfaces"',
    },
    { re: /from\s+"(?:\.\.?\/)+[^"']*apis\//g, rep: 'from "@/apis/' },
    { re: /from\s+"(?:\.\.?\/)+[^"']*apis"/g, rep: 'from "@/apis"' },
    { re: /from\s+"(?:\.\.?\/)+[^"']*theme\//g, rep: 'from "@/theme/' },
    { re: /from\s+"(?:\.\.?\/)+[^"']*theme"/g, rep: 'from "@/theme"' },
  ];
  for (const { re, rep } of patterns) {
    updated = updated.replace(re, rep);
  }
  return updated;
}

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");
let changedCount = 0;
for (const file of walk(src)) {
  const original = fs.readFileSync(file, "utf8");
  const updated = replaceImports(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    changedCount++;
    console.log("updated", path.relative(root, file));
  }
}
console.log(`Done. Files updated: ${changedCount}`);
