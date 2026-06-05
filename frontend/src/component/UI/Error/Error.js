import { defineComponent } from 'vue'
import './Error.css'

export const Error = defineComponent({
  name: 'Error',

  props: {
    store: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      timeoutId: null,
    }
  },

  computed: {
    error() {
      return this.store?.error || null
    },
  },

  watch: {
    error(newError) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
      if (newError) {
        this.timeoutId = setTimeout(() => {
          this.clearError()
          this.timeoutId = null
        }, 3000)
      }
    },
  },

  unmounted() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  },

  methods: {
    clearError() {
      this.store.setError(null)
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
    },
  },

  template: `
    <Transition name="slide-fade">
      <div 
        v-if="error" 
        class="error-toast" 
        @click="clearError"
      >
        <div class="error-toast__content">
          <div class="error-toast__message">{{ error.message }}</div>
        </div>
        <button class="error-toast__close" @click.stop="clearError">×</button>
      </div>
    </Transition>
  `,
})
