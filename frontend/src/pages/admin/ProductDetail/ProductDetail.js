import './ProductDetail.css'
import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { productsManager } from '@managers/productsManager'
import { tagsManager } from '@managers/tagsManager'
import { useTagsStore } from '@model/tagsStore.js'
import { Input } from '@component/UI/Input/Input'
import { Textarea } from '@component/UI/Textarea/Textarea'
import { Dropdown } from '@component/UI/Dropdown/Dropdown'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs'
import { Button } from '@component/UI/Button/Button'
import { Error } from '@component/UI/Error/Error'
import { formatPrice, formatDate } from '@helpers'

export default defineComponent({
  name: 'ProductDetail',

  components: {
    Breadcrumbs,
    Button,
    Input,
    Textarea,
    Dropdown,
    Error,
  },

  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      productsStore: useProductsStore(),
      tagsStore: useTagsStore(),
      isEditing: false,
      isEditingTags: false,
      originalProduct: null,
      editForm: {
        name: '',
        price: 0,
        description: '',
        short_description: '',
        created_at: '',
      },
      tagsForm: {
        tags: [],
      },
      originalTags: [],
    }
  },

  computed: {
    product() {
      return this.productsStore.products.find((p) => p.id == this.id) || null
    },

    breadcrumbItems() {
      return [
        { path: '/', title: 'Дашборд' },
        { path: '/products', title: 'Товары' },
        { path: '', title: this.product?.name || 'Товар' },
      ]
    },

    productImages() {
      return this.product?.images || []
    },

    productTags() {
      return this.product?.tags || []
    },

    formattedPrice() {
      return this.product ? formatPrice(this.product.price) : ''
    },

    formattedDate() {
      return this.product?.created_at ? formatDate(this.product.created_at) : ''
    },

    allTags() {
      return this.tagsStore.allTags || []
    },

    changedFields() {
      if (!this.originalProduct) return {}

      const changes = {}
      const fields = ['name', 'price', 'description', 'short_description']

      fields.forEach((field) => {
        if (this.editForm[field] != this.originalProduct[field]) {
          changes[field] = this.editForm[field]
        }
      })

      return changes
    },

    hasChanges() {
      return Object.keys(this.changedFields).length > 0
    },

    tagsChanged() {
      if (!this.originalTags) return false
      return JSON.stringify(this.tagsForm.tags) !== JSON.stringify(this.originalTags)
    },

    pageState() {
      if (this.productsStore.loading) return 'loading'
      if (!this.product) return 'not-found'
      return 'product'
    },
  },

  watch: {
    product: {
      handler(newProduct) {
        if (newProduct) {
          this.originalProduct = {
            name: newProduct.name || '',
            price: newProduct.price || 0,
            description: newProduct.description || '',
            short_description: newProduct.short_description || '',
            created_at: newProduct.created_at || '',
          }

          this.editForm = { ...this.originalProduct }

          const tagIds = newProduct.tags?.map((tag) => tag.id) || []
          this.originalTags = [...tagIds]
          this.tagsForm.tags = [...tagIds]
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    startEditing() {
      this.isEditing = true
    },

    cancelEditing() {
      this.isEditing = false
      if (this.originalProduct) {
        this.editForm = { ...this.originalProduct }
      }
    },

    async saveChanges() {
      const changedData = this.changedFields

      if (Object.keys(changedData).length === 0) {
        this.isEditing = false
        return
      }

      const updateData = { ...changedData }

      if (updateData.tags) {
        updateData.tags = updateData.tags
      }

      await productsManager.updateProduct(this.id, changedData)

      await productsManager.fetchProductById(this.id)

      this.originalProduct = { ...this.editForm }
      this.isEditing = false
    },

    startEditingTags() {
      this.isEditingTags = true
    },

    cancelEditingTags() {
      this.isEditingTags = false
      this.tagsForm.tags = [...this.originalTags]
    },

    async saveTags() {
      if (!this.tagsChanged) {
        this.isEditingTags = false
        return
      }
      const oldTags = this.originalTags || []
      const newTags = this.tagsForm.tags || []

      const tagsToAdd = newTags.filter((tag) => !oldTags.includes(tag))
      const tagsToRemove = oldTags.filter((tag) => !newTags.includes(tag))

      const operations = []

      if (tagsToAdd.length > 0) {
        operations.push(tagsManager.updateTags(this.id, tagsToAdd))
      }

      if (tagsToRemove.length > 0) {
        operations.push(tagsManager.deleteTags(this.id, tagsToRemove))
      }

      await Promise.all(operations)

      await productsManager.fetchProductById(this.id)

      this.originalTags = [...this.tagsForm.tags]
      this.isEditingTags = false
    },

    getTagNames(tagIds) {
      if (!tagIds || !this.allTags.length) return 'Нет тегов'

      const tags = this.allTags.filter((tag) => tagIds.includes(tag.id))
      return tags.map((tag) => tag.name).join(', ')
    },

    isFieldChanged(field) {
      return this.editForm[field] != this.originalProduct?.[field]
    },
  },

  async created() {
    await productsManager.fetchProductById(this.id)
    await tagsManager.fetchAllTags()
  },

  template: `
    <div class="product-detail">
      <Breadcrumbs :items="breadcrumbItems" />
      <Error :store="productsStore" />

      <div v-if="pageState === 'loading'" class="loading-state">
        Загрузка товара...
      </div>

      <div v-else-if="pageState === 'not-found'" class="not-found">
        Товар не найден
      </div>
      
      <div v-else class="product-info">
        <div class="product-info__header">
          <div class="product-info__title">Изображения</div>
        </div>
          <div class="product-info__images">
            <div v-if="productImages.length > 0" class="images-grid">
              <div 
                v-for="image in productImages" 
                :key="image.id"
                class="images-grid__item-wrap"
              >
                <img 
                  :src="image.url" 
                  :alt="product.name"
                  class="images-grid__item"
                  @error="$event.target.src = '/placeholder.jpg'"
                />
              </div>
            </div>
          </div>

          <div class="product-info__form-header">
            <div class="product-info__form-title">Информация о продукте</div>
            <div class="product-info__form-actions">
              <button 
                v-if="!isEditing" 
                @click="startEditing" 
                class="edit-btn"
              >
                Редактировать
              </button>
            </div>
            </div>
            <div class="product-info__form">
              <div class="form-group">
              <label for="product-name-edit">Название товара</label>
                <Input
                  v-if="isEditing" 
                  v-model="editForm.name" 
                  id="product-name-edit"
                  type="text" 
                  class="form-input"
                  placeholder="Введите название"
                  />
                <div v-else class="info-text">{{ product.name }}</div>
              </div>

              <div class="form-group">
                <label for="product-price-edit">Цена:</label>
                <Input
                  v-if="isEditing" 
                  v-model.number="editForm.price"
                  id="product-price-edit" 
                  type="number" 
                  min="0"
                  step="0.01"
                  class="form-input"
                  placeholder="Введите цену"
                  />
                <div v-else class="info-text">{{ formattedPrice }}</div>
              </div>

              <div class="form-group">
                <label for="product-short_description-edit">Краткое описание:</label>
                <Input
                  v-if="isEditing" 
                  v-model="editForm.short_description"
                  id="product-short_description-edit"  
                  class="form-input"
                  placeholder="Введите краткое описание"
                />
                <div v-else class="info-text description-text">{{ product.short_description || 'Нет описания' }}</div>
              </div>

              <div class="form-group">
                <label for="product-description-edit">Подробное описание:</label>
                <Textarea
                  v-if="isEditing" 
                  v-model="editForm.description" 
                  id="product-description-edit"
                  class="form-textarea"
                  rows="4"
                  placeholder="Введите подробное описание"
                />
                <div v-else class="info-text description-text">{{ product.description || 'Нет описания' }}</div>
              </div>
            </div>
    
        <div v-if="isEditing" class="action-buttons">
          <Button 
            @click="saveChanges" 
            color="primary"
          >
            Сохранить
          </Button>
          <Button 
            @click="cancelEditing" 
            color="secondary"
          >
            Отмена
          </Button>
        </div>

        <div class="product-info__header --tags">
          <div class="product-info__title">Ярлыки</div>
          <div class="product-info__header-actions">
            <button 
              v-if="!isEditingTags" 
              @click="startEditingTags" 
              class="edit-btn"
            >
              Редактировать ярлыки
            </button>
          </div>
        </div>
        
        <div class="product-info__tags">
          <div v-if="!isEditingTags" class="tags-display">
            <span 
              v-for="tag in product.tags" 
              :key="tag.id"
              class="tag-badge"
              :style="{
                backgroundColor: tag.styles?.background,
                borderColor: tag.styles?.border,
                color: tag.styles?.text
              }"
            >
              {{ tag.name }}
            </span>
            <span v-if="!product.tags.length" class="no-tags">Нет ярлыков</span>
          </div>

          <div v-else class="tags-edit">
            <Dropdown
              v-model="tagsForm.tags"
              :options="allTags"
              optionLabel="name"
              optionValue="id"
              placeholder="Выберите ярлыки"
              :multiple="true"
              class="tags-dropdown"
            />
            <div class="tags-actions">
              <Button 
                @click="saveTags" 
                color="primary"
                :disabled="!tagsChanged"
              >
                Сохранить ярлыки
              </Button>
              <Button 
                @click="cancelEditingTags" 
                color="secondary"
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      </div>  
    </div>
  `,
})
