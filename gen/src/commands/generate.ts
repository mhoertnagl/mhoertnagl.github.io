import fs from "fs-extra";
import { join, parse } from "path";

// const spinner = ora({
//   text: "Simulating some slow async task. What a Devimal Planet...",
//   spinner: "earth",
// }).start();
// spinner.succeed("Heavy task finished!\n");

export async function generate() {
  // Read and cache all layouts
  // Read all pages
  // Read index.handlebars
  // Generate files
  const cwd = process.cwd();
  const srcDir = join(cwd, "src");

  const layouts = await loadLayouts(srcDir);

  // const outDir = join(cwd, "docs");
  // await copyAssets(srcDir, outDir);
  console.log("Test");
}

async function loadLayouts(srcDir: string) {
  const layouts = new Map<string, string>();
  const layoutsDir = join(srcDir, "layouts");
  const layoutFiles = await fs.readdir(layoutsDir);
  for (const layoutFile of layoutFiles) {
    const layoutPath = join(layoutsDir, layoutFile);
    const contents = await fs.readFile(layoutPath, "utf8");
    layouts.set(parse(layoutFile).name, contents);
  }
  return layouts;
}

// async function copyAssets(srcDir: string, outDir: string) {
//   const srcAssetsDir = join(srcDir, "assets");
//   const outAssetsDir = join(outDir, "assets");
//   await fs.copy(srcAssetsDir, outAssetsDir, {
//     recursive: true,
//     overwrite: true,
//   });
// }
