import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from '@/main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    messages: [],
  },
  mutations: {
    ...vuexfireMutations,
  },
  actions: {
    loadMessages: firestoreAction(context =>
      context.bindFirestoreRef(
        'messages',
        db.collection('messages').orderBy('timestamp')
      )
    ),
  },
})
