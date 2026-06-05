import './Button.css'
import { defineComponent } from 'vue'

export const Button = defineComponent({
  name: 'BaseButton',

  props: {
    color: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click'],

  template: `
    <button
      :class="['base-btn', '--' + color]"
      :disabled="disabled"
      @click="$emit('click', $event)"
    >
      <slot />
    </button>
  `,
})
