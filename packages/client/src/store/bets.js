import api from '@/api'

const bets = {
  namespaced: true,
  state: {
    possibleBets: []
  },
  mutations: {
    setBets: (state, bets) => {
      state.possibleBets = bets
    }
  },
  actions: {
    fetchBets: ({ commit, dispatch }) => {
      api.request({
        url: '/v1/bets',
        method: 'get'
      }).then(res => {
        commit('setBets', res.data)
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    }
  }
}

export default bets
