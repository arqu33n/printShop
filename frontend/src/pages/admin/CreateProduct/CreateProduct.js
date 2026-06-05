import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { useTagsStore } from '@model/tagsStore.js'
import { productsManager } from '@managers/productsManager'
import { tagsManager } from '@managers/tagsManager'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs'
import { Input } from '@component/UI/Input/Input'
import { Textarea } from '@component/UI/Textarea/Textarea'
import { Dropdown } from '@component/UI/Dropdown/Dropdown'
import { Checkbox } from '@component/UI/Checkbox/Checkbox'
import { FileUpload } from '@component/UI/FileUpload/FileUpload'
import { Error } from '@component/UI/Error/Error'
import { formatPrice } from '@helpers'
import './CreateProduct.css'

export default defineComponent({
  name: 'CreateProduct',

  components: {
    Breadcrumbs,
    Input,
    Textarea,
    Checkbox,
    FileUpload,
    Dropdown,
    Error,
  },
  data() {
    return {
      productsStore: useProductsStore(),
      tagsStore: useTagsStore(),
      form: {
        name: '',
        description: '',
        short_description: '',
        price: '',
        is_active: true,
        images: [],
        tags: [],
      },
      loading: false,
      error: null,
      success: false,
      nameError: null,
      nameChecking: false,
      searchTimeout: null,
    }
  },
  computed: {
    breadcrumbItems() {
      return [
        { path: '/', title: 'Дашборд' },
        { path: '/products', title: 'Товары' },
        { path: '', title: 'Создание товара' },
      ]
    },
    formattedPrice() {
      return formatPrice(this.form.price)
    },
    allTags() {
      return this.tagsStore.allTags || []
    },
  },
  methods: {
    debouncedCheckName() {
      clearTimeout(this.searchTimeout)

      if (!this.form.name || this.form.name.length < 2) {
        this.nameError = null
        return
      }

      this.nameChecking = true
      this.searchTimeout = setTimeout(() => {
        this.checkNameDuplicate()
      }, 300)
    },

    async checkNameDuplicate() {
      try {
        const searchTerm = this.form.name.trim()

        const searchResults = await productsManager.searchProducts({
          name: searchTerm,
        })

        const existing = searchResults.find((product) => product.name.toLowerCase() === searchTerm.toLowerCase())

        if (existing) {
          this.nameError = `Товар "${this.form.name}" уже существует (ID: ${existing.id})`
        } else {
          this.nameError = null
        }
      } catch (error) {
        console.error('Ошибка при проверке имени:', error)
        this.nameError = null
      } finally {
        this.nameChecking = false
      }
    },
    async createProduct() {
      this.loading = true
      const formData = new FormData()
      formData.append('name', this.form.name.trim())
      formData.append('description', this.form.description.trim())
      formData.append('short_description', this.form.short_description.trim())
      formData.append('price', Number(this.form.price))
      formData.append('is_active', this.form.is_active ? 1 : 0)

      if (this.form.tags && this.form.tags.length) {
        this.form.tags.forEach((tagId) => {
          formData.append('tags[]', tagId)
        })
        console.log('Отправляю теги массивом:', this.form.tags)
      }

      if (this.form.images && this.form.images.length) {
        this.form.images.forEach((image) => {
          formData.append('images[]', image.file)
        })
      }

      try {
        const response = await productsManager.createProduct(formData)

        this.success = true

        this.form = {
          name: '',
          description: '',
          short_description: '',
          price: '',
          is_active: true,
          images: [],
          tags: [],
        }

        setTimeout(() => {
          this.success = false
        }, 3000)
      } finally {
        this.loading = false
      }
    },
  },
  async created() {
    await tagsManager.fetchAllTags()
  },
  template: ` 
    <div class="create-product">
      <Breadcrumbs :items="breadcrumbItems" />
      <Error :store="productsStore" />

      <div class="create-product__container">
        <div class="create-product__title">Создание нового товара</div>
        
        <div class="create-product__row">
          <div class="create-product__form">
            <form class="create-product__form-item" @submit.prevent="createProduct">
              <div class="form__group">
                <Input
                  v-model="form.name"
                  @update:modelValue="debouncedCheckName"
                  id="product-name"
                  label="Название товара"
                  placeholder="Например: Горшочек для травы котику"
                  :class="{ 'input--error': nameError }"
                  required
                />
                <div v-if="nameError" class="error-message">
                  {{ nameError }}
                </div>
                <div v-else-if="form.name && !nameError" class="success-message">
                  Название свободно
                </div>
              </div>

              <div class="form__group">
                <Input
                  v-model="form.short_description"
                  id="product-short-description"
                  label="Краткое описание"
                  placeholder="Кратко о товаре"
                  required
                />
              </div>

              <div class="form__group form__group--full">
                <Textarea
                  v-model="form.description"
                  id="product-description"
                  label="Полное описание"
                  placeholder="Подробное описание товара: материалы, размеры, особенности..."
                  :rows="3"
                  required
                />
              </div>
                
                <div class="form__group">
                  <Input
                    v-model.number="form.price"
                    id="product-price"
                    label="Цена (целое число в рублях)"
                    type="number"
                    placeholder="0"
                    step="100"
                    required
                  />
                </div>

                 <Dropdown
                  v-model="form.tags"
                  :options="allTags"
                  optionLabel="name"
                  optionValue="id"
                  label="Теги"
                  placeholder="Выберите теги"
                  :multiple="true"
                />

                <div class="form__group">
                  <Checkbox
                    v-model="form.is_active"
                    id="product-is-active"
                    label="Активен (показывать в каталоге)"
                  />
                </div>
            
              <div class="form__footer">
                <div class="form__footer-actions">
                  <button 
                    type="submit" 
                    class="btn btn--primary"
                    :disabled="loading || nameError"
                  >
                    <span v-if="loading"></span>
                    {{ loading ? 'Создание...' : 'Создать товар' }}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div class="create-product__upload">
            <FileUpload
              v-model="form.images"
              id="product-images"
              label="Изображения товара"
              :multiple="true"
            />
          </div>
        </div>

        <div v-if="success" class="alert alert--success">
          Товар успешно создан! 
        </div>
      </div>
    </div>
  `,
})
