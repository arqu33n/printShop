import { defineComponent } from 'vue'
import './CatalogFilters.css'
import { Checkbox } from '@component/UI/Checkbox/Checkbox'

export const CatalogFilters = defineComponent({
  name: 'CatalogFilters',

  components: {
    Checkbox,
  },

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:modelValue'],

  computed: {
    sortByDate() {
      return this.modelValue.sortByDate || false
    },
    sortByPrice() {
      return this.modelValue.sortByPrice || null
    },
    selectedTag() {
      return this.modelValue.selectedTag || null
    },
  },

  methods: {
    toggleDateSort() {
      const newValue = {
        ...this.modelValue,
        sortByDate: !this.sortByDate,
        sortByPrice: null,
      }
      this.$emit('update:modelValue', newValue)
    },

    togglePriceSort(direction) {
      const newValue = {
        ...this.modelValue,
        sortByDate: false,
        sortByPrice: this.sortByPrice === direction ? null : direction,
      }
      this.$emit('update:modelValue', newValue)
    },

    selectTag(tagId) {
      const newValue = {
        ...this.modelValue,
        selectedTag: this.selectedTag === tagId ? null : tagId,
      }
      this.$emit('update:modelValue', newValue)
    },

    resetFilters() {
      this.$emit('update:modelValue', {
        sortByDate: false,
        sortByPrice: null,
        selectedTag: null,
      })
    },
  },

  template: `
    <div class="catalog-filters">
      
      <div class="filters-header">
        <h3 class="filters-title">Фильтры</h3>
        <button 
          class="filters-reset"
          @click="resetFilters"
        >
          Сбросить
        </button>
      </div>

      <div class="filter-group">
        <h4 class="filter-group__title">Сортировка</h4>

        <div class="sort-buttons">
          
          <button
            class="sort-button"
            :class="{ 'sort-button--active': sortByDate }"
            @click="toggleDateSort"
          >
            По новизне
          </button>

          <button
            class="sort-button"
            :class="{ 'sort-button--active': sortByPrice === 'asc' }"
            @click="togglePriceSort('asc')"
          >
            По возрастанию цены
          </button>

          <button
            class="sort-button"
            :class="{ 'sort-button--active': sortByPrice === 'desc' }"
            @click="togglePriceSort('desc')"
          >
            По убыванию цены
          </button>

        </div>
      </div>
      
      <div class="filter-group">
        <div class="checkbox-group">
          <Checkbox
            v-for="tag in tags" 
            :key="tag.id"
            :modelValue="selectedTag === tag.id"
            @update:modelValue="selectTag(tag.id)"
            :id="'tag-' + tag.id"
            :label="tag.name"
          />
        </div>
      </div>

    </div>
  `,
})
