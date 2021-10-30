import parseFrontMatter from "./matter";
import marked from "marked";
import readingTime from "reading-time";
import hljs from "highlight.js";
import { katexExtension } from "./extensions/katex";
export default class Renderer {
    constructor() {
        marked.setOptions({
            highlight: (code, lang) => {
                const language = hljs.getLanguage(lang) ? lang : "plaintext";
                return hljs.highlight(code, { language }).value;
            },
            langPrefix: "hljs language-",
        });
        marked.use(katexExtension);
    }
    render(md) {
        const page = parseFrontMatter(md.trim());
        page.contents = marked(page.contents);
        page.readTime = readingTime(md);
        return page;
    }
}
