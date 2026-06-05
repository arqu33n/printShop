import { useOrdersStore } from '@model/ordersStore.js'
import { ordersService } from '@services/orders'
import { normalizeOrder } from '@storeUtils/orderUtils'
import { handleTechnicalError, handleBusinessError } from '@errors'

export const ordersManager = {
  async fetchAllOrders() {
    const store = useOrdersStore()

    store.setLoading(true)
    store.setError(null)

    try {
      const orders = await ordersService.getAllOrders()
      const normalizedOrders = orders.map(normalizeOrder)
      store.setOrders(normalizedOrders)
      store.setCountTotal(normalizedOrders.length)
      return normalizedOrders
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[OrdersManager] Fetch all error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async fetchOrdersPage(page = 1) {
    const store = useOrdersStore()

    store.setLoading(true)
    store.setError(null)

    try {
      const result = await ordersService.getOrdersPage(page)
      const normalizedOrders = result.orders.map(normalizeOrder)
      store.setOrders(normalizedOrders)
      store.setPagination(result.pagination)
      store.setCountTotal(result.pagination.total)
      return {
        ...result,
        orders: normalizedOrders,
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[OrdersManager] Fetch page error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async fetchOrdersCount() {
    const store = useOrdersStore()

    store.setLoading(true)
    store.setError(null)

    try {
      const count = await ordersService.getOrdersCount()
      store.setCountTotal(count)
      return count
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[OrdersManager] Fetch count error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async fetchOrderById(id) {
    const store = useOrdersStore()

    store.setLoading(true)
    store.setError(null)

    try {
      const order = await ordersService.getOrderById(id)
      const normalizedOrder = normalizeOrder(order)
      store.updateOrderInStore(normalizedOrder)
      return normalizedOrder
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[OrdersManager] Fetch by id error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async createOrder(orderData) {
    const store = useOrdersStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await ordersService.createOrder(orderData)

      if (response?.success) {
        const newOrder = normalizeOrder(response)
        store.updateOrderInStore(newOrder)
        store.setCountTotal(store.countTotal + 1)
        return newOrder
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[OrdersManager] Create error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async deleteOrder(id) {
    const store = useOrdersStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await ordersService.deleteOrder(id)

      if (response?.success) {
        store.removeOrder(id)
        store.setCountTotal(store.countTotal - 1)
        return response
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      if (error?.type === 'business') {
        throw error
      }
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[OrdersManager] Delete error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },
}
