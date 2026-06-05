import '@css/styles.css'
import { AdminHeader } from '@component/admin/AdminHeader/AdminHeader'
import { AdminSidebar } from '@component/admin/AdminSidebar/AdminSidebar'

export const AdminLayout = {
  name: 'AdminLayout',
  components: {
    AdminHeader,
    AdminSidebar,
  },
  props: {
    sidebar: {
      type: Boolean,
      default: true,
    },
  },
  template: `
    <div class="layout admin">
      <AdminHeader class="layout__header"/>
      <AdminSidebar v-if="sidebar" class="layout__sidebar" />
      <main class="layout__content">
        <slot></slot>
      </main>
    </div>
  `,
}
