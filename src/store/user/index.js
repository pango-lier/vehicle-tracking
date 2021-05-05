import { fs } from '../../firebase'

export default {
  name: 'users',
  namespaced: true,
  state: {
    list: null,
    uuid: 1,
    totalRows: 100,
    avatar: 'assets/images/avatars/1.png',
    icon: 'assets/images/avatars/1.png',
    role: 'admin',
    drives: [],
  },
  getters: {},
  mutations: {
    TOTAL_ROWS(state, total) {
      state.totalRows = total
    },
    FETCH(state, data) {
      state.list = [...data]
    },
    CREATE(state, data) {
      state.list.unshift(data)
      state.totalRows += 1
    },
    UPDATE(state, data) {
      Object.assign(
        state.list.find(item => item.id === data.id),
        data
      )
    },
    DELETE(state, data) {
      state.list = state.list.filter(item => item.id !== data.id)
      state.totalRows -= 1
    },
  },
  actions: {
    async fetch({ commit }) {
      try {
        const users = []
        await fs
          .collection('users')
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              console.log(doc.id)
              users.push({ id: doc.id, name: doc.data().name })
            })
            commit('FETCH', users)
          })
      } catch (e) {
        throw e.message
      }
    },
  },
}
