import './CreateMaterial.css'
import {useMaterialsStore} from "@model/materialsStore.js";
import {materialsManager} from "@managers/materialsManager.js";
import {Input} from "@component/UI/Input/Input.js";
import {defineComponent} from "vue";
import {Breadcrumbs} from "@component/UI/Breadcrumbs/Breadcrumbs.js";

export default defineComponent({
	name: 'CreateMaterial',

	components: {
		Breadcrumbs,
		Input
	},

	data() {
		return {
			materialsStore: useMaterialsStore(),
			form: {
				name: "",
				description: "",
				price_coef: 1,
			},
			loading: null,
			success: false,
			error: null,
			nameError: null,
		}
	},

	computed: {
		allMaterials() {
			return this.materialsStore.allMaterials || []
		},

		breadcrumbItems() {
			return [
				{ path: '/', title: 'Дашборд' },
				{ path: '/products', title: 'Товары' },
				{ path: '/create-product', title: 'Создание товара' },
				{ path: '', title: 'Создание материала'}
			]
		},

		isNameDuplicate() {
			if (!this.form.name)
			{
				return false
			}
			return this.allMaterials.some((material) =>
				material.name.toLowerCase() === this.form.name.trim().toLowerCase()
			)
		},

		canSubmit() {
			return this.form.name.trim() &&
				this.form.description.trim() &&
				!this.isNameDuplicate &&
				!this.loading
		}

	},

	async created() {
		await materialsManager.fetchAllMaterials()
	},

	methods: {
		checkNameDuplicate() {
			if (!this.form.name)
			{
				this.nameError = null
				return
			}

			const existing = this.allMaterials.find((material) =>
				material.name.toLowerCase() === this.form.name.trim().toLowerCase()
			)

			if (existing) {
				this.nameError = `Материал "${this.form.name}" уже существует`
			} else {
				this.nameError = null
			}
		},

		async createMaterial() {
			if (!this.canSubmit) return

			this.loading = true
			this.error = null

			try {
				const materialData = {
					name: this.form.name.trim(),
					description: this.form.description.trim(),
					price_coef: this.form.price_coef
				}

				await materialsManager.createMaterial(materialData)

				this.success = true

				this.form = {
					name: '',
					description: '',
					price_coef: 1,
				}

				await materialsManager.fetchAllMaterials()

				setTimeout(() => {
					this.success = false
				}, 3000)
			} catch (err){
				this.error = err.message || 'Ошибка при создании материала'
			} finally {
				this.loading = false
			}
		},

		updatePriceCoef(value) {
			if (value === '' || value === null) {
				this.form.price_coef = ''
				return
			}
			const num = parseFloat(value)
			if (isNaN(num)) {
				this.form.price_coef = ''
				return
			}
			this.form.price_coef = Math.max(1, Math.round(num * 10) / 10)
		},
	},

	template: `
      <div class="create-material">
        <Breadcrumbs :items="breadcrumbItems" />

        <div class="create-material__container">
          <div class="create-material__row">
            <div class="create-material__form">
              <div class="create-material__title">Создание нового материала</div>
              <form class="create-material__form-item" @submit.prevent="createMaterial">
                <div class="form__group">
                  <Input
                      v-model="form.name"
                      @update:modelValue="checkNameDuplicate"
                      id="material-name"
                      label="Название материала"
                      placeholder="Нейлон"
                      :class="{ 'input --error': nameError }"
                      required
                  />
                  <div v-if="nameError" class="error-message">
                    {{ nameError }}
                  </div>
                </div>

                <div class="form__group">
				  <label>Описание материала *</label>
                  <textarea
                      v-model="form.description"
					  rows="2"
                      id="material-description"
                      class="form__textarea"
                      placeholder="Очень прочный..."
                      required
				  ></textarea>
                </div>

                <div class="form__group">
                  <p>Ценовой коэффициент *</p>
				  <div class="coef-control">
					<button
						type="button"
						class="control-btn"
						@click="form.price_coef = Math.max(1, Math.round((form.price_coef - 0.1) * 10) / 10)"
					>-</button>
					<input
						type="number"
						v-model.number="form.price_coef"
						step="0.1"
						min="1"
						class="coef-input"
						@input="updatePriceCoef($event.target.value)"
					>
					<button
						type="button"
						class="control-btn"
						@click="form.price_coef = Math.round((form.price_coef + 0.1) * 10) / 10"
					>+</button>
				  </div>
                </div>

                <div class="form__footer">
                  <div class="form__footer-actions">
                    <button
                        class="btn --primary"
                        :disabled="!canSubmit"
                    >
                      <span v-if="loading"></span>
                      {{ loading ? 'Создание...' : 'Создать материал' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div class="create-material__exists">
              <div class="create-material__exists-title">Существующие материалы</div>
              <div class="all-materials__grid">
                <div
                    v-for="material in allMaterials"
                    :key="material.id"
                    class="all-materials"
                    :title="material.name"
                >
                  <span class="all-materials__name">{{ material.name }}</span>
				  <span class="all-materials__coef">{{ material.price_coef}}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="success" class="alert --success">
            Материал успешно создан!
          </div>

          <div v-if="error" class="alert --error">
            {{ error }}
          </div>
        </div>
      </div>
	`,



})