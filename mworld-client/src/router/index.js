import Vue from 'vue'
import Router from 'vue-router'

import PageHome from '@/pages/PageHome'
import PageNotFound from '@/pages/PageNotFound'
import PageLogin from '@/pages/PageLogin'
import PageLoginSuccess from '@/pages/PageLoginSuccess'
import PageBanking from '@/pages/PageBanking'

import bootstrap from 'bootstrap'
window.bootstrap = bootstrap

Vue.use(Router)
export default new Router({
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
      component: PageBanking
    }
  ]
})
