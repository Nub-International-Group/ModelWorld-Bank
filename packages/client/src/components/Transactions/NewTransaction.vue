<template>
  <BCard>
    <BRow>
      <BCol md="6">
        <h2>Make a payment</h2>
        <h5>Transaction Details</h5>
        <strong v-if="newTransaction.target">
          Selected account: {{ target.name }} ({{ newTransaction.target }})
        </strong>
        <strong
          v-else
          class="text-danger"
        >
          You must select an account.
        </strong>
        <br>
        <BFormGroup label="Amount">
          <BFormInput
            v-model.number="newTransaction.amount"
            type="number"
          />
          <strong>{{ $currency(amountWithFee) }} with NubBank Fee</strong>
        </BFormGroup>
        <BFormGroup label="Description">
          <BFormInput
            v-model.number="newTransaction.description"
            type="text"
          />
        </BFormGroup>
        <BBtn
        v-b-modal.confirmTransactionModal
        :disabled="$v.newTransaction.$invalid"
        >
          Make Transaction
        </BBtn>
      </BCol>
      <BCol md="6">
        <h5>Recipient</h5>
        <BFormGroup label="Account Search">
          <BFormInput
            v-model="query"
            type="text"
          />
        </BFormGroup>

        <br>
        <BTable
          striped
          :items="queried"
          :fields="['_id', 'name', 'description']"
          caption="Click the row to select."
          @row-clicked="selectRecipient"
        />
      </BCol>
    </BRow>

    <BModal
      id="confirmTransactionModal"
      title="Confirm Transaction"
      header-bg-variant="danger"
      @ok="createTransaction"
    >
      <p>You will transfer <strong>{{ $currency((newTransaction.amount || 0)) }}</strong> to <strong>{{ target.name }}.</strong></p>

      <p>The fee applied will be <strong>{{ $currency(fee) }}</strong>, this makes the total cost to you <strong>{{ $currency(amountWithFee) }}</strong>.</p>

      <p>Transfers are non-returnable.</p>
    </BModal>
  </BCard>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, decimal } from 'vuelidate/lib/validators'
import Fuse from 'fuse.js'

export default {
  name: 'NewTransaction',
  mixins: [validationMixin],
  data () {
    return {
      newTransaction: {
        target: null,
        amount: 0,
        description: ''
      },
      target: {
        name: null
      },
      query: 'nub'
    }
  },
  computed: {
    ...mapGetters('selectedAccount', ['balances', 'account']),
    ...mapState({
      allAccounts: state => state.ui.typeAhead.accounts
    }),
    queried () {
      const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'name',
          'description'
        ]
      }

      const fuse = new Fuse(this.allAccounts, options)

      return fuse.search(this.query).slice(0, 5)
    },
    amountWithFee () {
      return (this.newTransaction.amount || 0) + this.fee
    },
    fee () {
      return Math.floor(this.account.accountType.options.transactionFee.rate * (this.newTransaction.amount || 0) * 100) / 100
    }
  },
  methods: {
    selectRecipient (item) {
      this.target = item
      this.newTransaction.target = item._id
    },
    createTransaction () {
      this.$store.dispatch('selectedAccount/createTransaction', this.newTransaction)
    }
  },
  validations: {
    newTransaction: {
      target: {
        required
      },
      amount: {
        required,
        decimal
      }
    }
  }
}
</script>
