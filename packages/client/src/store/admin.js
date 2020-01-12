import api from '@/api'

const admin = {
  namespaced: true,
  state: {
    transactions: [],
    wageRequests: []
  },
  mutations: {
    setTransactions: (state, transactions) => {
      state.transactions = transactions
    },
    setWageRequests: (state, wageRequests) => {
      state.wageRequests = wageRequests
    },
    setAccounts: (state, accounts) => {
      state.accounts = accounts
    }
  },
  actions: {
    fetchTransactions: ({ state, rootState, commit, dispatch }) => {
      api.request({
        url: '/v1/transactions',
        method: 'get'
      }).then(res => {
        commit('setTransactions', res.data)
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    },
    fetchWageRequests: ({ commit, dispatch }) => {
      api.request({
        url: '/v1/requests',
        method: 'get'
      }).then((res) => {
        res.data = res.data.filter((val) => { // Remove broken data entries. Will eventually be cleaned server-side
          return !(val.wage == null || val.account == null)
        })

        commit('setWageRequests', res.data)
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    },
    decideWageRequest: ({ commit, dispatch }, { decision, wageRequest }) => {
      api.request({
        url: '/v1/requests/' + wageRequest,
        method: 'post',
        data: { accept: decision }
      }).then(() => {
        dispatch('fetchWageRequests')

        commit('messages/addMessage', {
          type: 'success',
          title: 'Wage Request Handled'
        }, { root: true })
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    }
  }
}

export default admin
