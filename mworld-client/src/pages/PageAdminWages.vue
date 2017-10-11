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
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Value</th>
                <th>Currency</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="wage in wages" :key="wage._id" class="col-md-4">
                <td><strong>{{wage._id}}</strong></td>
                <td>{{wage.name}}</td>
                <td>{{wage.description}}</td>
                <td>{{wage.value}}</td>
                <td>{{wage.curency}}</td>
                <td>BUTTON</td>
              </tr>
            </tbody>
          </table>
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
                <input v-model="newWage.amount" type="text" id="wage-amount" class="form-control">
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
              <button type="button" class="btn btn-primary">Submit Form</button>
            </div>
          </form>
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
      wagesQueue: [],
      newWage: {
        name: '',
        description: '',
        value: '',
        currency: ''
      }
    }
  },
  mounted: function () {
    let $this = this
    axios.request({
      url: '/api/wage/',
      method: 'get',
      headers: {jwt: this.$store.jwt}
    }).then(function (response) {
      console.log(response.data)
      $this.account = response.data
    }).catch(errorHandler)
  }
}
</script>