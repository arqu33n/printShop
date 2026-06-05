import { defineComponent } from 'vue'
import './Pagination.css'

export const Pagination = defineComponent({
  name: 'Pagination',

  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    nextPage: {
      type: Number,
      default: null,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: null,
    },
  },

  computed: {
    computedTotalPages() {
      if (this.totalPages !== null) {
        return this.totalPages
      }
      if (this.totalItems) {
        return Math.ceil(this.totalItems / this.perPage)
      }
      return this.nextPage ? this.nextPage : this.currentPage
    },

    hasNextPage() {
      return this.currentPage < this.computedTotalPages
    },

    hasPrevPage() {
      return this.currentPage > 1
    },

    // rangeText() {
    //   if (!this.totalItems) {
    //     return `Страница ${this.currentPage} из ${this.computedTotalPages}`
    //   }

    //   const startItem = (this.currentPage - 1) * this.perPage + 1
    //   let endItem = this.currentPage * this.perPage
    //   if (endItem > this.totalItems) {
    //     endItem = this.totalItems
    //   }

    //   return `${startItem}–${endItem} из ${this.totalItems} товаров`
    // },
    // visiblePages() {
    //   const total = this.computedTotalPages
    //   const current = this.currentPage
    //   console.log('total:', total, 'current:', current)
    //   // Если всего страниц 5 или меньше - показываем все
    //   if (total <= 5) {
    //     const pages = Array.from({ length: total }, (_, i) => i + 1)
    //     console.log('pages:', pages)
    //     return pages
    //   }

    //   const pages = []

    //   // Первая страница
    //   pages.push(1)

    //   // Левая часть
    //   if (current > 3) {
    //     pages.push('...')
    //   }

    //   // Центральная часть (всегда 3 страницы вокруг текущей)
    //   for (let i = current - 1; i <= current + 1; i++) {
    //     if (i > 1 && i < total) {
    //       pages.push(i)
    //     }
    //   }

    //   // Правая часть
    //   if (current < total - 2) {
    //     pages.push('...')
    //   }

    //   // Последняя страница
    //   if (total > 1) {
    //     pages.push(total)
    //   }

    //   // Убираем дубли
    //   return pages.filter((v, i, a) => v === '...' || a.indexOf(v) === i)
    // },
    visiblePages() {
      const total = this.computedTotalPages
      const pages = []

      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }

      return pages
    },
  },

  methods: {
    goToPage(page) {
      if (typeof page !== 'number') return
      if (page < 1 || page > this.computedTotalPages) return
      if (page === this.currentPage) return

      this.$emit('page-change', page)
    },

    goToPrev() {
      if (this.hasPrevPage) {
        this.goToPage(this.currentPage - 1)
      }
    },

    goToNext() {
      if (this.hasNextPage) {
        this.goToPage(this.currentPage + 1)
      }
    },

    goToFirst() {
      this.goToPage(1)
    },

    goToLast() {
      this.goToPage(this.computedTotalPages)
    },
  },

  template: `
    <nav class="pagination" v-if="computedTotalPages > 1">

      <div class="pagination__controls">
        <button
          class="pagination__arrow pagination__arrow--double"
          :disabled="!hasPrevPage"
          @click="goToFirst"
          title="Первая страница"
        >
          «
        </button>

        <button
          class="pagination__arrow"
          :disabled="!hasPrevPage"
          @click="goToPrev"
          title="Предыдущая страница"
        >
          ‹
        </button>

        <template v-for="(item, index) in visiblePages" :key="index">
          <button
            v-if="item === '...'"
            class="pagination__dots"
            disabled
          >
            ...
          </button>
          <button
            v-else
            class="pagination__button"
            :class="{ 'pagination__button--active': item === currentPage }"
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </template>

        <button
          class="pagination__arrow"
          :disabled="!hasNextPage"
          @click="goToNext"
          title="Следующая страница"
        >
          ›
        </button>

        <button
          class="pagination__arrow pagination__arrow--double"
          :disabled="!hasNextPage"
          @click="goToLast"
          title="Последняя страница"
        >
          »
        </button>
      </div>
    </nav>
  `,
})
