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
            @click="newWager.betId = newWager.betId === bet._id ? null : bet._id"
          >
            {{ bet.name }}
          </BButton>
        </BCardHeader>
        <BCollapse :visible="newWager.betId === bet._id">
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
                      @click="selectOption(option._id)"
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
    <BRow>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <h4>My Wagers</h4>
          </template>
          <VClientTable
            id="dataTable"
            :columns="columns"
            :data="wagers"
            :options="settings"
          >
            <template
              slot="amount"
              slot-scope="props"
            >
              {{ $currency(props.row.amount, props.row.currency) }}
            </template>
            <template
              slot="option"
              slot-scope="props"
            >
              {{ props.row.bet.options.find(opt => opt._id === props.row.optionId).name }}
            </template>
          </VClientTable>
        </BCard>
      </BCol>
    </BRow>
    <BModal
      v-if="!!selectedOption"
      :title="selectedBet.name + ' | ' + selectedOption.name"
      header-bg-variant="primary"
      :visible="!!selectedOption"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <template v-slot:default>
        <p>
          <strong>
            Bet Description:
          </strong>
          {{ selectedBet.description }}
        </p>
        <p>
          <strong>
            Selected Option:
          </strong>
          {{ selectedOption.name }}
          <br/>
          <strong>
            Option Odds:
          </strong>
          {{ selectedOption.currentOdds }}
          <br/>
          <strong>
            Option Description:
          </strong>
          {{ selectedOption.description }}
        </p>
        <BFormGroup>
          <strong>Amount</strong>
          <BFormInput
            v-model="newWager.amount"
            type="number"
            min="0"
          />
        </BFormGroup>
        <strong>
          Potential Winnings:
        </strong>
        {{ $currency(newWager.amount * selectedOption.currentOdds) }}
      </template>

      <template v-slot:modal-footer>
        <div
          class="mr-auto"
        >
          <BBtn
            variant="outline-secondary"
            @click="newWager.optionId = null"
          >
            Cancel
          </BBtn>
        </div>
        <BBtn
          variant="success"
          @click="makeWager"
        >
          Make Bet!
        </BBtn>
      </template>
    </BModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const defaultWager = () => {
  return {
    betId: null,
    optionId: null,
    amount: 0
  }
}
export default {
  name: 'Bets',
  filters: {
    currency: value => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  data: function () {
    return {
      newWager: defaultWager(),
      columns: ['created', '_id', 'amount', 'bet.name', 'option'],
      settings: {
        headings: {
          'created': 'Placed',
          '_id': 'Wager ID',
          'amount': 'Amount',
          'bet.name': 'Bet',
          'option': 'Chosen Option'
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
    this.$store.dispatch('bets/fetch')
    this.$store.dispatch('selectedAccount/wagers/fetch')
  },
  computed: {
    ...mapGetters('bets', ['openBets']),
    ...mapGetters('selectedAccount', ['wagers']),
    selectedBet () {
      if (!this.newWager.betId) {
        return null
      }

      return this.openBets.find(bet => bet._id === this.newWager.betId)
    },
    selectedOption () {
      if (!this.selectedBet || !this.newWager.optionId) {
        return null
      }

      return this.selectedBet.options.find(option => option._id === this.newWager.optionId)
    }
  },
  methods: {
    selectOption (optionId) {
      this.newWager.optionId = optionId
    },
    async makeWager () {
      await this.$store.dispatch('selectedAccount/wagers/create', this.newWager)
      Object.assign(this.newWager, defaultWager())
    }
  }
}
</script>
