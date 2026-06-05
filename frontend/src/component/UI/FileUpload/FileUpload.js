import { defineComponent } from 'vue'
import './FileUpload.css'

export const FileUpload = defineComponent({
  name: 'BaseFileUpload',
  inheritAttrs: false,

  props: {
    modelValue: Array,
    disabled: Boolean,
    required: Boolean,
    id: String,
    label: String,
    error: String,
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: 'image/*',
    },
  },

  emits: ['update:modelValue'],

  methods: {
    handleFileChange(event) {
      const files = Array.from(event.target.files)

      const newFiles = files.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }))

      if (this.multiple) {
        const updated = [...(this.modelValue || []), ...newFiles]
        this.$emit('update:modelValue', updated)
      } else {
        this.$emit('update:modelValue', newFiles.slice(0, 1))
      }

      event.target.value = ''
    },

    removeFile(index) {
      const updated = [...this.modelValue]
      updated.splice(index, 1)
      this.$emit('update:modelValue', updated)
    },
  },

  template: `
    <div class="file-upload" :class="{ 'file-upload--error': error }">
      <label v-if="label" :for="id" class="file-upload__label">
        {{ label }}
        <span v-if="required" class="file-upload__required">*</span>
      </label>

      <div class="file-upload__wrapper">
        <!-- Список загруженных файлов -->
        <div v-if="modelValue && modelValue.length" class="file-upload__list">
          <div v-for="(file, index) in modelValue" :key="index" class="file-upload__item">
            <span class="file-upload__name">{{ file.name }}</span>
            <button 
              type="button" 
              class="file-upload__remove"
              @click="removeFile(index)"
              :disabled="disabled"
            >
              ×
            </button>
          </div>
        </div>

        <!-- Кнопка загрузки -->
        <div class="file-upload__dropzone">
          <input
            :id="id"
            type="file"
            class="file-upload__input"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled"
            @change="handleFileChange"
            v-bind="$attrs"
          />
          <div class="file-upload__content">
            <span class="file-upload__text">+ Загрузить изображения</span>
          </div>
        </div>
      </div>
      
      <span v-if="error" class="file-upload__error">{{ error }}</span>
    </div>
  `,
})
