<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <div class="float-left">
              <h4>Wage Management</h4>
            </div>
            <div class="float-right">
              <BBtn
                variant="success"
                @click="createNew"
              >
                Create New
              </BBtn>
            </div>
          </template>
          <VClientTable
            :columns="allWagesTable.columns"
            :data="allWages"
            :options="allWagesTable.options"
          >
            <div
              slot="value"
              slot-scope="props"
            >
              {{ $currency(props.row.value, props.row.currency) }}
            </div>
            <div
              slot="buttons"
              slot-scope="props"
            >
              <BBtn
                variant="primary"
                @click="selectToModify(props.row._id)"
              >
                Modify Wage
              </BBtn>
            </div>
          </VClientTable>
        </BCard>
      </BCol>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <div class="float-left">
              <h4>Wage Requests</h4>
            </div>
          </template>
          <VClientTable
            :columns="wageRequestsTable.columns"
            :data="wageRequests"
            :options="wageRequestsTable.options"
          >
            <div
              slot="decide"
              slot-scope="props"
            >
              <BBtn
                variant="success"
                @click="decideWageRequest({
                  wageRequest:props.row._id,
                  decision: true
                })"
              >
                Accept
              </BBtn>
              &nbsp;
              <BBtn
                variant="danger"
                @click="decideWageRequest({
                  wageRequest:props.row._id,
                  decision: false
                })"
              >
                Deny
              </BBtn>
            </div>
          </VClientTable>
          <template v-slot:footer>
            <BBtn
              variant="danger"
              @click="showAllWageDeletionConfirmation = true"
            >
              Reset ALL Wages
            </BBtn>
          </template>
        </BCard>
      </BCol>
    </BRow>
    <BModal
      v-if="!!selectedToModify"
      :title="selectedToModify.name"
      header-bg-variant="primary"
      :visible="!!selectedToModify"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <template v-slot:default>
        <BFormGroup label="Name">
          <BFormInput
            v-model="selectedToModify.name"
            type="text"
          />
        </BFormGroup>
        <BFormGroup label="Description">
          <BFormInput
            v-model="selectedToModify.description"
            type="text"
          />
        </BFormGroup>
        <BFormGroup label="Salary">
          <BFormInput
            v-model.number="selectedToModify.value"
            type="number"
          />
        </BFormGroup>
        <BFormGroup label="Currency">
          <BFormSelect
            v-model="selectedToModify.currency"
            :options="currencies"
            text-field="name"
          />
        </BFormGroup>
      </template>

      <template v-slot:modal-footer>
        <div
          v-if="selectedToModify._id !== 'new'"
          class="mr-auto"
        >
          <BBtn
            variant="danger"
            @click="deleteSelected"
          >
            Delete
          </BBtn>
        </div>
        <div>
          <BBtn
            variant="success"
            @click="saveModified"
          >
            Save Changes
          </BBtn>
          &nbsp;
          <BBtn
            variant="outline-secondary"
            @click="selectedToModify = null"
          >
            Cancel
          </BBtn>
        </div>
      </template>
    </BModal>
    <BModal
      v-if="showAllWageDeletionConfirmation"
      title="Clear ALL Wages"
      header-bg-variant="danger"
      :visible="showAllWageDeletionConfirmation"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <template v-slot:default>
        <strong>This is a destructive action! You will have to manually re-accept all user wages after completing this.</strong>
      </template>

      <template v-slot:modal-footer>
        <div class="mr-auto">
          <BBtn
            variant="danger"
            @click="clearAllWages"
          >
            Clear ALL Wages
          </BBtn>
        </div>
        <div>
          <BBtn
            variant="outline-secondary"
            @click="showAllWageDeletionConfirmation = null"
          >
            Cancel
          </BBtn>
        </div>
      </template>
    </BModal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdminWages',
  data () {
    return {
      wageRequestsTable: {
        columns: ['account.name', 'wage.name', 'decide'],
        options: {
          headings: {
            'account.name': 'Account',
            'wage.name': 'Wage'
          },
          sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' }
        }
      },
      allWagesTable: {
        columns: ['name', 'description', 'value', 'buttons'],
        options: {
          sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
          perPage: 1000
        }
      },
      selectedToModify: null,
      wageSaving: false,
      wageDeleting: false,
      showAllWageDeletionConfirmation: false
    }
  },
  computed: {
    ...mapState({
      allWages: state => state.wages.all,
      wageRequests: state => state.admin.wageRequests,
      currencies: state => state.ui.currencies
    })
  },
  created () {
    this.$store.dispatch('admin/fetchWageRequests')
  },
  methods: {
    ...mapActions('admin', ['decideWageRequest']),
    createNew () {
      this.selectedToModify = JSON.parse(JSON.stringify({
        _id: 'new',
        name: '',
        description: '',
        value: 0,
        currency: 'GBP'
      }))
    },
    selectToModify (wageId) {
      this.selectedToModify = JSON.parse(JSON.stringify(this.allWages.find(wage => wageId === wage._id)))
    },
    async saveModified () {
      await this.$store.dispatch('wages/' + (this.selectedToModify._id === 'new' ? 'create' : 'update'), this.selectedToModify)
      this.selectedToModify = null
    },
    async deleteSelected () {
      const confirm = window.confirm('Pressing ok will delete this wage')
      if (confirm) {
        await this.$store.dispatch('wages/deleteById', this.selectedToModify._id)
        this.selectedToModify = null
      }
    },
    async clearAllWages () {
      await this.$store.dispatch('wages/clearAllWages')
      this.showAllWageDeletionConfirmation = false
    }
  }
}
</script>
