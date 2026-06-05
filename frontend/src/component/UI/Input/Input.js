import { defineComponent } from 'vue'
import './Input.css'

export const Input = defineComponent({
  name: 'Input',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    type: {
      type: String,
      default: 'text',
    },
    disabled: Boolean,
    error: String,
    required: Boolean,
    id: String,
    label: String,
  },
  emits: ['update:modelValue'],

  template: `
    <div class="base-input">
      <label 
        v-if="label" 
        :for="id" 
        class="base-input__label"
        :class="{ 'base-input__label--required': required }"
      >
        {{ label }} *
      </label>
      
      <input
        :id="id"
        class="base-input__field"
        :type="type"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
        :class="{ 'base-input__field--error': error }"
      />
      
      <span v-if="error" class="base-input__error">{{ error }}</span>
    </div>
  `,
})
