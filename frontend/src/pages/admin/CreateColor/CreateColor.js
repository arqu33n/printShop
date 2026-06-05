import './CreateColor.css'
import { Breadcrumbs } from '@component/UI/Breadcrumbs/Breadcrumbs.js'
import { Input } from '@component/UI/Input/Input.js'
import { Error } from '@component/UI/Error/Error'
import { defineComponent } from 'vue'
import { useColorsStore } from '@model/colorsStore.js'
import { colorsManager } from '@managers/colorsManager.js'

export default defineComponent({
  name: 'CreateColor',

  components: {
    Breadcrumbs,
    Input,
    Error,
  },

  data() {
    return {
      colorsStore: useColorsStore(),
      form: {
        name: '',
        hex_rgb: '',
      },
      loading: false,
      success: false,
      nameError: null,
      hexError: null,
    }
  },

  computed: {
    allColors() {
      return this.colorsStore.allColors || []
    },

    breadcrumbItems() {
      return [
        { path: '/', title: 'Дашборд' },
        { path: '/products', title: 'Товары' },
        { path: '/create-product', title: 'Создание товара' },
        { path: '', title: 'Создание цвета' },
      ]
    },

    isNameDuplicate() {
      if (!this.form.name) {
        return false
      }
      return this.allColors.some((color) => color.name.toLowerCase() === this.form.name.trim().toLowerCase())
    },

    isHexDuplicate() {
      if (!this.form.hex_rgb) {
        return false
      }
      const normalizedHex = this.form.hex_rgb.trim().toLowerCase()
      return this.allColors.some((color) => color.hex_rgb.toLowerCase() === normalizedHex)
    },

    canSubmit() {
      return (
        this.form.name.trim() &&
        this.form.hex_rgb.trim() &&
        !this.isNameDuplicate &&
        !this.isHexDuplicate &&
        !this.loading
      )
    },
  },

  async created() {
    await colorsManager.fetchAllColors()
  },

  methods: {
    checkNameDuplicate() {
      if (!this.form.name) {
        this.nameError = null
        return
      }

      const existing = this.allColors.find((color) => color.name.toLowerCase() === this.form.name.trim().toLowerCase())

      if (existing) {
        this.nameError = `Цвет "${this.form.name}" уже существует`
      } else {
        this.nameError = null
      }
    },

    checkHexDuplicate() {
      if (!this.form.hex_rgb) {
        this.hexError = null
        return
      }

      const normalizedHex = this.form.hex_rgb.trim().toLowerCase()
      const existing = this.allColors.find((color) => color.hex_rgb.toLowerCase() === normalizedHex)

      if (existing) {
        this.hexError = `Цвет с кодом ${this.form.hex_rgb} уже существует (${existing.name})`
      } else {
        this.hexError = null
      }
    },

    normalizeHex() {
      let hex = this.form.hex_rgb.trim()
      if (hex && !hex.startsWith('#')) {
        hex = '#' + hex
      }
      this.form.hex_rgb = hex
    },

    async createColor() {
      if (!this.canSubmit) return

      this.loading = true

      try {
        const colorData = {
          name: this.form.name.trim(),
          hex_rgb: this.form.hex_rgb.trim().toLowerCase(),
        }

        await colorsManager.createColor(colorData)

        this.success = true

        this.form = {
          name: '',
          hex_rgb: '',
        }

        await colorsManager.fetchAllColors()

        setTimeout(() => {
          this.success = false
        }, 3000)
      } finally {
        this.loading = false
      }
    },
  },

  template: `
      <div class="create-color">
        <Breadcrumbs :items="breadcrumbItems" />
				<Error :store="colorsStore"/>

        <div class="create-color__container">
          <div class="create-color__row">
            <div class="create-color__form">
              <div class="create-color__title">Создание нового цвета</div>
              <form class="create-color__form-item" @submit.prevent="createColor">
                <div class="form__group">
                  <Input
                      v-model="form.name"
                      @update:modelValue="checkNameDuplicate"
                      id="color-name"
                      label="Название цвета"
                      placeholder="Красный"
                      :class="{ 'input --error': nameError }"
                      required
                  />
                  <div v-if="nameError" class="error-message">
                    {{ nameError }}
                  </div>
                </div>

                <div class="form__group">
                  <Input
                      v-model="form.hex_rgb"
                      @update:modelValue="checkHexDuplicate"
                      @blur="normalizeHex"
                      id="color-hex"
                      label="HEX код цвета"
                      placeholder="#E61C1C"
                      :class="{ 'input --error': hexError }"
                      required
                  />
                  <div v-if="hexError" class="error-message">
                    {{ hexError }}
                  </div>
                  <div v-if="form.hex_rgb" class="color-preview" :style="{ backgroundColor: form.hex_rgb }"></div>
                </div>

                <div class="form__footer">
                  <div class="form__footer-actions">
                    <button
                        class="btn --primary"
                        :disabled="!canSubmit"
                    >
                      <span v-if="loading"></span>
                      {{ loading ? 'Создание...' : 'Создать цвет' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div class="create-color__exists">
              <div class="create-color__exists-title">Существующие цвета</div>
              <div class="all-colors__grid">
                <div
                    v-for="color in allColors"
                    :key="color.id"
                    class="all-colors"
                    :title="color.name"
                >
					<span
						class="all-colors__circle"
						:style="{ backgroundColor: color.hex_rgb }"
					></span>
                  <span class="all-colors__name">{{ color.name }}</span>
                  <span class="all-colors__hex">{{ color.hex_rgb }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="success" class="alert --success">
            Цвет успешно создан!
          </div>

        </div>
      </div>
	`,
})
