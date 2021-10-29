import parseFrontMatter from "./matter";
import marked from "marked";
import hljs from "highlight.js";
import { katexExtension } from "./extensions/katex";
// import mermaid from 'mermaid'

class Renderer {
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

  render(source: string) {
    const document = parseFrontMatter(source.trim());
    document.contents = marked(document.contents);
    return document;
  }
}

export default new Renderer();
