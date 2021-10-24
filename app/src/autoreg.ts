import { App } from 'vue'

export default function registerComponents(app: App) {
  const components = import.meta.globEager('./components/**/*.vue')

  for (const [path, definition] of Object.entries(components)) {
    const name = path
      .split('/')
      .pop()
      ?.replace(/\.\w+$/, '')

    if (name) {
      app.component(name, definition.default)
    }
  }
}
