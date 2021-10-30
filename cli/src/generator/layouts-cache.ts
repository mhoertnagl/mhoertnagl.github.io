import fs from "fs-extra";
import { join } from "path";
import handlebars from "handlebars";
import "./helpers/formatDate";

export default class LayoutsCache {
  private readonly layoutsRoot: string;
  private readonly layouts: LayoutsMap;

  /**
   * Creates a new layouts cache.
   *
   * @param layoutsRoot Path to the layouts root directoy.
   */
  constructor(layoutsRoot: string) {
    this.layoutsRoot = layoutsRoot;
    this.layouts = new LayoutsMap();
  }

  /**
   * Loads, caches and returns the requested layout. The layout name is
   * equivalent to the filename including any subdirectories without file
   * extension.
   * For instance assume the following layouts directory structure:
   *
   *   layouts
   *    + foo
   *       + layout2.handlebars
   *    + layout1.handlebars
   *
   * The correct layout names would then be 'layout1' and 'foo/layout2'.
   *
   * @param layoutName The layout identifer.
   */
  async findLayout(layoutName: string) {
    if (this.layouts.has(layoutName) === false) {
      const layout = await this.loadLayout(layoutName);
      this.layouts.set(layoutName, layout);
    }
    return this.layouts.get(layoutName)!;
  }

  private async loadLayout(layoutName: string) {
    const layoutPath = join(this.layoutsRoot, `${layoutName}.handlebars`);
    const source = await fs.readFile(layoutPath, "utf8");
    return handlebars.compile(source);
  }

  // TODO: loadLayout(layoutPath: string) {}
}

class LayoutsMap extends Map<string, HandlebarsTemplateDelegate<any>> {}
