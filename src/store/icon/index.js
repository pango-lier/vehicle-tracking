import { fs } from '../../firebase'

export default {
  name: 'icons',
  namespaced: true,
  state: {
    list: {
      start32x32: [],
      end32x32: [],
      avatar32x32: '',
    },
    totalRows: 100,
    first: true,
  },
  getters: {
    getFirst(state) {
      return state.first
    },
  },
  mutations: {
    TOTAL_ROWS(state, total) {
      state.totalRows = total
    },
    FETCH(state, data) {
      state.list = data
    },
    UPDATE_DRIVER(state, data) {
      const driver = state.drivers.find(item => item.uid === data.uid)
      if (driver === undefined) {
        state.drivers.push(data)
        return
      }
      driver.latlngs.push(data.markerLatLng)
      Object.assign(driver, {
        markerLatLng: data.markerLatLng,
      })
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
    UPDATE_AVATAR(state, data) {
      state.list.avatar32x32 = data
    },
    FIRST(state, data) {
      state.first = data
    },
  },
  actions: {
    async fetch({ commit, getters }) {
      if (getters.getFirst) {
        try {
          const doc = await fs.collection('icons').doc('marker').get()
          const data = doc.data()
          console.log(data)
          commit('FETCH', data)
          commit('FIRST', false)
        } catch (e) {
          throw e.message
        }
      }
    },
    async create({ commit }, payload) {
      try {
        await fs.collection('icons').doc('icon32x32').set(payload)
        commit('FETCH', payload)
      } catch (e) {
        throw e.message
      }
    },
  },
}
