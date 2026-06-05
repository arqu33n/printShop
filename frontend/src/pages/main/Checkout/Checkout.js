import './Checkout.css'
import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { useMaterialsStore } from '@model/materialsStore.js'
import { useColorsStore } from '@model/colorsStore.js'
import { useOrdersStore } from '@model/ordersStore.js'
import { productsManager } from '@managers/productsManager'
import { materialsManager } from '@managers/materialsManager'
import { ordersManager } from '@managers/ordersManager'
import { colorsManager } from '@managers/colorsManager'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs'
import { Input } from '@component/UI/Input/Input'
import { Error } from '@component/UI/Error/Error'
import { formatPrice, getProductImage } from '@helpers'

export default defineComponent({
  name: 'Checkout',

  components: {
    Breadcrumbs,
    Input,
    Error,
  },

  props: {
    productId: {
      type: [String, Number],
      required: true,
    },
    colorId: {
      type: [String, Number],
      default: null,
    },
    materialId: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {
      productsStore: useProductsStore(),
      materialsStore: useMaterialsStore(),
      colorsStore: useColorsStore(),
      ordersStore: useOrdersStore(),

      form: {
        name: '',
        surname: '',
        email: '',
        phone: '',
        address: '',
        product_id: null,
        quantity: 1,
        color_id: null,
        material_id: null,
      },

      loading: false,
      orderId: null,
      orderCreated: false,
    }
  },

  computed: {
    selectedProduct() {
      return this.productsStore.products.find((p) => p.id == this.productId) || null
    },
    colorName() {
      if (!this.colorId) return null
      const color = this.colorsStore.allColors.find((c) => c.id == this.colorId)
      return color?.name || this.colorId
    },
    materialName() {
      if (!this.materialId) return null
      const material = this.materialsStore.allMaterials.find((m) => m.id == this.materialId)
      return material?.name || this.materialId
    },
    productImage() {
      return getProductImage(this.selectedProduct)
    },
    totalPrice() {
      if (!this.selectedProduct) return 0

      let price = Number(this.selectedProduct.price)

      const materials = this.materialsStore.allMaterials

      if (this.materialId && materials?.length) {
        const material = materials.find((m) => String(m.id) === String(this.materialId))
        if (material?.price_coef) {
          price = price * parseFloat(material.price_coef)
        }
      }

      return Math.round(price * Number(this.form.quantity || 1))
    },

    formattedPrice() {
      return formatPrice(this.totalPrice)
    },

    isValidPhone() {
      const phone = this.form.phone.replace(/\D/g, '')
      return phone.length === 11
    },

    isFormValid() {
      return (
        this.form.name.trim() &&
        this.form.surname.trim() &&
        this.form.email.trim() &&
        this.isValidPhone &&
        this.form.address.trim() &&
        this.selectedProduct
      )
    },
    breadcrumbItems() {
      const items = [
        { path: '/', title: 'Главная' },
        { path: '/catalog', title: 'Каталог' },
      ]

      if (this.selectedProduct) {
        items.push({
          path: { name: 'product', params: { id: this.selectedProduct.id } },
          title: this.selectedProduct.name,
        })
      }

      items.push({ path: '', title: 'Оформление заказа' })

      return items
    },
  },

  watch: {
    productId: {
      immediate: true,
      handler(newId) {
        this.form.product_id = newId
      },
    },

    colorId: {
      immediate: true,
      handler(newColorId) {
        this.form.color_id = newColorId
      },
    },

    materialId: {
      immediate: true,
      handler(newMaterialId) {
        this.form.material_id = newMaterialId
      },
    },
  },

  methods: {
    cleanPhone(value) {
      return value.replace(/\D/g, '')
    },

    handlePhoneInput(event) {
      const cleaned = this.cleanPhone(event.target.value)
      this.form.phone = cleaned
    },

    async submitOrder() {
      if (!this.isFormValid || this.loading) return

      this.loading = true

      try {
        const orderData = {
          name: this.form.name.trim(),
          surname: this.form.surname.trim(),
          email: this.form.email.trim(),
          phone: this.form.phone,
          address: this.form.address.trim(),
          product_id: this.form.product_id,
          quantity: this.form.quantity,
          price: this.totalPrice.toString(),
          color_id: this.form.color_id,
          material_id: this.form.material_id,
        }

        const response = await ordersManager.createOrder(orderData)

        this.orderId = response.id || response.order_id
        this.orderCreated = true
      } finally {
        this.loading = false
      }
    },
  },

  async created() {
    if (!this.productsStore.products.length) {
      await productsManager.fetchAllProducts()
    }
    await materialsManager.fetchAllMaterials()
    await colorsManager.fetchAllColors()
  },

  template: `
    <div class="checkout">
      <Breadcrumbs :items="breadcrumbItems"/>
      <Error :store="ordersStore"/>
      <div class="checkout-container">
        <div class="checkout__card">
        <template v-if="!orderCreated">
          <h2 class="checkout__title">Оформление заказа</h2>

          <div v-if="selectedProduct" class="product">
            <img 
              :src="productImage" 
              :alt="selectedProduct.name"
              class="product__image"
            />

            <div class="product__info">
              <h3 class="product__name">{{ selectedProduct.name }}</h3>
              <p class="product__price">{{ formattedPrice }}</p>

              <div class="product__meta">
                <span v-if="colorName"><strong>Цвет:</strong> {{ colorName  }}</span>
                <span v-if="materialName "><strong>Материал:</strong> {{ materialName  }}</span>

                <div class="product__quantity">
                  <strong>Количество:</strong>
                  <div class="quantity-control">
                    <button 
                      type="button" 
                      class="quantity-btn"
                      @click="form.quantity = Math.max(1, form.quantity - 1)"
                    >−</button>
                    <input 
                      type="number" 
                      v-model.number="form.quantity" 
                      min="1"
                      class="quantity-input"
                      @input="form.quantity = Math.max(1, parseInt(form.quantity) || -1)"
                    />
                    <button 
                      type="button" 
                      class="quantity-btn"
                      @click="form.quantity = form.quantity + 1"
                    >+</button>
                  </div>
                </div>


              </div>
            </div>
          </div>

          <form v-if="!orderCreated" class="form" @submit.prevent="submitOrder">
            <div class="form__row">
              <div class="form__group">
                  <Input
                    v-model="form.name"
                    id="checkout-name"
                    label="Имя"
                    placeholder="Введите имя"
                    required
                  />
              </div>

              <div class="form__group">
                <Input
                  v-model="form.surname"
                  id="checkout-surname"
                  label="Фамилия"
                  placeholder="Введите фамилию"
                  required
                />
              </div>
            </div>

            <div class="form__row">
              <div class="form__group">
                <label>Email *</label>
                <input v-model="form.email" type="email" required placeholder="example@mail.com" />
              </div>

              <div class="form__group">
                <label>Телефон *</label>
                <input 
                  v-model="form.phone" 
                  type="tel" 
                  required 
                  placeholder="+7 (___) ___-__-__"
                  @input="handlePhoneInput"
                  :disabled="loading"
                />
                <div v-if="form.phone && !isValidPhone" class="error-text">
                  Введите корректный номер телефона (11 цифр)
                </div>
              </div>
            </div>

            <div class="form__group">
              <label>Адрес доставки *</label>
              <textarea 
                v-model="form.address" 
                rows="3" 
                required 
                placeholder="Город, улица, дом, квартира"
              ></textarea>
            </div>

            <div class="form__footer">
              <div class="total">
                <span>Итого:</span>
                <strong>{{ formattedPrice }}</strong>
              </div>

              <button class="btn" type="submit" :disabled="loading || !isFormValid">
                {{ loading ? 'Отправка…' : 'Оформить заказ' }}
              </button>
            </div>
          </form>
      </template>
          <div  v-else class="success">
            <div class="success-content">Заказ успешно оформлен. Номер заказа: <strong>{{ orderId }}</strong></div>
            <router-link to="/catalog" class="btn">Вернуться в каталог</router-link>
          </div>
        </div>
      </div>
    </div>
  `,
})
