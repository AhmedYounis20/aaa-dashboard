#!/usr/bin/env node
/**
 * Convert deep relative imports (../../..) under selected roots to @/ aliases.
 */
import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2);
if (!roots.length) {
  console.error("Usage: node scripts/codemod-alias-imports.mjs <dir>...");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let changedFiles = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    let text = fs.readFileSync(file, "utf8");
    const dir = path.dirname(file);
    const re = /from\s+["']((?:\.\.\/)+[^"']+)["']/g;
    let match;
    const replacements = [];
    while ((match = re.exec(text)) !== null) {
      const rel = match[1];
      // Only rewrite 2+ levels deep
      if (!rel.startsWith("../../")) continue;
      const abs = path.normalize(path.join(dir, rel)).replace(/\\/g, "/");
      if (!abs.startsWith("src/") && !abs.startsWith("src\\")) continue;
      const normalized = abs.replace(/\\/g, "/");
      if (!normalized.startsWith("src/")) continue;
      const alias = "@/" + normalized.slice("src/".length);
      replacements.push({ from: match[0], to: match[0].replace(rel, alias) });
    }
    if (!replacements.length) continue;
    for (const { from, to } of replacements) {
      text = text.split(from).join(to);
    }
    fs.writeFileSync(file, text);
    changedFiles++;
  }
}
console.log(`Updated ${changedFiles} files`);
