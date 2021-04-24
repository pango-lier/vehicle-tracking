import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import users from './user'
import drivers from './driver'
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    users,
    drivers,
  },
  strict: process.env.DEV,
})
