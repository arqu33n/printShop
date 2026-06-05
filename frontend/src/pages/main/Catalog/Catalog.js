import './Catalog.css'
import { defineComponent } from 'vue'
import { useProductsStore } from '@model/productsStore.js'
import { useTagsStore } from '@model/tagsStore.js'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs'
import { ProductList } from '@component/main/ProductList/ProductList'
import { Pagination } from '@component/UI/Pagination/Pagination'
import { CatalogFilters } from '@component/main/CatalogFilters/CatalogFilters'
import { productsManager } from "@managers/productsManager"
import {tagsManager} from "@managers/tagsManager";

export default defineComponent({
  name: 'Catalog',

  components: {
    Breadcrumbs,
    ProductList,
    Pagination,
    CatalogFilters,
  },

  data() {
    return {
      productsStore: useProductsStore(),
      tagsStore: useTagsStore(),
      filters: {
        sortByDate: false,
        sortByPrice: null,
        selectedTag: null,
      },
      totalItemsCount: 0,
      filteredTotalCount: 0,
    }
  },

  computed: {
    breadcrumbItems() {
      return [
        { path: '/', title: 'Главная' },
        { path: '', title: 'Каталог' },
      ]
    },
    // totalItems() {
    //   return this.productsStore.totalCount
    // },
    allTags() {
      console.log('Tags from store:', this.tagsStore.allTags)
      return this.tagsStore.allTags || []
    },
  },

  methods: {
    async handleFilterChange(newFilters) {
      console.log('Filters:', newFilters)
      this.filters = { ...newFilters }

      const query = {
        page: 1,
      }
      if (newFilters.selectedTag) {
        query['tag-id'] = newFilters.selectedTag
      }
      if (newFilters.sortByDate) {
        query.sort_by = 'date'
        query.order = 'desc'
      } else if (newFilters.sortByPrice) {
        query.sort_by = 'price'
        query.order = newFilters.sortByPrice
      }

      await this.$router.push({ query })
    },

    async loadPage(page) {
      await this.$router.push({
        query: {
          ...this.$route.query,
          page,
        },
      })
    },

    initFiltersFromQuery() {
      const query = this.$route.query

      const newFilters = {
        sortByDate: false,
        sortByPrice: null,
        selectedTag: query['tag-id'] ? Number(query['tag-id']) : null,
      }

      if (query.sort_by === 'price') {
        newFilters.sortByPrice = query.order === 'desc' ? 'desc' : 'asc'
      } else if (query.sort_by === 'date') {
        newFilters.sortByDate = true
      }

      if (JSON.stringify(this.filters) !== JSON.stringify(newFilters)) {
        this.filters = newFilters
      }
    },
    getTagIdsByType(tagType) {
      if (!tagType) return []
      return this.allTags.filter((tag) => tag.tag_type === tagType).map((tag) => tag.id)
    },
  },

  watch: {
    '$route.query': {
      async handler(newQuery) {
        this.initFiltersFromQuery()

        const page = newQuery.page || 1
        let result

        if (newQuery.sort_by) {
          const params = {
            order: newQuery.order || 'asc',
            page: page,
          }
          if (this.filters.selectedTag) {
            params.tagId = this.filters.selectedTag
          }
          result = await productsManager.sortProducts(newQuery.sort_by, params, true)
        } else if (this.filters.selectedTag) {
          result = await productsManager.fetchProductsPageWithTag(page, this.filters.selectedTag, true)
        } else {
          result = await productsManager.fetchProductsPage(page, true)
        }
        if (this.filters.selectedTag || newQuery.sort_by) {
          this.filteredTotalCount = result?.pagination?.total || 0
        } else {
          this.totalItemsCount = await productsManager.fetchProductsCount()
        }
      },
      immediate: true,
    },
  },

  async created() {
    this.totalItemsCount = await productsManager.fetchProductsCount()
    await tagsManager.fetchAllTags()
  },

  template: `
    <div class="catalog">
      <Breadcrumbs :items="breadcrumbItems"/>
      
      <div class="catalog__container">
        <aside class="catalog__aside">
          <CatalogFilters 
            :modelValue="filters"
            :tags="allTags"
            @update:modelValue="handleFilterChange"
          />
        </aside>
        
        <main class="catalog__content">
          <ProductList :products="productsStore.catalogProducts" />
          
          <Pagination
            :current-page="productsStore.pagination.current_page"
            :next-page="productsStore.pagination.next_page"
            :per-page="productsStore.pagination.per_page"
             :total-items="filters.selectedTag || filters.sort_by ? filteredTotalCount : totalItemsCount"
            @page-change="loadPage"
          />
        </main>
      </div>
    </div>
  `,
})
