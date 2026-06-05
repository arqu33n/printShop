import { useMaterialsStore } from '@model/materialsStore.js'
import { materialsService } from '@services/materials'
import { normalizeMaterial } from '@storeUtils/materialsUtils'
import { handleTechnicalError, handleBusinessError } from '@errors'

export const materialsManager = {
  hydrate(rawMaterials) {
    if (!Array.isArray(rawMaterials)) {
      return
    }

    const store = useMaterialsStore()
    const normalized = rawMaterials.map(normalizeMaterial)
    store.setMaterials(normalized)
  },

  async fetchAllMaterials() {
    const store = useMaterialsStore()

    store.setLoading(true)
    store.setError(null)

    try {
      const materials = await materialsService.getMaterials()
      const normalizedMaterials = materials.map(normalizeMaterial)
      store.setMaterials(normalizedMaterials)
      return normalizedMaterials
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[MaterialsManager] Fetch error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

	async createMaterial(materialData) {
		const store = useMaterialsStore()
		store.setLoading(true)
		store.setError(null)

		try {
			const response = await materialsService.createMaterial(materialData)

			if (response?.success) {
				await this.fetchAllMaterials()
				return normalizeMaterial(response)
			} else {
				const businessError = handleBusinessError(response)
				store.setError(businessError)
				throw businessError
			}
		} catch (error) {
			const processedError = handleTechnicalError(error)
			store.setError(processedError)
			console.error('[MaterialsManager] Create error:', processedError.message)
			throw error
		} finally {
			store.setLoading(false)
		}
	},
}
