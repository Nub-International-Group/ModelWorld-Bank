import api from '@/api'

const accountTypes = {
  namespaced: true,
  state: {
    all: []
  },
  actions: {
    fetch: async ({ commit, dispatch }) => {
      try {
        const res = await api.request({
          url: '/v1/account-types',
          method: 'get'
        })
        commit('setAll', res.data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    create: async ({ state, commit, dispatch }, accountType) => {
      try {
        await api.request({
          url: '/v1/account-types',
          method: 'post',
          data: accountType
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    update: async ({ state, commit, dispatch }, accountType) => {
      try {
        await api.request({
          url: '/v1/account-types/' + accountType._id,
          method: 'put',
          data: accountType
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    deleteById: async ({ state, commit, dispatch }, accountTypeId) => {
      try {
        await api.request({
          url: '/v1/account-types/' + accountTypeId,
          method: 'delete'
        })

        await dispatch('fetchAccountTypes')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    }
  },
  mutations: {
    setAll: (state, accountTypes) => {
      state.all = accountTypes
    }
  }
}

export default accountTypes
