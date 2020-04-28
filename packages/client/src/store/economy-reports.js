import api from '@/api'

const leaderboards = {
  namespaced: true,
  state: {
    latest: null
  },
  mutations: {
    setLatest: (state, data) => {
      state.latest = data
    }
  },
  actions: {
    fetchLatest: ({ commit, dispatch }, leaderboard) => {
      api.request({
        url: '/v1/economy-reports/latest',
        method: 'get'
      }).then(res => {
        commit('setLatest', res.data)
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    }
  },
  getters: {
    gbpEconomy: (state, getters) => {
      return (state.latest && state.latest.currencies.find(currency => currency._id === 'GBP')) || null
    },
    leaderboard: (state, getters, rootGetters) => {
      if (!getters.gbpEconomy) {
        return []
      }

      return Object.values(getters.gbpEconomy.accountStats)
    }
  }
}

export default leaderboards
