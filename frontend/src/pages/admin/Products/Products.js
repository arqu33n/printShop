import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs'
import { Pagination } from '@component/UI/Pagination/Pagination'
import { Error } from '@component/UI/Error/Error'
import { formatPrice, getProductImage, formatDate } from '@helpers'
import actionsIcons from '@images/icons/actions'
import './Products.css'
import { productsManager } from '@managers/productsManager'

export default defineComponent({
  name: 'Products',

  components: {
    Breadcrumbs,
    Pagination,
    Error,
  },

  data() {
    return {
      productsStore: useProductsStore(),
      icons: actionsIcons,
      togglingId: null,
      deletingId: null,
    }
  },

  computed: {
    products() {
      return this.productsStore.catalogProducts
    },
    breadcrumbItems() {
      return [
        { path: '/', title: 'Дашборд' },
        { path: '', title: 'Товары' },
      ]
    },
    totalItems() {
      return this.productsStore.totalCount
    },
    formatPrice() {
      return (price) => formatPrice(price)
    },
    formatDate() {
      return (date) => formatDate(date)
    },
    getProductImage() {
      return (product) => getProductImage(product)
    },
    pageState() {
      if (this.productsStore.loading) return 'loading'
      if (!this.products?.length) return 'empty'
      return 'products'
    },
  },
  methods: {
    async loadPage(page) {
      await productsManager.fetchProductsPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    async toggleStatus(product) {
      const newStatus = !product.is_active
      this.togglingId = product.id

      try {
        await productsManager.updateProduct(product.id, {
          is_active: newStatus ? 1 : 0,
        })

        await this.loadPage(this.productsStore.pagination.current_page)
      } finally {
        this.togglingId = null
      }
    },

    async deleteProduct(id) {
      if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

      this.deletingId = id

      try {
        await productsManager.deleteProduct(id)
        await this.loadPage(this.productsStore.pagination.current_page)
      } catch (error) {
        setTimeout(async () => {
          const shouldHide = confirm('Товар нельзя удалить. Хотите скрыть его из каталога?')

          if (shouldHide) {
            try {
              await productsManager.updateProduct(id, {
                is_active: 0,
              })
              await this.loadPage(this.productsStore.pagination.current_page)
            } catch (hideError) {
              console.log('Ошибка скрытия:', hideError)
            }
          }
        }, 100)
      } finally {
        this.deletingId = null
      }
    },
  },
  async created() {
    await productsManager.fetchProductsCount()
    await productsManager.fetchProductsPage(1, false)
  },
  template: `
<div class="admin-products__container">
    <Breadcrumbs :items="breadcrumbItems" />  
    <Error :store="productsStore" />     

    <div v-if="pageState === 'loading'" class="admin-grid__message">
      Загрузка товаров...
    </div>

    <div v-else-if="pageState === 'empty'" class="admin-grid__message">
      Товары не найдены
    </div>

    <div  v-else class="admin-grid">
      <div class="admin-grid__header">
        <div class="admin-grid__header-cell">Продукт</div>
        <div class="admin-grid__header-cell">Цена</div>
        <div class="admin-grid__header-cell">Видимость</div>
        <div class="admin-grid__header-cell">Дата</div>
        <div class="admin-grid__header-cell">Управление</div>
      </div>
      
      <div 
        v-for="product in products" 
        :key="product.id"
        class="admin-grid__row"
      >
        <div class="admin-grid__cell --product">
          <div class="admin-product__info">
            <img
              :src="getProductImage(product)"
              :alt="product.name"
              class="admin-product__image"
            />
            <div class="admin-product__name">{{ product.name }}</div>
          </div>
        </div>
        
        <div class="admin-grid__cell --price">
          {{ formatPrice(product.price)}} 
        </div>
        
        <div class="admin-grid__cell --visibility">
          <div class="toggle-switch">
            <label class="toggle-switch__label">
              <input 
                type="checkbox" 
                class="toggle-switch__input"
                :checked="product.is_active === true || product.is_active === 1"
                @change="toggleStatus(product)"
                :disabled="togglingId === product.id"
              />
              <span class="toggle-switch__slider"></span>
            </label>
          </div>
        </div>
        
        <div class="admin-grid__cell --date">
          {{ formatDate(product.created_at) }}
        </div>
        
        <div class="admin-product__actions">
          <router-link 
            :to="{ name: 'product', params: { id: product.id } }"
            class="admin-product__action-link"
            title="Просмотреть"
          >
            <img :src="icons.view" alt="Просмотреть" class="admin-product__icon" />
          </router-link>
          
          <button 
            class="admin-product__action-btn"
            @click="deleteProduct(product.id)"
            title="Удалить"
          >
            <img :src="icons.delete" alt="Удалить" class="admin-product__icon" />
          </button>
        </div>
      </div>
    </div>
    
    <Pagination
      :current-page="productsStore.pagination.current_page"
      :next-page="productsStore.pagination.next_page"
      :per-page="productsStore.pagination.per_page"
      :total-items="totalItems"
      @page-change="loadPage"
    />
  </div>
  `,
})
