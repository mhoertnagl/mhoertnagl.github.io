import jsYaml from "js-yaml";
import Page from "./page";
const re = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/;
export default function parse(text) {
    const matches = re.exec(text);
    const result = new Page();
    if (matches) {
        const matter = matches[2] || "";
        const contents = matches[3] || "";
        result.meta = jsYaml.load(matter);
        result.contents = contents;
    }
    return result;
}
