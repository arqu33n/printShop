import { useAuthStore } from '@model/authStore'
import { authService } from '@services/auth'
import { handleBusinessError, handleTechnicalError } from '@errors'

export const authManager = {
  async login(formData) {
    const store = useAuthStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await authService.login(formData)
      console.log('login response:', response)
      if (response?.success && response.items?.length) {
        store.setUser(response.items[0])
        return response
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        return businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[AuthManager] Technical error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async logout() {
    const store = useAuthStore()
    store.setLoading(true)
    store.setError(null)

    try {
      await authService.logout()
      store.clearAuth()
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[AuthManager] Logout error:', processedError.message)
    } finally {
      store.setLoading(false)
    }
  },

  async checkAuth() {
    const store = useAuthStore()

    if (store.isAuthenticated) {
      return true
    }

    try {
      const response = await authService.getMe()

      if (response?.authorized && response.user) {
        store.setUser(response.user)
        return true
      } else {
        store.clearAuth()
        return false
      }
    } catch (error) {
      console.warn('CheckAuth error:', handleTechnicalError(error).message)
      store.clearAuth()
      return false
    }
  },

  initAuth() {
    this.checkAuth()
  },
}
