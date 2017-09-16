import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import PageNotFound from '@/components/PageNotFound'
import bootstrap from 'bootstrap'
window.bootstrap = bootstrap

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
})
