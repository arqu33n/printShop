import { defineComponent } from 'vue'
import './AdminHeader.css'
import { SearchInput } from '@component/UI/Input/SearchInput'
import adminIcon from '@images/admin/admin-icon.svg'
import logoutIcon from '@images/admin/logout-icon.svg'
import { useAuthStore } from '@model/authStore.js'
import {authManager} from "@managers/authManager.js";

export const AdminHeader = defineComponent({
  name: 'AdminHeader',

  components: {
    SearchInput,
  },

  data() {
    return {
      searchText: '',
      adminIcon: adminIcon,
      logoutIcon: logoutIcon,
      authStore: useAuthStore(),
    }
  },
  computed: {
    userName() {
      return this.authStore.userName
    },
  },
  methods: {
    async handleLogout() {
      await authManager.logout()
      this.$router.push('/login')
    },
  },
  watch: {
    searchText(newValue) {
      console.log('search:', newValue)
    },
  },
  created() {
    authManager.initAuth()
  },

  template: `
    <div class="admin-header">
      <div class="admin-header__search">
        <SearchInput
          v-model="searchText"
          placeholder="Поиск товаров..."
        />
      </div>
      <div class="admin-header__auth">
      <div>{{ userName }}</div>
      <img :src="adminIcon" class="admin-header__auth-icon" />
      <img 
          :src="logoutIcon" 
          class="admin-header__auth-icon --logout" 
          @click="handleLogout"
          title="Выйти"
        />
      </div>
    </div>
  `,
})
