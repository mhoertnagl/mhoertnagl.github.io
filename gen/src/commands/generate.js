import { join, parse } from "path";
import { readFileSync, writeFileSync } from "fs";

export function generate() {
  const cwd = process.cwd();
  const filePath = join(cwd, "localeasy.json");
  const data = readFileSync(filePath);
}
