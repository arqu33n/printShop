import { createApp, defineComponent } from 'vue'
import { createPinia } from 'pinia'
import { adminRouter } from '@router/admin'
import { AdminLayout } from '@layout/admin/'

const AdminApp = defineComponent({
  name: 'AdminApp',
  components: {
    AdminLayout,
  },
  computed: {
    layoutComponent() {
      return this.$route.meta?.noLayout ? 'div' : AdminLayout
    },
  },
  template: `
    <component :is="layoutComponent">
      <router-view />
    </component>
  `,
})

const app = createApp(AdminApp)
app.use(createPinia())
app.use(adminRouter)

app.mount('#application')
