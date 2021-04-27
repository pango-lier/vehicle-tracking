import Vue from 'vue'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import 'leaflet/dist/leaflet.css'

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB8qk-4GRWZz6bQggeOCSnW01H1XWtfzC8',
  authDomain: 'vehicle-tracking-5946a.firebaseapp.com',
  projectId: 'vehicle-tracking-5946a',
  storageBucket: 'vehicle-tracking-5946a.appspot.com',
  messagingSenderId: '472702586901',
  appId: '1:472702586901:web:c1eb56d3018d2311f5be1c',
  measurementId: 'G-7HKJZ77XHH',
}
firebase.initializeApp(firebaseConfig)

export const ft = firebase.firestore()
export const db = firebase.database()

export const driversRef = db.ref('drivers')
export const settingsRef = db.ref('settings')

let app
firebase.auth().onAuthStateChanged(user => {
  console.log('sss', user)
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  }
})
