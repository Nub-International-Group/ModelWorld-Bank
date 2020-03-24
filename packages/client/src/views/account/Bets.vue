<template>
  <div class="animated fadeIn">
    <BCard>
      <h3>Open Bets</h3>
      <BCard
        v-for="bet in openBets"
        :key="bet._id"
        no-body
        class="mb-1"
      >
        <BCardHeader
          header-tag="header"
          class="p-1"
        >
          <BButton
            block
            @click="selectedBet = selectedBet === bet._id ? null : bet._id"
          >
            {{ bet.name }}
          </BButton>
        </BCardHeader>
        <BCollapse :visible="selectedBet === bet._id">
          <BCardBody>
            <BCardText>{{ bet.description }}</BCardText>
            <BListGroup>
              <BListGroupItem v-for="option in bet.options" :key="option._id">
                <div class="d-flex justify-content-end">
                  <div class="mr-auto align-self-center">
                    <strong>{{ option.name }} | {{ option.currentOdds }}</strong>
                  </div>
                  <div>
                    <BBtn
                      variant="success"
                    >
                      Place Bet
                    </BBtn>
                  </div>
                </div>
              </BListGroupItem>
            </BListGroup>
          </BCardBody>
        </BCollapse>
      </BCard>
    </BCard>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Bets',
  filters: {
    currency: value => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  data: function () {
    return {
      selectedBet: null,
      columns: ['created', '_id', 'amount', 'bet.name', 'chosenOption.name'],
      settings: {
        headings: {
          'created': 'Placed',
          '_id': 'Wager ID',
          'amount': 'Amount',
          'bet.name': 'Bet',
          'chosenOption.name': 'Option'
        },
        uniqueKey: '_id',
        orderBy: {
          column: 'created',
          ascending: false
        }
      }
    }
  },
  created () {
    //this.$store.dispatch('bets/fetchBets')
    //this.$store.dispatch('selectedAccount/fetchWagers')
  },
  computed: {
    ...mapGetters('bets', ['openBets']),
    ...mapState('selectedAccount', {
      wagers: state => state.wagers
    })
  }
}
</script>
