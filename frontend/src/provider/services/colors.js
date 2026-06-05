import { apiClient } from '@provider/apiClient'

export const colorsService = {
  getColorsRaw() {
    return apiClient.get('/colors')
  },

  createColorRaw(colorData) {
    return apiClient.post('/create/color', colorData)
  },

  async getColors() {
    try {
      const response = await this.getColorsRaw()
      const colors = Array.isArray(response) ? response : response.items || []
      return colors
    } catch (error) {
      handleApiError(error, 'getColors')
    }
  },

  async createColor(colorData) {
    try {
      const response = await this.createColorRaw(colorData)
      return response
    } catch (error) {
      handleApiError(error, 'createColor')
    }
  },
}
