import glob from "fast-glob";

export default function findFiles(base: string, pattern: string) {
  return glob(pattern, {
    cwd: base,
    onlyFiles: true,
  });
}
