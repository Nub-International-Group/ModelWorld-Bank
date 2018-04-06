<template>
  <div>
    <div class="page-header">
      <h1>Betting
        <small>A fun way to spend wages</small>
      </h1>
    </div>
    <div class="row">
      <div v-for="bet in bets" v-if="bet.status === 1" class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            {{bet.name}}
          </div>
          <div class="panel-body">
            {{bet.description}}
            <hr/>
            <div class="row">
              <div v-for="option in bet.options" class="col-md-4">
                <div class="panel panel-primary">
                  <div class="panel-heading">
                    {{option.name}}
                    |
                    <strong>{{option.currentOdds | toFractional}}</strong>
                  </div>
                  <div class="panel-body">
                    {{option.description}}
                    <br/>
                    <strong>Return: {{option.currentOdds * option.betPlace | currency}}</strong>
                    <br/><br/>
                    <div class="input-group">
                      <span class="input-group-addon">Account:</span>
                      <select v-model="option.target" class="form-control">
                        <option :value="account._id" v-for='account in accounts'>{{account.name}}</option>
                      </select>
                    </div>
                    <br/>
                    <div class="input-group">
                      <span class="input-group-addon">Bet Amount:</span>
                      <input v-model="option.betPlace" type="text" class="form-control">
                    </div>
                  </div>
                  <div class="panel-footer">
                    <button v-on:click="makeBet(bet, option, option.betPlace)" type="button" class="btn btn-primary">Make Bet</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import errorHandler from '@/errorHandler'
  import Fraction from 'fraction.js'
  import swal from 'sweetalert2'

  export default {
    name: 'PageBetting',
    store: ['user', 'jwt'],
    data: function () {
      return {
        bets: [],
        accounts: []
      }
    },
    mounted: function () {
      let $this = this
      axios.request({
        url: '/api/bet',
        method: 'get',
        headers: {jwt: this.$store.jwt}
      }).then(function (response) {
        $this.bets = response.data
      }).catch(errorHandler)

      axios.request({
        url: '/api/account',
        method: 'get',
        headers: {jwt: this.$store.jwt}
      }).then(function (response) {
        $this.accounts = response.data
      }).catch(errorHandler)
    },
    filters: {
      toFractional: function (decimal) {
        decimal = decimal - 1

        let fraction = new Fraction(decimal)

        return fraction.n + '/' + fraction.d
      },
      currency: function (value) {
        return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      }
    },
    methods: {
      makeBet: function (bet, option, amount) {
        let number = parseFloat(amount)

        if ((!isNaN(number)) || number > 0) {
          let data = {
            amount: number,
            target: option.target,
            option: option._id,
            bet: bet._id
          }

          axios.request({
            url: '/api/wager',
            method: 'post',
            headers: {jwt: this.$store.jwt},
            data: data
          }).then(function (response) {
            swal('Success', 'Bet has been created', 'success')
          }).catch(errorHandler)
        } else {
          swal('Invalid amount', 'Bet amount must be a valid number', 'error')
        }
      }
    }
  }
</script>
