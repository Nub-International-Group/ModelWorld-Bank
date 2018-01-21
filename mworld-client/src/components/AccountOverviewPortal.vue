<template>
  <div class="col-md-4" id="AccountOverviewPortal">
    <div class="panel panel-primary">
      <div class="panel-heading">
        {{account.name}}
      </div>
      <div class="panel-body">
        <strong> Access: </strong>{{account.users[user.name]| accessLevel}} <br>
        <strong> Description: </strong>{{account.description}} <br>
        <strong> ID: </strong>{{account._id}} <br>
        <strong> Balance: </strong>£{{balances['GBP'] | currency}}
      </div>
      <div class="panel-footer">
        <router-link :to="'/account/' + account._id" type="button" class="btn btn-primary">Access Account</router-link>
      </div>
    </div>
  </div>      
</template>

<script>
import axios from 'axios'
import errorHandler from '@/errorHandler'
import {accessLevels} from '@/globalValues'

export default {
  name: 'AccountOverviewPortal',
  store: ['user', 'jwt'],
  props: ['account'],
  data: function () {
    return {
      balances: {}
    }
  },
  mounted: function () {
    let $this = this
    axios.request({
      url: '/api/account/id/' + $this.account._id + '/transaction',
      method: 'get',
      headers: {jwt: $this.$store.jwt}
    }).then(function (response) {
      $this.balances = response.data.balance
    }).catch(errorHandler)
  },
  filters: {
    currency: function (value) {
      if (value === undefined) {
        value = 0
      }

      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    accessLevel: function (level) {
      return accessLevels[level]
    }
  }
}
</script>