<template>
  <div class="animated fadeIn">
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
              {{ $currency((balances.GBP || 0)) }}
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
          class="bg-success"
        >
          <BCardBody class="pb-0">
            <h2 class="mb-0">
              {{ $currency(inOut.input) }}
            </h2>
            <p>Cash In (Last 7 days)</p>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol
        sm="6"
        lg="4"
      >
        <BCard
          no-body
          class="bg-danger"
        >
          <BCardBody class="pb-0">
            <h2 class="mb-0">
              {{ $currency(inOut.output) }}
            </h2>
            <p>Cash Out (Last 7 days)</p>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol sm="12">
        <NewTransaction />
      </BCol>
    </BRow>
    <BRow>
      <BCol sm="12">
        <BCard title="Transactions History">
          <VClientTable
            id="dataTable"
            :columns="columns"
            :data="transactions"
            :options="options"
            :loading="$wait.is('fetching transactions')"
          >
            <div
              slot="child_row"
              slot-scope="props"
            >
              <strong>ID:</strong> {{ props.row._id }} <br>
              <strong>Authoriser:</strong> {{ props.row.authoriser }} <br>
              <div v-if="props.row.type === 'INCOME'">
                <strong>Salary Income:</strong> {{ $currency(props.row.meta.salary, props.row.currency) }} <br>
                <strong>Property Income:</strong> {{ $currency(props.row.meta.property, props.row.currency) }} <br>
                <strong>Gross:</strong> {{ $currency(props.row.meta.salary + props.row.meta.property, props.row.currency) }} <br>
                <strong>Tax Due:</strong> {{ $currency(props.row.meta.tax, props.row.currency) }} <br>
              </div>
            </div>
            <div
              slot="amount"
              slot-scope="props"
            >
              {{ $currency(props.row.amount, props.row.currency) }}
            </div>
          </VClientTable>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import NewTransaction from '@/components/Transactions/NewTransaction'

export default {
  name: 'Transactions',
  components: { NewTransaction },
  data () {
    return {
      columns: ['created', 'other.name', 'amount', 'description'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          'created': 'Time',
          'other.name': 'Other Account',
          'amount': 'Amount',
          'description': 'Description'
        },
        uniqueKey: '_id',
        orderBy: {
          column: 'created',
          ascending: false
        }
      }
    }
  },
  computed: {
    ...mapGetters('selectedAccount', ['transactions', 'balances']),
    inOut () {
      const recentTransactions = this.transactions.filter(
        (tx) => ((new Date()).getTime() - (new Date(tx.created)).getTime() <= 1000 * 60 * 60 * 24 * 7)
      )

      let input = 0
      let output = 0

      for (const transaction of recentTransactions) {
        if (transaction.to && transaction.to.name) {
          output += transaction.amount
        } else if (transaction.from && transaction.from.name) {
          input += transaction.amount
        }
      }

      return { input, output: Math.abs(output) }
    }
  },
  mounted () {
    this.$store.dispatch('selectedAccount/fetchTransactions')
  }
}
</script>
