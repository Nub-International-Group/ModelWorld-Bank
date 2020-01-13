<template>
  <div class="animated fadeIn">
    <p>This page will reload.</p>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'LoginSuccess',
  methods: {
    ...mapActions({
      login: 'user/login'
    }),
    ...mapMutations({
      setJWT: 'user/setJWT'
    })
  },
  async mounted () {
    if (!this.$route.query.jwt) {
      await this.login()
      this.$router.push('/')
    } else {
      await this.login(this.$route.query.jwt)
      this.$router.push('/')
    }
  }
}
</script>
