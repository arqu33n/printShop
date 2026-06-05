import { apiClient } from '@provider/apiClient'
import { handleApiError } from '@provider/errorHandler'

export const ordersService = {
  getOrdersRaw(page = null) {
    const url = page ? `/orders?page=${page}` : '/orders'
    return apiClient.get(url)
  },

  getOrderByIdRaw(id) {
    return apiClient.get(`/orders/${id}`)
  },

  getOrdersCountRaw() {
    return apiClient.get('/orders/count')
  },

  createOrderRaw(data) {
    return apiClient.post('/create/order', data)
  },

  deleteOrderRaw(id) {
    return apiClient.post('/delete/order', { id })
  },

  async getAllOrders() {
    try {
      let page = 1
      let allOrders = []

      while (true) {
        const response = await this.getOrdersRaw(page)

        if (!response) break

        let items = []

        if (Array.isArray(response.items)) {
          items = response.items
        } else if (response.items && typeof response.items === 'object') {
          items = [response.items]
        } else {
          break
        }

        allOrders = [...allOrders, ...items]

        if (!response.next_page) break
        page = response.next_page
      }

      return allOrders
    } catch (error) {
      handleApiError(error, 'getAllOrders')
    }
  },

  async getOrdersPage(page = 1) {
    try {
      const response = await this.getOrdersRaw(page)

      let items = []
      if (Array.isArray(response.items)) {
        items = response.items
      } else if (response.items && typeof response.items === 'object') {
        items = [response.items]
      }

      return {
        orders: items,
        pagination: {
          current_page: response.current_page || 1,
          per_page: response.per_page || 10,
          next_page: response.next_page || null,
          total: response.total || 0,
        },
      }
    } catch (error) {
      handleApiError(error, 'getOrdersPage')
    }
  },

  async getOrderById(id) {
    try {
      const response = await this.getOrderByIdRaw(id)

      if (Array.isArray(response.items)) {
        return response.items[0]
      }
      return response
    } catch (error) {
      handleApiError(error, 'getOrderById')
    }
  },

  async getOrdersCount() {
    try {
      const response = await this.getOrdersCountRaw()
      const count = response?.orders_count ?? response?.count ?? response ?? 0
      return count
    } catch (error) {
      handleApiError(error, 'getOrdersCount')
    }
  },

  async createOrder(orderData) {
    try {
      const newOrder = await this.createOrderRaw(orderData)
      return newOrder
    } catch (error) {
      handleApiError(error, 'createOrder')
    }
  },

  async deleteOrder(id) {
    try {
      const response = await this.deleteOrderRaw(id)
      return response
    } catch (error) {
      handleApiError(error, 'deleteOrder')
    }
  },
}
