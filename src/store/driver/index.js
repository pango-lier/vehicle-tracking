import axios from '@axios'

export default {
  name: 'users',
  namespaced: true,
  state: {
    list: null,
    totalRows: 100,
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
    async fetch(commit, params) {
      try {
        return await axios.get(`/api/v1/drivers/?${params}`)
      } catch (e) {
        throw e.message
      }
    },
  },
}
