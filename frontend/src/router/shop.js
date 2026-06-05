import { createRouter, createWebHistory } from 'vue-router'

const loadShopPage = (page) => () => import(`@pages/main/${page}/${page}.js`).then((m) => m.default || m)

const routes = [
  {
    path: '/',
    name: 'home',
    component: loadShopPage('MainScreen'),
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: loadShopPage('Catalog'),
  },
  {
    path: '/product/:id',
    name: 'product',
    component: loadShopPage('ProductDetail'),
    props: true,
  },
  {
    path: '/checkout/:productId',
    name: 'checkout',
    component: loadShopPage('Checkout'),
    props: (route) => ({
      productId: route.params.productId,
      colorId: route.query.colorId,
      materialId: route.query.materialId,
    }),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: loadShopPage('NotFound'),
  },
]

export const shopRouter = createRouter({
  history: createWebHistory(),
  routes,
})
