<script setup lang="ts">
  import { ref } from 'vue'
  import matter from '../renderer/matter'
  import marked, { MarkedExtension } from 'marked'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/default.css'
  import mermaid from 'mermaid'
  import katex from 'katex'
  import 'katex/dist/katex.css'

  const props = defineProps<{ source: string }>()

  mermaid.initialize({})

  // https://marked.js.org/using_pro#extensions

  const mermaidExtension: MarkedExtension = {
    renderer: {
      code(code, language) {
        if (language === 'mermaid') {
          return `<div class="mermaid">${code}</div>`
        }
        // Use default code renderer.
        return false
      },
    },
  }

  const latexExtension: MarkedExtension = {
    renderer: {
      code(code, language) {
        if (language === 'katex') {
          return katex.renderToString(code, {
            displayMode: true,
          })
        }
        // Use default code renderer.
        return false
      },
      codespan(code) {
        if (code.startsWith('katex')) {
          return katex.renderToString(code.substring(5))
        }
        return false
      },
    },
  }

  marked.setOptions({
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-',
  })

  marked.use(mermaidExtension)
  marked.use(latexExtension)

  const cleanSource = props.source.trim()
  const document = matter(cleanSource)
  const contents = marked(document.contents)
</script>

<template>
  <article>
    <h1>{{ document.meta.title }}</h1>
    <h5>{{ document.meta.date }}</h5>
    <section v-html="contents"></section>
  </article>
</template>

<style scoped></style>
