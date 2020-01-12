<template>
  <div class="animated fadeIn">
    <BCard>
      <h3>Open Bets</h3>
      <BRow>
        <BCol
          v-for="bet in openBets"
          :key="bet._id"
          sm="12"
        >
          <BCard :title="bet.name">
            <BCardBody>
              <strong>Created: </strong> {{ bet.created }} <br>
              <strong>Description: </strong> {{ bet.description }} <br> <br>

              <BRow>
                <BCol
                  v-for="option in bet.options"
                  :key="option._id"
                  sm="12"
                  md="4"
                >
                  <BetOption
                    :option="option"
                    :bet="bet"
                  />
                </BCol>
              </BRow>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BCard>
    <BCard>
      <h3>My Wagers</h3>
      <BCardBody>
        <VClientTable
          :columns="columns"
          :data="wagers"
          :options="settings"
        />
      </BCardBody>
    </BCard>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BetOption from '@/components/BetOption'

export default {
  name: 'Bets',
  components: { BetOption },
  filters: {
    currency: value => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  data: function () {
    return {
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
    this.$store.dispatch('bets/fetchBets')
    this.$store.dispatch('selectedAccount/fetchWagers')
  },
  computed: {
    ...mapState('bets', {
      openBets: state => state.possibleBets.filter(bet => bet.status === 1)
    }),
    ...mapState('selectedAccount', {
      wagers: state => state.wagers
    })
  }
}
</script>
