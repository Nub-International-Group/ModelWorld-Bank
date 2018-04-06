<template>
  <div>
    <form>
      <div class="row">
        <div class="col-md-6">
          <label for="account-search">Account Name:</label>
          <div class="input-group">
            <span class="input-group-addon">Account Name Search:</span>
            <input v-model="query" v-on:input="queryChanged" type="text" id="account-search" class="form-control" />
          </div>
          <span class="help-block">Search for an account!</span>
          <br>
        </div>


        <table class="table table-striped" v-if="possible.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in possible" :key="account._id">
              <td>{{account.name}}</td>
              <td>{{account.description}}</td>
              <td><button class="btn btn-primary" v-on:click="setID(account._id)">Select</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="account-name-field">Account ID:</label>
          <div class="input-group">
            <span class="input-group-addon">Account ID:</span>
            <input v-model="newTransaction.target" type="text" id="account-name-field" class="form-control" />
          </div>
          <span class="help-block">Copy and paste their Account ID or use the search function above.</span>
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
</template>

<script>
  import axios from 'axios'
  import errorHandler from '@/errorHandler'
  import swal from 'sweetalert2'
  import Fuse from 'fuse.js'

  export default {
    name: 'TransactionDialogue',
    store: ['user', 'jwt', 'currencies'],
    data: function () {
      return {
        newTransaction: {
          target: ''
        },
        typeahead: [],
        query: '',
        possible: []
      }
    },
    mounted: function () {
      axios.request({
        url: '/api/account/typeahead',
        method: 'get'
      }).then((response) => {
        this.typeahead = response.data
      }).catch(errorHandler)
    },
    methods: {
      addTransaction: function () {
        swal({
          title: 'ARE YOU SURE?',
          type: 'warning',
          text: 'Clicking \'ok\' will start the transaction!',
          dangerMode: true,
          buttons: true
        }).then((choice) => {
          if (choice === true) {
            axios.request({
              url: '/api/account/id/' + this.$route.params.id + '/transaction',
              method: 'post',
              headers: {jwt: this.$store.jwt},
              data: this.newTransaction
            }).then((response) => {
              this.$emit('updateTransactions')
            }).catch(errorHandler)
          }
        })
      },
      queryChanged: function () {
        const options = {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            'name',
            'description'
          ]
        }

        let fuse = new Fuse(this.typeahead, options) // "list" is the item array
        let result = fuse.search(this.query)

        result = result.slice(0, 5)

        this.possible = result
      },
      setID: function (id) {
        this.newTransaction.target = id
      }
    },
    filters: {
      currency: function (value) {
        if (value === undefined) {
          value = 0
        }

        return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      }
    }
  }
</script>
