import './MainProducts.css'
import { defineComponent } from 'vue'
import { ProductCard } from '@component/main/ProductCard/ProductCard.js'

export const MainProducts = defineComponent({
  name: 'MainProducts',

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
    <div class="main-list">
      <div class="main-list__grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  `,
})
