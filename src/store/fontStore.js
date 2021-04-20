import axios from '@axios'

export default {
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
    async fetch({ commit }, params) {
      try {
        const response = await axios.get(`/api/v1/fonts/?${params}`)
        commit('FETCH', response.data.results)
        commit('TOTAL_ROWS', response.data.total)
      } catch (e) {
        throw e.message
      }
    },
    async create({ commit }, payload) {
      try {
        const getPresigned = await axios.post(
          `/api/v1/fonts/generate_presigned?key=${payload.info.name}`
        )
        const headers = new Headers()
        headers.append('Content-Type', `font/${payload.info.ext}`)
        const data = await fetch(getPresigned.data, {
          method: 'PUT',
          headers,
          body: payload.file,
        })
        if (data.status !== 200) throw new Error(data.statusText)

        const response = await axios.post(`/api/v1/fonts/`, {
          fontName: payload.info.slug,
          image: '',
          file: payload.info.name,
        })
        commit('CREATE', response.data)
      } catch (e) {
        throw e.message
      }
    },
    async update({ commit }, payload) {
      try {
        const getPresigned = await axios.post(
          `/api/v1/fonts/generate_presigned?key=${payload.info.name}`
        )
        const headers = new Headers()
        headers.append('Content-Type', `font/${payload.info.ext}`)
        const data = await fetch(getPresigned.data, {
          method: 'PUT',
          headers,
          body: payload.file,
        })
        if (data.status !== 200) throw new Error(data.statusText)
        const response = await axios.put(`/api/v1/fonts/${payload.id}`, {
          fontName: payload.info.slug,
          image: '',
          file: payload.info.name,
        })
        commit('UPDATE', response.data)
      } catch (e) {
        throw e.message
      }
    },
    async delete({ commit }, id) {
      try {
        const response = await axios.delete(`/api/v1/fonts/${id}`)
        commit('DELETE', response.data)
      } catch (e) {
        throw e.message
      }
    },
    async renderFontFace(commit, payload) {
      const font = new FontFace(
        payload.value.fontName,
        `url('${payload.value.file}')`
      )
      await font.load()
      document.fonts.add(font)

      document.body.classList.add('fonts-loaded')
      const el = document.getElementById('my-font')
      el.style.fontFamily = `${payload.value.fontName},sans-serif`
      return true
    },
  },
}
