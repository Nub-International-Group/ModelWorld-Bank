import api from '@/api'

const bets = {
  namespaced: true,
  state: {
    items: [
      {
        _id: '123',
        name: 'General Election 2020',
        description: 'Bets based on the results of the General Election 2020 results as per the Electoral Commission. Will close the day after the election.',
        created: Date.now(),
        options: [{
          _id: 'esfesf',
          name: 'Jeremy',
          description: 'smelly',
          currentOdds: 2
        },
        {
          _id: 'dsfwf',
          name: 'David',
          description: 'ow',
          currentOdds: 1
        }],
        status: 'OPEN'
      },
      {
        _id: 'fff',
        name: 'General Election 2021',
        description: 'blah',
        created: Date.now(),
        options: [{
          _id: 'esfesf',
          name: 'Jeremy',
          description: 'smelly',
          currentOdds: 2
        },
        {
          _id: 'dsfwf',
          name: 'David',
          description: 'ow',
          currentOdds: 1
        }],
        status: 'OPEN'
      }
    ]
  },
  mutations: {
    setBets: (state, bets) => {
      state.items = bets
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
  },
  getters: {
    openBets (state) {
      return state.items.filter(item => item.status === 'OPEN')
    }
  }
}

export default bets
