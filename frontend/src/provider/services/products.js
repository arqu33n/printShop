import { apiClient } from '@provider/apiClient'
import { handleApiError } from '@provider/errorHandler'

const IS_ADMIN = window.location.pathname.startsWith('/admin')

function addOnlyActiveParam(url) {
  if (!IS_ADMIN) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}only-active=0`
}

export const productsService = {
  getProductsRaw(page = null) {
    const url = page ? `/products?page=${page}` : '/products'
    return apiClient.get(addOnlyActiveParam(url))
  },

  getProductByIdRaw(id) {
    return apiClient.get(addOnlyActiveParam(`/products/${id}`))
  },

  getProductsCountRaw() {
    return apiClient.get(addOnlyActiveParam('/products/count'))
  },

  createProductRaw(data) {
    return apiClient.postFormData('/create/product', data)
  },

  updateProductRaw(data) {
    return apiClient.post('/change/product', data)
  },

  searchProductsRaw(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.name) queryParams.append('name', params.name)
    const queryString = queryParams.toString()
    const url = queryString ? `/products/search?${queryString}` : '/products/search'
    return apiClient.get(addOnlyActiveParam(url))
  },

  sortProductsRaw(type, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.order) queryParams.append('order', params.order)
    if (params.page) queryParams.append('page', params.page)
    if (params.tagId) queryParams.append('tag-id', params.tagId)
    const queryString = queryParams.toString()
    const url = queryString ? `/products/sort/${type}?${queryString}` : `/products/sort/${type}`
    return apiClient.get(addOnlyActiveParam(url))
  },

  deleteProductRaw(data) {
    return apiClient.post(`/delete/product`, data)
  },

  async getAllProducts() {
    try {
      let page = 1
      let allProducts = []

      while (true) {
        const response = await this.getProductsRaw(page)
        const products = response.items || []
        allProducts = [...allProducts, ...products]

        if (!response.next_page) break
        page = response.next_page
      }

      return allProducts
    } catch (error) {
      handleApiError(error, 'getAllProducts')
    }
  },

  async getProductsPage(page = 1) {
    try {
      const response = await this.getProductsRaw(page)

      return {
        products: response.items || [],
        pagination: {
          current_page: response.current_page || 1,
          per_page: response.per_page || 10,
          next_page: response.next_page || null,
        },
      }
    } catch (error) {
      handleApiError(error, 'getProductsPage')
    }
  },

  async getProductById(id) {
    try {
      const response = await this.getProductByIdRaw(id)
      if (Array.isArray(response.items)) {
        return response.items[0]
      }
      return response
    } catch (error) {
      handleApiError(error, 'getProductById')
    }
  },

  async getProductsCount() {
    try {
      const response = await this.getProductsCountRaw()
      const count = response?.products_count ?? response?.count ?? response ?? 0
      return count
    } catch (error) {
      handleApiError(error, 'getProductsCount')
    }
  },

  async sortProducts(type, params = {}) {
    try {
      const response = await this.sortProductsRaw(type, params)

      let items = []

      if (response?.items) {
        items = Array.isArray(response.items) ? response.items : [response.items]
      }

      return {
        products: items,
        pagination: {
          current_page: response?.current_page || 1,
          per_page: response?.per_page || 10,
          next_page: response?.next_page || null,
        },
        sortParams: {
          type,
          order: params.order || 'asc',
        },
      }
    } catch (error) {
      handleApiError(error, 'sortProducts')
    }
  },

  async searchProducts(params = {}) {
    try {
      const response = await this.searchProductsRaw(params)

      let items = []
      if (Array.isArray(response?.items)) {
        items = response.items
      } else if (response?.items && typeof response.items === 'object') {
        items = [response.items]
      } else if (Array.isArray(response)) {
        items = response
      }
      return items
    } catch (error) {
      handleApiError(error, 'searchProducts')
    }
  },

  async getProductsPageWithTag(page = 1, tagId) {
    try {
      const params = {
        order: 'asc',
        page: page,
        tagId: tagId,
      }
      return await this.sortProducts('price', params)
    } catch (error) {
      handleApiError(error, 'getProductsPageWithTag')
    }
  },

  async createProduct(data) {
    try {
      const response = await this.createProductRaw(data)

      return response
    } catch (error) {
      handleApiError(error, 'createProduct')
    }
  },

  async updateProduct(data) {
    try {
      const response = await this.updateProductRaw(data)
      return response
    } catch (error) {
      error.userMessage = 'Не удалось обновить товар'
      error.context = 'updateProduct'
      console.error(`Ошибка в updateProduct для id ${data.id}:`, error)
      throw error
    }
  },

  async deleteProduct(id) {
    try {
      const response = await this.deleteProductRaw({ id })
      return response
    } catch (error) {
      handleApiError(error, 'deleteProduct')
    }
  },
}
