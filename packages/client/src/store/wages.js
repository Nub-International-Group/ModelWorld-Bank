import api from '@/api'

const wages = {
  namespaced: true,
  state: {
    all: []
  },
  actions: {
    fetch: async ({ commit, dispatch }) => {
      try {
        const res = await api.request({
          url: '/v1/wages',
          method: 'get'
        })
        commit('setWages', res.data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    create: async ({ state, commit, dispatch }, wage) => {
      try {
        await api.request({
          url: '/v1/wages/',
          method: 'post',
          data: wage
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    update: async ({ state, commit, dispatch }, wage) => {
      try {
        await api.request({
          url: '/v1/wages/' + wage._id,
          method: 'put',
          data: wage
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    deleteById: async ({ state, commit, dispatch }, wageId) => {
      try {
        await api.request({
          url: '/v1/wages/' + wageId,
          method: 'delete'
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    clearAllWages: async ({ dispatch }) => {
      try {
        await api.request({
          url: '/v1/wages/purge',
          method: 'post'
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    }
  },
  mutations: {
    setWages: (state, wages) => {
      state.all = wages
    }
  },
  getters: {
    wagesById: (state) => state.all.reduce((wagesById, wage) => ({
      ...wagesById,
      [wage._id]: wage
    }), {})
  }
}

export default wages
