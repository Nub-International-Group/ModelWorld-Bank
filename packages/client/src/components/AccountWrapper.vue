<template>
  <div
    v-if="!accountId"
    class="animated fadeIn"
  >
    <h1>No account!</h1>
    <h3>If you don't have an account, speak to any member of the NubBank team. Otherwise, try refreshing.</h3>
  </div>
  <div
    v-else-if="loading"
    class="animated fadeIn"
  >
    <h1>Loading...</h1>
  </div>
  <RouterView
    v-else-if="selectedAccount"
    :key="$route.fullPath"
  />
  <div
    v-else
    class="animated fadeIn"
  >
    <h1>404 Account Doesn't Exist</h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'AccountWrapper',
  data () {
    return {
      loading: false,
      error: null
    }
  },
  computed: {
    accountId () {
      return this.$route.query.accountId
    },
    selectedAccount () {
      return this.$store.getters['selectedAccount/account']
    }
  },
  watch: {
    'accountId': {
      handler: async function () {
        if (this.accountId) {
          this.loading = true

          try {
            await this.selectAccount(this.accountId)
          } catch (e) {
            this.error = e
          }
          this.loading = false
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.$store.dispatch('ui/fetchTypeAhead')
    this.$store.dispatch('wages/fetch')
    this.$store.dispatch('accountTypes/fetch')
  },
  methods: {
    ...mapActions('selectedAccount', ['selectAccount'])
  }
}
</script>

<style scoped>

</style>
