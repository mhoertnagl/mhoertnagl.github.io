---
title: A Debounce Directive for Vue
date: 2019-12-01
published: true
tags: ['Vue', 'Typescript']
series: false
canonical_url: false
cover_image: ''
description: "Develop a reusable vue-directive to debounce AJAX requests."
---

Abstractions are a vital ingredient to computer science. As a web developer I am scouting for even the tiniest of abstractions that reduce the repetitve chores. A problem I came across recently is debouncing AJAX requests. We will develop a reusable vue-directive ready to be attached to any input element.

## The Status Quo

Let's take a look at an acutal example. The following code segments implement a debounced search box.

```html
<v-text-field v-model="search"></v-text-field>
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

Nice! Alot more delcarative. `@input="fetchItems"` invokes the AJAX fetching logic whenever the input box triggers an `input` event. We specify the actual debouncing behavior with `v-debounce:input="500"`. It reads: debounce all listeners attached to the `input` event with a wait period of `500` ms. The final piece is the directive itself.

## Implementing The Directive

This code will register our new directive `debounce`. The method `bind` gets called exactly once when the directive is bound to the element for the first time. The argument `vnode` contains a reference to the actual vue instance and `binding` provides properties supplied to the directive. `binding.arg` holds the name of the event that will be debounced and `binding.value` specifies the waiting time in milliseconds.

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
```

The first thing to do is to disable the original listeners registered with the event. Vue's [$off](https://vuejs.org/v2/api/#vm-off) function comes in handy. Next we wrap all the disabled listeners and re-register the wrapped functions with the event.

```ts
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

The wrapper function is doing the same thing as our conventional debouncing logic. It creates a property in the data section that will reference the current debounced function. If there is a pending debouncing function, we will cancel it and invoke a new debounced function.

## Conclusion

We are done. This code will save you a bit of boilerplate and reduces the noise in the component implementation. If you want to get your hands dirty try the exercise.

## Exercises

1. Implement a component that serves the same purpose as the `v-debounce` directive. An exemplar usage may look like this:

   ```html
   <debounce #default="{ on }" :call="fetchItems" :wait="500">
     <v-text-field v-model="search" @input="on"></v-text-field>
   </debounce>
   ```

   `on` wrapps the original call `fetchItems` and debounces it with a wait period of `500` ms.
