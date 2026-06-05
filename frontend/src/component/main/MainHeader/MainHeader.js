import './MainHeader.css'

import logo from '@images/logo.png'
import cartLogo from '@images/icons/cart.png'
import { SearchInput } from '@component/UI/Input/SearchInput'

export const MainHeader = {
  name: 'MainHeader',

  components: {
    SearchInput,
  },

  data() {
    return {
      logo,
      cartLogo,
      searchText: '',
    }
  },

  watch: {
    searchText(newValue) {
      console.log('search:', newValue)
    },
  },

  template: `
		<header class="header">
			<router-link to="/" class="header__logo">
				<img :src="logo" >
			</router-link>
			<div class="header__search">
				<SearchInput
          v-model="searchText"
          placeholder="Поиск товаров..."
        />
			</div>
			<nav class="header__nav">
			  <router-link to="/catalog" style="text-decoration: none">Каталог</router-link>
			  <a href="#contacts" style="text-decoration: none">Контакты</a>
			  <button class="header__cart">
				<img :src="cartLogo">
			  </button>
			</nav>
		</header>
	`,
}
