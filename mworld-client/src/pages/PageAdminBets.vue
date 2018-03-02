<template>
  <div id="PageAdminAccounts">
    <div class="page-header">
      <h1>Bet Management
        <small>Create and access bets</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Add Bet
          </div>
          <form>
            <div class="panel-body">
              <div class="input-group">
                <span class="input-group-addon">Bet Name:</span>
                <input v-model="newBet.name" type="text" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Bet Description:</span>
                <input v-model="newBet.description" type="text" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Initial Status:</span>
                <select v-model="newBet.status" class="form-control">
                  <option v-for='status in betStatus'>{{status}}</option>
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
            Bet Management
          </div>
          <vue-good-table
            :columns="allAccounts.columns"
            :rows="allAccounts.rows"
            :filterable="true"
            :globalSearch="true"
            :paginate="true"
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

  export default {
    name: 'PageAdminBets',
    store: ['user', 'jwt', 'betStatus'],
    data: function () {
      return {
        newBet: {
          name: 'XYZ BET',
          description: 'Bet decided upon XYZ based on X criterion by Z',
          status: 'Open'
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
