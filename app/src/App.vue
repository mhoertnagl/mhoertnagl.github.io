<script setup lang="ts">
const source = `
---
title: Test
date: 2021-10-24 12:41
tags: test
---
# Test
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
