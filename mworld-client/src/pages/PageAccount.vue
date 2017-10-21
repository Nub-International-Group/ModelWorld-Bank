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
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Users
          </div>
          <vue-good-table
          :columns="tables.users"
          :rows="account.users"
          :filterable="true"
          :globalSearch="true"
          >
          </vue-good-table>
          <div class="panel-footer">
              <label for="wage-name">Username:</label>
              <div class="input-group">
                <span class="input-group-addon">Username:</span>
                <input v-model="userToAdd.name" type="text" id="wage-name" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <label for="sel1">Access Level:</label>
                <select v-model="userToAdd.level" class="form-control" id="sel1">
                  <option v-for='(name, level) in accessLevels' :value="level">{{name}}</option>
                </select>
              </div>
              <br>
            <button type="button" v-on:click="addUser" class="btn btn-primary">Add User</button>
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
                <td><strong>eXampLe</strong></td>
                <td>09/10/2017 12:44</td>
                <td>Account Created(<strong>3728sd</strong>)</td>
                <td>Example</td>
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
            <button v-on:click="deleteAccount()" type="button" class="btn btn-danger">Delete Account</button>
            <button type="button" class="btn btn-primary">Pay Wages</button>
            <button type="button" class="btn btn-primary">Place Hold</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="wageRequestModal" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
            <h4 class="modal-title">Request Wage</h4>
          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" v-on:click="" class="btn btn-danger" data-dismiss="modal">Delete Wage</button>
            <button type="button" v-on:click="" class="btn btn-primary" data-dismiss="modal">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import errorHandler from '@/errorHandler'
import swal from 'sweetalert'

export default {
  name: 'PageAccount',
  store: ['user', 'jwt'],
  data: function () {
    return {
      account: {},
      accessLevels: {0: 'Remove User', 1: 'Read', 2: 'Read/Write', 3: 'Full Ownership'},
      userToAdd: {name: '', level: ''},
      tables: {
        users: [
          {
            label: 'Username',
            field: 'name'
          },
          {
            label: 'Access Level',
            field: 'level'
          }
        ]
      }
    }
  },
  methods: {
    fetchAccount: function () {
      let $this = this
      axios.request({
        url: '/api/account/id/' + $this.$route.params.id,
        method: 'get',
        headers: {jwt: $this.$store.jwt}
      }).then(function (response) {
        $this.processAccountData(response.data)
      }).catch(errorHandler)
    },
    processAccountData: function (responseData) {
      let userData = []
      for (let key in responseData.users) {
        if (responseData.users.hasOwnProperty(key)) {
          userData.push({name: key, level: responseData.users[key]})
        }
      }
      responseData.users = userData

      this.account = responseData
    },
    addUser: function () {
      let $this = this
      axios.request({
        url: '/api/account/id/' + $this.$route.params.id + '/user',
        method: 'post',
        headers: {jwt: $this.$store.jwt},
        data: {newDocument: $this.userToAdd}
      }).then(function (response) {
        $this.processAccountData(response.data)
      }).catch(errorHandler)
    },
    deleteAccount: function () {
      let $this = this
      swal({
        title: 'ARE YOU SURE?',
        icon: 'warning',
        text: 'Clicking \'ok\' will permenantly delete this account!',
        dangerMode: true,
        buttons: true
      }).then((choice) => {
        if (choice === true) {
          axios.request({
            url: '/api/account/id/' + $this.account._id,
            method: 'delete',
            headers: {jwt: $this.$store.jwt}
          }).then(function (response) {
            $this.$router.push('/admin/accounts')
          }).catch(errorHandler)
        }
      })
    }
  },
  mounted: function () {
    this.fetchAccount()
  }
}
</script>