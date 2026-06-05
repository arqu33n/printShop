import './ProductDetails.css'
import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { useMaterialsStore } from '@model/materialsStore.js'
import { useColorsStore } from '@model/colorsStore.js'
import { productsManager } from '@managers/productsManager'
import { materialsManager } from '@managers/materialsManager'
import { colorsManager } from '@managers/colorsManager'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs'
import { formatPrice, getProductImage } from '@helpers'
import questionImg from '@images/icons/actions/question-mark.PNG'

export default defineComponent({
  name: 'ProductDetail',

  components: {
    Breadcrumbs,
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
      materialsStore: useMaterialsStore(),
      colorsStore: useColorsStore(),

      selectedColorId: null,
      selectedMaterialId: null,
      selectedImage: null,

      canScrollUp: false,
      canScrollDown: true,

      questionImg,
    }
  },

  computed: {
    product() {
      return this.productsStore.products.find((p) => p.id == this.id) || null
    },

    materials() {
      return this.materialsStore.allMaterials || []
    },

    colors() {
      return this.colorsStore.allColors || []
    },

    breadcrumbItems() {
      return [
        { path: '/', title: 'Главная' },
        { path: '/catalog', title: 'Каталог' },
        { path: '', title: this.product?.name || 'Товар' },
      ]
    },

    selectedColor() {
      return this.colors.find((c) => c.id == this.selectedColorId)
    },

    selectedMaterial() {
      return this.materials.find((m) => m.id == this.selectedMaterialId)
    },

    mainProductImage() {
      if (this.selectedImage) {
        return this.selectedImage.url
      }
      return getProductImage(this.product)
    },

    finalPrice() {
      if (!this.product) return 0

      let price = this.product.price

      if (this.selectedMaterial && this.selectedMaterial.price_coef) {
        price = price * parseFloat(this.selectedMaterial.price_coef)
      }

      return Math.round(price)
    },
    formattedPrice() {
      return formatPrice(this.finalPrice)
    },
    pageState() {
      if (this.productsStore.loading) return 'loading'
      if (!this.product) return 'not-found'
      return 'product'
    },
  },

  methods: {
    goToCheckout() {
      this.$router.push({
        name: 'checkout',
        params: { productId: this.product.id },
        query: {
          colorId: this.selectedColorId,
          materialId: this.selectedMaterialId,
        },
      })
    },

    selectColor(colorId) {
      this.selectedColorId = colorId
    },

    selectMaterial(materialId) {
      this.selectedMaterialId = materialId
    },

    selectImage(image) {
      this.selectedImage = image
    },

    scrollThumbnails(direction) {
      const container = this.$refs.thumbnails
      if (!container) return

      const scrollAmount = 120
      const currentScroll = container.scrollTop

      if (direction === 'up') {
        container.scrollTo({
          top: currentScroll - scrollAmount,
          behavior: 'smooth',
        })
      } else if (direction === 'down') {
        container.scrollTo({
          top: currentScroll + scrollAmount,
          behavior: 'smooth',
        })
      }

      setTimeout(() => this.updateScrollButtons(), 100)
    },

    updateScrollButtons() {
      const container = this.$refs.thumbnails
      if (!container) return

      this.canScrollUp = container.scrollTop > 0

      const maxScroll = container.scrollHeight - container.clientHeight
      this.canScrollDown = container.scrollTop < maxScroll - 1
    },

    handleThumbnailScroll() {
      this.updateScrollButtons()
    },

    getMaterialStyle(material) {
      if (material.imageUrl) {
        return {
          backgroundImage: `url(${material.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      }
      return {}
    },
  },

  async created() {
    await productsManager.fetchProductById(this.id)
    await materialsManager.fetchAllMaterials()
    await colorsManager.fetchAllColors()

    if (this.colors.length > 0) {
      this.selectedColorId = this.colors[0].id
    }
    if (this.materials.length > 0) {
      this.selectedMaterialId = this.materials[0].id
      console.log(this.materials)
    }
    if (this.product && this.product.images && this.product.images.length > 0) {
      const mainImage = this.product.images.find((img) => img.is_main === '1') || this.product.images[0]
      this.selectedImage = mainImage
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updateScrollButtons()

      const container = this.$refs.thumbnails
      if (container) {
        container.addEventListener('scroll', this.handleThumbnailScroll)
      }
    })
  },

  beforeUnmount() {
    const container = this.$refs.thumbnails
    if (container) {
      container.removeEventListener('scroll', this.handleThumbnailScroll)
    }
  },

  template: `
      <div class="product-detail">
        <Breadcrumbs :items="breadcrumbItems" />

        <div v-if="pageState === 'loading'" class="product-detail__loading">
          Загрузка товара...
        </div>

        <div v-else-if="pageState === 'not-found'" class="product-detail__not-found">
          <h2>Товар не найден</h2>
          <p>Извините, товар с ID {{ id }} не существует.</p>
          <router-link to="/catalog" class="product-detail__back-to-catalog">
            Вернуться в каталог
          </router-link>
        </div>

        <div v-else class="product-detail__container">
          <div class="product-detail__images">
            <div class="product-detail__thumbnails-container">
              <button
                  v-if="canScrollUp"
                  class="scroll-arrow scroll-up"
                  @click="scrollThumbnails('up')"
                  aria-label="Прокрутить вверх"
              >
                ↑
              </button>

              <div
                  class="product-detail__thumbnails"
                  ref="thumbnails"
                  @scroll="handleThumbnailScroll"
              >
                <div
                    v-for="image in product.images"
                    :key="image.id"
                    class="product-detail__thumbnail"
                    :class="{ '--active': (!selectedImage && image.is_main === '1') || selectedImage?.id === image.id }"
                    @click="selectImage(image)"
                >
                  <img
                      :src="image.url"
                      :alt="product.name"
                      class="product-detail__thumbnail-image"
                  />
                </div>
              </div>

              <button
                  v-if="canScrollDown"
                  class="scroll-arrow scroll-down"
                  @click="scrollThumbnails('down')"
                  aria-label="Прокрутить вниз"
              >
                ↓
              </button>
            </div>

            <div class="product-detail__main">
              <img
                  :src="mainProductImage"
                  :alt="product.name"
                  class="product-detail__main-image"
              />
            </div>
          </div>

          <div class="product-detail__info">
            <div class="product-detail__title">{{ product.name }}</div>

            <div class="product-detail__options">
              <!-- Цвета -->
              <div class="product-detail__option-group">
                <div class="option-group__title">Цвет:</div>
                <div class="color-options">
                  <button
                      v-for="color in colors"
                      :key="color.id"
                      class="color-option"
                      :class="{ '--selected': selectedColorId == color.id }"
                      @click="selectColor(color.id)"
                      :title="color.name"
                  >
                  <span
                      class="color-option__circle"
                      :style="{ backgroundColor: color.hex_rgb }"
                  ></span>
                    <span class="color-option__name">{{ color.name }}</span>
                  </button>
                </div>
              </div>

              <!-- Материалы -->
              <div class="product-detail__option-group">
                <div class="option-group__title">
                  <div class="title-name">Материал:</div>
                  <div class="tooltip-container">
                    <img
                        v-if="selectedMaterial"
						:src="questionImg" 
						class="title-icon"
						:title="selectedMaterial.description"
					>
                    <img
                        v-else
                        :src="questionImg"
                        class="title-icon"
                        title="Выберите материал для просмотра описания"
                    >
                  </div>
                </div>
                <div class="material-options">
                  <button
                      v-for="material in materials"
                      :key="material.id"
                      class="material-option"
                      :class="{ '--selected': selectedMaterialId == material.id }"
                      @click="selectMaterial(material.id)"
                      :title="material.name"
                  >
                    <div class="material-option__preview">
                      <img
                          v-if="material.imageUrl"
                          :src="material.imageUrl"
                          :alt="material.name"
                          class="material-option__image"
                      />
                    </div>
                    <span class="material-option__name">{{ material.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="product.description" class="product-detail__description">
              <div class="product-detail__description-title">Описание</div>
              <p>{{ product.description }}</p>
            </div>
            <div class="product-detail__price">
              {{ formattedPrice }}
            </div>
            <div class="product-detail__actions">
              <button
                  class="product-detail__add-to-cart"
                  @click="addToCart"
              >
                Добавить в корзину
              </button>

              <button
                  class="product-detail__buy-now"
                  @click="goToCheckout"
              >
                Купить сейчас
              </button>
            </div>
          </div>
        </div>
      </div>
	`,
})
