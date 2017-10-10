<template>
  <div id="PageLoginSuccess">
    <div class="page-header">
      <h1>{{account.name}}
        <small>{{account.description}}</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Transactions
          </div>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Other Account</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>a17ec</strong></td>
                <td>09/10/2017 12:44</td>
                <td>+ 433,986,342.00</td>
                <td>GBP</td>
                <td>DaddyNub(<strong>34aef3</strong>)</td>
                <td>A spogtacular advance payment on your mortgereige</td>
              </tr>
            </tbody>
          </table>
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
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>aas32</strong></td>
                <td>Mad Hacker</td>
                <td>986,342.00</td>
                <td>GBP</td>
                <td><button type="button" class="btn btn-primary btn-sm">Delete</button></td>
              </tr>
              <tr>
                <td><strong>a234d</strong></td>
                <td>Grand Exchequer</td>
                <td>12,342.00</td>
                <td>GBP</td>
                <td><button type="button" class="btn btn-primary btn-sm">Delete</button></td>
              </tr>
            </tbody>
          </table>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">Request Wage</button>
            <button type="button" class="btn btn-primary">View Wage Review Queue</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Users
          </div>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Username</th>
                <th>Access Level</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Strideynet</td>
                <td>3</td>
                <td><button type="button" class="btn btn-primary btn-sm">Options</button></td>
              </tr>
              <tr>
                <td>Padanub</td>
                <td>2</td>
                <td><button type="button" class="btn btn-primary btn-sm">Options</button></td>
              </tr>
            </tbody>
          </table>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">Add User</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Action Logs
          </div>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Date</th>
                <th>Event Type</th>
                <th>User</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>a17eii</strong></td>
                <td>09/10/2017 12:44</td>
                <td>Account Created(<strong>3728sd</strong>)</td>
                <td>Strideynet(<strong>34aef3d</strong>)</td>
                <td>{}</td>
              </tr>
            </tbody>
          </table>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary">New Transaction</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="user.admin" class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Admin Options
          </div>
          <div class="panel-body">
            <button type="button" class="btn btn-primary">Delete Account</button>
            <button type="button" class="btn btn-primary">Pay Wages</button>
            <button type="button" class="btn btn-primary">Place Hold</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import errorHandler from '@/errorHandler'

export default {
  name: 'PageAccount',
  store: ['user', 'jwt'],
  data: function () {
    return {
      account: {}
    }
  },
  mounted: function () {
    let $this = this
    axios.request({
      url: '/api/account/' + $this.$route.params.id,
      method: 'get',
      headers: {jwt: this.$store.jwt}
    }).then(function (response) {
      console.log(response.data)
      $this.account = response.data
    }).catch(errorHandler)
  }
}
</script>