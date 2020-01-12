import './polyfill'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueWait from 'vue-wait'
import BootstrapVue from 'bootstrap-vue'
import { ClientTable } from 'vue-tables-2'
import App from './App'
import router from './router/index'
import store from './store/index'

// todo
// cssVars()

Vue.use(BootstrapVue)
Vue.use(ClientTable)
Vue.use(VueAnalytics, {
  id: 'UA-131338540-1',
  router
})
Vue.use(VueWait)

Vue.component('VClientTable', Vue.component('v-client-table'))

Vue.mixin({
  methods: {
    $currency: function (amount, code = 'GBP') {
      const currency = this.$store.state.ui.currencies[code] || this.$store.state.ui.currencies['GBP']
      const negative = amount < 0 ? '-' : ''
      return `${negative}${currency.symbol}${Math.abs(amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  wait: new VueWait({
    useVuex: true,
    vuexModuleName: 'wait'
  })
})
