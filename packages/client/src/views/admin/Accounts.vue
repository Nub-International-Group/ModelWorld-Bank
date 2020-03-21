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
              {{ totalAccounts.total }}
            </h2>
            <p>Total Accounts</p>
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
              {{ totalAccounts.corporations }}
            </h2>
            <p>Corporate Accounts</p>
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
              {{ totalAccounts.personal }}
            </h2>
            <p>Personal Accounts</p>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <div class="float-left">
              <h4>Account Management</h4>
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
            :data="accounts"
            :options="options"
          >
            <div
              slot="details"
              slot-scope="props"
              class="text-center"
            >
              <BBtn
                variant="primary"
                @click="selectToModify(props.row)"
              >
                Edit Account
              </BBtn>&nbsp;
              <BBtn
                variant="warning"
                @click="imitate(props.row._id)"
              >
                Imitate
              </BBtn>
            </div>
          </VClientTable>
        </BCard>
      </BCol>
    </BRow>
    <BModal
      v-if="!!selectedToModify"
      title="Create or modify account"
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
        <BFormGroup
          v-if="selectedToModify._id === 'new'"
          label="Owner"
          description="/u/ of the account owner"
        >
          <BFormInput
            v-model="selectedToModify.owner"
            type="text"
          />
        </BFormGroup>
        <BFormGroup label="Account Visibility">
          <BFormRadioGroup
            v-model="selectedToModify.public"
            :options="visibilityRadios"
          />
        </BFormGroup>
        <BFormGroup label="Account Type">
          <BFormSelect
            v-model="selectedToModify.accountType"
            :options="accountTypes"
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

export default {
  name: 'AdminAccounts',
  data () {
    return {
      columns: ['_id', 'name', 'created', 'details'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          'name': 'Name',
          'created': 'Created',
          'details': 'Details'
        },
        uniqueKey: '_id',
        orderBy: {
          column: 'created',
          ascending: false
        }
      },
      selectedToModify: null,
      visibilityRadios: [
        {
          text: 'Public',
          value: true
        },
        {
          text: 'Hidden',
          value: false
        }
      ]
    }
  },
  computed: {
    ...mapState({
      accounts: state => state.accounts.all,
      accountTypes: state => state.accountTypes.all.map(type => ({ value: type._id, text: type.name }))
    }),
    totalAccounts () {
      let total = this.accounts.length
      let corporations = 0
      let personal = 0

      for (let i = 0; i < this.accounts.length; i++) {
        const account = this.accounts[i]

        if (account.company) {
          corporations++
        } else {
          personal++
        }
      }

      return { total, corporations, personal }
    }
  },
  created () {
    this.$store.dispatch('accounts/fetchAdmin')
  },
  methods: {
    imitate (id) {
      this.$router.push({
        name: 'Dashboard',
        query: {
          accountId: id
        }
      })
    },
    createNew () {
      this.selectedToModify = JSON.parse(JSON.stringify({
        _id: 'new',
        name: 'New Account',
        description: 'Description....',
        public: true,
        verified: true,
        owner: '',
        accountType: this.accountTypes[0]._id
      }))
    },
    selectToModify (account) {
      this.selectedToModify = JSON.parse(JSON.stringify({
        ...account,
        accountType: typeof account.accountType === 'object' ? account.accountType._id : account.accountType
      }))
    },
    async saveModified () {
      await this.$store.dispatch('accounts/' + (this.selectedToModify._id === 'new' ? 'create' : 'update'), this.selectedToModify)
      this.selectedToModify = null
    },
    async deleteSelected () {
      const confirm = window.confirm('Pressing ok will delete this account')
      if (confirm) {
        await this.$store.dispatch('accounts/deleteById', this.selectedToModify._id)
        this.selectedToModify = null
      }
    }
  }
}
</script>
