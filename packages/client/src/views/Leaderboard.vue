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
              £{{ props.row.balance | currency }}
            </div>
          </VClientTable>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// TODO: Rehaul leaderboards to be more flexible and dynamic. Don't lock down to just company/personal.
export default {
  name: 'Leaderboard',
  filters: {
    currency: value => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  data: function () {
    return {
      columns: ['name', 'balance'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          'name': 'Name',
          'balance': 'Balance'
        },
        uniqueKey: '_id',
        orderBy: {
          column: 'balance',
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
