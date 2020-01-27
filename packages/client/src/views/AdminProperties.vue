<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <div class="float-left">
              <h4>Property Management</h4>
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
            id="dataTable"
            :columns="columns"
            :data="properties"
            :options="options"
          >
            <div
              slot="returnRate"
              slot-scope="props"
            >
              {{ $currency(props.row.returnRate, props.row.currency) }}
            </div>
            <div
              slot="details"
              slot-scope="props"
            >
              <BBtn
                variant="primary"
                @click="selectToModify(props.row)"
              >
                Edit
              </BBtn>
            </div>
          </VClientTable>
        </BCard>
      </BCol>
    </BRow>
    <BModal
      v-if="!!selectedToModify"
      title="Create or modify property"
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
        <BFormGroup label="Image URL (4:3 minimum height 250)">
          <BFormInput
            v-model="selectedToModify.image"
            type="text"
          />
        </BFormGroup>
        &nbsp;
        <strong v-if="targetAccount">
          Selected owner: {{ targetAccount.name }} ({{ targetAccount._id }})
        </strong>
        <strong v-else>
          No owner selected!
        </strong>
        <AccountPicker v-model="selectedToModify.owner" />
        <BFormGroup label="Annual Revenue">
          <BFormInput
            v-model.number="selectedToModify.returnRate"
            type="number"
          />
        </BFormGroup>
        <BFormGroup
          v-if="selectedToModify._id === 'new'"
          label="Initial Valuation"
        >
          <BFormInput
            v-model.number="selectedToModify.initialValuation"
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
      </template>
    </BModal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AccountPicker from '../components/AccountPicker'

export default {
  name: 'AdminProperties',
  components: {
    AccountPicker
  },
  data () {
    return {
      columns: ['_id', 'name', 'description', 'returnRate', 'details'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          '_id': 'Id',
          'name': 'Name',
          'description': 'Description',
          'returnRate': 'Annual Revenue',
          'details': 'Details'
        },
        uniqueKey: '_id'
      },
      selectedToModify: null
    }
  },
  computed: {
    ...mapState({
      properties: state => state.properties.all,
      currencies: state => state.ui.currencies
    }),
    targetAccount () {
      return this.selectedToModify && this.selectedToModify.owner ? this.$store.getters['ui/accountsById'][this.selectedToModify.owner] : {}
    }
  },
  mounted () {
    this.$store.dispatch('properties/fetch')
  },
  methods: {
    createNew () {
      this.selectedToModify = JSON.parse(JSON.stringify({
        _id: 'new',
        name: '',
        description: '',
        returnRate: 0,
        owner: '*property*',
        image: '',
        currency: 'GBP',
        initialValuation: 0
      }))
    },
    selectToModify (accountType) {
      this.selectedToModify = JSON.parse(JSON.stringify(accountType))
    },
    async saveModified () {
      await this.$store.dispatch('properties/' + (this.selectedToModify._id === 'new' ? 'create' : 'update'), this.selectedToModify)
      this.selectedToModify = null
    },
    async deleteSelected () {
      const confirm = window.confirm('Pressing ok will delete this account')
      if (confirm) {
        await this.$store.dispatch('properties/deleteById', this.selectedToModify._id)
        this.selectedToModify = null
      }
    }
  }
}
</script>
