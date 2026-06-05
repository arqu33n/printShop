import { defineStore } from 'pinia'


export const useColorsStore = defineStore('colors', {
  state: () => ({
    colors: [],
    loading: false,
    error: null,
  }),

  actions: {
	  setColors(colors) {
		  this.colors = colors
	  },

    setLoading(status) {
      this.loading = status
    },

    setError(error) {
      this.error = error
    },

  },

  getters: {
    allColors: (state) => state.colors,
    getColorStyle: (state) => (id) => {
      const color = state.colors.find((c) => c.id === id)
      return color ? { backgroundColor: color.hex_rgb } : {}
    },
  },
})
