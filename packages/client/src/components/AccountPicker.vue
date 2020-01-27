<template>
  <div>
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
      selectable
      select-mode="single"
      @row-selected="select"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import Fuse from 'fuse.js'

export default {
  name: 'NewTransaction',
  mixins: [validationMixin],
  data () {
    return {
      selected: null,
      query: 'nub'
    }
  },
  computed: {
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
    }
  },
  methods: {
    select (item) {
      this.selected = item._id
      this.$emit('input', item._id)
    },
    trClass (item, type) {
      console.log(type)
      if (!item || type !== 'row') return
      console.log(item)
      if (item._id === this.selected) {
        return 'table-success'
      }
    }
  }
}
</script>
