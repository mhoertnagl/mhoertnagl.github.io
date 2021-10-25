import jsYaml from 'js-yaml'

export default function parse(text: string) {
  const re = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/
  const matches = re.exec(text)
  const result = { meta: {} as any, contents: '' }

  if (matches) {
    result.meta = jsYaml.load(matches[2]) as object
    result.contents = matches[3]
  }
  return result
}
