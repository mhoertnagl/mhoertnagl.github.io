import fs from "fs-extra";
import glob from "fast-glob";
import { join, parse } from "path";
import handlebars from "handlebars";
import renderer from "../renderer/renderer";
export async function generate() {
    const cwd = process.cwd();
    const srcDir = join(cwd, "src");
    const outDir = join(cwd, "docs");
    const layouts = await loadLayouts(srcDir);
    const srcBase = join(srcDir, "pages");
    const outBase = join(outDir, "pages");
    const pages = await glob("**/*.md", {
        cwd: srcBase,
        onlyFiles: true,
    });
    for (const page of pages) {
        const srcPath = join(srcBase, page);
        const contents = await fs.readFile(srcPath, "utf8");
        const article = renderer.render(contents);
        const layout = layouts.get(article.meta.layout);
        if (layout) {
            const outDirPath = join(outBase, parse(page).dir);
            const outPath = join(outDirPath, `${parse(page).name}.html`);
            const result = layout({ article });
            await fs.ensureDir(outDirPath);
            await fs.writeFile(outPath, result);
        }
    }
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
