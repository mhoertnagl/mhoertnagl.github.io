import fs from "fs-extra";
import { join } from "path";
import handlebars from "handlebars";
import "./helpers/formatDate";
export default class LayoutsCache {
    layoutsRoot;
    layouts;
    constructor(layoutsRoot) {
        this.layoutsRoot = layoutsRoot;
        this.layouts = new LayoutsMap();
    }
    async findLayout(layoutName) {
        if (this.layouts.has(layoutName) === false) {
            const layout = await this.loadLayout(layoutName);
            this.layouts.set(layoutName, layout);
        }
        return this.layouts.get(layoutName);
    }
    async loadLayout(layoutName) {
        const layoutPath = join(this.layoutsRoot, `${layoutName}.handlebars`);
        const source = await fs.readFile(layoutPath, "utf8");
        return handlebars.compile(source);
    }
}
class LayoutsMap extends Map {
}
