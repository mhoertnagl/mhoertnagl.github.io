import fs from "fs-extra";
import glob from "fast-glob";
import { join, parse } from "path";
import handlebars from "handlebars";
export async function generate() {
    const cwd = process.cwd();
    const srcDir = join(cwd, "src");
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
    console.log(files);
}
async function loadLayouts(srcDir) {
    const layouts = new Map();
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
