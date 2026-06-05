import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@model/authStore'
import { authManager } from '@managers/authManager'

const loadAdminPage = (page) => () => import(`@pages/admin/${page}/${page}.js`)

const routes = [
  {
    path: '/login',
    name: 'admin.login',
    component: loadAdminPage('Login'),
    meta: { noLayout: true },
  },
  {
    path: '/',
    name: 'admin.dashboard',
    component: loadAdminPage('Dashboard'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'admin.products',
    component: loadAdminPage('Products'),
    meta: { requiresAuth: true },
  },
  {
    path: '/create-product',
    name: 'admin.createProduct',
    component: loadAdminPage('CreateProduct'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'admin.orders',
    component: loadAdminPage('Orders'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id',
    name: 'admin.ordersDetail',
    component: loadAdminPage('OrderDetail'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/product/:id',
    name: 'product',
    component: loadAdminPage('ProductDetail'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/create-color',
    name: 'admin.createColor',
    component: loadAdminPage('CreateColor'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/create-tag',
    name: 'admin.createTag',
    component: loadAdminPage('CreateTag'),
    meta: { requiresAuth: true },
    props: true,
  },
	{
		path: '/create-material',
		name: 'admin.createMaterial',
		component: loadAdminPage('CreateMaterial'),
		meta: { requiresAuth: true },
		props: true,
	},
  {
    path: '/:pathMatch(.*)*',
    name: 'admin.not-found',
    component: loadAdminPage('NotFound'),
  },
]

export const adminRouter = createRouter({
  history: createWebHistory('/admin/'),
  routes,
})

adminRouter.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const isAuth = await authManager.checkAuth()

  if (to.name === 'admin.login') {
    if (isAuth) {
      next({ name: 'admin.dashboard' })
    } else {
      next()
    }
  } else if (to.meta.requiresAuth) {
    if (isAuth) {
      next()
    } else {
      next({ name: 'admin.login' })
    }
  } else {
    next()
  }
})
