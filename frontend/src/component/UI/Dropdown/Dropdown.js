import { defineComponent } from 'vue'
import './Dropdown.css'

export const Dropdown = defineComponent({
  name: 'Dropdown',

  props: {
    modelValue: {
      type: [Array, String, Number],
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    optionLabel: {
      type: String,
      default: 'name',
    },
    optionValue: {
      type: String,
      default: 'id',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Выберите...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    renderOption: {
      type: Function,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      showDropdown: false,
    }
  },

  computed: {
    isMultiple() {
      return this.multiple
    },

    selectedItems() {
      if (this.isMultiple) {
        return this.options.filter((item) => (this.modelValue || []).includes(item[this.optionValue]))
      } else {
        const item = this.options.find((item) => item[this.optionValue] === this.modelValue)
        return item ? [item] : []
      }
    },

    buttonText() {
      if (this.selectedItems.length === 0) return this.placeholder
      if (this.selectedItems.length === 1) return this.selectedItems[0][this.optionLabel]
      return `Выбрано: ${this.selectedItems.length}`
    },
  },

  methods: {
    toggleDropdown() {
      if (this.disabled) return
      this.showDropdown = !this.showDropdown
    },

    selectItem(item) {
      const value = item[this.optionValue]

      if (this.isMultiple) {
        const currentValue = this.modelValue || []
        const newValue = currentValue.includes(value)
          ? currentValue.filter((v) => v !== value)
          : [...currentValue, value]
        this.$emit('update:modelValue', newValue)
      } else {
        this.$emit('update:modelValue', value)
        this.showDropdown = false
      }
    },

    isSelected(item) {
      const value = item[this.optionValue]
      if (this.isMultiple) {
        return (this.modelValue || []).includes(value)
      } else {
        return this.modelValue === value
      }
    },

    removeItem(value, event) {
      event.stopPropagation()
      if (this.isMultiple) {
        const newValue = (this.modelValue || []).filter((v) => v !== value)
        this.$emit('update:modelValue', newValue)
      } else {
        this.$emit('update:modelValue', null)
      }
    },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.showDropdown = false
      }
    },

    getOptionDisplay(item) {
      if (this.renderOption) {
        return this.renderOption(item)
      }
      return item[this.optionLabel]
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  template: `
  <div class="dropdown">
  <label v-if="label" class="dropdown__label">{{ label }}</label>
  
  <div 
    class="dropdown__field" 
    :class="{ '--disabled': disabled, '--open': showDropdown }" 
    @click="toggleDropdown"
  >
    <div class="dropdown__selected">
      <template v-if="isMultiple && selectedItems.length > 0">
        <div 
          v-for="item in selectedItems" 
          :key="item[optionValue]"
          class="dropdown__selected-item"
          @click.stop
        >
          <span>{{ getOptionDisplay(item) }}</span>
          <button 
            type="button"
            class="dropdown__remove"
            @click.stop="removeItem(item[optionValue], $event)"
            :disabled="disabled"
          >×</button>
        </div>
      </template>
      
      <span v-else class="dropdown__text">{{ buttonText }}</span>
      
      <span class="dropdown__arrow" :class="{ '--open': showDropdown }">▼</span>
    </div>
  </div>

  <div v-if="showDropdown" class="dropdown__menu">
    <div class="dropdown__list">
      <div
        v-for="item in options"
        :key="item[optionValue]"
        class="dropdown__option"
        :class="{ '--selected': isSelected(item) }"
        @click.stop="selectItem(item)"
      >
        <div class="dropdown__option-checkbox" v-if="isMultiple">
          <input 
            type="checkbox"
            :checked="isSelected(item)"
            readonly
          />
        </div>
        <div class="dropdown__option-radio" v-else>
          <input 
            type="radio"
            :checked="isSelected(item)"
            readonly
          />
        </div>
        <span class="dropdown__option-label">{{ getOptionDisplay(item) }}</span>
      </div>
      
      <div v-if="options.length === 0" class="dropdown__empty">
        Нет доступных опций
      </div>
    </div>
  </div>
</div>
  `,
})
