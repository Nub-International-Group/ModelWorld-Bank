import api from '@/api'

const defaultState = () => {
  return {
    transactions: [],
    balances: {}
  }
}
const convertTransaction = transaction => ({
  ...transaction,
  other: (transaction.to && transaction.to.name) ? transaction.to : transaction.from,
  amount: (transaction.to && transaction.to.name) ? transaction.amount * -1 : transaction.amount
})

const transactions = {
  namespaced: true,
  state: defaultState(),
  actions: {
    create: async ({ state, commit, dispatch, rootState }, transaction) => {
      try {
        dispatch('wait/start', 'create account transaction', { root: true })
        await api.request({
          url: `/v1/accounts/${rootState.selectedAccount.accountId}/transactions`,
          method: 'post',
          data: transaction
        })

        dispatch('fetch')

        commit('messages/addMessage', {
          title: 'Transaction Created',
          type: 'success',
          message: 'Successfully created transaction'
        }, { root: true })
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'create account transaction', { root: true })
      }
    },
    fetch: async ({ state, commit, dispatch, rootState }) => {
      try {
        dispatch('wait/start', 'fetching account transactions', { root: true })
        const { data } = await api.request({
          url: `/v1/accounts/${rootState.selectedAccount.accountId}/transactions`,
          method: 'get'
        })

        const transactions = data.transactions.map(convertTransaction).sort(
          (a, b) => Date.parse(a.created) - Date.parse(b.created))

        commit('setAccountTransactionData', { transactions, balances: data.balances })
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      } finally {
        dispatch('wait/end', 'fetching account transactions', { root: true })
      }
    }
  },
  mutations: {
    resetState: (state) => {
      state = defaultState()
    },
    setAccountTransactionData: (state, { transactions, balances }) => {
      state.transactions = transactions
      state.balances = balances
    }
  }
}

export default transactions
