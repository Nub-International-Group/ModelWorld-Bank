<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol sm="12">
        <BCard>
          <template v-slot:header>
            <h4>Tax Management</h4>
          </template>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
  data () {
    return {
      settings: null
    }
  },
  async mounted () {
    await this.$store.dispatch('ui/fetchSettings')
    this.resetChanges()
  },
  methods: {
    resetChanges () {
      this.settings = JSON.parse(JSON.stringify(this.$store.state.ui.settings))
    }
  }
}
</script>
