import { apiClient } from '@provider/apiClient'
import { handleApiError } from '@provider/errorHandler'
import { normalizeMaterial } from "@storeUtils/materialsUtils.js";

export const materialsService = {
  getMaterialsRaw() {
    return apiClient.get('/materials')
  },

	createMaterialRaw(materialData) {
		return apiClient.post('/create/material', materialData)
	},

  async getMaterials() {
    try {
      const response = await this.getMaterialsRaw()
      const materials = Array.isArray(response) ? response : response.items || []
      return materials
    } catch (error) {
      handleApiError(error, 'getMaterials')
    }
  },

	async createMaterial(materialData) {
		try {
			const response = await this.createMaterialRaw(materialData)
			return normalizeMaterial() ? normalizeMaterial(response) : response
		} catch (error) {
			error.userMessage = 'Не удалось создать цвет'
			error.context = 'createMaterial'
			console.error('Ошибка в createMaterial:', error)
			throw error
		}
	},

}
