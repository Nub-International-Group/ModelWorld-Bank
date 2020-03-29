import api from '@/api'

const bets = {
  namespaced: true,
  state: {
    items: []
  },
  mutations: {
    setItems: (state, items) => {
      state.items = items
    }
  },
  actions: {
    fetch: async ({ commit, dispatch }) => {
      try {
        dispatch('wait/start', 'bets.fetching', { root: true })
        const { data } = await api.request({
          url: `/v1/bets`,
          method: 'get'
        })

        commit('setItems', data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'bets.fetching', { root: true })
      }
    },
    create: async ({ commit, dispatch }, bet) => {
      try {
        dispatch('wait/start', 'bets.creating', { root: true })
        delete bet._id
        await api.request({
          url: `/v1/bets`,
          method: 'POST',
          data: bet
        })

        dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'bets.creating', { root: true })
      }
    },
    update: async ({ commit, dispatch }, bet) => {
      try {
        dispatch('wait/start', 'bets.updating', { root: true })
        await api.request({
          url: `/v1/bets/${bet._id}`,
          method: 'PATCH',
          data: bet
        })

        dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'bets.updating', { root: true })
      }
    },
    openBet: async ({ commit, dispatch }, betId) => {
      try {
        dispatch('wait/start', 'bets.updating', { root: true })
        await api.request({
          url: `/v1/bets/${betId}/open`,
          method: 'POST'
        })

        dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'bets.updating', { root: true })
      }
    },
    closeBet: async ({ commit, dispatch }, betId) => {
      try {
        dispatch('wait/start', 'bets.updating', { root: true })
        await api.request({
          url: `/v1/bets/${betId}/close`,
          method: 'POST'
        })

        dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'bets.updating', { root: true })
      }
    },
    payoutBet: async ({ commit, dispatch }, { betId, winningOptionId }) => {
      try {
        dispatch('wait/start', 'bets.updating', { root: true })
        await api.request({
          url: `/v1/bets/${betId}/pay-out`,
          method: 'POST',
          data: {
            winningOptionId
          }
        })

        dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'bets.updating', { root: true })
      }
    }
  },
  getters: {
    openBets (state) {
      return state.items.filter(item => item.status === 'OPEN')
    }
  }
}

export default bets
