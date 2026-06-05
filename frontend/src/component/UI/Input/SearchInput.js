import { defineComponent } from 'vue'
import './SearchInput.css'
import searchIcon from '@images/icons/zoom-icon.svg'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@model/productsStore.js'
import {productsManager} from "@managers/productsManager";

export const SearchInput = defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Поиск...',
    },
  },
  emits: ['update:modelValue'],

  data() {
    return {
      localValue: this.modelValue,
      searchIcon: searchIcon,
      suggestions: [],
      showDropdown: false,
      searchTimeout: null,
      productsStore: useProductsStore(),
    }
  },

  setup() {
    const router = useRouter()
    return { router }
  },

  watch: {
    modelValue(newValue) {
      this.localValue = newValue
    },

    localValue(newValue) {
      this.$emit('update:modelValue', newValue)
      this.debouncedSearch()
    },
  },

  methods: {
    debouncedSearch() {
      clearTimeout(this.searchTimeout)

      if (this.localValue.length < 2) {
        this.suggestions = []
        this.showDropdown = false
        return
      }

      this.searchTimeout = setTimeout(() => {
        this.performSearch()
      }, 300)
    },

    async performSearch() {
      const searchTerm = this.localValue.trim()
      console.log('Поиск:', searchTerm)

      const results = await productsManager.searchProducts({
        name: searchTerm,
      })

      this.suggestions = results || []
      this.showDropdown = this.suggestions.length > 0
    },

    goToProduct(product) {
      this.showDropdown = false
      this.localValue = ''
      this.router.push({ name: 'product', params: { id: product.id } })
    },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.showDropdown = false
      }
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    clearTimeout(this.searchTimeout)
  },

  template: `
    <div class="search-wrapper">
      <div class="search-input">
        <input
          type="text"
          class="search-input__field"
          :value="localValue"
          @input="localValue = $event.target.value"
          :placeholder="placeholder"
        />
        <img :src="searchIcon" class="search-input__icon" />
      </div>

      <div v-if="showDropdown" class="search-dropdown">
        <div
          v-for="product in suggestions"
          :key="product.id"
          class="suggestion-item"
          @click="goToProduct(product)"
        >
          <div class="suggestion-item__content">
            <span class="suggestion-item__name">{{ product.name }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
