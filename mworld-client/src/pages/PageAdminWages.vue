<template>
  <div id="PageLoginSuccess">
    <div class="page-header">
      <h1>Wages Management
        <small>Create and update existing wages</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Wages
          </div>
          <vue-good-table 
          :columns="columns"
          :rows="wages"
          :filterable="true"
          :globalSearch="true"
          >
            <template slot="table-row" scope="props">
              <td><strong>{{ props.row._id }}</strong></td>
              <td>{{ props.row.name }}</td>
              <td>{{ props.row.description }}</td>
              <td>{{ props.row.value | currency}}</td>
              <td>{{ props.row.currency}}</td>
              <td><button class="btn btn-primary" v-on:click="selectWage(props.row)" data-toggle="modal" data-target="#wageModal">Modify Wage</button></td>
            </template>         
          </vue-good-table>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Add Wage
          </div>
          <form>
            <div class="panel-body">
              <div class="input-group">
                <span class="input-group-addon">Wage Name:</span>
                <input v-model="newWage.name" type="text" id="wage-name" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Wage Description:</span>
                <input v-model="newWage.description" type="text" id="wage-description" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Wage Amount:</span>
                <input v-model="newWage.value" type="text" id="wage-amount" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <label for="sel1">Currency:</label>
                <select v-model="newWage.currency" class="form-control" id="sel1">
                  <option v-for='currency in currencies'>{{currency}}</option>
                </select>
              </div>
            </div>
            <div class="panel-footer">
              <button v-on:click="submitNew()" type="button" class="btn btn-primary">Submit Form</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="wageModal" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">{{selectedWage._id}}</h4>
          </div>
          <div class="modal-body">
            <form>
              <div class="input-group">
                <span class="input-group-addon">Wage Name:</span>
                <input v-model="selectedWage.name" type="text" id="wage-name" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Wage Description:</span>
                <input v-model="selectedWage.description" type="text" id="wage-description" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Wage Amount:</span>
                <input v-model="selectedWage.value" type="text" id="wage-amount" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <label for="sel1">Currency:</label>
                <select v-model="selectedWage.currency" class="form-control" id="sel1">
                  <option v-for='currency in currencies'>{{currency}}</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Delete Wage</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>
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
  name: 'PageAdminWages',
  store: ['user', 'jwt', 'currencies'],
  data: function () {
    return {
      wages: [],
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
          label: 'Value',
          field: 'value',
          type: 'decimal'
        },
        {
          label: 'Currency',
          field: 'currency'
        },
        {
          label: 'Buttons'
        }
      ],
      wagesQueue: [],
      selectedWage: {},
      newWage: {
        name: '',
        description: '',
        value: '',
        currency: ''
      }
    }
  },
  mounted: function () {
    this.fetchWages()
  },
  methods: {
    submitNew: function (event) {
      let $this = this
      axios.request({
        url: '/api/wage',
        method: 'post',
        headers: {jwt: this.$store.jwt},
        data: {newDocument: $this.newWage}
      }).then(function (response) {
        console.log(response.data)
        $this.wages = response.data
      }).catch(errorHandler)
    },
    selectWage: function (row) {
      this.selectedWage = Object.assign({}, row) // Performs a copy of the object
    },
    fetchWages: function () {
      let $this = this
      axios.request({
        url: '/api/wage',
        method: 'get',
        headers: {jwt: this.$store.jwt}
      }).then(function (response) {
        console.log(response.data)
        $this.wages = response.data
      }).catch(errorHandler)
    }
  },
  filters: {
    currency: function (value) {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  }
}
</script>