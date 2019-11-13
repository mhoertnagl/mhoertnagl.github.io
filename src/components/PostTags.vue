<template>
   <div class="post-tags">
   		<g-link class="post-tags__link" v-for="tag in post.tags" :key="tag.id" :to="tag.path">
   			<span>#</span> {{ tag.title }}
   		</g-link>
    </div>
</template>

<script>
export default {
  props: ['post']
}
</script>

<style lang="scss">
.post-tags {
  margin: 1em 0 0;

  &__link {
  	font-size: .8em;
  	text-decoration: none;
    color: var(--tag-color) !important;
  	background-color: var(--bg-tag);
    margin-right: .7em;
  	padding: .5em;
  	border-radius: var(--radius);
  }
}
</style>
