import { defineComponent } from 'vue'
import './ProductCard.css'
import { formatPrice, getProductImage } from '@helpers'

export const ProductCard = defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasTags() {
      return this.product.tags && this.product.tags.length > 0
    },
    mainProductImage() {
      return getProductImage(this.product)
    },
    formattedPrice() {
      return formatPrice(this.product.price)
    },
  },

  template: `
    <router-link 
      :to="{ name: 'product', params: { id: product.id } }"
      class="product-card"
    >
      <div class="product-card__tags" v-if="hasTags">
        <div v-for="tag in product.tags" 
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
      <div class="product-card__image">
        <img 
          :src="mainProductImage" 
          :alt="product.name"
          class="product-card__img"
        />
      </div>
      <div class="product-card__content">
        <div class="product-card__info">
        <div class="product-card__title">{{ product.name }}</div>
        <div class="product-card__price">{{ formattedPrice }}</div>
        </div>
        <div class="product-card__desc">{{ product.short_description }}</div>
      </div>
    </router-link>
  `,
})
