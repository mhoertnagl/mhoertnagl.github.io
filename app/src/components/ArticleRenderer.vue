<script setup lang="ts">
import { ref } from 'vue'
import * as matter from 'yaml-front-matter'

const props = defineProps<{ source: string }>()

const contents = matter.loadFront(props.source.trim())
console.log(contents);

</script>

<template>
  <article>
    <h1>{{ contents.title }}</h1>
    <h5>{{ contents.date }}</h5>
    {{ contents.__content }}
  </article>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
