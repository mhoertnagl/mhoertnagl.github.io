export const mermaidExtension = {
    renderer: {
        code(code, language) {
            if (language === "mermaid") {
                return `<div class="mermaid">${code}</div>`;
            }
            return false;
        },
    },
};
