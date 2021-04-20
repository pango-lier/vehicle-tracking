import axios from '@axios'

export default {
  namespaced: true,
  state: {
    list: null,
  },
  getters: {},
  mutations: {
    FETCH(state, data) {
      state.list = [...data]
    },
  },
  actions: {
    fetch(ctx, params) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/v1/template?${params}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    create(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `/api/v1/template/?${payload.params.toString()}`,
            payload.formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    update(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/api/v1/template/${payload.id}`, payload.body)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    delete(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/api/v1/template/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
