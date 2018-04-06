<template>
  <div id="PageAdminAccounts">
    <div class="page-header">
      <h1>Transaction Management
        <small>Delete and view transactions</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            View Transactions
          </div>
          <vue-good-table
            :columns="allTransactions.columns"
            :rows="allTransactions.rows"
            :filterable="true"
            :globalSearch="true"
            :paginate="true"
            :defaultSortBy="{field: 'created', type: 'desc'}"
          >
            <template slot="table-row" scope="props">
              <td><strong>{{ props.row._id }}</strong></td>
              <td><router-link :to="'/account/' + props.row.from">{{ props.row.from }}</router-link></td>
              <td><router-link :to="'/account/' + props.row.to">{{ props.row.to }}</router-link></td>
              <td>{{ props.row.amount | currency}}</td>
              <td>{{ props.row.description}}</td>
              <td>{{ props.row.created | dateString}}</td>
              <td>
                <button class="btn btn-danger" v-on:click="deleteTransaction(props.row._id)">Delete</button>
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
  import swal from 'sweetalert2'

  export default {
    name: 'PageAdminTransactions',
    store: ['user', 'jwt', 'currencies'],
    data: function () {
      return {
        newAccount: {
          name: 'X\'s Personal Account',
          description: 'Premium personal banking',
          owner: 'X',
          public: true
        },
        allTransactions: {
          columns: [
            {
              label: 'ID',
              field: '_id'
            },
            {
              label: 'From',
              field: 'from'
            },
            {
              label: 'To',
              field: 'to'
            },
            {
              label: 'Amount',
              field: 'amount'
            },
            {
              label: 'Description',
              field: 'description'
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
      fetchTransactions: function () {
        axios.request({
          url: '/api/transaction',
          method: 'get',
          headers: {jwt: this.$store.jwt}
        }).then((response) => {
          this.processTransactions(response.data)
        }).catch(errorHandler)
      },
      processTransactions: function (transactions) {
        let processedTransactions = []

        transactions.forEach(function (transaction) {
          transaction.created = Date.parse(transaction.created)

          processedTransactions.push(transaction)
        })

        this.allTransactions.rows = processedTransactions
      },
      deleteTransaction: function (transactionID) {
        swal({
          title: 'ARE YOU SURE?',
          type: 'warning',
          text: 'Clicking \'ok\' will permanently delete this transaction!',
          dangerMode: true,
          buttons: true
        }).then((choice) => {
          if (choice === true) {
            axios.request({
              url: '/api/transaction/id/' + transactionID,
              method: 'delete',
              headers: {jwt: this.$store.jwt}
            }).then((response) => {
              this.processTransactions(response.data)
            }).catch(errorHandler)
          }
        })
      }
    },
    mounted: function () {
      this.fetchTransactions()
    },
    filters: {
      currency: function (value) {
        return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      },
      dateString: function (dateIn) {
        let date = new Date(dateIn)
        let string = date.toLocaleString('en-GB')
        return string
      }
    }
  }
</script>
