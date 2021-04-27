<template>
  <div>
    <b-row>
      <h1 class="justify-content-md-center">Setting</h1>
    </b-row>
    <b-row class="mt-3">
      <b-col md="1"></b-col>
      <b-col md="3">
        <div style="border-right: 1px solid white; padding: 1px 10px">
          <b-nav vertical>
            <b-nav-item
              v-for="(menu, key) in menus"
              :key="key"
              style="padding: 10px"
              :class="{ 'menu-active': activeIcon === menu.icon }"
              @click.prevent="setClassActive(menu.icon)"
            >
              <span style="color: black">
                <feather-icon :icon="menu.icon" class="mr-2" />
                {{ menu.title }}
              </span>
            </b-nav-item>
          </b-nav>
        </div>
      </b-col>
      <b-col md="6">
        <b-form @submit.prevent="saveSetting">
          <b-row>
            <!-- first name -->
            <b-col cols="12">
              <b-form-group label="First Name" label-for="vi-first-name">
                <b-input-group class="input-group-merge">
                  <b-input-group-prepend is-text>
                    <feather-icon icon="UserIcon" />
                  </b-input-group-prepend>
                  <b-form-input
                    id="vi-first-name"
                    v-model="generals.fullName"
                    placeholder="First Name"
                  />
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
                  <b-form-input
                    id="vi-email"
                    v-model="generals.email"
                    type="email"
                    placeholder="Email"
                  />
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
                  <b-form-input
                    id="vi-mobile"
                    v-model="generals.phone"
                    type="number"
                    placeholder="Mobile"
                  />
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
                    v-model="generals.about"
                    type="password"
                    placeholder="Password"
                  />
                </b-input-group>
              </b-form-group>
            </b-col>

            <!-- checkbox -->
            <b-col cols="12">
              <b-form-group>
                <b-form-checkbox
                  id="checkbox-4"
                  name="checkbox-4"
                  value="Remember_me"
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
      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>
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
  BNav,
  BNavItem,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import store from '@/store'
import { settingsRef } from '../../main'

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
    BNav,
    BNavItem,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      activeIcon: 'UserIcon',
      menus: [
        {
          icon: 'UserIcon',
          title: 'General',
        },
        {
          icon: 'LockIcon',
          title: 'Change Password',
        },
        {
          icon: 'InfoIcon',
          title: 'Infor',
        },
        {
          icon: 'GithubIcon',
          title: 'Social Links',
        },
        {
          icon: 'Link2Icon',
          title: 'Connections',
        },
        {
          icon: 'BellIcon',
          title: 'Notification',
        },
      ],
      generals: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        about: '',
      },
    }
  },
  mounted() {
    store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', false)
  },
  destroyed() {
    store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', true)
  },
  methods: {
    setClassActive(icon) {
      this.activeIcon = icon
    },
    saveSetting() {
      settingsRef.push(this.generals)
    },
  },
}
</script>
<style>
.menu-active span {
  color: blue !important;
  font-weight: bold;
}
</style>
