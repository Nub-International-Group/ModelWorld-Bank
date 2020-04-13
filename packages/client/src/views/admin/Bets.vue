<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <h4>Bets Management</h4>
          </template>
          <VClientTable
            id="dataTable"
            :columns="columns"
            :data="bets"
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
    <BRow>
      <BCol sm="12">
        <BOverlay :show="$wait.is('bet.*')" rounded="sm">
          <BCard>
            <template v-slot:header>
              <h4>{{ selectedToModify._id === 'new' ? 'Create' : 'Edit' }} Bet</h4>
            </template>
            <BCardText>
              <BRow class="mb-4">
                <BCol md="6">
                  <h4>Bet Settings</h4>
                  <BFormGroup label="Name">
                    <BFormInput
                      v-model="selectedToModify.name"
                      type="text"
                    />
                  </BFormGroup>
                  <BFormGroup label="Description">
                    <BFormTextarea
                      v-model="selectedToModify.description"
                    />
                  </BFormGroup>
                  <BBtn
                    variant="success"
                    @click="addNewOption"
                  >
                    Add Option
                  </BBtn>&nbsp;
                  <BBtn
                    variant="secondary"
                    @click="saveModified"
                  >
                    Save
                  </BBtn>
                </BCol>
                <BCol md="6">
                  <h4>Bet Status</h4>
                  <p v-if="selectedToModify._id === 'new'">
                    You can't modify the status of a new bet. It will automatically be created as CLOSED.
                  </p>
                  <p v-else-if="selectedToModify.status === 'PAID_OUT'">
                    This bet's already been paid out!
                  </p>
                  <div v-else>
                    <BBtn
                      variant="success"
                      @click="toggleStatus"
                    >
                      {{ selectedToModify.status === 'CLOSED' ? 'Open Bet' : 'Close Bet' }}
                    </BBtn><br/><br/>
                    <BFormGroup label="Winning Option">
                      <BFormSelect
                        v-model="winningOptionId"
                        :options="selectedToModify.options"
                        text-field="name"
                        value-field="_id"
                      />
                    </BFormGroup>
                    <BBtn
                      variant="danger"
                      @click="payout"
                    >
                      Payout Bet
                    </BBtn>
                  </div>
                </BCol>
              </BRow>
              <BRow>
                <BCol md="4" v-for="(option) of selectedToModify.options" :key="option._id">
                  <BCard>
                    <template v-slot:header>
                      <div class="float-left">
                        <h4>Option</h4>
                      </div>
                      <div
                        v-if="selectedToModify.options.length !== 1 && selectedToModify._id ==='new'"
                        class="float-right"
                      >
                        <BBtn
                          variant="danger"
                          @click="deleteOption(option._id)"
                        >
                          Delete
                        </BBtn>
                      </div>
                    </template>
                    <BCardText>
                      <BFormGroup label="Name">
                        <BFormInput
                          v-model="option.name"
                          type="text"
                        />
                      </BFormGroup>
                      <BFormGroup label="Description">
                        <BFormTextarea
                          v-model="option.description"
                        />
                      </BFormGroup>
                      <BFormGroup label="Odds">
                        <BFormInput
                          v-model.number="option.currentOdds"
                          type="number"
                        />
                      </BFormGroup>
                    </BCardText>
                  </BCard>
                </BCol>
              </BRow>
            </BCardText>
          </BCard>
        </BOverlay>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const defaultOption = () => {
  return {
    _id: Math.random().toString(36).substring(3),
    name: '',
    description: '',
    currentOdds: 1
  }
}
const defaultBet = () => {
  return {
    _id: 'new',
    name: '',
    description: '',
    status: 'CLOSED',
    options: [
      defaultOption()
    ]
  }
}
export default {
  name: 'AdminBets',
  components: {},
  data () {
    return {
      winningOptionId: null,
      columns: ['_id', 'name', 'description', 'status', 'details'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc', is: 'fa-sort' },
        headings: {
          '_id': 'Id',
          'name': 'Name',
          'description': 'Description',
          'status': 'Status',
          'details': 'Details'
        },
        uniqueKey: '_id'
      },
      selectedToModify: defaultBet()
    }
  },
  computed: {
    ...mapState({
      bets: state => state.bets.items
    })
  },
  mounted () {
    this.$store.dispatch('bets/fetch')
  },
  methods: {
    resetModified () {
      this.selectedToModify = defaultBet()
      this.winningOptionId = this.selectedToModify.options[0]._id
    },
    addNewOption () {
      this.selectedToModify.options.push(defaultOption())
    },
    deleteOption (id) {
      this.selectedToModify.options = this.selectedToModify.options.filter((option) => option._id !== id)
    },
    selectToModify (bet) {
      this.selectedToModify = JSON.parse(JSON.stringify(bet))
      this.winningOptionId = this.selectedToModify.options[0]._id
    },
    async toggleStatus () {
      if (this.selectedToModify.status === 'CLOSED') {
        await this.$store.dispatch('bets/openBet', this.selectedToModify._id)
      } else {
        await this.$store.dispatch('bets/closeBet', this.selectedToModify._id)
      }

      this.resetModified()
    },
    async payout () {
      await this.$store.dispatch('bets/payoutBet', { betId: this.selectedToModify._id, winningOptionId: this.winningOptionId })

      this.resetModified()
    },
    async saveModified () {
      await this.$store.dispatch('bets/' + (this.selectedToModify._id === 'new' ? 'create' : 'update'), this.selectedToModify)
      this.resetModified()
    }
  }
}
</script>
