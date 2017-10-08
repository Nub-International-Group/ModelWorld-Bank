<template>
  <div id="PageLoginSuccess">
    <div class="page-header">
      <h1>Banking
        <small>Our primary service</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            My Accounts
          </div>
          <div class="panel-body">
            <div class="row">
              <div v-if="accounts.length">
                <div v-for="account in accounts" :key="account._id" class="col-md-4">
                  <div class="panel panel-primary">
                    <div class="panel-heading">
                      {{account.name}}
                    </div>
                    <div class="panel-body">
                        Balance: {{account.balance}} <br>
                        Access: {{account.users[user.name]}} <br>
                        Description: {{account.description}} <br>
                        ID: {{account._id}}
                    </div>
                    <div class="panel-footer">
                      <router-link :to="'/account/' + account._id" type="button" class="btn btn-primary">Access Account</router-link>
                    </div>
                  </div>
                </div>
              </div>
              <h4 v-else>You don't have any accounts registered to this username. Should you want to register an account speak to a member of staff on our Discord!</h4>
            </div>
          </div>
          <!--
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">New Account</button>
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import errorHandler from '@/errorHandler'

export default {
  name: 'PageBanking',
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
    }).catch(errorHandler)
  }
}
</script>