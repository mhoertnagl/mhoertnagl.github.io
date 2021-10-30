import glob from "fast-glob";
export default function findFiles(base, pattern) {
    return glob(pattern, {
        cwd: base,
        onlyFiles: true,
    });
}
