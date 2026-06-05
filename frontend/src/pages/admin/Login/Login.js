import './Login.css'
import { defineComponent } from 'vue'
import { Input } from '@component/UI/Input/Input'
import { Checkbox } from '@component/UI/Checkbox/Checkbox'
import { useAuthStore } from '@model/authStore.js'
import logo from '@images/logo.svg'
import actionsIcons from '@images/icons/actions'
import { authManager } from '@managers/authManager'
import { Error } from '@component/UI/Error/Error'

export default defineComponent({
  name: 'Login',

  components: {
    Input,
    Checkbox,
    Error,
  },
  data() {
    return {
      logo: logo,
      form: {
        login: '',
        password: '',
        remember_me: false,
      },
      loading: false,
      showPassword: false,
      icons: actionsIcons,
      authStore: useAuthStore(),
    }
  },
  computed: {
    passwordInputType() {
      return this.showPassword ? 'text' : 'password'
    },
    errorMessage() {
      return this.authStore.error?.message || ''
    },
  },
  methods: {
    async login() {
      this.loading = true

      try {
        const response = await authManager.login({
          login: this.form.login.trim(),
          password: this.form.password.trim(),
          remember_me: this.form.remember_me,
        })

        if (response?.success) {
          this.$router.push('/')
        }
      } finally {
        this.loading = false
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword
    },
  },

  template: `
    <div class="login">
    <Error :store="authStore"/>
      <div class="login__container">
        <div class="login__wrapper">
          <img :src="logo" alt="logo" class="login__logo" />
          <div class="login__form-content">
            <div class="login__form-title">Войти в систему</div>
            <form class="login__form-item" @submit.prevent="login">
              <Input
                v-model="form.login"
                id="login"
                label="Логин"
                placeholder="localhost_hero"
                required
                :disabled="loading"
              />
              <div class="password-wrapper">
              <Input
                  v-model="form.password"
                  id="password"
                  label="Пароль"
                  placeholder="qwerty123"
                  required
                  :disabled="loading"
                  :type="passwordInputType"
              />
              <button 
                  type="button"
                  class="password-toggle"
                  @click="togglePassword"
                  :disabled="loading"
                  tabindex="-1"
                >
                  <img :src="icons.eyeOpen" alt="icon" v-if="showPassword"/>
                  <img :src="icons.eyeHidden" alt="icon" v-else/>
                </button>
              </div>
              <Checkbox
                v-model="form.remember_me"
                id="remember"
                label="Оставаться в системе"
                :disabled="loading"
              />
              <button 
                type="submit" 
                class="login-btn"
                :disabled="loading"
              >
              <span v-if="loading">Вход...</span>
              <span v-else>Войти</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="login__preview">
      <div class="login__preview-title">Всё для управления магазином</div>
      <div class="login__preview-desc">Заказы, товары, клиенты — всё под рукой</div>
      </div>
    </div>
  `,
})
