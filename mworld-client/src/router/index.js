import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import PageHome from '@/pages/PageHome'
import PageNotFound from '@/pages/PageNotFound'
import PageLogin from '@/pages/PageLogin'
import PageLoginSuccess from '@/pages/PageLoginSuccess'
import PageBanking from '@/pages/PageBanking'
import PageAccount from '@/pages/PageAccount'
import PageLogout from '@/pages/PageLogout'
import PageHelp from '@/pages/PageHelp'
import PageStaff from '@/pages/PageStaff'

import PageBetting from '@/pages/PageBetting'

import PageAdminWages from '@/pages/PageAdminWages'
import PageAdminAccounts from '@/pages/PageAdminAccount'
import PageAdminTransactions from '@/pages/PageAdminTransactions'
import PageAdminBets from '@/pages/PageAdminBets'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: PageHome
    },
    {
      path: '*',
      component: PageNotFound
    },
    {
      path: '/login',
      name: 'Login',
      component: PageLogin
    },
    {
      path: '/logout',
      name: 'Logout',
      component: PageLogout,
      meta: { authRequire: true }
    },
    {
      path: '/help',
      name: 'Help',
      component: PageHelp
    },
    {
      path: '/staff',
      name: 'Staff',
      component: PageStaff
    },
    {
      path: '/login/success',
      name: 'LoginSuccess',
      component: PageLoginSuccess
    },
    {
      path: '/account',
      name: 'Banking',
      component: PageBanking,
      meta: { authRequire: true }
    },
    {
      path: '/betting',
      name: 'Betting',
      component: PageBetting,
      meta: { authRequire: true }
    },
    {
      path: '/account/:id/:sub',
      name: 'Account',
      component: PageAccount,
      meta: { authRequire: true }
    },
    {
      path: '/account/:id',
      name: 'Account',
      component: PageAccount,
      meta: { authRequire: true }
    },
    {
      path: '/admin/wages',
      name: 'AdminWages',
      component: PageAdminWages,
      meta: { adminRequire: true }
    },
    {
      path: '/admin/accounts',
      name: 'AdminAccounts',
      component: PageAdminAccounts,
      meta: { adminRequire: true }
    },
    {
      path: '/admin/transactions',
      name: 'AdminTransactions',
      component: PageAdminTransactions,
      meta: { adminRequire: true }
    },
    {
      path: '/admin/bets',
      name: 'AdminBets',
      component: PageAdminBets,
      meta: { adminRequire: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.authRequire)) {
    if (store.jwt) {
      return next()
    } else {
      return next('/login')
    }
  } else if (to.matched.some(route => route.meta.adminRequire)) {
    if (store.user.admin) {
      return next()
    } else {
      return next('/login')
    }
  }

  return next()
})

export default router
