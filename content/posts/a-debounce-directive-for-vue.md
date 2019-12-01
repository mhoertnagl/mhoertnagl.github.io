---
title: A Debounce Directive for Vue
date: 2019-12-01
published: false
tags: ['Markdown', 'Cover Image']
series: false
# cover_image: ./images/alexandr-podvalny-220262-unsplash.jpg
canonical_url: false
description: ""
---

Abstractions are a vital ingredient to computer science. As a web developer I am scouting for even the tiniest of abstractions that reduce the repetitve chores. A problem I came across recently is debouncing AJAX requests. We will develop a reusable vue-directive ready to be attached to any input element.

## The Status Quo

Let's take a look at an acutal example. The following code segments implement a debounced search box.
The example is available as a [code sandbox](xxx).

```html
<v-text-field
  v-model="search"
  dense
  single-line
  hide-details
  append-icon="$vuetify.icons.search"
  placeholder="Type anything ..."
></v-text-field>
```

The component watches the model `search` for changes. If there is a pending request, we cancel it and initiate a new request with the updated search value. I'm using [Lodash's debounce function](https://lodash.com/docs/4.17.15#debounce) to handle the actual debouncing.

```ts
import { Component, Vue, Watch } from 'vue-property-decorator'
import debounce from 'lodash/debounce'
import { Cancelable } from 'lodash'

@Component
export default class Items extends Vue {

  private debounced: (() => Promise<void>) & Cancelable | null = null
  private search = ''

  @Watch('search')
  private searchChanged() {
    if (this.debounced) {
      this.debounced.cancel()
    }
    this.debounced = debounce(this.fetchItems, 500)
    this.debounced()
  }

  private fetchItems() {
    ...
  }
}
```

The only things that change across various implmentations are the fetching mechanism and the wait period.

## Enter Vue-Directives

It's perfectly acceptable to wrap the logic in a vue `debounce` component but there is a more general solution. In fact it's the recommended way and in the exercises section I ask you to provide such an implementation. In this post however I'm going to build the abstraction with a [vue directive](xxx). The code above then reduces to this

```html
<v-text-field
  v-model="search"
  @input="fetchItems"
  v-debounce:input="500"
  dense
  single-line
  hide-details
  append-icon="$vuetify.icons.search"
  placeholder="Type anything ..."
></v-text-field>
```

```ts
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Items extends Vue {

  private search = ''

  private fetchItems() {
    ...
  }
}
```

Nice! Alot more delcarative. `@input="fetchItems"` invokes the AJAX fetching logic whenever the input box triggers an `input` event. We specify the actual debouncing behavior in this line

```html
<v-text-field
  ...
  v-debounce:input="500"
  ...
></v-text-field>
```

It reads: debounce all listeners attached to the `input` event with a wait period of `500ms`.

## Implementing The Directive

```ts
import Vue, { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import debounce from 'lodash/debounce'

Vue.directive('debounce', {
  bind(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (binding.arg === undefined) {
      throw new Error('missing argument to v-debounce.')
    }

    if (vnode === null) {
      return
    }

    const instance = vnode.componentInstance
    if (instance === undefined) {
      return
    }

    const listeners = instance.$listeners[binding.arg]

    instance.$off(binding.arg)

    if (Array.isArray(listeners)) {
      for (const listener of listeners) {
        wrapListener(instance, listener, binding)
      }
    } else {
      wrapListener(instance, listeners, binding)
    }
  },
})

function wrapListener(instance: Vue, listener: Function, binding: DirectiveBinding) {
  if (binding.arg === undefined) {
    throw new Error('missing argument to v-debounce.')
  }

  const name = 'debounced' + binding.arg
  instance.$on(binding.arg, function() {
    if (instance.$data[name]) {
      instance.$data[name].cancel()
    }
    const wrapper = () => {
      // @ts-ignore
      listener.call(this, ...arguments)
    }
    const debounced = debounce(wrapper, binding.value)
    instance.$data[name] = debounced
    debounced()
  })
}
```

<!-- Abstractions are a vital ingredient to computer science. This is especially true in the realm of web development. Perhaps all of us are on the quest to implement or discover some Grand Unified Framework, that is designed to solve each and every technical challenge our customers may pose on us. While there is indeed a long road ahead of us and the odds are, there will never be a GUF ever, it is still rewarding to build many tiny abstractions. -->
