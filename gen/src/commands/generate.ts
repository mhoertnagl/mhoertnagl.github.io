import fs from "fs-extra";
import glob from "fast-glob";
import { join, parse } from "path";
import handlebars from "handlebars";

// const spinner = ora({
//   text: "Simulating some slow async task. What a Devimal Planet...",
//   spinner: "earth",
// }).start();
// spinner.succeed("Heavy task finished!\n");

export async function generate() {
  const cwd = process.cwd();
  const srcDir = join(cwd, "src");
  // const outDir = join(cwd, "docs");
  const layouts = await loadLayouts(srcDir);
  const layout = layouts.get("article");
  if (layout) {
    console.log(layout({ test: "hui" }));
  }

  const base = join(srcDir, "pages");
  const files = await glob("**/*.md", {
    cwd: base,
    onlyFiles: true,
  });

  // Read page contents
  // Compile (front-matter + markdown)

  // Read index.handlebars

  // Create HTML files

  console.log(files);

  // await copyAssets(srcDir, outDir);
}

async function loadLayouts(srcDir: string) {
  const layouts = new Map<string, HandlebarsTemplateDelegate>();
  const base = join(srcDir, "layouts");
  const files = await glob("**/*.handlebars", {
    cwd: base,
    onlyFiles: true,
  });
  for (const file of files) {
    const path = join(base, file);
    const contents = await fs.readFile(path, "utf8");
    const template = handlebars.compile(contents);
    layouts.set(parse(file).name, template);
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
