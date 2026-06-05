import { apiClient } from '@provider/apiClient'
import { handleApiError } from '@provider/errorHandler'

export const tagsService = {
  getTagsRaw() {
    return apiClient.get('/tags')
  },

  createTagRaw(data) {
    return apiClient.post('/create/tag', data)
  },

  updateTagsRaw(data) {
    return apiClient.post('/change/product/add-tags', data)
  },

  deleteTagsRaw(data) {
    return apiClient.post('/change/product/delete-tags', data)
  },

  async getTags() {
    try {
      const response = await this.getTagsRaw()
      return Array.isArray(response) ? response : response.items || []
    } catch (error) {
      handleApiError(error, 'getTags')
    }
  },

  async createTag(tagData) {
    try {
      const newTag = await this.createTagRaw(tagData)
      return newTag
    } catch (error) {
      handleApiError(error, 'createTag')
    }
  },

  async updateTags(tagData) {
    try {
      const response = await this.updateTagsRaw(tagData)
      return response
    } catch (error) {
      handleApiError(error, 'updateTags')
    }
  },
  async deleteTags(data) {
    try {
      const response = await this.deleteTagsRaw(data)
      return response
    } catch (error) {
      handleApiError(error, 'deleteTags')
    }
  },
}
