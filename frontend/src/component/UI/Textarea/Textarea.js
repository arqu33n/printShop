import { defineComponent } from 'vue'
import './Textarea.css'

export const Textarea = defineComponent({
  name: 'BaseTextarea',
  inheritAttrs: false,

  props: {
    modelValue: [String, Number],
    disabled: Boolean,
    error: String,
    required: Boolean,
    id: String,
    label: String,
    rows: {
      type: Number,
      default: 4,
    },
  },

  emits: ['update:modelValue', 'blur'],

  template: `
    <div class="base-textarea">
      <label 
        v-if="label" 
        :for="id" 
        class="base-textarea__label"
        :class="{ 'base-textarea__label--required': required }"
      >
        {{ label }} *
      </label>
      
      <textarea
        :id="id"
        class="base-textarea__field"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :rows="rows"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
        :class="{ 'base-textarea__field--error': error }"
      ></textarea>
    </div>
  `,
})
