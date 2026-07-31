/**
 * ToolWise — TypeScript Type Check Runner
 * ────────────────────────────────────────
 * Programmatically invokes `tsc --noEmit` and reports results.
 * This is the test-harness wrapper; the actual checking is done
 * by the TypeScript compiler.
 *
 * Run: npx tsx tests/typecheck.test.ts
 */

import { execSync } from "child_process";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");

function main() {
  console.log("\n🔎 Type Check — running tsc --noEmit\n");

  try {
    execSync("npx tsc --noEmit --pretty", {
      cwd: ROOT,
      stdio: "pipe",
      encoding: "utf-8",
    });

    console.log("✅ TypeScript: zero type errors!\n");
  } catch (err: any) {
    const output: string = err.stdout || err.stderr || "";

    // Count errors
    const errorLines = output
      .split("\n")
      .filter((line: string) => line.includes("error TS"));
    const errorCount = errorLines.length;

    console.error(`❌ TypeScript found ${errorCount} type error(s):\n`);
    console.error(output);
    process.exit(1);
  }
}

main();
