import { defineComponent } from 'vue'
import { ProductCard } from '@component/main/ProductCard/ProductCard'
import './ProductList.css'

export const ProductList = defineComponent({
  name: 'ProductList',

  components: {
    ProductCard,
  },

  props: {
    products: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  template: `
    <div class="product-list">
      <div v-if="products.length === 0" class="product-list__empty">
        Товары не найдены
      </div>
      <div v-else class="product-list__grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  `,
})
