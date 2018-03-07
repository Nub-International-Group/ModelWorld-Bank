<template>
  <div class="col-md-12">
    <div class="panel panel-primary">
      <div class="panel-heading">
        My Wagers
      </div>
      <vue-good-table
        :columns="betTable"
        :rows="bets"
        :filterable="true"
        :globalSearch="true"
        styleClass="table table-bordered condensed">
      </vue-good-table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import errorHandler from '@/errorHandler'
  // import swal from 'sweetalert'

  export default {
    name: 'WagerList',
    store: ['user', 'jwt'],
    data: function () {
      return {
        bets: [],
        betTable: [
          {
            label: 'Bet ID',
            field: '_id'
          },
          {
            label: 'Amount',
            field: 'amount'
          },
          {
            label: 'Bet',
            field: 'bet.name'
          },
          {
            label: 'Option',
            field: 'chosenOption.name'
          },
          {
            label: 'Created',
            field: 'created'
          }
        ]

      }
    },
    methods: {
      fetchBets: function () {
        axios.request({
          url: '/api/wager/account/' + this.$route.params.id,
          method: 'get',
          headers: {jwt: this.$store.jwt}
        }).then((response) => {
          response.data.forEach((wager) => {
            console.log(wager)
            wager.chosenOption = null

            wager.bet.options.forEach((option) => {
              if (option._id === wager.betOption) {
                wager.chosenOption = option
              }
            })
          })
          this.bets = response.data
        }).catch(errorHandler)
      }
    },
    mounted: function () {
      this.fetchBets()
    }
  }
</script>
