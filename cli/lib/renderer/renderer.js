import matter from "./matter";
import marked from "marked";
import hljs from "highlight.js";
import { katexExtension } from "./extensions/katex";
class Renderer {
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
    render(source) {
        const document = matter(source.trim());
        document.contents = marked(document.contents);
        return document;
    }
}
export default new Renderer();
