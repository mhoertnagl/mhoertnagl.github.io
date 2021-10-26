import fs from "fs-extra";
import { join, parse } from "path";
export async function generate() {
    const cwd = process.cwd();
    const srcDir = join(cwd, "src");
    const layouts = await loadLayouts(srcDir);
    console.log("Test");
}
async function loadLayouts(srcDir) {
    const layouts = new Map();
    const layoutsDir = join(srcDir, "layouts");
    const layoutFiles = await fs.readdir(layoutsDir);
    for (const layoutFile of layoutFiles) {
        const layoutPath = join(layoutsDir, layoutFile);
        const contents = await fs.readFile(layoutPath, "utf8");
        layouts.set(parse(layoutFile).name, contents);
    }
    return layouts;
}
