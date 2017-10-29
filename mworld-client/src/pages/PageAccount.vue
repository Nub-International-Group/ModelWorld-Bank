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
            Account Summary
          </div>
          <div class="panel-body">
            Unique Account ID: <strong>{{account._id}}</strong>
            <br/>
            Creation Date: {{account.created}}
            <br/>
            Public: {{account.public}}
            <br/>
          </div>
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(amount, currency) in balances">
                <td>{{currency}}</td>
                <td>{{amount | currency}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Transactions
          </div>
          <vue-good-table
          :columns="tables.transactions"
          :rows="transactions"
          :filterable="true"
          :globalSearch="true"
          :paginate="true"
          >
            <template slot="table-row" scope="props">
              <td>{{ props.row._id }}</td>
              <td>{{ props.row.created }}</td>
              <td>{{ props.row.sign}}</td>
              <td>{{ props.row.amount | currency }}</td>
              <td>{{ props.row.currency }}</td>
              <td><strong>{{ props.row.other }}</strong>{{ props.row.other.name }}</td>
              <td>{{ props.row.description }}</td>
            </template>
          </vue-good-table>
          <div class="panel-footer">
            <form>
              <div class="row">
                <div class="col-md-6">
                  <label for="account-name-field">Account ID:</label>
                  <div class="input-group">
                    <span class="input-group-addon">Account ID:</span>
                    <input v-model="newTransaction.target" type="text" id="account-name-field" class="form-control" />
                  </div>
                  <span class="help-block">Copy and paste their Account ID. This must be identical!</span>
                  <br>
                  <label for="amount-field">Amount:</label>
                  <div class="input-group">
                    <span class="input-group-addon">Amount:</span>
                    <input v-model="newTransaction.amount" type="text" id="amount-field" class="form-control" />
                  </div>
                  <br>
                  <label for="description-field">Description:</label>
                  <div class="input-group">
                    <span class="input-group-addon">Description:</span>
                    <input v-model="newTransaction.description" type="text" id="description-field" class="form-control" />
                  </div>
                  <br>
                  <div class="input-group">
                    <label for="sel1">Currency:</label>
                    <select v-model="newTransaction.currency" class="form-control" id="sel1">
                      <option v-for='currency in currencies'>{{currency}}</option>
                    </select>
                  </div>
                  <br>
                  <button type="button" v-on:click="addTransaction" class="btn btn-primary">Submit Transaction</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Wages
          </div>
          <vue-good-table 
          :columns="tables.wages"
          :rows="account.wages"
          :filterable="true"
          :globalSearch="true"
          :paginate="true"
          >
            <template slot="table-row" scope="props">
              <td><strong>{{ props.row._id }}</strong></td>
              <td>{{ props.row.name }}</td>
              <td>{{ props.row.description }}</td>
              <td>{{ props.row.value | currency}}</td>
              <td>{{ props.row.currency}}</td>
              <td><button class="btn btn-danger" v-on:click="deleteWage(props.row)">Remove</button></td>
            </template>         
          </vue-good-table>
          <div class="panel-footer">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#wageRequestModal">Request Wage</button>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Users
          </div>
          <vue-good-table
          :columns="tables.users"
          :rows="account.users"
          :filterable="true"
          :globalSearch="true"
          :paginate="true"
          >
            <template slot="table-row" scope="props">
              <td>{{ props.row.name }}</td>
              <td>{{ props.row.level | accessLevel }}</td>
            </template>
          </vue-good-table>
          <div class="panel-footer">
            <div class="row">
              <div class="col-md-6">
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
                <button type="button" v-on:click="addUser" class="btn btn-primary">Save User</button>
              </div>
            </div>
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
            <button type="button" v-on:click="payWages()" class="btn btn-primary">Pay Wages</button>
            <button type="button" class="btn btn-primary disabled">Place Hold</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="wageRequestModal" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
            <h4 class="modal-title">Wage Requests</h4>
          </div>
          <div class="modal-body">
            <h4>Currently Requested</h4>
            <p>Your requests will be validated as soon as possible. Please be patient.</p>
            <vue-good-table 
            :columns="tables.wageRequests"
            :rows="wageRequests"
            :filterable="true"
            :globalSearch="true"
            :paginate="true"
            styleClass="table table-bordered condensed"/>
            </vue-good-table>
            <hr />
            <h4>Request New</h4>
            <p>Once requested, a site operator will validate and accept your request to have this wage added.</p>
            <vue-good-table 
            :columns="tables.wagesList"
            :rows="possibleWages"
            :filterable="true"
            :globalSearch="true"
            :paginate="true"
            styleClass="table table-bordered condensed">
              <template slot="table-row" scope="props">
                <td>{{ props.row.name }}</td>
                <td>{{ props.row.description}}</td>
                <td>{{ props.row.value | currency }}</td>
                <td><button type="button" v-on:click="requestWage(props.row._id)" class="btn btn-primary">Request</button></td>
              </template>
            </vue-good-table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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

let accessLevels = {0: 'Remove User', 1: 'Read', 2: 'Read/Write', 3: 'Full Ownership'}
export default {
  name: 'PageAccount',
  store: ['user', 'jwt', 'currencies'],
  data: function () {
    return {
      account: {},
      accessLevels: accessLevels,
      userToAdd: {name: '', level: ''},
      wageToRequest: '',
      wageRequests: [],
      possibleWages: [],
      transactions: [],
      balances: {},
      newTransaction: {},
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
        ],
        wages: [
          {
            label: 'ID',
            field: '_id'
          },
          {
            label: 'Name',
            field: 'name'
          },
          {
            label: 'Description',
            field: 'description'
          },
          {
            label: 'Value',
            field: 'value',
            type: 'decimal'
          },
          {
            label: 'Currency',
            field: 'currency'
          },
          {
            label: 'Delete'
          }
        ],
        transactions: [
          {
            label: 'ID'
          },
          {
            label: 'Date',
            field: 'created'
          },
          {
            label: 'Positive/Negative'
          },
          {
            label: 'Amount',
            field: 'amount',
            type: 'decimal'
          },
          {
            label: 'Currency'
          },
          {
            label: 'Other Account'
          },
          {
            label: 'Description'
          }
        ],
        wagesList: [
          {
            label: 'Name',
            field: 'name'
          },
          {
            label: 'Description',
            field: 'description'
          },
          {
            label: 'Value',
            field: 'value',
            type: 'decimal'
          },
          {
            label: 'Request'
          }
        ],
        wageRequests: [
          {
            label: 'Request ID',
            field: '_id'
          },
          {
            label: 'Wage ID',
            field: 'wage._id'
          },
          {
            label: 'Name',
            field: 'wage.name'
          },
          {
            label: 'Requested',
            field: 'created'
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
    fetchPossibleWages: function () {
      let $this = this
      axios.request({
        url: '/api/wage',
        method: 'get',
        headers: {jwt: $this.$store.jwt}
      }).then(function (response) {
        $this.processWageData(response.data)
      }).catch(errorHandler)
    },
    fetchWageRequests: function () {
      let $this = this
      axios.request({
        url: '/api/account/id/' + $this.$route.params.id + '/wage',
        method: 'get',
        headers: {jwt: $this.$store.jwt}
      }).then(function (response) {
        response.data = response.data.filter(function (val) { // Remove broken data entries. Will eventually be cleaned server-side
          return !(val.wage == null)
        })

        $this.wageRequests = response.data
        $this.fetchPossibleWages()
      }).catch(errorHandler)
    },
    fetchTransactions: function () {
      let $this = this
      axios.request({
        url: '/api/account/id/' + $this.$route.params.id + '/transaction',
        method: 'get',
        headers: {jwt: $this.$store.jwt}
      }).then(function (response) {
        let processedTransactions = []

        response.data.transactions.forEach(function (transaction) {
          let accountID = $this.$route.params.id

          if (transaction.from === accountID) {
            transaction.other = transaction.to
            transaction.sign = '-'
          } else if (transaction.to === accountID) {
            transaction.other = transaction.from
            transaction.sign = '+'
          }

          processedTransactions.push(transaction)
        })

        $this.transactions = processedTransactions
        $this.balances = response.data.balance
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
      this.fetchWageRequests()
    },
    processWageData: function (responseData) {
      let $this = this
      responseData = responseData.filter(function (val) {
        let existingWages = $this.account.wages.find(function (wage) { // Remove elements that exist already in the wage data.
          return wage['_id'] === val['_id']
        })

        let existingRequests = $this.wageRequests.find(function (wageRequest) { // Remove elements that exist already in the requests
          if (wageRequest.wage) {
            return wageRequest.wage['_id'] === val['_id']
          } else {
            return false
          }
        })
        return (existingWages === undefined) && (existingRequests === undefined)
      })

      $this.possibleWages = responseData
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
    addTransaction: function () {
      let $this = this
      swal({
        title: 'ARE YOU SURE?',
        icon: 'warning',
        text: 'Clicking \'ok\' will start the transaction!',
        dangerMode: true,
        buttons: true
      }).then((choice) => {
        if (choice === true) {
          axios.request({
            url: '/api/account/id/' + $this.$route.params.id + '/transaction',
            method: 'post',
            headers: {jwt: $this.$store.jwt},
            data: $this.newTransaction
          }).then(function (response) {
            $this.fetchTransactions()
          }).catch(errorHandler)
        }
      })
    },
    deleteWage: function (wage) {
      let $this = this
      swal({
        title: 'ARE YOU SURE?',
        icon: 'warning',
        text: 'Clicking \'ok\' will remove this wage!',
        dangerMode: true,
        buttons: true
      }).then((choice) => {
        if (choice === true) {
          axios.request({
            url: '/api/account/id/' + $this.$route.params.id + '/wage/' + wage._id,
            method: 'delete',
            headers: {jwt: $this.$store.jwt}
          }).then(function (response) {
            $this.fetchAccount()
          }).catch(errorHandler)
        }
      })
    },
    requestWage: function (wageID) {
      let $this = this
      axios.request({
        url: '/api/account/id/' + $this.$route.params.id + '/wage',
        method: 'post',
        headers: {jwt: $this.$store.jwt},
        data: {wageID: wageID}
      }).then(function (response) {
        $this.wageRequests = response.data
        $this.fetchPossibleWages()
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
    },
    payWages: function () {
      let $this = this
      axios.request({
        url: '/api/account/id/' + $this.$route.params.id + '/pay',
        method: 'get',
        headers: {jwt: $this.$store.jwt}
      }).then(function (response) {
        $this.fetchTransactions()
      }).catch(errorHandler)
    }
  },
  mounted: function () {
    this.fetchAccount()
    this.fetchTransactions()
  },
  filters: {
    currency: function (value) {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    accessLevel: function (level) {
      return accessLevels[level]
    }
  }
}
</script>