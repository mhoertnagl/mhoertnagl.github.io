import fs from "fs-extra";
import { join, parse } from "path";
import handlebars from "handlebars";
import { minify } from "html-minifier-terser";
import LayoutsCache from "./layouts-cache";
import Page from "./renderer/page";
import Renderer from "./renderer/renderer";
import "./helpers/formatDate";
import findFiles from "../utils/find-files";

export default class Generator {
  private readonly srcRoot: string;
  private readonly outRoot: string;
  private readonly pages: Page[];
  private readonly renderer: Renderer;
  private readonly cache: LayoutsCache;

  private readonly minificationOptions = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  };

  constructor(srcRoot: string, outRoot: string) {
    this.srcRoot = srcRoot;
    this.outRoot = outRoot;
    this.pages = [];
    this.renderer = new Renderer();
    this.cache = new LayoutsCache(join(srcRoot, "layouts"));
  }

  async generateAll() {
    // Make sure the output directory exists.
    await fs.ensureDir(this.outRoot);
    await this.generatePages();
    await this.generateIndex();
    await this.copyPublic();
  }

  private async generatePages() {
    const mdRoot = join(this.srcRoot, "pages");
    const mdSubPaths = await findFiles(mdRoot, "**/*.md");
    await this.generatePagesForMdFiles(mdSubPaths);
    this.sortPagesByDateDesc();
  }

  private async generatePagesForMdFiles(mdSubPaths: string[]) {
    for (const mdSubPath of mdSubPaths) {
      this.pages.push(await this.generatePageForMdFile(mdSubPath));
    }
  }

  private async generatePageForMdFile(mdSubPath: string) {
    const page = await this.readPageMarkdown(mdSubPath);
    const html = await this.renderPage(page);
    await this.writePage(page, html);
    return page;
  }

  private async readPageMarkdown(mdSubPath: string) {
    const mdPath = join(this.srcRoot, "pages", mdSubPath);
    const md = await fs.readFile(mdPath, "utf8");
    const page = this.renderer.render(md);
    const mdPathParse = parse(mdSubPath);
    // TODO: ugly...
    page.filename = `${mdPathParse.name}.html`;
    page.dir = join("pages", mdPathParse.dir);
    page.path = join(page.dir, page.filename);
    return page;
  }

  private async renderPage(page: Page) {
    const layout = await this.cache.findLayout(page.meta.layout);
    const html = layout({ page });
    return await minify(html, this.minificationOptions);
  }

  private async writePage(page: Page, html: string) {
    await fs.ensureDir(join(this.outRoot, page.dir));
    await fs.writeFile(join(this.outRoot, page.path), html);
  }

  private async generateIndex() {
    // TODO: Load with layout cache as well?
    const srcPath = join(this.srcRoot, "index.handlebars");
    const outPath = join(this.outRoot, "index.html");
    const source = await fs.readFile(srcPath, "utf8");
    const layout = handlebars.compile(source);
    const html = layout({ pages: this.pages });
    await fs.writeFile(outPath, html);
  }

  private async copyPublic() {
    await fs.copy(join(this.srcRoot, "public"), this.outRoot, {
      recursive: true,
      overwrite: true,
    });
  }

  private sortPagesByDateDesc() {
    this.pages.sort((a, b) => {
      const da = a.meta.date;
      const db = b.meta.date;
      return da < db ? 1 : da > db ? -1 : 0;
    });
  }
}
