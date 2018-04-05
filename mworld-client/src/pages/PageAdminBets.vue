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
              <br/>
              <strong>Bet Options:</strong>
              <div class="row">
                <div class="col-md-4" v-for="option in newBet.options">
                  <div class="panel panel-primary">
                    <div class="panel-heading">
                      {{option.name}}
                    </div>
                    <div class="panel-body">
                      <div class="input-group">
                        <span class="input-group-addon">Name:</span>
                        <input v-model="option.name" type="text" class="form-control">
                      </div>
                      <br/>
                      <div class="input-group">
                        <span class="input-group-addon">Description:</span>
                        <textarea v-model="option.description" type="text" class="form-control" style="height:100px; resize: none;"/>
                      </div>
                      <br>
                      <div class="input-group">
                        <span class="input-group-addon">Odds:</span>
                        <input v-model="option.currentOdds" type="text" class="form-control">
                      </div>
                      <br/>
                    </div>
                    <div class="panel-footer">
                      <button v-on:click="removeOption(option)" type="button" class="btn btn-danger">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel-footer">
              <button v-on:click="submitNew" type="button" class="btn btn-primary">Submit Form</button>
              <button v-on:click="addOption" type="button" class="btn btn-success">Add Option</button>
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
            :columns="allBets.columns"
            :rows="allBets.rows"
            :filterable="true"
            :globalSearch="true"
            :paginate="true"
          >
            <template slot="table-row" scope="props">
              <td><strong>{{ props.row._id }}</strong></td>
              <td>{{ props.row.name }}</td>
              <td>{{ props.row.description }}</td>
              <td>{{ props.row.status | statusConversion}}</td>
              <td>{{ props.row.created}}</td>
              <td>
                <button type="button" class="btn btn-primary">Edit Bet</button>

                <button v-if="props.row.status == 1" type="button" class="btn btn-primary">Close</button>
                <button v-if="props.row.status == 0" type="button" class="btn btn-primary">Open</button>
                <button v-if="props.row.status == 0" type="button" disabled class="btn btn-primary">Pay Out</button>
              </td>
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
  import {betStatus} from '@/globalValues'

  export default {
    name: 'PageAdminBets',
    store: ['user', 'jwt'],
    data: function () {
      return {
        betStatus,
        newBet: {
          name: 'XYZ BET',
          description: 'Bet decided upon XYZ based on X criterion by Z',
          status: 'Open',
          options: []
        },
        allBets: {
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
              label: 'Status',
              field: 'status'
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
        axios.request({
          url: '/api/bet',
          method: 'post',
          headers: {jwt: this.$store.jwt},
          data: this.newBet
        }).then((response) => {
          this.allBets.rows.push(response.data) // Add new account to table onscreen

          swal({
            title: 'Creation Success!',
            icon: 'success'
          })
        }).catch(errorHandler)
      },
      addOption: function () {
        this.newBet.options.push({
          name: 'Example Option',
          description: 'Johnson Johnson wins the election.',
          currentOdds: 3.76
        })
      },
      removeOption: function (option) {
        let index = this.newBet.options.indexOf(option)
        this.newBet.options.splice(index, 1)
      },
      fetchBets: function () {
        let $this = this
        axios.request({
          url: '/api/bet',
          method: 'get',
          headers: {jwt: this.$store.jwt}
        }).then(function (response) {
          $this.allBets.rows = response.data
        }).catch(errorHandler)
      }
    },
    mounted: function () {
      this.fetchBets()
      this.addOption()
    },
    filters: {
      statusConversion: function (number) {
        return betStatus[number]
      }
    }
  }
</script>
