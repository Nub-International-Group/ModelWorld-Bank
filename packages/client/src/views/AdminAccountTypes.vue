<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <div class="float-left">
              <h4>Account Type Management</h4>
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
            :data="accountTypes"
            :options="options"
          >
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
      title="Create or modify account type"
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
        <BFormGroup label="Type">
          <BFormRadio
            v-model="selectedToModify.corporate"
            name="corporate-radios"
            :value="true"
          >
            Corporate
          </BFormRadio>
          <BFormRadio
            v-model="selectedToModify.corporate"
            name="corporate-radios"
            :value="false"
          >
            Consumer
          </BFormRadio>
        </BFormGroup>
        <BFormGroup label="Account Features">
          <BFormCheckbox
            v-model="selectedToModify.options.salary"
            :value="true"
            :unchecked-value="false"
          >
            Salary
          </BFormCheckbox>
          <BFormCheckbox
            v-model="selectedToModify.options.betting"
            :value="true"
            :unchecked-value="false"
          >
            Betting
          </BFormCheckbox>
          <BFormCheckbox
            v-model="selectedToModify.options.benefits"
            :value="true"
            :unchecked-value="false"
          >
            Benefits
          </BFormCheckbox>
          <BFormCheckbox
            v-model="selectedToModify.options.property"
            :value="true"
            :unchecked-value="false"
          >
            Property Ownership
          </BFormCheckbox>
        </BFormGroup>
        <BFormGroup
          label="Transaction Fee (%)"
        >
          <BFormInput
            v-model.number="selectedToModify.options.transactionFee.rate"
            min="0"
            max="1"
            step="0.005"
            type="range"
          />
          <strong>{{ Math.floor(selectedToModify.options.transactionFee.rate * 200) / 2 }}%</strong>
        </BFormGroup>
        <BFormGroup
          label="Interest Rate (AER) (%)"
        >
          <BFormInput
            v-model.number="selectedToModify.options.interest.rate"
            min="0"
            max="1"
            step="0.005"
            type="range"
          />
          <strong>{{ Math.floor(selectedToModify.options.interest.rate * 200) / 2 }}%</strong>
        </BFormGroup>
      </template>

      <template v-slot:modal-footer>
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

export default {
  name: 'AdminAccountTypes',
  data () {
    return {
      columns: ['_id', 'name', 'description', 'details'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          'name': 'Name',
          'description': 'Description',
          'details': 'Details'
        },
        uniqueKey: '_id'
      },
      selectedToModify: null
    }
  },
  computed: {
    ...mapState({
      accountTypes: state => state.accountTypes.all
    })
  },
  methods: {
    createNew () {
      this.selectedToModify = JSON.parse(JSON.stringify({
        _id: 'new',
        name: 'Example Name',
        description: 'Blah blah blah',
        corporate: false,
        options: {
          salary: true,
          benefits: true,
          transactionFee: {
            mechanism: 'percentage',
            rate: 0.05
          },
          interest: {
            mechanism: 'percentage',
            rate: 0
          },
          betting: true,
          property: true
        }
      }))
    },
    selectToModify (accountType) {
      this.selectedToModify = JSON.parse(JSON.stringify(accountType))
    },
    async saveModified () {
      await this.$store.dispatch('accountTypes/' + (this.selectedToModify._id === 'new' ? 'create' : 'update'), this.selectedToModify)
      this.selectedToModify = null
    }
  }
}
</script>
