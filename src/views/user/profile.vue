<template>
  <b-form @submit.prevent>
    <b-row>
      <!-- first name -->
      <b-col cols="12">
        <b-form-group label="First Name" label-for="vi-first-name">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="UserIcon" />
            </b-input-group-prepend>
            <b-form-input id="vi-first-name" placeholder="First Name" />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- email -->
      <b-col cols="12">
        <b-form-group label="Email" label-for="vi-email">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="MailIcon" />
            </b-input-group-prepend>
            <b-form-input id="vi-email" type="email" placeholder="Email" />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- mobile -->
      <b-col cols="12">
        <b-form-group label="Mobile" label-for="vi-mobile">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="SmartphoneIcon" />
            </b-input-group-prepend>
            <b-form-input id="vi-mobile" type="number" placeholder="Mobile" />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- password -->
      <b-col cols="12">
        <b-form-group label="Password" label-for="vi-password">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="LockIcon" />
            </b-input-group-prepend>
            <b-form-input
              id="vi-password"
              type="password"
              placeholder="Password"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- checkbox -->
      <b-col cols="12">
        <b-form-group>
          <b-form-checkbox id="checkbox-4" name="checkbox-4" value="Remember_me"
            >Remember me</b-form-checkbox
          >
        </b-form-group>
      </b-col>

      <!-- reset and submit -->
      <b-col cols="12">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          type="submit"
          variant="primary"
          class="mr-1"
          >Submit</b-button
        >
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="reset"
          variant="outline-secondary"
          >Reset</b-button
        >
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BInputGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import store from '@/store'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BInputGroup,
    BInputGroupPrepend,
    BForm,
    BButton,
  },
  directives: {
    Ripple,
  },
  mounted() {
    store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', false)
  },
  destroyed() {
    store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', true)
  },
}
</script>
