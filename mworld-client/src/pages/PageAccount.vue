<template>
  <div id="PageLoginSuccess">
    <div class="page-header">
      <h1>Strideynet
        <small>oi hands off its mine</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Transactions
          </div>
          <div class="panel-body">
          </div>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">New Transaction</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Wages
          </div>
          <div class="panel-body">
          </div>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">Request Wage</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Users
          </div>
          <div class="panel-body">
          </div>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">Add User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PageAccount',
  store: ['user', 'jwt'],
  data: function () {
    return {
      accounts: []
    }
  },
  mounted: function () {
    let $this = this
    axios.request({
      url: '/api/account',
      method: 'get',
      headers: {jwt: this.$store.jwt}
    }).then(function (response) {
      $this.accounts = response.data
    })
  }
}
</script>