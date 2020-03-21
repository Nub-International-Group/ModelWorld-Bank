<template>
  <div class="animated fadeIn" v-if="settings">
    <BRow>
      <BCol
        sm="12"
        md="6"
      >
        <BCard>
          <template v-slot:header>
            <div class="float-left">
              <h4>Settings</h4>
            </div>
          </template>
          <p>
            Please ensure settings are correct before saving. A save button will appear when any settings on this page have been modified.
          </p>
          <BBtn
            v-if="settingsDirtied"
            variant="success"
            @click="saveSettings"
          >
            Save Settings
          </BBtn>
          <strong v-else>
            No settings have been changed.
          </strong>
        </BCard>
      </BCol>
      <BCol
        sm="12"
        md="6"
      >
        <BCard>
          <template v-slot:header>
            <div class="float-left">
              <h4>Tax Management</h4>
            </div>
            <div class="float-right">
              <BBtn
                variant="success"
                @click="addBracket"
              >
                Add Bracket
              </BBtn>
            </div>
          </template>
          <b-list-group>
            <b-list-group-item v-for="(bracket, index) in settings.taxBrackets">
              <div class="float-left">
                <b-input-group
                  v-if="bracket.topEnd !== undefined"
                  prepend="Bracket Topend"
                  class="mb-2"
                >
                  <b-form-input type="number" min="0" v-model="bracket.topEnd"/>
                </b-input-group>
                <b-input-group prepend="Tax Rate (out of 1)" class="mb-2">
                  <b-form-input type="number" min="0" v-model="bracket.rate"/>
                </b-input-group>
              </div>
              <div class="float-right">
                <BBtn
                  v-if="bracket.topEnd !== undefined && index !== 0"
                  variant="danger"
                  @click="removeBracket(index)"
                >
                  Remove
                </BBtn>
              </div>
            </b-list-group-item>
          </b-list-group>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import deepEqual from 'deep-equal'
import api from '@/api'

export default {
  name: 'AdminSettings',
  data () {
    return {
      settings: null
    }
  },
  computed: {
    settingsDirtied () {
      if (this.settings) {
        if (!deepEqual(this.settings, this.$store.state.ui.settings)) {
          return true
        }
      }
      return false
    }
  },
  async mounted () {
    await this.$store.dispatch('ui/fetchSettings')
    this.resetChanges()
  },
  methods: {
    resetChanges () {
      this.settings = JSON.parse(JSON.stringify(this.$store.state.ui.settings))
    },
    addBracket () {
      this.settings.taxBrackets = [
        this.settings.taxBrackets.shift(),
        {
          topEnd: 0,
          rate: 0
        },
        ...this.settings.taxBrackets
      ]
    },
    removeBracket (i) {
      this.settings.taxBrackets.splice(i, 1)
    },
    async saveSettings () {
      try {
        await api.request({
          url: '/v1/settings',
          method: 'PUT',
          data: this.settings
        })
        await this.$store.dispatch('ui/fetchSettings')
        this.resetChanges()
      } catch (err) {
        this.$store.dispatch('messages/handleError', { err })
      }
    }
  }
}
</script>
