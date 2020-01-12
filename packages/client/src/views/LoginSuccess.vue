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
      fetchJWT: 'user/fetchJWT'
    }),
    ...mapMutations({
      setJWT: 'user/setJWT'
    })
  },
  mounted () {
    if (!this.$route.query.jwt) {
      this.fetchJWT().then(() => {
        this.$router.push('/')
      })
    } else {
      this.setJWT({ jwt: this.$route.query.jwt })
      this.$router.push('/')
    }
  }
}
</script>
