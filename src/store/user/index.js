import { fs, db } from '../../firebase'

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
    drivers: [],
    first: false,
  },
  getters: {},
  mutations: {
    TOTAL_ROWS(state, total) {
      state.totalRows = total
    },
    FETCH(state, data) {
      state.list = [...data]
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
  },
  actions: {
    async getDriver({ commit }) {
      try {
        const querySnapshot = await fs.collection('users').get()
        querySnapshot.forEach(doc => {
          const setting = doc.data()
          db.ref(`location/${doc.id}/geopoints`).on('value', Snapshots => {
            Snapshots.forEach(snapshot => {
              const data = snapshot.val()
              commit('UPDATE_DRIVER', {
                uid: doc.id,
                color: setting.generals.color,
                name: setting.fullName,
                markerLatLng: data.latlngs,
                latlngs: [],
              })
            })
          })
        })
      } catch (e) {
        throw e.message
      }
    },
  },
}
