import { fs, auth } from '../../firebase'

export default {
  name: 'users',
  namespaced: true,
  state: {
    list: [],
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
      if (state.totalRows > 0) state.totalRows -= 1
    },
  },
  actions: {
    async fetch({ commit }) {
      try {
        const userId = auth.currentUser.uid
        const querySnapshot = await fs
          .collection('users')
          .doc(userId)
          .collection('drivers')
          .get()
        const drivers = []
        querySnapshot.forEach(doc => {
          const driver = doc.data()
          driver.id = doc.id
          drivers.push(driver)
        })
        if (drivers.length > 0) commit('FETCH', drivers)
      } catch (e) {
        throw e.message
      }
    },
    async createDriver(commit, payload) {
      const driverRef = await fs.collection('drivers').add(payload)
      return driverRef
    },
    async generateDriver({ commit }, payload) {
      try {
        const userId = auth.currentUser.uid
        const docRef = await fs
          .collection('users')
          .doc(userId)
          .collection('drivers')
          .add(payload)
        const data = payload
        data.id = docRef.id
        commit('CREATE', data)
      } catch (e) {
        throw e.message
      }
    },
    async delete({ commit }, id) {
      try {
        const userId = auth.currentUser.uid
        await fs
          .collection('users')
          .doc(userId)
          .collection('drivers')
          .doc(id)
          .delete()
        commit('DELETE', id)
      } catch (e) {
        throw e.message
      }
    },
    async update({ commit }, payload) {
      try {
        const userId = auth.currentUser.uid
        const { id } = payload
        const data = payload
        delete data.id
        await fs
          .collection('users')
          .doc(userId)
          .collection('drivers')
          .doc(id)
          .update(data)
        data.id = id
        commit('UPDATE', data)
      } catch (e) {
        throw e.message
      }
    },
  },
}
