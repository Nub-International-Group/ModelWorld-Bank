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
              <td><button class="btn btn-danger" v-on:click="selectWage(props.row)" data-toggle="modal" data-target="#wageModal">Remove</button></td>
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
  store: ['user', 'jwt'],
  data: function () {
    return {
      account: {},
      accessLevels: accessLevels,
      userToAdd: {name: '', level: ''},
      wageToRequest: '',
      wageRequests: [],
      possibleWages: [],
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
    }
  },
  mounted: function () {
    this.fetchAccount()
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