import fs from "fs-extra";
import glob from "fast-glob";
import { join, parse } from "path";
import handlebars from "handlebars";
import renderer from "../renderer/renderer";
import { PageInfo } from "../renderer/page";
export async function generate() {
    const cwd = process.cwd();
    const srcDir = join(cwd, "src");
    const outDir = join(cwd, "docs");
    await fs.ensureDir(outDir);
    const templates = await loadTemplates(srcDir);
    const articles = await createPages(srcDir, outDir, templates);
    await createStartPage(srcDir, outDir, articles);
    await copyAssets(srcDir, outDir);
}
async function loadTemplates(srcDir) {
    const templates = new TemplatesMap();
    const base = join(srcDir, "layouts");
    const layoutNames = await findFiles(base, "**/*.handlebars");
    for (const layoutName of layoutNames) {
        const path = join(base, layoutName);
        const template = await loadTemplate(path);
        templates.set(parse(layoutName).name, template);
    }
    return templates;
}
async function createPages(srcDir, outDir, templates) {
    const pageInfos = [];
    const srcBase = join(srcDir, "pages");
    const outBase = join(outDir, "pages");
    const pageNames = await findFiles(srcBase, "**/*.md");
    for (const pageName of pageNames) {
        const pageInfo = await createPage(srcBase, outBase, templates, pageName);
        pageInfos.push(pageInfo);
    }
    return pageInfos;
}
async function createPage(srcBase, outBase, templates, pageName) {
    const srcPath = join(srcBase, pageName);
    const source = await fs.readFile(srcPath, "utf8");
    const page = renderer.render(source);
    const layout = templates.get(page.meta.layout);
    if (layout === undefined) {
        throw new Error(`[${pageName}]: Layout [${page.meta.layout}] not found`);
    }
    const pageFile = parse(pageName);
    const outFileName = `${pageFile.name}.html`;
    const outDirPath = join(outBase, pageFile.dir);
    const outPath = join(outDirPath, outFileName);
    const contents = layout({ page });
    await fs.ensureDir(outDirPath);
    await fs.writeFile(outPath, contents);
    const info = new PageInfo();
    info.path = join("pages", pageFile.dir, outFileName);
    info.meta = page.meta;
    return info;
}
async function createStartPage(srcDir, outDir, pages) {
    const srcPath = join(srcDir, "index.handlebars");
    const outPath = join(outDir, "index.html");
    const template = await loadTemplate(srcPath);
    const contents = template({ pages });
    await fs.writeFile(outPath, contents);
}
async function copyAssets(srcDir, outDir) {
    const srcPath = join(srcDir, "assets");
    const outPath = join(outDir, "assets");
    await fs.copy(srcPath, outPath, {
        recursive: true,
        overwrite: true,
    });
}
function findFiles(base, pattern) {
    return glob(pattern, {
        cwd: base,
        onlyFiles: true,
    });
}
async function loadTemplate(path) {
    const source = await fs.readFile(path, "utf8");
    return handlebars.compile(source);
}
class TemplatesMap extends Map {
}