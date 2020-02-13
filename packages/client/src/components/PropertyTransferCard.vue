<template>
  <BCard title="Transfer Property">
    <BRow>
      <BCol md="6">
        <strong v-if="targetId">
          Recipient account: {{ targetAccount.name }} ({{ targetId }})
        </strong>
        <strong
          v-else
          class="text-danger"
        >
          You must select an account.
        </strong>
        <br>
        <BFormGroup label="Exchange Price">
          <BFormInput
            v-model.number="amount"
            type="number"
          />
        </BFormGroup>
        <BBtn
          v-b-modal.transferPropertyModal
          :disabled="$v.$invalid"
        >
          Make Transfer
        </BBtn>
      </BCol>
      <BCol md="6">
        <h5>Recipient</h5>
        <AccountPicker v-model="targetId" />
      </BCol>
    </BRow>

    <BModal
      id="transferPropertyModal"
      title="Confirm Transfer"
      header-bg-variant="danger"
      @ok="transferProperty"
    >
      <p>You will transfer the property to <strong>{{ targetAccount.name }}.</strong></p>

      <p>Transfers are non-returnable. This will not create a transaction for the value of the property!</p>
    </BModal>
  </BCard>
</template>

<script>
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, integer, minValue } from 'vuelidate/lib/validators'
import AccountPicker from './AccountPicker'

export default {
  name: 'TransferPropertyCard',
  components: {
    AccountPicker
  },
  mixins: [validationMixin],
  props: {
    property: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      targetId: null,
      amount: 0
    }
  },
  computed: {
    ...mapGetters('selectedAccount', ['balances', 'account']),
    targetAccount () {
      return this.targetId ? this.$store.getters['ui/accountsById'][this.targetId] : {}
    }
  },
  methods: {
    async transferProperty () {
      await this.$store.dispatch('selectedAccount/transferProperty', { value: this.amount, accountId: this.targetId, propertyId: this.property._id })

      this.$router.push({ name: 'Dashboard' })
    }
  },
  validations: {
    targetId: {
      required
    },
    amount: {
      required,
      integer,
      minValue: minValue(1)
    }
  }
}
</script>
