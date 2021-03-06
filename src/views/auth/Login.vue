<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">Anyprint</h2>
        </b-link>

        <b-card-title class="mb-1">Welcome to Anyprint! 👋</b-card-title>
        <small v-if="fireBaseErrors.length" class="mb-2 text-danger">
          {{ fireBaseErrors[0] }}
        </small>
        <b-card-text v-else class="mb-2"
          >Please sign-in to your account and start the adventure</b-card-text
        >

        <!-- form -->
        <validation-observer ref="loginForm" #default="{ invalid }">
          <b-form class="auth-login-form mt-2" @submit.prevent="onLogin">
            <!-- email -->
            <b-form-group label-for="email" label="Email">
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <b-form-input
                  id="email"
                  v-model="userEmail"
                  name="login-email"
                  :state="errors.length > 0 ? false : null"
                  placeholder="admin@example.com"
                  autofocus
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Password"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="login-password"
                    placeholder="Password"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->
            <!--
            <b-form-group>
              <b-form-checkbox
                id="remember-me"
                v-model="status"
                name="checkbox-1"
                >Remember Me</b-form-checkbox
              >
            </b-form-group>
            -->
            <!-- submit button -->
            <b-button variant="primary" type="submit" block :disabled="invalid"
              >Sign in</b-button
            >
          </b-form>
        </validation-observer>

        <b-card-text class="text-center mt-2">
          <span>New on our platform?</span>
          <b-link :to="{ name: 'auth-register-v1' }">
            <span>Create an account</span>
          </b-link>
        </b-card-text>
      </b-card>
      <!-- /Login v1 -->
    </div>
    <b-overlay
      :show="effectLoadingSignIn"
      spinner-variant="primary"
      no-wrap
    ></b-overlay>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BButton,
  BForm,
  BFormInput,
  BFormGroup,
  BCard,
  BLink,
  BCardTitle,
  BCardText,
  BInputGroup,
  BInputGroupAppend,
  BOverlay,
  // BFormCheckbox,
} from 'bootstrap-vue'

import VuexyLogo from '@core/layouts/components/Logo.vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'

import { auth } from '../../firebase'

export default {
  components: {
    // BSV
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    VuexyLogo,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BOverlay,
    // BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userEmail: '',
      password: '',
      status: '',
      required,
      email,
      fireBaseErrors: [],
      effectLoadingSignIn: false,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    async onLogin() {
      try {
        this.effectLoadingSignIn = true
        this.fireBaseErrors = []
        await auth.signInWithEmailAndPassword(this.userEmail, this.password)
        this.$router.replace({ name: 'home', role: 'driver' })
      } catch (e) {
        this.fireBaseErrors.push(e.message)
        this.effectLoadingSignIn = false
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
