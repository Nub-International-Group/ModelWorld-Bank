<template>
  <div class="animated fadeIn">
    <h3>{{ account.name }}</h3> <br>
    <BRow>
      <BCol
        sm="6"
        lg="4"
      >
        <BCard
          no-body
          class="bg-primary"
        >
          <BCardBody class="pb-0">
            <h2 class="mb-0">
              {{ $currency(balances.GBP || 0) }}
            </h2>
            <p>Account Balance</p>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol
        sm="6"
        lg="4"
      >
        <BCard
          no-body
          class="bg-dark"
        >
          <BCardBody class="pb-0">
            <h2 class="mb-0">
              {{ $currency(totalAssetValue) }}
            </h2>
            <p>Assets</p>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol
        sm="6"
        lg="4"
      >
        <BCard
          no-body
          class="bg-success"
        >
          <BCardBody class="pb-0">
            <h2 class="mb-0">
              {{ $currency(netWorth) }}
            </h2>
            <p>Net Worth</p>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol
        lg="6"
        sm="12"
      >
        <BCard
          title="Top Assets"
          sub-title="Your 5 highest revenue assets"
        >
          Soon
        </BCard>
      </BCol>
      <BCol
        lg="6"
        sm="12"
      >
        <BCard
          title="Top Commodities"
          sub-title="Your 5 highest value commodities"
        >
          Soon
        </BCard>
      </BCol>
      <BCol sm="12">
        <BCard
          title="Last Transactions"
          sub-title="Your last 5 transactions"
        >
          <VClientTable
            id="dataTable"
            :columns="lastTransactionsTable.columns"
            :data="mostRecentTransactions"
            :options="lastTransactionsTable.options"
            :loading="$wait.is('fetching transactions')"
          >
            <template
              slot="created"
              slot-scope="props"
            >
              {{ new Date(props.row.created).toLocaleString('en-GB') }}
            </template>
            <template
              slot="amount"
              slot-scope="props"
            >
              {{ $currency(props.row.amount) }}
            </template>
          </VClientTable>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data: function () {
    return {
      lastTransactionsTable: {
        columns: ['created', 'other.name', 'amount', 'description'],
        options: {
          sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
          headings: {
            'created': 'Time',
            'other.name': 'Other Account',
            'amount': 'Amount',
            'description': 'Description'
          },
          orderBy: {
            column: 'created',
            ascending: false
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      account: 'selectedAccount/account',
      transactions: 'selectedAccount/transactions',
      balances: 'selectedAccount/balances',
      properties: 'selectedAccount/properties'
    }),
    ...mapState('user', ['userDetails']),
    mostRecentTransactions () {
      return this.transactions.slice(-5)
    },
    totalAssetValue () {
      const properties = this.properties.reduce((acc, property) => {
        const length = property.valuations.length
        return acc + (length ? property.valuations[length - 1].amount : 0)
      }, 0)

      return properties
    },
    netWorth () {
      return this.totalAssetValue + (this.balances['GBP'] || 0)
    }
  },
  mounted () {
    this.$store.dispatch('selectedAccount/fetchTransactions')
  }
}
</script>
