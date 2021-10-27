import katex from "katex";
export const katexExtension = {
    renderer: {
        code(code, language) {
            if (language === "katex") {
                return katex.renderToString(code, {
                    displayMode: true,
                });
            }
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
