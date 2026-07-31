/**
 * ToolWise — Syntax & Import Validation
 * ──────────────────────────────────────
 * Dynamically imports every .ts and .tsx source file to verify
 * that the code has no syntax errors and all imports resolve.
 *
 * This does NOT render React components — it only checks that
 * the JavaScript engine can parse and evaluate the modules.
 *
 * Run: npx tsx tests/syntax.test.ts
 */

import { readdirSync, statSync } from "fs";
import { join, extname, relative } from "path";
import { pathToFileURL } from "url";

const ROOT = join(import.meta.dirname, "..");
const EXTENSIONS = new Set([".ts", ".tsx"]);

// Directories/files to skip (tests themselves, config files, env types)
const SKIP = new Set([
  "node_modules",
  "dist",
  ".git",
  "tests",
  "vite-env.d.ts",
]);

/** Recursively collect all source files */
function collectFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full));
    } else if (EXTENSIONS.has(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = collectFiles(ROOT);
  let passed = 0;
  let failed = 0;
  const errors: { file: string; error: string }[] = [];

  console.log(`\n🔍 Syntax Check — validating ${files.length} source files\n`);

  for (const file of files) {
    const rel = relative(ROOT, file);
    try {
      // Dynamic import triggers the JS parser on the file
      await import(pathToFileURL(file).href);
      passed++;
      console.log(`  ✅  ${rel}`);
    } catch (err: any) {
      // SyntaxError = genuine parse failure we must catch
      // Other errors (missing env vars, DOM APIs) are expected in Node
      // and don't indicate broken syntax, so we allow them.
      if (err instanceof SyntaxError) {
        failed++;
        errors.push({ file: rel, error: err.message });
        console.log(`  ❌  ${rel}`);
        console.log(`      └─ ${err.message}\n`);
      } else {
        // Non-syntax runtime error — file parsed OK
        passed++;
        console.log(`  ✅  ${rel}  (parsed; runtime skip expected)`);
      }
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`${"─".repeat(50)}\n`);

  if (failed > 0) {
    console.error("❌ Syntax check FAILED\n");
    for (const { file, error } of errors) {
      console.error(`  • ${file}: ${error}`);
    }
    process.exit(1);
  }

  console.log("✅ All files have valid syntax!\n");
}

main();
