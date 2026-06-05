import { createApp, defineComponent } from 'vue'
import { createPinia } from 'pinia'
import { shopRouter } from '@router/shop'
import { ShopLayout } from '@layout/main/'
import { useProductsStore } from "@model/productsStore";
import { productsManager } from '@managers/productsManager'

const App = defineComponent({
	name: 'App',
	components: {
		ShopLayout,
	},

	data: () => (window.__APP_DATA__ || {}),

	template: `
      <ShopLayout>
        <router-view />
      </ShopLayout>
	`,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(shopRouter)

if (window.__APP_DATA__ && window.__APP_DATA__.first_page_products) {
	productsManager.hydrate(window.__APP_DATA__.first_page_products)
}

app.mount('#application')
