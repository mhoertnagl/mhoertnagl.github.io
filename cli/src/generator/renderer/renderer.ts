import parseFrontMatter from "./matter";
import marked from "marked";
import readingTime from "reading-time";
import hljs from "highlight.js";
import { katexExtension } from "./extensions/katex";
// import mermaid from 'mermaid'

export default class Renderer {
  constructor() {
    // https://mermaid-js.github.io/mermaid/#/usage
    // mermaid.initialize({})

    // const mermaidExtension: MarkedExtension = {
    //   renderer: {
    //     code(code, language) {
    //       if (language === 'mermaid') {
    //         return `<div class="mermaid">${code}</div>`
    //       }
    //       // Use default code renderer.
    //       return false
    //     },
    //   },
    // }

    marked.setOptions({
      highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: "hljs language-",
    });

    // marked.use(mermaidExtension)
    marked.use(katexExtension);
  }

  render(md: string) {
    const page = parseFrontMatter(md.trim());
    page.contents = marked(page.contents);
    // Estimate the reading time for this page.
    page.readTime = readingTime(md);
    return page;
  }
}
