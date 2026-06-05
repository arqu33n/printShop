import './Dashboard.css'
import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { useOrdersStore } from '@model/ordersStore.js'
import { mapState } from 'pinia'
import { formatPrice, getProductImage } from '@helpers'
import arrowIcon from '@images/icons/arrow-up-right.svg'
import {productsManager} from "@managers/productsManager.js";
import {ordersManager} from "@managers/ordersManager.js";

export default defineComponent({
  name: 'Dashboard',

  data() {
    return {
      productsService: null,
      ordersService: null,
      arrowIcon: arrowIcon,
      isLoading: true,
    }
  },

  computed: {
    ...mapState(useProductsStore, {
      productsCount: 'totalCount',
    }),
    ...mapState(useOrdersStore, {
      ordersCount: 'totalCount',
      orders: 'allOrders',
    }),
    totalRevenue() {
      if (!this.orders || this.orders.length === 0) return 0
      return this.orders.reduce((sum, order) => sum + (Number(order.price) || 0), 0)
    },
    averageOrderValue() {
      if (!this.orders || this.orders.length === 0) return 0
      const total = this.orders.reduce((sum, order) => sum + (Number(order.price) || 0), 0)
      return total / this.orders.length
    },
    topProduct() {
      if (!this.orders || this.orders.length === 0) return null

      const productCounts = {}

      this.orders.forEach((order) => {
        const productName = order.product_model?.name || 'Неизвестный товар'
        productCounts[productName] = (productCounts[productName] || 0) + 1
      })

      let maxCount = 0
      let topProductName = ''

      Object.entries(productCounts).forEach(([name, count]) => {
        if (count > maxCount) {
          maxCount = count
          topProductName = name
        }
      })
      const topOrder = this.orders.find((order) => order.product_model?.name === topProductName)

      return {
        name: topProductName,
        count: maxCount,
        product: topOrder?.product_model || null,
        image: topOrder?.product_model?.images?.[0] || null,
      }
    },
  },

  methods: {
    formatPrice(price) {
      return formatPrice(price)
    },
    getProductImage(product) {
      return getProductImage(product)
    },
  },

  async created() {
    await productsManager.fetchProductsCount()
    await ordersManager.fetchOrdersCount()
    await ordersManager.fetchAllOrders()
    this.isLoading = false
    await this.$nextTick()
  },

  template: `
   <div class="admin-dashboard">
    <div class="dashboard-panel">
      <div class="dashboard-panel__item">
        <div class="dashboard-panel__item-header">
          <div class="dashboard-panel__item-title">Самый популярный товар</div>
          <router-link to="products" class="dashboard-panel__item-link">
            Смотреть все
            <img :src="arrowIcon" class="dashboard-card__icon"/>
          </router-link>
        </div>
        
        <div class="dashboard-panel__item-content">
          <template v-if="!topProduct">
            <div class="dashboard-panel__item-image skeleton"></div>
            <div class="dashboard-panel__item-info">
              <div class="dashboard-panel__item-name skeleton"></div>
              <div class="dashboard-panel__item-count skeleton"></div>
            </div>
          </template>
          
          <template v-else>
            <img 
              v-if="topProduct.product"
              :src="getProductImage(topProduct.product)" 
              :alt="topProduct.name"
              class="dashboard-panel__item-image"
            />
            <div class="dashboard-panel__item-info">
              <div class="dashboard-panel__item-name">{{ topProduct.name }}</div>
              <div class="dashboard-panel__item-count">{{ topProduct.count }} {{ topProduct.count === 1 ? 'заказ' : 'заказов' }}</div>
            </div>
          </template>
        </div>
      </div>
      </div>
      <div class="dashboard-grid">
        <div class="dashboard-card --total-revenue">
          <div class="dashboard-card__header">
            <div class="dashboard-card__title">Общая выручка</div>
          </div>
          <div class="dashboard-card__value" :class="{ 'skeleton': isLoading }">{{ formatPrice(totalRevenue) }}</div>
        </div>
        <router-link to="orders" class="dashboard-card">
          <div class="dashboard-card__header">
            <div class="dashboard-card__title">Всего заказов</div>
            <img :src="arrowIcon" class="dashboard-card__icon"/>
          </div>
          <div class="dashboard-card__value">{{ ordersCount }}</div>
        </router-link>      
        <div class="dashboard-card --avg">
          <div class="dashboard-card__header">
            <div class="dashboard-card__title">Средний чек</div>
          </div>
          <div class="dashboard-card__value" :class="{ 'skeleton': isLoading }">{{ formatPrice(averageOrderValue) }}</div>
        </div>
        <router-link to="products" class="dashboard-card">
          <div class="dashboard-card__header">
            <div class="dashboard-card__title">Всего товаров</div>
            <img :src="arrowIcon" class="dashboard-card__icon"/>
          </div>
          <div class="dashboard-card__value">{{ productsCount }}</div>
        </router-link>
      </div>
    </div>
  `,
})
