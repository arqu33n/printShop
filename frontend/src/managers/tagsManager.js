import { useTagsStore } from '@model/tagsStore.js'
import { tagsService } from '@services/tags'
import { normalizeTag } from '../utils/tagsUtils'
import { handleTechnicalError, handleBusinessError } from '@errors'

export const tagsManager = {
  async fetchAllTags() {
    const store = useTagsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const tags = await tagsService.getTags()
      const normalizedTags = tags.map(normalizeTag)
      store.setTags(normalizedTags)
      return normalizedTags
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[TagsManager] Fetch error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async createTag(tagData) {
    const store = useTagsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await tagsService.createTag(tagData)

      if (response?.success) {
        const newTag = normalizeTag(response)
        return newTag
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[TagsManager] Create error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async updateTags(productId, tagIds) {
    const store = useTagsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await tagsService.updateTags({
        id: productId,
        tags: tagIds,
      })

      if (response?.success) {
        return response
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[TagsManager] Update error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },

  async deleteTags(productId, tagIds) {
    const store = useTagsStore()
    store.setLoading(true)
    store.setError(null)

    try {
      const response = await tagsService.deleteTags({
        id: productId,
        tags: tagIds,
      })

      if (response?.success) {
        return response
      } else {
        const businessError = handleBusinessError(response)
        store.setError(businessError)
        throw businessError
      }
    } catch (error) {
      const processedError = handleTechnicalError(error)
      store.setError(processedError)
      console.error('[TagsManager] Delete error:', processedError.message)
      throw error
    } finally {
      store.setLoading(false)
    }
  },
}
