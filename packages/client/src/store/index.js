import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './accounts'
import accountTypes from './account-types'
import admin from './admin'
import bets from './bets'
import leaderboards from './leaderboards'
import messages from './messages'
import properties from './properties'
import selectedAccount from './selectedAccount'
import transactions from './transactions'
import user from './user'
import ui from './ui'
import wages from './wages'
import wageRequests from './wageRequests'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    accountTypes,
    accounts,
    admin,
    bets,
    leaderboards,
    messages,
    properties,
    selectedAccount,
    transactions,
    ui,
    user,
    wageRequests,
    wages
  }
})

/**
 * When user logs in:
 */
store.watch(state => state.user.jwt, jwt => {
  if (jwt) {
    store.dispatch('accounts/fetchPersonal')
  }
})

export default store
