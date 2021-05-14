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
        <s-general
          v-if="activeIcon === 'UserIcon'"
          :generals="generals"
          @on-save="saveGeneral"
        />
        <s-change-password
          v-if="activeIcon === 'LockIcon'"
          :password="password"
          @on-save="savePassword"
        />
      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>
</template>
<script>
import { BRow, BCol, BNav, BNavItem } from 'bootstrap-vue'
import store from '@/store'
import { ref, onMounted, onUnmounted } from '@vue/composition-api'
import { db, auth, fs } from '../../firebase'
import SGeneral from './components/SGeneral.vue'
import SChangePassword from './components/SChangePassword.vue'

export default {
  components: {
    BRow,
    BCol,
    BNav,
    BNavItem,
    SGeneral,
    SChangePassword,
  },
  setup() {
    onMounted(() => {
      store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', false)
    })
    onUnmounted(() => {
      store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', true)
    })
    const activeIcon = ref('UserIcon')
    const menus = ref([
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
    ])
    const generals = ref({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      about: '',
      color: '',
    })
    const password = ref({
      new: '',
      old: '',
    })
    const socialLinks = ref({
      facebook: '',
      zalo: '',
      tiktok: '',
    })
    const saveGeneral = e => {
      console.log(e)
    }
    const savePassword = e => {
      console.log(e)
    }
    return {
      socialLinks,
      generals,
      password,
      menus,
      activeIcon,
      saveGeneral,
      savePassword,
    }
  },
  methods: {
    setClassActive(icon) {
      this.activeIcon = icon
    },
    saveSetting() {
      const user = auth.currentUser
      fs.collection('users')
        .doc(user.uid)
        .collection('settings')
        .doc('generals')
        .set(this.generals)
    },
    geopoint(driverId) {
      const lat = Math.random() * 10
      const lng = Math.random() * 10
      db.ref(`geopoints/${driverId}`)
        .push()
        .set({
          latlngs: [
            {
              lat,
              lng,
              createdAt: new Date().getTime(),
            },
          ],
        })
    },
    async getSetting() {
      const user = auth.currentUser

      const doc = await fs.collection('users').doc(user.uid).get()
      if (doc.exists) {
        console.log(doc)
        console.log(doc.data())
        Object.assign(this.generals, doc.data().generals)
      }
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
