import { defineComponent } from 'vue'
import './Breadcrumbs.css'

export const Breadcrumbs = defineComponent({
  name: 'Breadcrumbs',

  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  template: `
    <nav class="breadcrumbs">
      <ul class="breadcrumbs__list">
        <li 
          v-for="(item, index) in items" 
          :key="index"
          class="breadcrumbs__item"
          :class="{ '--current': index === items.length - 1 }"
        >
          <router-link 
            v-if="item.path && index !== items.length - 1"
            :to="item.path"
            class="breadcrumbs__link"
          >
            {{ item.title }}
          </router-link>
          <span 
            v-else 
            class="breadcrumbs__current"
          >
            {{ item.title }}
          </span>
          
          <span 
            v-if="index !== items.length - 1" 
            class="breadcrumbs__separator"
          >
            /
          </span>
        </li>
      </ul>
    </nav>
  `,
})
