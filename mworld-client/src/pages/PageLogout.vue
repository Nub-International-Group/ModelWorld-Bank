<template>
  <div id="PageLogout">
    <div class="page-header">
      <h1>Logout
        <small>Logging out</small>
      </h1>
    </div>
    <br>
    <p> This page will redirect once your session has been fully destroyed. Please hold.</p>
  </div>
</template>

<script>
export default {
  name: 'PageLoginSuccess',
  store: ['user', 'jwt'],
  data: function () {
    return {}
  },
  created: function () {
    window.localStorage.setItem('jwt', null)
    window.localStorage.setItem('user', null)

    this.user.name = ''
    this.user.admin = false
    this.jwt = null

    this.$router.push('/')
  }
}
</script>
