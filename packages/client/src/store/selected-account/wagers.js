import api from '@/api'

const defaultState = () => {
  return {
    items: []
  }
}

const wagers = {
  namespaced: true,
  state: defaultState(),
  mutations: {
    resetState: (state) => {
      Object.assign(state, defaultState())
    },

    setItems: (state, items) => {
      state.items = items
    }
  },
  actions: {
    fetch: async ({ state, commit, dispatch, rootState }) => {
      try {
        dispatch('wait/start', 'fetching account wagers', { root: true })
        const { data } = await api.request({
          url: `/v1/accounts/${rootState.selectedAccount.accountId}/transactions`,
          method: 'get'
        })

        commit('setItems', data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'fetching account wagers', { root: true })
      }
    },

    create: async ({ state, commit, dispatch, rootState }, wager) => {
      try {
        dispatch('wait/start', 'creating wager', { root: true })
        await api.request({
          url: `/v1/wagers`,
          method: 'post',
          data: {
            ...wager,
            accountId: rootState.selectedAccount.accountId
          }
        })

        dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'creating wager', { root: true })
      }
    }
  },
  getters: {
  }
}

export default wagers
