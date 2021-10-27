import fs from "fs-extra";
import glob from "fast-glob";
import { join, parse } from "path";
import handlebars from "handlebars";
import renderer from "../renderer/renderer";
export async function generate() {
    const cwd = process.cwd();
    const srcDir = join(cwd, "src");
    const outDir = join(cwd, "docs");
    await fs.ensureDir(outDir);
    const layouts = await loadLayouts(srcDir);
    const articles = await createPages(srcDir, outDir, layouts);
    await createStartPage(srcDir, outDir, articles);
    await copyAssets(srcDir, outDir);
}
async function loadLayouts(srcDir) {
    const layouts = new TemplatesMap();
    const base = join(srcDir, "layouts");
    const files = await findFiles(base, "**/*.handlebars");
    for (const file of files) {
        const path = join(base, file);
        const template = await loadTemplate(path);
        layouts.set(parse(file).name, template);
    }
    return layouts;
}
async function createPages(srcDir, outDir, layouts) {
    const articleInfos = [];
    const srcBase = join(srcDir, "pages");
    const outBase = join(outDir, "pages");
    const pages = await findFiles(srcBase, "**/*.md");
    for (const page of pages) {
        const info = await createPage(srcBase, outBase, layouts, page);
        if (info) {
            articleInfos.push(info);
        }
    }
    return articleInfos;
}
async function createPage(srcBase, outBase, layouts, page) {
    const srcPath = join(srcBase, page);
    const contents = await fs.readFile(srcPath, "utf8");
    const article = renderer.render(contents);
    const layout = layouts.get(article.meta.layout);
    if (layout) {
        const pageFile = parse(page);
        const outFileName = `${pageFile.name}.html`;
        const outDirPath = join(outBase, pageFile.dir);
        const outPath = join(outDirPath, outFileName);
        const result = layout({ article });
        await fs.ensureDir(outDirPath);
        await fs.writeFile(outPath, result);
        const info = new ArticleInfo();
        info.path = join("pages", pageFile.dir, outFileName);
        info.meta = article.meta;
        return info;
    }
}
async function createStartPage(srcDir, outDir, articles) {
    const srcPath = join(srcDir, "index.handlebars");
    const outPath = join(outDir, "index.html");
    const template = await loadTemplate(srcPath);
    const result = template({ articles });
    await fs.writeFile(outPath, result);
}
async function copyAssets(srcDir, outDir) {
    const srcAssetsDir = join(srcDir, "assets");
    const outAssetsDir = join(outDir, "assets");
    await fs.copy(srcAssetsDir, outAssetsDir, {
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
    const contents = await fs.readFile(path, "utf8");
    return handlebars.compile(contents);
}
class TemplatesMap extends Map {
}
class ArticleInfo {
    path;
    meta;
}
