<template>
  <BCard :title="option.name + ' | ' + option.currentOdds">
    <BCardBody>
      <p>{{ option.description }}</p>
      <BFormGroup label="Stake:">
        <BFormInput
          v-model.number="amountStaked"
          type="number"
          required
          placeholder="Enter amount"
        />
      </BFormGroup>
      <strong>Potential Winning: </strong> £{{ possibleReturn | currency }}
      <BBtn
        variant="primary"
        block
        @click="createBet"
      >
        Make Bet
      </BBtn>
    </BCardBody>
  </BCard>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BetOption',
  filters: {
    currency: (value) => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  props: {
    option: {
      type: Object,
      default () {
        return {
          name: '',
          currentOdds: 1,
          description: ''
        }
      }
    },
    bet: {
      type: Object,
      default () {
        return {
          _id: ''
        }
      }
    }
  },
  data: function () {
    return {
      amountStaked: 0
    }
  },
  computed: {
    ...mapState('selectedAccount', ['balance', 'accountDetails']),
    possibleReturn () {
      return this.amountStaked * this.option.currentOdds
    }
  },
  methods: {
    createBet () {
      if (this.amountStaked > 0 && this.amountStaked <= this.balance.GBP) {
        this.$store.dispatch('selectedAccount/newWager', {
          amount: this.amountStaked,
          option: this.option._id,
          bet: this.bet._id
        })
      } else {
        this.$store.commit('messages/addMessage', {
          type: 'error',
          title: 'Invalid Data',
          message: 'Invalid amount. You have not enough balance or number is invalid.'
        })
      }
    }
  }
}
</script>
