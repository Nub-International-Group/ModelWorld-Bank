import api from '@/api'

const wageRequests = {
  namespaced: true,
  state: {
    wageRequestsByAccountId: {}
  },
  actions: {
    fetchByAccount: async ({ state, commit, dispatch }, accountId) => {
      try {
        const { data } = await api.request({
          url: `/v1/accounts/${accountId}/wages`,
          method: 'get'
        })
        commit('setAccountWageRequests', { accountId, wageRequests: data })
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    }
  },
  mutations: {
    setAccountWageRequests: (state, { accountId, wageRequests }) => {
      state.wageRequestsByAccountId = {
        ...state.wageRequestsByAccountId,
        [accountId]: wageRequests
      }
    }
  }
}

export default wageRequests
