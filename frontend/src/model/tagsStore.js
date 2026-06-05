import { defineStore } from 'pinia'

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [],
    loading: false,
    error: null,
  }),
  actions: {
    setTags(tags) {
      this.tags = tags
    },
    setLoading(status) {
      this.loading = status
    },

    setError(error) {
      this.error = error
    },
  },
  getters: {
    allTags: (state) => state.tags,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
})
