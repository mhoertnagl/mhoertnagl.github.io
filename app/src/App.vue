<script setup lang="ts">
  const source = `
---
title: Test
date: 2021-10-24 12:41
tags: test
---
# Heading 1

> Quote

Inline KaTeX \`katex \\sum^{n}_{i=0} i\`

\`\`\`js
function foo() { return 0; }
\`\`\`

\`\`\`mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\`

\`\`\`katex
\\sum^{n}_{i=0} i
\`\`\`
`
</script>

<template>
  <article-renderer :source="source" />
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
