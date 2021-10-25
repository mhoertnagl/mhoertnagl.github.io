<script setup lang="ts">
  import { ref } from 'vue'
  import renderer from '../renderer/renderer'

  const props = defineProps<{ source: string }>()

  const document = renderer.render(props.source)
</script>

<template>
  <article>
    <h1>{{ document.meta.title }}</h1>
    <h5>{{ document.meta.date }}</h5>
    <section v-html="document.contents"></section>
  </article>
</template>

<style scoped></style>
