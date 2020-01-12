import api from '@/api'

const convertTransaction = transaction => ({
  ...transaction,
  other: (transaction.to && transaction.to.name) ? transaction.to : transaction.from,
  amount: (transaction.to && transaction.to.name) ? transaction.amount * -1 : transaction.amount
})

const transactions = {
  namespaced: true,
  state: {
    transactionDataByAccountId: {}
  },
  actions: {
    fetchByAccount: async ({ state, commit, dispatch, rootState }, accountId) => {
      try {
        dispatch('wait/start', 'fetching transactions', { root: true })
        const { data } = await api.request({
          url: `/v1/accounts/${accountId}/transactions`,
          method: 'get'
        })

        const transactions = data.transactions.map(convertTransaction).sort(
          (a, b) => Date.parse(a.created) - Date.parse(b.created))

        dispatch('wait/end', 'fetching transactions', { root: true })

        commit('setAccountTransactionData', { accountId, transactionData: { transactions, balances: data.balances } })
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    }
  },
  mutations: {
    setAccountTransactionData: (state, { accountId, transactionData }) => {
      state.transactionDataByAccountId = {
        ...state.transactionDataByAccountId,
        [accountId]: transactionData
      }
    }
  }
}

export default transactions
