import api from '@/api'

const accounts = {
  namespaced: true,
  state: {
    all: []
  },
  mutations: {
    upsert: (state, account) => {
      state.all = [
        ...state.all.filter(acc => acc._id !== account._id),
        account
      ]
    },
    upsertArray: (state, accounts) => {
      for (const account of accounts) {
        state.all = [
          ...state.all.filter(acc => acc._id !== account._id),
          account
        ]
      }
    },
    delete: (state, accountId) => {
      state.all = [
        ...state.all.filter(acc => acc._id !== accountId)
      ]
    }
  },
  actions: {
    fetchPersonal: async ({ commit, dispatch }) => {
      try {
        const { data } = await api.request({
          url: '/v1/users/me/accounts',
          method: 'get'
        })

        commit('upsertArray', data)
      } catch (e) {
        dispatch('messages/handleError', { e }, { root: true })
      }
    },
    fetchAdmin: async ({ commit, dispatch }) => {
      try {
        const { data } = await api.request({
          url: '/v1/accounts/?admin',
          method: 'get'
        })
        commit('upsertArray', data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    create: async ({ state, rootState, commit, dispatch }, account) => {
      try {
        const { data } = await api.request({
          url: '/v1/accounts',
          method: 'post',
          data: account
        })
        commit('upsertAdmin', data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    update: async ({ state, commit, dispatch }, account) => {
      try {
        const { data } = await api.request({
          url: '/v1/accounts/' + account._id,
          method: 'put',
          data: account
        })

        await commit('upsert', data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    deleteById: async ({ state, commit, dispatch }, accountId) => {
      try {
        await api.request({
          url: '/v1/accounts/' + accountId,
          method: 'delete'
        })

        await commit('delete', accountId)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    fetchById: async ({ state, commit, dispatch, rootState }, accountId) => {
      accountId = accountId || rootState.selectedAccount.accountId
      try {
        const { data } = await api.request({
          url: '/v1/accounts/' + accountId,
          method: 'get'
        })
        commit('upsert', data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
        return null
      }
    }
  },
  getters: {
    allAccountsById: (state, getters) => state.all.reduce((accounts, account) => ({ ...accounts, [account._id]: account }), {}),
    ownedAccounts: (state, getters, rootState) => state.all.filter(account => account.users[rootState.user.userDetails.name])
  }
}

export default accounts
