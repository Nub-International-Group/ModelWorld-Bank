<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol sm="12">
        <BCard>
          <h3>Forbes Rich List - {{ $route.params.type === 'company' ? 'Company' : 'People\'s' }} Accounts</h3>
          <h5> Cash in economy: {{ $currency(gbpEconomy.totalCash) }} </h5>
          <h5> Assets in economy: {{ $currency(gbpEconomy.totalAssetValue) }} </h5>
          <br>
          <VClientTable
            id="dataTable"
            :columns="columns"
            :data="selectedLeaderboard"
            :options="options"
          >
            <div
              slot="balance"
              slot-scope="props"
            >
              {{ $currency(props.row.balance) }}
            </div>
            <div
              slot="assets"
              slot-scope="props"
            >
              {{ $currency(props.row.assets) }}
            </div>
            <div
              slot="netWorth"
              slot-scope="props"
            >
              {{ $currency(props.row.netWorth) }}
            </div>
          </VClientTable>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Leaderboard',
  data: function () {
    return {
      columns: ['account.name', 'balance', 'assets', 'netWorth'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          'account.name': 'Name',
          'balance': 'Balance',
          'assets': 'Value of Assets',
          'netWorth': 'Net Worth'
        },
        uniqueKey: '_id',
        orderBy: {
          column: 'netWorth',
          ascending: false
        }
      }
    }
  },
  computed: {
    ...mapGetters('ui', ['accountsById']),
    ...mapGetters('economyReports', ['leaderboard', 'gbpEconomy']),
    selectedLeaderboard () {
      const type = this.$route.params.type === 'company' ? 'company' : 'personal'

      return this.leaderboard.filter(entry => entry.public && (entry.corporate === (type === 'company'))).map(entry => ({
        ...entry,
        account: this.accountsById[entry._id]
      }))
    }
  },
  created () {
    this.$store.dispatch('economyReports/fetchLatest')
  }
}
</script>
