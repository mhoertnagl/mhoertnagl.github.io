import { join } from "path";
import Generator from "../generator/generator";
export async function generate() {
    const cwd = process.cwd();
    const srcRoot = join(cwd, "src");
    const outRoot = join(cwd, "docs");
    const generator = new Generator(srcRoot, outRoot);
    await generator.generateAll();
}
