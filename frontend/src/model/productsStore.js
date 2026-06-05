import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    catalogProducts: [],
    pagination: {
      current_page: 1,
      per_page: 10,
      next_page: null,
    },
    sortParams: {
      type: 'price',
      order: 'asc',
    },
    countTotal: 0,
    loading: false,
    error: null,
  }),

  actions: {
    setProducts(products) {
      this.products = products
    },

    setCatalogProducts(products) {
      this.catalogProducts = products
    },

    setPagination(pagination) {
      this.pagination = pagination
    },

    setSortParams(sortParams) {
      this.sortParams = sortParams
    },

    setCountTotal(countTotal) {
      this.countTotal = countTotal
    },

    setLoading(status) {
      this.loading = status
    },

    setError(error) {
      this.error = error
    },

    removeProduct(id) {
      this.products = this.products.filter((p) => p.id != id)

      this.catalogProducts = this.catalogProducts.filter((p) => p.id != id)

      this.pagination.total = this.products.length
    },

    updateProductInStore(product) {
      const existingIndex = this.products.findIndex((o) => o.id === product.id)
      if (existingIndex !== -1) {
        this.products[existingIndex] = product
      } else {
        this.products.push(product)
      }
    },

    clearError() {
      this.error = null
    },
  },

  getters: {
    totalCount: (state) => state.countTotal,
    currentPage: (state) => state.pagination.current_page,
    hasNextPage: (state) => !!state.pagination.next_page,
    currentCatalogProducts: (state) => state.catalogProducts,
    allProducts: (state) => state.products,
    getProductById: (state) => (id) => state.products.find((p) => p.id === id) || null,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
})
