// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueStash from 'vue-stash'
import store from '@/store'
import VueGoodTable from 'vue-good-table'

Vue.config.productionTip = false

Vue.use(VueStash)
Vue.use(VueGoodTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: {store},
  template: '<App/>',
  components: { App }
})
