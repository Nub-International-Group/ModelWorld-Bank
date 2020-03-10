import api from '@/api'

const ui = {
  namespaced: true,
  state: {
    typeAhead: {
      accounts: []
    },
    currencies: {
      GBP: {
        _id: 'GBP',
        symbol: '£',
        name: 'Great British Pound'
      },
      USD: {
        _id: 'USD',
        symbol: '$',
        name: 'US Dollar'
      }
    },
    settings: {
    }
  },
  actions: {
    fetchTypeAhead: ({ commit, dispatch }) => {
      api.request({
        url: '/v1/accounts/?typeahead',
        method: 'get'
      }).then(res => {
        commit('setTypeAhead', { type: 'accounts', content: res.data })
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    },
    fetchSettings: async ({ commit, dispatch }) => {
      try {
        const { data } = await api.request({
          url: `/v1/settings`,
          method: 'get'
        })

        commit('setSettings', data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    }
  },
  mutations: {
    setSettings: (state, settings) => {
      state.settings = settings
    },
    setTypeAhead: (state, { type, content }) => {
      state.typeAhead[type] = content
    }
  },
  getters: {
    accountsById (state) {
      return state.typeAhead.accounts.reduce((accountsById, account) => ({
        ...accountsById,
        [account._id]: account
      }), {})
    },
    getAccount (state, getters) {
      return (id) => getters.accountsById[id]
    },
    allowedNavScopes (state, getters, rootState, rootGetters) {
      const accountType = rootGetters['selectedAccount/account'] && rootGetters['selectedAccount/account'].accountType

      return {
        admin: !!rootState.user.userDetails.admin,
        property: accountType && accountType.options.property,
        betting: accountType && accountType.options.betting,
        salary: accountType && accountType.options.salary
      }
    }
  }
}

export default ui
