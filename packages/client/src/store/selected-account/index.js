import api from '@/api'

import transactions from './transactions'
import wagers from './wagers'

const selectedAccount = {
  namespaced: true,
  state: {
    accountId: null
  },
  mutations: {
    setAccountId: (state, accountId) => {
      state.accountId = accountId
    }
  },
  modules: {
    wagers,
    transactions
  },
  actions: {
    selectAccount: async ({ state, commit, dispatch }, accountId) => {
      await dispatch('accounts/fetchById', accountId, { root: true })

      // reset sub-modules
      commit('wagers/resetState')
      commit('transactions/resetState')

      // set id
      commit('setAccountId', accountId)

      // trigger any sub-module fetches needed
    },
    deleteWage: async ({ state, commit, dispatch, rootState }, wageId) => {
      try {
        await api.request({
          url: `/v1/accounts/${state.accountId}/wages/${wageId}`,
          method: 'delete'
        })
        dispatch('fetchAccount', state.accountId)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
        return null
      }
    },
    editUser: async ({ state, commit, dispatch }, { username, level }) => {
      try {
        await api.request({
          url: `/v1/accounts/${state.accountId}/users/${username}`,
          method: 'put',
          data: {
            level
          }
        })
        dispatch('fetchAccount', state.accountId)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
        return null
      }
    },
    createWageRequest: async ({ state, commit, dispatch, rootState }, wageId) => {
      try {
        const { data } = await api.request({
          url: `/v1/accounts/${state.accountId}/wages`,
          method: 'post',
          data: {
            wageID: wageId
          }
        })

        commit('wageRequests/setAccountWageRequests', { accountId: state.accountId, wageRequests: data }, { root: true })
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    transferProperty: async ({ state, commit, dispatch }, { value, accountId, propertyId }) => {
      try {
        await api.request({
          url: `/v1/accounts/${state.accountId}/properties/${propertyId}/transfer`,
          method: 'post',
          data: {
            value,
            accountId
          }
        })

        await dispatch('properties/fetch', {}, { root: true })
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    fetchWageRequests: async ({ state, dispatch }) => {
      await dispatch('wageRequests/fetchByAccount', state.accountId, { root: true })
    },
    fetchTransactions: async ({ state, dispatch }) => {
      await dispatch('transactions/fetchByAccount', state.accountId, { root: true })
    },
    fetchAccount: async ({ state, dispatch }) => {
      await dispatch('accounts/fetchById', state.accountId, { root: true })
    }
  },
  getters: {
    account: (state, getters, rootState, rootGetters) => rootGetters['accounts/allAccountsById'][state.accountId],
    balances: (state) => state.transactions.balances || {},
    properties: (state, getters, rootState, rootGetters) => rootGetters['properties/all'].filter(property => property.owner === state.accountId),
    transactions: (state) => state.transactions.transactions || [],
    wageRequests: (state, getters, rootState) => rootState.wageRequests.wageRequestsByAccountId[state.accountId] || [],
    wages: (state, getters, rootState, rootGetters) => getters.account.wages.map(wageId => rootGetters['wages/wagesById'][wageId]),
    wagers: (state) => state.wagers.items
  }
}

export default selectedAccount
