import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    pagination: {
      current_page: 1,
      per_page: 10,
      next_page: null,
      total: 0,
    },
    loading: false,
    error: null,
  }),

  actions: {
    setOrders(orders) {
      this.orders = orders
    },

    removeOrder(id) {
      this.orders = this.orders.filter((order) => order.id != id)
      this.pagination.total = this.orders.length
    },

    setPagination(pagination) {
      this.pagination = pagination
    },

    setCountTotal(count) {
      this.countTotal = count
    },

    setLoading(status) {
      this.loading = status
    },

    setError(error) {
      this.error = error
    },

    updateOrderInStore(order) {
      const existingIndex = this.orders.findIndex((o) => o.id === order.id)
      if (existingIndex !== -1) {
        this.orders[existingIndex] = order
      } else {
        this.orders.push(order)
      }
    },

    clearError() {
      this.error = null
    },
  },

  getters: {
    totalCount: (state) => state.countTotal,
    allOrders: (state) => state.orders,
    getOrderById: (state) => (id) => state.orders.find((o) => o.id === id) || null,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
})
