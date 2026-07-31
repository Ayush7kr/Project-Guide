/**
 * ToolWise — Project Structure Integrity Check
 * ─────────────────────────────────────────────
 * Validates that all critical files and directories exist.
 * Catches accidental deletions or missing config before merge.
 *
 * Run: npx tsx tests/structure.test.ts
 */

import { existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");

/** Files and directories that MUST exist for the project to function */
const REQUIRED = [
  // Config
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "index.html",

  // Entry points
  "index.tsx",
  "App.tsx",
  "types.ts",

  // Core directories
  "components",
  "services",
  "lib",

  // Key components
  "components/InputForm.tsx",
  "components/ResultsPage.tsx",
  "components/SuccessPath.tsx",
  "components/ArchitectChat.tsx",
  "components/Dashboard.tsx",

  // Services
  "services/geminiService.ts",
  "lib/supabaseClient.ts",
];

function main() {
  let passed = 0;
  let failed = 0;
  const missing: string[] = [];

  console.log(
    `\n📂 Structure Check — verifying ${REQUIRED.length} required paths\n`
  );

  for (const rel of REQUIRED) {
    const full = join(ROOT, rel);
    if (existsSync(full)) {
      passed++;
      console.log(`  ✅  ${rel}`);
    } else {
      failed++;
      missing.push(rel);
      console.log(`  ❌  ${rel}  — MISSING`);
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`  Results: ${passed} passed, ${failed} missing`);
  console.log(`${"─".repeat(50)}\n`);

  if (failed > 0) {
    console.error("❌ Structure check FAILED — missing files:\n");
    for (const f of missing) {
      console.error(`  • ${f}`);
    }
    process.exit(1);
  }

  console.log("✅ All required files and directories are present!\n");
}

main();
