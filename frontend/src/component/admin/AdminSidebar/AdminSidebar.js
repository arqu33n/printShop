import { defineComponent } from 'vue'
import './AdminSidebar.css'
import logo from '@images/logo.svg'

export const AdminSidebar = defineComponent({
  name: 'AdminSidebar',
  data() {
    return {
      logo: logo,
    }
  },
  template: `
    <aside class="admin-sidebar">
      <router-link to="/" class="admin-sidebar__logo">
				<img :src="logo"/>
			</router-link>
      <nav class="admin-sidebar__nav">
		<router-link to="/products">Продукты</router-link>
		<router-link to="/create-product">Добавить продукт</router-link>
		<router-link to="/create-color">Добавить цвет</router-link>
		<router-link to="/create-tag">Добавить тег</router-link>
		<router-link to="/create-material">Добавить материал</router-link>
		<router-link to="/orders">Заказы</router-link>
      </nav>
    </aside>
  `,
})
