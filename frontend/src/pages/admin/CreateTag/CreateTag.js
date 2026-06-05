import './CreateTag.css'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs.js'
import { Input } from '@component/UI/Input/Input.js'
import { defineComponent } from 'vue'
import { useTagsStore } from '@model/tagsStore.js'
import { tagsManager } from '@managers/tagsManager'

export default defineComponent({
  name: 'CreateTag',

  components: {
    Breadcrumbs,
    Input,
  },

  data() {
    return {
      tagsStore: useTagsStore(),
      form: {
        name: '',
        tag_type_id: null,
      },
      loading: false,
      success: false,
      error: null,
      nameError: null,
    }
  },

  computed: {
    allTags() {
      return this.tagsStore.allTags || []
    },

    tagTypes() {
      const typesMap = new Map()
      const uniqueTypes = [...new Set(this.allTags.map((t) => t.tag_type_model?.name).filter(Boolean))]

      this.allTags.forEach((tag) => {
        if (tag.tag_type_model?.name && !typesMap.has(tag.tag_type_model?.name)) {
          typesMap.set(tag.tag_type_model?.name, {
            value: uniqueTypes.indexOf(tag.tag_type_model?.name) + 1,
            label: this.formatTypeLabel(tag.tag_type_model?.name),
            styles: tag.styles,
          })
        }
      })

      return Array.from(typesMap.values())
    },

    breadcrumbItems() {
      return [
        { path: '/', title: 'Дашборд' },
        { path: '/products', title: 'Товары' },
        { path: '/create-product', title: 'Создание товара' },
        { path: '', title: 'Создание тега' },
      ]
    },

    isNameDuplicate() {
      if (!this.form.name) {
        return false
      }

      const normalize = (str) => str.replace(/[^\wа-яА-ЯёЁ]/g, '').toLowerCase()
      const inputName = normalize(this.form.name)

      return this.allTags.some((tag) => normalize(tag.name) === inputName)
    },

    canSubmit() {
      return this.form.name.trim() &&
		  this.form.tag_type_id &&
		  !this.isNameDuplicate &&
		  !this.loading
    },

    selectedTypeStyles() {
      const selectedType = this.tagTypes.find((t) => t.value === this.form.tag_type_id)
      return selectedType ? selectedType.styles : null
    },
  },

  async created() {
    await tagsManager.fetchAllTags()
  },

  methods: {
    formatTypeLabel(type) {
      if (!type) {
        return ''
      }
      return type.charAt(0).toUpperCase() + type.slice(1)
    },

    checkNameDuplicate() {
      if (!this.form.name) {
        this.nameError = null
        return
      }

      const normalize = (str) => str.replace(/[^\wа-яА-ЯёЁ]/g, '').toLowerCase()
      const inputName = normalize(this.form.name)

      const existing = this.allTags.find((tag) => normalize(tag.name) === inputName)

      if (existing) {
        this.nameError = `Похожий тег "${existing.name}" уже существует`
      } else {
        this.nameError = null
      }
    },

    async createTag() {
      if (!this.canSubmit) {
        return
      }
      this.loading = true
      this.error = null

      try {
        const tagData = {
          name: this.form.name.trim(),
          tag_type_id: this.form.tag_type_id,
        }

        await tagsManager.createTag(tagData)

        this.success = true

        this.form = {
          name: '',
          tag_type_id: null,
        }

        await tagsManager.fetchAllTags()

        setTimeout(() => {
          this.success = false
        }, 3000)
      } catch (err) {
        this.error = err.message || 'Ошибка при создании тега'
      } finally {
        this.loading = false
      }
    },
  },

  template: `
      <div class="create-tag">
        <Breadcrumbs :items="breadcrumbItems" />

        <div class="create-tag__container">
          <div class="create-tag__row">
            <div class="create-tag__form">
              <div class="create-tag__title">Создание нового тега</div>
              <form class="create-tag__form-item" @submit.prevent="createTag">
                <div class="form__group">
                  <Input
                      v-model="form.name"
                      @update:modelValue="checkNameDuplicate"
                      id="tag-name"
                      label="Название тега"
                      placeholder="Хит"
                      :class="{ 'input --error': nameError }"
                      required
                  />
                  <div v-if="nameError" class="error-message">
                    {{ nameError }}
                  </div>
                </div>

                <div class="form__group">
                  <label class="form__label">Тип тега</label>
                  <select
                      v-model="form.tag_type_id"
                      class="form__select"
                      required
                  >
                    <option :value="null" disabled>Выберите тип</option>
                    <option
                        v-for="type in tagTypes"
                        :key="type.value"
                        :value="type.value"
                    >
                      {{ type.label }}
                    </option>
                  </select>
                </div>

                <!-- Превью тега -->
                <div v-if="form.tag_type_id && selectedTypeStyles" class="form__group">
                  <label class="form__label">Превью</label>
                  <div class="tag-preview"
                       :style="{
                      backgroundColor: selectedTypeStyles.background,
                      borderColor: selectedTypeStyles.border,
                      color: selectedTypeStyles.text,
                    }"
                  >
                    {{ form.name || 'Пример тега' }}
                  </div>
                </div>

                <div class="form__footer">
                  <div class="form__footer-actions">
                    <button
                        class="btn --primary"
                        :disabled="!canSubmit"
                    >
                      <span v-if="loading"></span>
                      {{ loading ? 'Создание...' : 'Создать тег' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div class="create-tag__exists">
              <div class="create-tag__exists-title">Существующие теги</div>
              <div class="all-tags__grid">
                <div v-for="tag in allTags"
                     :key="tag.id"
                     class="product-tag"
                     :style="{       
                      backgroundColor: tag.styles.background,
                      borderColor: tag.styles.border,
                      color: tag.styles.text
                      }">
                  {{ tag.name }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="success" class="alert --success">
            Тег успешно создан!
          </div>

          <div v-if="error" class="alert --error">
            {{ error }}
          </div>
        </div>
      </div>
	`,
})
