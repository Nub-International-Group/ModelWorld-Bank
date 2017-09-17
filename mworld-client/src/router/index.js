import Vue from 'vue'
import Router from 'vue-router'

import PageHome from '@/components/PageHome'
import PageNotFound from '@/components/PageNotFound'
import PageLogin from '@/components/PageLogin'
import PageLoginSuccess from '@/components/PageLoginSuccess'

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
    }
  ]
})
