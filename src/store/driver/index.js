import { fs, auth, db } from '../../firebase'

export default {
  name: 'driver',
  namespaced: true,
  state: {
    list: [],
    totalRows: 100,
    first: true,
    points: [],
  },
  getters: {
    getFirst(state) {
      return state.first
    },
    getLatLngs: state => id => {
      const latlngs = state.points.filter(point => point.id === id)
      if (latlngs !== undefined) {
        return latlngs.map(point => ({ lat: point.lat, lng: point.lng }))
      }
      return []
    },
  },
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
    UPDATE_POINTS(state, data) {
      const point = state.points.find(driver => driver.id === data.id)
      let latlngs = data.latlngs.map(item => [item.lat, item.lng])
      if (point !== undefined) {
        latlngs = point.latlngs.concat(latlngs)
        Object.assign(point, {
          latlngs,
          markerStart: latlngs[0],
          markerEnd: latlngs[latlngs.length - 1],
          createdAt: data.createdAt,
        })
      } else {
        state.points.push({
          id: data.id,
          latlngs,
          markerStart: latlngs[0],
          markerEnd: latlngs[latlngs.length - 1],
          createdAt: data.createdAt,
        })
      }
    },
    DELETE(state, data) {
      state.list = state.list.filter(item => item.id !== data.id)
      if (state.totalRows > 0) state.totalRows -= 1
    },
    FIRST(state, data) {
      state.first = data
    },
  },
  actions: {
    async fetch({ commit, getters }) {
      if (getters.getFirst) {
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
            db.ref(`geopoints/${driver.driverKey}`).on(
              'child_added',
              snapshot => {
                // Snapshots.forEach(snapshot => {
                const data = snapshot.val()
                commit('UPDATE_POINTS', {
                  id: driver.driverKey,
                  latlngs: data.latlngs,
                  createdAt: data.createdAt,
                })
                // })
              }
            )
          })
          if (drivers.length > 0) {
            commit('FETCH', drivers)
            commit('FIRST', false)
          }
        } catch (e) {
          throw e.message
        }
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
