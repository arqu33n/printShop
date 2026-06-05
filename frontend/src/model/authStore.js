import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  actions: {
    setLoading(status) {
      this.loading = status
    },

    setError(error) {
      this.error = error
    },

    setUser(user) {
      this.user = user
      this.isAuthenticated = !!user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },

    clearAuth() {
      this.setUser(null)
      this.error = null
    },
  },

  getters: {
    userName: (state) => state.user?.login || state.user?.name || 'Администратор',
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
})
