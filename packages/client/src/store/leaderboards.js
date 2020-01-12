import api from '@/api'

const leaderboards = {
  namespaced: true,
  state: {
    personal: [],
    company: []
  },
  mutations: {
    setLeaderboard: (state, { leaderboard, data }) => {
      state[leaderboard] = data
    }
  },
  actions: {
    fetchLeaderboard: ({ commit, dispatch }, leaderboard) => {
      api.request({
        url: '/v1/accounts/?public=true&type=' + leaderboard,
        method: 'get'
      }).then(res => {
        commit('setLeaderboard', { leaderboard, data: res.data.leaderboard })
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    }
  }
}

export default leaderboards
