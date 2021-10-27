import jsYaml from "js-yaml";

const re = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/;

export default function parse(text: string) {
  const matches = re.exec(text);
  const result = { meta: {} as any, contents: "" };
  if (matches) {
    const matter = matches[2] || "";
    const contents = matches[3] || "";
    result.meta = jsYaml.load(matter) as object;
    result.contents = contents;
  }
  return result;
}
