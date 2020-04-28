import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './accounts'
import accountTypes from './account-types'
import admin from './admin'
import bets from './bets'
import economyReports from './economy-reports'
import messages from './messages'
import properties from './properties'
import selectedAccount from './selected-account'
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
    economyReports,
    messages,
    properties,
    selectedAccount,
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
