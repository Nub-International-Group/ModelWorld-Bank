<template>
  <div id="PageAdminAccounts">
    <div class="page-header">
      <h1>Account Management
        <small>Create and access accounts</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Add Account
          </div>
          <form>
            <div class="panel-body">
              <div class="input-group">
                <span class="input-group-addon">Account Name:</span>
                <input v-model="newAccount.name" type="text" id="wage-name" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Account Description:</span>
                <input v-model="newAccount.description" type="text" id="wage-description" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Initial Owner (Without /u/ Case Insensitive):</span>
                <input v-model="newAccount.owner" type="text" id="wage-amount" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <label for="sel1">Public Account:</label>
                <select v-model="newAccount.public" class="form-control" id="sel1">
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>
            <div class="panel-footer">
              <button v-on:click="submitNew" type="button" class="btn btn-primary">Submit Form</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Account Search
          </div>
          <vue-good-table
          :columns="allAccounts.columns"
          :rows="allAccounts.rows"
          :filterable="true"
          :globalSearch="true"
          >
            <template slot="table-row" scope="props">
              <td><strong>{{ props.row._id }}</strong></td>
              <td>{{ props.row.name }}</td>
              <td>{{ props.row.description }}</td>
              <td>{{ props.row.public}}</td>
              <td>{{ props.row.created}}</td>
              <td><router-link :to="'/account/' + props.row._id" type="button" class="btn btn-primary">Access Account</router-link></td>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import errorHandler from '@/errorHandler'
import swal from 'sweetalert'
import VueGoodTable from 'vue-good-table'

export default {
  name: 'PageAdminAccounts',
  store: ['user', 'jwt', 'currencies'],
  components: [VueGoodTable],
  data: function () {
    return {
      newAccount: {
        name: '',
        description: '',
        owner: '',
        public: ''
      },
      allAccounts: {
        columns: [
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
            label: 'Public?',
            field: 'public'
          },
          {
            label: 'Created Date',
            field: 'created'
          },
          {
            label: 'Buttons'
          }
        ],
        rows: []
      }
    }
  },
  methods: {
    submitNew: function (event) {
      let $this = this
      axios.request({
        url: '/api/account',
        method: 'post',
        headers: {jwt: this.$store.jwt},
        data: {newDocument: $this.newAccount}
      }).then(function (response) {
        $this.allAccounts.rows.push(response.data) // Add new account to table onscreen

        swal({
          title: 'Creation Success!',
          icon: 'success',
          text: 'Account succesfully created!',
          buttons: {
            stay: {
              text: 'Stay Here',
              value: false
            },
            change: {
              text: 'Visit Account',
              value: true
            }
          }
        }).then((choice) => {
          if (choice) {
            $this.$router.push('/account/' + response.data['_id']) // Redirect to account page
          }
        })
        console.log(response.data)
      }).catch(errorHandler)
    },
    fetchAccounts: function () {
      let $this = this
      axios.request({
        url: '/api/account/admin',
        method: 'get',
        headers: {jwt: this.$store.jwt}
      }).then(function (response) {
        $this.allAccounts.rows = response.data
      }).catch(errorHandler)
    }
  },
  mounted: function () {
    this.fetchAccounts()
  }
}
</script>