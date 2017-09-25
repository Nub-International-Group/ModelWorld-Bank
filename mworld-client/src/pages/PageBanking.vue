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
              <div class="col-md-4">
                <div class="panel panel-primary">
                  <div class="panel-heading">
                    strideynet
                  </div>
                  <div class="panel-body">
                      Balance: £666 <br>
                      Position: Owner <br>
                      Description: Personal account for /u/strideynet <br>
                      ID: PPBqWA9
                  </div>
                  <div class="panel-footer">
                    <button type="button" class="btn btn-primary">Access Account</button>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="panel panel-primary">
                  <div class="panel-heading">
                    NiGBet
                  </div>
                  <div class="panel-body">
                      Balance: £543 <br>
                      Position: Read/Write <br>
                      Description: Corporate account for NiGBet <br>
                      ID: PZBs99G
                  </div>
                  <div class="panel-footer">
                    <button type="button" class="btn btn-primary">Access Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">New Account</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PageBanking',
  store: ['user', 'jwt'],
  data: function () {
    return {
      accounts: []
    }
  },
  mounted: function () {
    axios.request({
      url: '/api/account',
      method: 'get',
      headers: {jwt: this.$store.jwt}
    }).then(function (response) {
      this.accounts = response.data
    })
  }
}
</script>