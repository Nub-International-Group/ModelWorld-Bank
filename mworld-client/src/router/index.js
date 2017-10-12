import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import PageHome from '@/pages/PageHome'
import PageNotFound from '@/pages/PageNotFound'
import PageLogin from '@/pages/PageLogin'
import PageLoginSuccess from '@/pages/PageLoginSuccess'
import PageBanking from '@/pages/PageBanking'
import PageAccount from '@/pages/PageAccount'

import PageAdminWages from '@/pages/PageAdminWages'
import PageAdminAccount from '@/pages/PageAdminAccount'

import bootstrap from 'bootstrap'
window.bootstrap = bootstrap

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
      path: '/admin/account',
      name: 'AdminAccount',
      component: PageAdminAccount,
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
