#!/usr/bin/env node
/**
 * Fails if t("...") / t('...') keys used in src are missing from en or ar locales,
 * or if either locale JSON has duplicate keys.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcRoot = path.join(root, "src");
const enPath = path.join(srcRoot, "locales/en/translation.json");
const arPath = path.join(srcRoot, "locales/ar/translation.json");

const IGNORE_PREFIXES = [
  // dynamic / non-catalog keys
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "locales") continue;
      walk(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function findDuplicateKeys(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const keys = [...text.matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1]);
  const counts = new Map();
  for (const key of keys) {
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n > 1).map(([k]) => k);
}

function loadLocaleKeys(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  // Prefer unique last-wins parse via JSON (duplicates collapse); also report dups separately
  const parsed = JSON.parse(raw);
  return new Set(Object.keys(parsed));
}

function collectUsedKeys(files) {
  const keys = new Set();
  // Match t("key") / t('key') / i18n.t("key") — skip template literals and nested calls
  const re = /(?:^|[^\w.])(?:i18n\.)?t\(\s*["']([^"']+)["']/g;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    let match;
    while ((match = re.exec(text)) !== null) {
      const key = match[1];
      if (!key || key.includes("${")) continue;
      if (IGNORE_PREFIXES.some((p) => key.startsWith(p))) continue;
      // Skip likely non-i18n single-char / empty
      if (key.length < 2) continue;
      keys.add(key);
    }
  }
  return keys;
}

const enDups = findDuplicateKeys(enPath);
const arDups = findDuplicateKeys(arPath);
const enKeys = loadLocaleKeys(enPath);
const arKeys = loadLocaleKeys(arPath);
const used = collectUsedKeys(walk(srcRoot));

const missingEn = [...used].filter((k) => !enKeys.has(k)).sort();
const missingAr = [...used].filter((k) => !arKeys.has(k)).sort();
const onlyEn = [...enKeys].filter((k) => !arKeys.has(k)).sort();
const onlyAr = [...arKeys].filter((k) => !enKeys.has(k)).sort();

let failed = false;

function report(title, items) {
  if (!items.length) return;
  failed = true;
  console.error(`\n${title} (${items.length}):`);
  for (const item of items.slice(0, 80)) {
    console.error(`  - ${item}`);
  }
  if (items.length > 80) {
    console.error(`  … and ${items.length - 80} more`);
  }
}

report("Duplicate keys in en/translation.json", enDups);
report("Duplicate keys in ar/translation.json", arDups);
report("Used t() keys missing from en", missingEn);
report("Used t() keys missing from ar", missingAr);

// Sync gaps between locales are warnings that also fail CI (practical integrity)
report("Keys present in en but missing in ar", onlyEn);
report("Keys present in ar but missing in en", onlyAr);

if (failed) {
  console.error("\ni18n key check failed.");
  process.exit(1);
}

console.log(
  `i18n key check passed (${used.size} used keys; en=${enKeys.size}, ar=${arKeys.size}).`
);
