import './MainScreen.css'
import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { useTagsStore } from "@model/tagsStore.js"
import previewImg from '@images/main/preview-img.jpg'
import newItemsImg from '@images/main/new-items-img.png'
import hitsImg from '@images/main/hits.png'
import allImg from '@images/main/all-img.jpg'
import discountsImg from '@images/main/discounts.png'
import { newItems } from '@component/UI/tags/new-items/index.js'
import { hits } from '@component/UI/tags/hits/index.js'
import { discounts } from '@component/UI/tags/discounts/index.js'
import { all } from '@component/UI/tags/all/index.js'
import { MainProducts } from '@component/main/MainProducts/MainProducts.js'
import { normalizeProduct } from '@storeUtils/productUtils'
import {tagsManager} from "@managers/tagsManager.js"

export default defineComponent({
	name: 'MainScreen',

	components: {
		newItems,
		hits,
		discounts,
		all,
		MainProducts,
	},

	data() {
		const serverProductsRaw =
			typeof window !== 'undefined' &&
			window.__APP_DATA__ &&
			Array.isArray(window.__APP_DATA__.first_page_products)
				? window.__APP_DATA__.first_page_products
				: []
		return {
			productsStore: useProductsStore(),
			tagsStore: useTagsStore(),
			serverProducts: serverProductsRaw.map(normalizeProduct),
			previewImg,
			newItemsImg,
			hitsImg,
			discountsImg,
			allImg,
		}
	},

	async mounted() {
		await tagsManager.fetchAllTags()
	},

	computed: {
		paginatedProducts() {
			if (this.serverProducts && this.serverProducts.length) {
				return this.serverProducts
			}
			return this.productsStore.catalogProducts || []
		},

		hitsTagId() {
			const tag = this.tagsStore.allTags.find(t =>
				t.name.toLowerCase().includes('хит') || t.tag_type === 'hits'
			)
			return tag?.id || 1
		},
		discountsTagId() {
			const tag = this.tagsStore.allTags.find(t =>
				t.name.toLowerCase().includes('скидк') || t.tag_type === 'discount'
			)
			return tag?.id || 2
		},
	},

	template: `
      <img :src="previewImg" class="preview">
      <MainProducts :products="paginatedProducts" class="preview-product"/>
      <div class="benefit">
        <h1 class="benefit__header">Вам может быть интересно</h1>
        <div class="benefit__list">
          <router-link
              :to="{ path: '/catalog', query: { sort_by: 'date', order: 'desc' }}"
              class="benefit__item --new__items"
          >
            <div class="benefit__tag">
              <newItems/>
            </div>
            <img :src="newItemsImg" class="benefit__img">
          </router-link>

          <router-link
              :to="{ path: '/catalog', query: { 'tag-id': hitsTagId }}"
              class="benefit__item --hits"
          >
            <div class="benefit__tag">
              <hits/>
            </div>
            <img :src="hitsImg" class="benefit__img">
          </router-link>

          <router-link
              :to="{ path: '/catalog', query: { 'tag-id': discountsTagId }}"
              class="benefit__item --discounts"
          >
            <div class="benefit__tag">
              <discounts/>
            </div>
            <img :src="discountsImg" class="benefit__img">
          </router-link>

          <router-link
              :to="{ path: '/catalog' }"
              class="benefit__item --all"
          >
            <div class="benefit__tag">
              <all/>
            </div>
            <img :src="allImg" class="benefit__img">
          </router-link>

        </div>
      </div>
	`,
})