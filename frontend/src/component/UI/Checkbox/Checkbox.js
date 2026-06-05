import { defineComponent } from 'vue'
import './Checkbox.css'

export const Checkbox = defineComponent({
  name: 'BaseCheckbox',
  inheritAttrs: false,

  props: {
    modelValue: Boolean,
    disabled: Boolean,
    required: Boolean,
    id: String,
    label: String,
    error: String,
  },

  emits: ['update:modelValue'],

  template: `
    <div class="base-checkbox">
      <div class="base-checkbox__wrapper">
        <input
          :id="id"
          type="checkbox"
          class="base-checkbox__input"
          :checked="modelValue"
          :disabled="disabled"
          :required="required"
          @change="$emit('update:modelValue', $event.target.checked)"
          v-bind="$attrs"
        />
        
        <label 
          :for="id" 
          class="base-checkbox__label"
          :class="{ 'base-checkbox__label--disabled': disabled }"
        >
          <span class="base-checkbox__box"></span>
          <span class="base-checkbox__text">{{ label }}</span>
          <span v-if="required" class="base-checkbox__required">*</span>
        </label>
      </div>
    </div>
  `,
})
