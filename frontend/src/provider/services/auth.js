import { apiClient } from '@provider/apiClient'
import { handleApiError } from '@provider/errorHandler'

export const authService = {
  loginRaw(formData) {
    return apiClient.post('/login', formData)
  },

  logoutRaw() {
    return apiClient.post('/logout')
  },

  meRaw() {
    return apiClient.get('/me')
  },

  async login(formData) {
    try {
      const response = await this.loginRaw(formData)
      return response
    } catch (error) {
      handleApiError(error, 'login')
    }
  },

  async logout() {
    try {
      const response = await this.logoutRaw()
      return response
    } catch (error) {
      handleApiError(error, 'logout')
    }
  },

  async getMe() {
    try {
      const response = await this.meRaw()
      return response
    } catch (error) {
      handleApiError(error, 'getMe')
      throw error
    }
  },
}
