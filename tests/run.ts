/**
 * ToolWise — Test Runner
 * ──────────────────────
 * Orchestrates all test suites in sequence.
 * Each test file is an independent script that exits non-zero on failure.
 *
 * Run: npx tsx tests/run.ts
 */

import { execSync } from "child_process";
import { join } from "path";

const TESTS_DIR = import.meta.dirname;

const suites = [
  { name: "📂 Project Structure", file: "structure.test.ts" },
  { name: "🔎 TypeScript Types", file: "typecheck.test.ts" },
  { name: "🔍 Syntax Validation", file: "syntax.test.ts" },
];

let allPassed = true;

console.log("\n" + "═".repeat(60));
console.log("  🧪  ToolWise CI Test Suite");
console.log("═".repeat(60) + "\n");

for (const suite of suites) {
  console.log(`\n┌${"─".repeat(58)}┐`);
  console.log(`│  ${suite.name.padEnd(55)} │`);
  console.log(`└${"─".repeat(58)}┘`);

  try {
    execSync(`npx tsx ${join(TESTS_DIR, suite.file)}`, {
      cwd: join(TESTS_DIR, ".."),
      stdio: "inherit",
    });
  } catch {
    allPassed = false;
    console.error(`\n⛔ Suite "${suite.name}" FAILED — continuing...\n`);
  }
}

console.log("\n" + "═".repeat(60));
if (allPassed) {
  console.log("  ✅  All test suites passed!");
} else {
  console.log("  ❌  Some test suites failed. See output above.");
}
console.log("═".repeat(60) + "\n");

if (!allPassed) process.exit(1);
