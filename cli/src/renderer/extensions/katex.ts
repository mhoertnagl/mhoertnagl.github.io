import { MarkedExtension } from "marked";
import katex from "katex";

export const katexExtension: MarkedExtension = {
  renderer: {
    code(code, language) {
      if (language === "katex") {
        return katex.renderToString(code, {
          displayMode: true,
        });
      }
      // Use default code renderer.
      return false;
    },
    codespan(code) {
      if (code.startsWith("katex")) {
        return katex.renderToString(code.substring(5));
      }
      return false;
    },
  },
};
