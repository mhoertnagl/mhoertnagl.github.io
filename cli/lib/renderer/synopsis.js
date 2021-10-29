const re = /<p>(:?.+)<\/p>/;
export default function parseSynopsis(text) {
    const matches = re.exec(text);
    if (matches && matches.length > 0) {
        return matches[1] || "";
    }
    return "";
}
