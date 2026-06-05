import { defineComponent } from 'vue'
import { useOrdersStore } from '@model/ordersStore'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs'
import { Pagination } from '@component/UI/Pagination/Pagination'
import { formatPrice, formatDate } from '@helpers'
import actionsIcons from '@images/icons/actions'
import './Orders.css'
import {ordersManager} from "@managers/ordersManager";

export default defineComponent({
  name: 'Orders',

  components: {
    Breadcrumbs,
    Pagination,
  },

  data() {
    return {
      ordersStore: useOrdersStore(),
      icons: actionsIcons,
      showTip: false,
      tipMessage: '',
      tipType: 'error',
    }
  },

  computed: {
    orders() {
      return this.ordersStore.orders
    },
    breadcrumbItems() {
      return [
        { path: '/', title: 'Дашборд' },
        { path: '', title: 'Заказы' },
      ]
    },
    totalItems() {
      return this.ordersStore.totalCount
    },
    formatPrice() {
      return (price) => formatPrice(price)
    },
    formatDate() {
      return (date) => formatDate(date)
    },
  },

  methods: {
    async loadPage(page) {
      await ordersManager.fetchOrdersPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    showTipMessage(message, type = 'error') {
      this.tipMessage = message
      this.tipType = type
      this.showTip = true

      setTimeout(() => {
        this.showTip = false
      }, 3000)
    },
  },

  async created() {
    await ordersManager.fetchOrdersCount()
    await ordersManager.fetchOrdersPage(1)
  },

  template: `
    <div class="admin-orders__container">
      <div v-if="showTip" class="tip" :class="'tip-' + tipType">
        {{ tipMessage }}
      </div>

      <Breadcrumbs :items="breadcrumbItems" />

      <div class="admin-grid orders-grid">
        <div class="admin-grid__header orders-grid__header">
          <div class="admin-grid__header-cell">ID заказа</div>
          <div class="admin-grid__header-cell">Покупатель</div>
          <div class="admin-grid__header-cell">Телефон</div>
          <div class="admin-grid__header-cell">Email</div>
          <div class="admin-grid__header-cell">Сумма</div>
          <div class="admin-grid__header-cell">Дата</div>
          <div class="admin-grid__header-cell">Действия</div>
        </div>

        <div 
          v-for="order in orders" 
          :key="order.id"
          class="admin-grid__row orders-grid__row"
        >
          <div class="admin-grid__cell orders-grid__cell --id">#{{ order.id }}</div>
          <div class="admin-grid__cell orders-grid__cell --customer">{{ order.name }} {{ order.surname || '' }}</div>
          <div class="admin-grid__cell orders-grid__cell --phone">{{ order.phone }}</div>
          <div class="admin-grid__cell orders-grid__cell --email">{{ order.email }}</div>
          <div class="admin-grid__cell orders-grid__cell --price">{{ formatPrice(order.price) }}</div>
          <div class="admin-grid__cell orders-grid__cell --date">{{ formatDate(order.created_at) }}</div>
          <div class="admin-grid__cell orders-grid__cell --actions">
            <router-link 
              :to="{ name: 'admin.ordersDetail', params: { id: order.id } }"
              class="admin-product__action-link"
              title="Просмотреть заказ"
            >
              <img 
                :src="icons.view" 
                alt="Просмотреть" 
                class="admin-product__icon"
              />
            </router-link>
          </div>
        </div>

        <div v-if="!orders.length" class="admin-grid__empty">
          Заказы не найдены
        </div>
      </div>

      <Pagination
        :current-page="ordersStore.pagination?.current_page || 1"
        :next-page="ordersStore.pagination?.next_page"
        :per-page="ordersStore.pagination?.per_page || 10"
        :total-items="totalItems"
        @page-change="loadPage"
      />
    </div>
  `,
})
