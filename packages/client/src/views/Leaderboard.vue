<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol sm="12">
        <BCard>
          <h3>Forbes Rich List - {{ $route.params.type === 'company' ? 'Company' : 'People\'s' }} Accounts</h3>
          <br>
          <h5>Updated every 5 minutes</h5>
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
              slot="assetValue"
              slot-scope="props"
            >
              {{ $currency(props.row.assetValue) }}
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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Leaderboard',
  filters: {
    currency: value => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  data: function () {
    return {
      columns: ['name', 'balance', 'assetValue', 'netWorth'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          'name': 'Name',
          'balance': 'Balance',
          'assetValue': 'Value of Assets',
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
    ...mapState('leaderboards', {
      company: state => state.company,
      personal: state => state.personal
    }),
    selectedLeaderboard () {
      const type = this.$route.params.type === 'company' ? 'company' : 'personal'

      return this[type]
    }
  },
  methods: {
    ...mapActions('leaderboards', ['fetchLeaderboard'])
  },
  created () {
    this.$store.dispatch('leaderboards/fetchLeaderboard', 'personal')
    this.$store.dispatch('leaderboards/fetchLeaderboard', 'company')
  }
}
</script>
