import { useProductsStore } from '@model/productsStore'
import { productsService } from '@services/products'
import { normalizeProduct } from '@storeUtils/productUtils'
import { handleTechnicalError, handleBusinessError } from '@errors'

export const productsManager = {
  hydrate(rawProducts) {
    if (!Array.isArray(rawProducts)) return

    const store = useProductsStore()
    const normalized = rawProducts.map(normalizeProduct)

    store.setProducts(normalized)
    store.setCatalogProducts(normalized.slice(0, store.pagination.per_page))
    store.setPagination({
      ...store.pagination,
      total: normalized.length,
    })
  },

  async fetchAllProducts() {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const products = await productsService.getAllProducts()
      const normalizedProducts = products.map(normalizeProduct)
      store.setProducts(normalizedProducts)
      store.setCountTotal(normalizedProducts.length)
      return normalizedProducts
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Fetch all error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async fetchProductsPage(page = 1, activeOnly = false) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const result = await productsService.getProductsPage(page)
      const normalizedProducts = result.products.map(normalizeProduct)

      if (activeOnly) {
        const activeProducts = normalizedProducts.filter((p) => p.is_active === true || p.is_active === 1)
        store.setCatalogProducts(activeProducts)
        store.setPagination(result.pagination)
        return { products: activeProducts, pagination: result.pagination }
      } else {
        store.setCatalogProducts(normalizedProducts)
        store.setPagination(result.pagination)
        return { products: normalizedProducts, pagination: result.pagination }
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Fetch page error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async fetchProductById(id) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const product = await productsService.getProductById(id)
      const normalizedProduct = normalizeProduct(product)
      store.updateProductInStore(normalizedProduct)
      return normalizedProduct
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Fetch by id error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async fetchProductsCount() {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const count = await productsService.getProductsCount()
      store.setCountTotal(count)
      return count
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Fetch count error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async searchProducts(filters = {}) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const products = await productsService.searchProducts(filters)
      const normalizedProducts = products.map(normalizeProduct)
      return normalizedProducts
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Search error:', processedError.message)
      return []
    } finally {
      store.setLoading(false)
    }
  },

  async sortProducts(type, params = {}, activeOnly = false) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const result = await productsService.sortProducts(type, params)
      const normalizedProducts = result.products.map(normalizeProduct)

      if (activeOnly) {
        const activeProducts = normalizedProducts.filter((p) => p.is_active === true || p.is_active === 1)
        store.setCatalogProducts(activeProducts)
        store.setPagination(result.pagination)
        store.setSortParams(result.sortParams)
        return {
          products: activeProducts,
          pagination: result.pagination,
          sortParams: result.sortParams,
        }
      } else {
        store.setCatalogProducts(normalizedProducts)
        store.setPagination(result.pagination)
        store.setSortParams(result.sortParams)
        return {
          products: normalizedProducts,
          pagination: result.pagination,
          sortParams: result.sortParams,
        }
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Sort error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async fetchProductsPageWithTag(page = 1, tagId, activeOnly = false) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const result = await productsService.getProductsPageWithTag(page, tagId)
      const normalizedProducts = result.products.map(normalizeProduct)

      if (activeOnly) {
        const activeProducts = normalizedProducts.filter((p) => p.is_active === true || p.is_active === 1)
        store.setCatalogProducts(activeProducts)
        store.setPagination(result.pagination)
        store.setSortParams(result.sortParams)
        return {
          products: activeProducts,
          pagination: result.pagination,
          sortParams: result.sortParams,
        }
      } else {
        store.setCatalogProducts(normalizedProducts)
        store.setPagination(result.pagination)
        store.setSortParams(result.sortParams)
        return {
          products: normalizedProducts,
          pagination: result.pagination,
          sortParams: result.sortParams,
        }
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Fetch with tag error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async createProduct(productData) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await productsService.createProduct(productData)

      if (response?.success) {
        const product = normalizeProduct(response)
        store.updateProductInStore(product)
        return product
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Create error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async updateProduct(id, productData) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await productsService.updateProduct({ id, ...productData })

      if (response?.success) {
        await this.fetchProductById(id)
        return { success: true }
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Update error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async deleteProduct(id) {
    const store = useProductsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await productsService.deleteProduct(id)

      if (response?.success) {
        store.removeProduct(id)

        if (store.catalogProducts.length === 0 && store.pagination.current_page > 1) {
          const prevPage = store.pagination.current_page - 1
          await this.fetchProductsPage(prevPage)
        }

        return true
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ProductsManager] Delete error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },
}
