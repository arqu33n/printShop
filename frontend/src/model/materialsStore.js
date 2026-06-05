import { defineStore } from 'pinia'

export const useMaterialsStore = defineStore('materials', {
  state: () => ({
    materials: [],
    loading: false,
    error: null,
  }),

  actions: {
	  setMaterials(materials) {
		  this.materials = materials
	  },

    setLoading(status) {
      this.loading = status
    },

    setError(error) {
      this.error = error
    },

    clearError() {
      this.error = null
    },
	  //
	  // updateMaterialInStore(material) {
		//   const existingIndex = this.materials.findIndex((m) => m.id === material.id)
		//   if (existingIndex !== -1) {
		// 	  this.materials[existingIndex] = material
		//   } else {
		// 	  this.materials.push(material)
		//   }
	  // },

  },

  getters: {
    allMaterials: (state) => state.materials,
    totalCount: (state) => state.materials.length,
    getMaterialById: (state) => (id) => state.materials.find((m) => m.id === id) || null,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
})
