<template>
  <div class="animated fadeIn">
    <BCard title="My Wages">
      <VClientTable
        :columns="currentWagesTable.columns"
        :data="wages"
        :options="currentWagesTable.options"
      >
        <div
          slot="value"
          slot-scope="props"
        >
          £{{ props.row.value | currency }}
        </div>
        <div
          slot="actions"
          slot-scope="props"
        >
          <BBtn
            variant="danger"
            @click="$store.dispatch('selectedAccount/deleteWage', props.row._id)"
          >
            Delete Wage
          </BBtn>
        </div>
      </VClientTable>
    </BCard>
    <BCard title="Pending Requests">
      <VClientTable
        :columns="wageRequestsTable.columns"
        :data="wageRequests"
        :options="wageRequestsTable.options"
      >
        <div
          slot="wage.value"
          slot-scope="props"
        >
          £{{ props.row.wage.value | currency }}
        </div>
      </VClientTable>
    </BCard>
    <BCard title="Apply for Wage">
      <VClientTable
        :columns="possibleWagesTable.columns"
        :data="possibleWageRequests"
        :options="possibleWagesTable.options"
      >
        <div
          slot="value"
          slot-scope="props"
        >
          £{{ props.row.value | currency }}
        </div>
        <div
          slot="apply"
          slot-scope="props"
        >
          <BBtn
            variant="primary"
            @click="$store.dispatch('selectedAccount/createWageRequest', props.row._id)"
          >
            Apply
          </BBtn>
        </div>
      </VClientTable>
    </BCard>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Wages',
  filters: {
    currency: (value) => {
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  data () {
    return {
      currentWagesTable: {
        columns: ['name', 'description', 'value', 'actions'],
        options: {
          sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
          orderBy: {
            column: 'value',
            ascending: false
          }
        }
      },
      wageRequestsTable: {
        columns: ['wage.name', 'wage.description', 'wage.value'],
        options: {
          headings: {
            'wage.name': 'Name',
            'wage.description': 'Description',
            'wage.value': 'Value'
          },
          sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
          orderBy: {
            column: 'wage.value',
            ascending: false
          }
        }
      },
      possibleWagesTable: {
        columns: ['name', 'description', 'value', 'apply'],
        options: {
          sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' }
        }
      }
    }
  },
  computed: {
    ...mapState({
      allWages: state => state.wages.all
    }),
    ...mapGetters({
      wages: 'selectedAccount/wages',
      wageRequests: 'selectedAccount/wageRequests'
    }),
    possibleWageRequests () { // Filter out existing wages and existing wage requests.
      return this.allWages.filter(wage => {
        return (this.wages.findIndex(srch => srch._id === wage._id) === -1) &&
          (this.wageRequests.findIndex(srch => srch.wage._id === wage._id) === -1)
      })
    }
  },
  mounted () {
    this.$store.dispatch('selectedAccount/fetchWageRequests')
    this.$store.dispatch('selectedAccount/fetchAccount')
  }
}
</script>
