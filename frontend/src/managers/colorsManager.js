import { useColorsStore } from '@model/colorsStore.js'
import { colorsService } from '@services/colors'
import { normalizeColorList, normalizeColor } from '@storeUtils/colorsUtils'
import { handleTechnicalError, handleBusinessError } from '@errors'

export const colorsManager = {
  hydrate(rawColors) {
    if (!Array.isArray(rawColors)) return

    const store = useColorsStore()
    store.setColors(normalizeColorList(rawColors))
  },

  async fetchAllColors() {
    const store = useColorsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const colors = await colorsService.getColors()
      const normalizedColors = normalizeColorList(colors)
      store.setColors(normalizedColors)
      return normalizedColors
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ColorsManager] Fetch error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async createColor(colorData) {
    const store = useColorsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await colorsService.createColor(colorData)

      if (response?.success) {
        await this.fetchAllColors()
        return normalizeColor(response)
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[ColorsManager] Create error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },
}
