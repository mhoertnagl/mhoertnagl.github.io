import fs from "fs-extra";
import glob from "fast-glob";
import { join, parse } from "path";
import handlebars from "handlebars";
import renderer from "../renderer/renderer";
import Page from "../renderer/page";
import readingTime from "reading-time";
import "../helpers/formatDate";

export async function generate() {
  const cwd = process.cwd();
  const srcDir = join(cwd, "src");
  const outDir = join(cwd, "docs");
  await fs.ensureDir(outDir);
  const templates = await loadTemplates(srcDir);
  const pages = await createPages(srcDir, outDir, templates);
  await createStartPage(srcDir, outDir, pages);
  await copyAssets(srcDir, outDir);
}

// TODO: lazy template loading.
async function loadTemplates(srcDir: string) {
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

async function createPages(
  srcDir: string,
  outDir: string,
  templates: TemplatesMap
) {
  const pages: Page[] = [];
  const srcBase = join(srcDir, "pages");
  const outBase = join(outDir, "pages");
  const pageNames = await findFiles(srcBase, "**/*.md");
  for (const pageName of pageNames) {
    const page = await createPage(srcBase, outBase, templates, pageName);
    pages.push(page);
  }
  pages.sort((a, b) => {
    const da = a.meta.date;
    const db = b.meta.date;
    return da < db ? 1 : da > db ? -1 : 0;
  });
  return pages;
}

async function createPage(
  srcBase: string,
  outBase: string,
  templates: TemplatesMap,
  pageName: string
) {
  const srcPath = join(srcBase, pageName);
  const markdown = await fs.readFile(srcPath, "utf8");
  const page = renderer.render(markdown);
  const layout = templates.get(page.meta.layout);

  if (layout === undefined) {
    throw new Error(`[${pageName}]: Layout [${page.meta.layout}] not found`);
  }

  const pageFile = parse(pageName);
  const outFileName = `${pageFile.name}.html`;

  page.path = join("pages", pageFile.dir, outFileName);
  page.readTime = readingTime(markdown);

  const html = layout({ page });

  const outDirPath = join(outBase, pageFile.dir);
  const outPath = join(outDirPath, outFileName);

  await fs.ensureDir(outDirPath);
  await fs.writeFile(outPath, html);

  return page;
}

async function createStartPage(srcDir: string, outDir: string, pages: Page[]) {
  const srcPath = join(srcDir, "index.handlebars");
  const outPath = join(outDir, "index.html");
  const template = await loadTemplate(srcPath);
  const contents = template({ pages });
  await fs.writeFile(outPath, contents);
}

async function copyAssets(srcDir: string, outDir: string) {
  const srcPath = join(srcDir, "assets");
  const outPath = join(outDir, "assets");
  await fs.copy(srcPath, outPath, {
    recursive: true,
    overwrite: true,
  });
}

function findFiles(base: string, pattern: string) {
  return glob(pattern, {
    cwd: base,
    onlyFiles: true,
  });
}

// TODO: lazy template loading.
async function loadTemplate(path: string) {
  const source = await fs.readFile(path, "utf8");
  return handlebars.compile(source);
}

class TemplatesMap extends Map<string, HandlebarsTemplateDelegate<any>> {}
