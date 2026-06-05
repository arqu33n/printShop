import './OrderDetail.css'
import { defineComponent } from 'vue'
import { useOrdersStore } from '@model/ordersStore.js'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs.js'
import { Error } from '@component/UI/Error/Error'
import { formatPrice } from '@helpers'
import { ordersManager } from '@managers/ordersManager.js'

export default defineComponent({
  name: 'OrderDetail',

  components: {
    Breadcrumbs,
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
      ordersStore: useOrdersStore(),
      loading: false,
      currentOrder: null,
      deleting: false,
    }
  },

  computed: {
    breadcrumbItems() {
      return [
        { path: '/', title: 'Главная' },
        { path: '/orders', title: 'Заказы' },
        { path: '', title: `Заказ #${this.id}` },
      ]
    },
    formattedPrice() {
      return (price) => formatPrice(price)
    },
  },

  methods: {
    async deleteOrder() {
      if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return

      this.deleting = true

      try {
        await ordersManager.deleteOrder(this.id)
        this.$router.push('/orders')
      } finally {
        this.deleting = false
      }
    },

    editOrder() {
      console.log('Переход к редактированию заказа:', this.id)
    },
  },

  async created() {
    this.currentOrder = await ordersManager.fetchOrderById(this.id)
  },
  template: `
      <div class="order-detail">
       <Error :store="ordersStore" /> 
        <div class="order-detail__header">
          <h2>Заказ №{{ currentOrder?.id || id }}</h2>
          <Breadcrumbs :items="breadcrumbItems"/>
        </div>

        <div v-if="loading" class="order-detail__loading">
          Загрузка заказа...
        </div>

        <div v-else-if="currentOrder" class="order-detail__content">
          <div class="order-detail__grid">
            <section class="order-detail__section">
              <h3 class="section-header">Данные покупателя</h3>
              <div class="info-card">
                <p><strong class="info-card__item">ФИО:</strong> {{ currentOrder.name }} {{ currentOrder.surname || '' }}</p>
                <p><strong class="info-card__item">Email:</strong> {{ currentOrder.email }}</p>
                <p><strong class="info-card__item">Телефон:</strong> {{ currentOrder.phone }}</p>
                <p><strong class="info-card__item">Адрес:</strong> {{ currentOrder.address || 'Не указан' }}</p>
              </div>
            </section>

            <section class="order-detail__section">
              <h3 class="section-header">Товары в заказе</h3>
              <div class="order-items">
                <table class="order-items__table">
                  <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Кол-во</th>
                    <th>Цена</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in (currentOrder.items || [])" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.quantity }} шт.</td>
                    <td>{{ formattedPrice(item.price) }}</td>
                  </tr>
                  <tr v-if="!currentOrder.items || currentOrder.items.length === 0">
                    <td>{{ currentOrder.product_model?.name }}</td>
                    <td>{{ currentOrder.quantity || 1 }} шт.</td>
                    <td>{{ formattedPrice(currentOrder.price) }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <footer v-if="currentOrder" class="order-detail__footer">
          <button @click="editOrder" class="btn-edit">Редактировать</button>
          <button @click="deleteOrder" class="btn-delete">Удалить</button>
        </footer>

        <div v-else-if="!loading" class="order-detail__error">
          <h2>Заказ не найден</h2>
          <router-link to="/orders">Вернуться к списку</router-link>
        </div>
      </div>
  `,
})
